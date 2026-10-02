import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient, type Prisma } from "@prisma/client";
import {
  CHAPTER_2_MODULE_SORT_ORDER,
  FOUNDATION_COURSE_SLUG,
  chapter2Module,
  legacyChapter2,
  loadChapter2Lessons,
  type LoadedChapter2Lesson,
} from "./foundation-chapter-2";

// Replaces the Foundation Chapter 2 lessons with the approved text lessons.
//
// Usage:
//   npx tsx prisma/import-chapter-2-text-lessons.ts          # dry run (reads only)
//   npx tsx prisma/import-chapter-2-text-lessons.ts --apply  # writes in one transaction
//
// Guarantees:
// - refuses placeholder/empty manuscript files and a missing module description;
// - only touches the Foundation module at sortOrder 20, and only when its title
//   is the obsolete or the new Chapter 2 title;
// - aborts without changes if any LessonProgress exists on the lessons it would replace;
// - preserves the module id and sortOrder;
// - is a no-op when the database already matches the content files.

type ExistingModule = NonNullable<Awaited<ReturnType<typeof findChapter2Module>>>;

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

function assertContentIsImportable(lessons: LoadedChapter2Lesson[]) {
  const problems: string[] = [];

  if (!chapter2Module.description?.trim()) {
    problems.push("chapter2Module.description is not set in prisma/foundation-chapter-2.ts");
  }

  if (
    chapter2Module.resourceUrl !== null &&
    !chapter2Module.resourceUrl.startsWith("/")
  ) {
    problems.push(
      "chapter2Module.resourceUrl must be null or an in-app route (the workbook must be served from a logged-in-only Academy route)"
    );
  }

  for (const lesson of lessons) {
    if (lesson.isPlaceholder) {
      problems.push(`Lesson 2.${lesson.sortOrder} (${lesson.file}) is a placeholder or empty`);
    }
  }

  const sortOrders = lessons.map((lesson) => lesson.sortOrder);
  const expectedSortOrders = lessons.map((_, index) => index + 1);

  if (sortOrders.join(",") !== expectedSortOrders.join(",")) {
    problems.push(`Lesson sortOrders must be 1..${lessons.length}, found ${sortOrders.join(",")}`);
  }

  if (problems.length > 0) {
    throw new Error(
      `Refusing to import Chapter 2:\n- ${problems.join("\n- ")}`
    );
  }
}

async function findChapter2Module(client: Prisma.TransactionClient | PrismaClient) {
  const modules = await client.module.findMany({
    where: {
      sortOrder: CHAPTER_2_MODULE_SORT_ORDER,
      course: { slug: FOUNDATION_COURSE_SLUG },
    },
    select: {
      id: true,
      title: true,
      description: true,
      sortOrder: true,
      resourceTitle: true,
      resourceUrl: true,
      lessons: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          videoUrl: true,
          body: true,
          sortOrder: true,
          _count: { select: { progress: true } },
        },
      },
    },
  });

  if (modules.length !== 1) {
    throw new Error(
      `Expected exactly one ${FOUNDATION_COURSE_SLUG} module at sortOrder ${CHAPTER_2_MODULE_SORT_ORDER}, found ${modules.length}`
    );
  }

  return modules[0];
}

function isUpToDate(existing: ExistingModule, lessons: LoadedChapter2Lesson[]) {
  return (
    existing.title === chapter2Module.title &&
    existing.description === chapter2Module.description &&
    existing.resourceTitle === chapter2Module.resourceTitle &&
    existing.resourceUrl === chapter2Module.resourceUrl &&
    existing.lessons.length === lessons.length &&
    lessons.every((lesson, index) => {
      const current = existing.lessons[index];

      return (
        current.sortOrder === lesson.sortOrder &&
        current.title === lesson.title &&
        current.description === lesson.description &&
        current.duration === lesson.duration &&
        current.videoUrl === null &&
        current.body === lesson.body
      );
    })
  );
}

function assertExpectedExistingState(existing: ExistingModule) {
  if (existing.title === legacyChapter2.title) {
    const titles = existing.lessons.map((lesson) => lesson.title);

    if (titles.join("\n") !== legacyChapter2.lessonTitles.join("\n")) {
      throw new Error(
        `Module "${existing.title}" does not contain the expected obsolete lessons. Found:\n- ${titles.join("\n- ")}`
      );
    }
  } else if (existing.title !== chapter2Module.title) {
    throw new Error(
      `Unexpected Chapter 2 module title "${existing.title}". Expected "${legacyChapter2.title}" or "${chapter2Module.title}".`
    );
  }

  const lessonsWithProgress = existing.lessons.filter(
    (lesson) => lesson._count.progress > 0
  );

  if (lessonsWithProgress.length > 0) {
    throw new Error(
      `Aborting: LessonProgress exists on lessons that would be replaced:\n- ${lessonsWithProgress
        .map((lesson) => `${lesson.sortOrder}. ${lesson.title} (${lesson._count.progress} rows)`)
        .join("\n- ")}`
    );
  }
}

async function replaceChapter2Lessons(
  prisma: PrismaClient,
  moduleId: string,
  lessons: LoadedChapter2Lesson[]
) {
  await prisma.$transaction(
    async (tx) => {
      const current = await findChapter2Module(tx);

      if (current.id !== moduleId) {
        throw new Error("Chapter 2 module changed during import.");
      }

      assertExpectedExistingState(current);

      // Only delete lessons with no progress, and require that this is every
      // lesson in the module. Otherwise the transaction rolls back.
      const deleted = await tx.lesson.deleteMany({
        where: {
          moduleId,
          progress: { none: {} },
        },
      });

      if (deleted.count !== current.lessons.length) {
        throw new Error(
          `Aborting: expected to delete ${current.lessons.length} lessons without progress, deleted ${deleted.count}.`
        );
      }

      await tx.lesson.createMany({
        data: lessons.map((lesson) => ({
          moduleId,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          body: lesson.body,
          videoUrl: null,
          sortOrder: lesson.sortOrder,
        })),
      });

      await tx.module.update({
        where: { id: moduleId },
        data: {
          title: chapter2Module.title,
          description: chapter2Module.description,
          resourceTitle: chapter2Module.resourceTitle,
          resourceUrl: chapter2Module.resourceUrl,
        },
      });
    },
    { isolationLevel: "Serializable", timeout: 30_000 }
  );
}

async function main() {
  const apply = process.argv.includes("--apply");
  const lessons = loadChapter2Lessons();

  assertContentIsImportable(lessons);

  for (const lesson of lessons) {
    console.log(`Lesson 2.${lesson.sortOrder}: ${lesson.title} (${lesson.duration})`);
  }

  loadDotEnv();

  const prisma = new PrismaClient();

  try {
    const existing = await findChapter2Module(prisma);

    console.log(
      `Found Chapter 2 module ${existing.id} "${existing.title}" with ${existing.lessons.length} lessons.`
    );

    if (isUpToDate(existing, lessons)) {
      console.log("Chapter 2 already matches the content files. Nothing to do.");
      return;
    }

    assertExpectedExistingState(existing);

    if (!apply) {
      console.log(
        `Dry run: would replace ${existing.lessons.length} lessons with ${lessons.length} text lessons and update module ${existing.id}. Re-run with --apply to write.`
      );
      return;
    }

    await replaceChapter2Lessons(prisma, existing.id, lessons);

    const verified = await findChapter2Module(prisma);

    if (verified.id !== existing.id || !isUpToDate(verified, lessons)) {
      throw new Error("Verification failed: Chapter 2 does not match the content files after import.");
    }

    console.log(
      `Import complete: module ${verified.id} now has ${verified.lessons.length} text lessons.`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
