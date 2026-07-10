import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";

type VimeoLessonMapping = {
  courseSlug: string;
  moduleSortOrder: number;
  lessonSortOrder: number;
  expectedTitle: string;
  label: string;
  vimeoVideoId: string;
  playerUrl: string;
};

const mappings: VimeoLessonMapping[] = [
  {
    courseSlug: "foundation",
    moduleSortOrder: 10,
    lessonSortOrder: 1,
    expectedTitle: "The Artisan Consultation Framework",
    label: "Lesson 1.1: The Artisan Consultation Framework",
    vimeoVideoId: "1208793359",
    playerUrl: "https://player.vimeo.com/video/1208793359",
  },
  {
    courseSlug: "foundation",
    moduleSortOrder: 10,
    lessonSortOrder: 2,
    expectedTitle: "Managing Difficult Conversations",
    label: "Lesson 1.2: Managing Difficult Conversations",
    vimeoVideoId: "1208793357",
    playerUrl: "https://player.vimeo.com/video/1208793357",
  },
  {
    courseSlug: "foundation",
    moduleSortOrder: 10,
    lessonSortOrder: 3,
    expectedTitle: "Building Your Chair-Side Presence",
    label: "Lesson 1.3: Building Your Chair-side Presence",
    vimeoVideoId: "1208793358",
    playerUrl: "https://player.vimeo.com/video/1208793358",
  },
];

function loadDotEnv() {
  const envPath = join(process.cwd(), ".env");

  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);

    if (!match || match[1].startsWith("#")) {
      continue;
    }

    const [, key, rawValue] = match;

    if (process.env[key] !== undefined) {
      continue;
    }

    let value = rawValue.trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function assertNormalizedVimeoPlayerUrl(playerUrl: string, videoId: string) {
  let parsed: URL;

  try {
    parsed = new URL(playerUrl);
  } catch {
    throw new Error(`Invalid Vimeo player URL: ${playerUrl}`);
  }

  if (
    parsed.protocol !== "https:" ||
    parsed.hostname !== "player.vimeo.com" ||
    parsed.pathname !== `/video/${videoId}` ||
    parsed.search !== "" ||
    parsed.hash !== ""
  ) {
    throw new Error(
      `Vimeo URL must be normalized as https://player.vimeo.com/video/{id}: ${playerUrl}`
    );
  }
}

async function findUniqueMappedLesson(
  prisma: PrismaClient,
  mapping: VimeoLessonMapping
) {
  const matches = await prisma.lesson.findMany({
    where: {
      sortOrder: mapping.lessonSortOrder,
      module: {
        sortOrder: mapping.moduleSortOrder,
        course: {
          slug: mapping.courseSlug,
        },
      },
    },
    select: {
      id: true,
      title: true,
      sortOrder: true,
      videoUrl: true,
      module: {
        select: {
          id: true,
          title: true,
          sortOrder: true,
          course: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (matches.length === 0) {
    throw new Error(
      `Could not find ${mapping.label} using course=${mapping.courseSlug}, moduleSortOrder=${mapping.moduleSortOrder}, lessonSortOrder=${mapping.lessonSortOrder}`
    );
  }

  if (matches.length > 1) {
    throw new Error(
      `Expected one match for ${mapping.label}, found ${matches.length}`
    );
  }

  const lesson = matches[0];

  if (lesson.title !== mapping.expectedTitle) {
    throw new Error(
      `Matched ${mapping.label}, but found title "${lesson.title}" instead of "${mapping.expectedTitle}"`
    );
  }

  return lesson;
}

async function main() {
  loadDotEnv();

  const prisma = new PrismaClient();
  let mappedLessonCount = 0;

  try {
    for (const mapping of mappings) {
      assertNormalizedVimeoPlayerUrl(mapping.playerUrl, mapping.vimeoVideoId);

      const lesson = await findUniqueMappedLesson(prisma, mapping);

      const updatedLesson = await prisma.lesson.update({
        where: {
          id: lesson.id,
        },
        data: {
          videoUrl: mapping.playerUrl,
        },
        select: {
          id: true,
          title: true,
          sortOrder: true,
          videoUrl: true,
          module: {
            select: {
              title: true,
              sortOrder: true,
              course: {
                select: {
                  slug: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      mappedLessonCount += 1;
      console.log(
        `Mapped ${mapping.label} (${updatedLesson.id}) -> Vimeo ${mapping.vimeoVideoId} -> ${updatedLesson.videoUrl}`
      );
    }

    const verificationRows = await Promise.all(
      mappings.map(async (mapping) => ({
        mapping,
        lesson: await findUniqueMappedLesson(prisma, mapping),
      }))
    );
    const incorrectMappings = verificationRows.filter(
      ({ mapping, lesson }) => lesson.videoUrl !== mapping.playerUrl
    );

    if (incorrectMappings.length > 0) {
      throw new Error(
        `Verification failed: ${incorrectMappings.length} mapped lessons do not match the expected Vimeo URL`
      );
    }

    console.log(
      `Verification complete: ${mappedLessonCount} lessons mapped with normalized Vimeo player URLs.`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
