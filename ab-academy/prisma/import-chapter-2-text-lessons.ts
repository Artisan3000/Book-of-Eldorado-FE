import { PrismaClient, type Prisma } from "@prisma/client";
import {
  CHAPTER_2_MODULE_SORT_ORDER,
  FOUNDATION_COURSE_SLUG,
  chapter2Module,
  getChapter2ModuleUpdate,
  getExistingChapter2LessonSet,
  loadChapter2Lessons,
  type LoadedChapter2Lesson,
} from "./foundation-chapter-2";
import { loadDotEnv } from "./load-dot-env";
import { isVisibleFoundationModuleTitle } from "../src/lib/data/course-visibility";

// Replaces the Foundation Chapter 2 lessons with the approved text lessons.
//
// Usage:
//   npx tsx prisma/import-chapter-2-text-lessons.ts          # dry run (reads only)
//   npx tsx prisma/import-chapter-2-text-lessons.ts --apply  # writes in one transaction
//
// Guarantees:
// - refuses placeholder/empty manuscript files and a missing module description;
// - only touches the Foundation module at sortOrder 20, and only when its title
//   is allow-listed in src/lib/data/course-visibility.ts and its lessons are the obsolete seven or the
//   approved ten;
// - never changes the module title (see prisma/rename-chapter-2-module.ts);
// - aborts without changes if any LessonProgress exists on the lessons it would replace;
// - preserves the module id and sortOrder;
// - replaces the obsolete lessons (only when none has progress); once the
//   approved lessons exist, updates their content in place by id, keeping
//   numbering and progress;
// - is a no-op when the database already matches the content files.

type ExistingModule = NonNullable<Awaited<ReturnType<typeof findChapter2Module>>>;

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

type ExistingLesson = ExistingModule["lessons"][number];

// The content fields of an approved lesson that differ from the files.
function getLessonChanges(current: ExistingLesson, lesson: LoadedChapter2Lesson) {
  const changes: string[] = [];

  if (current.description !== lesson.description) changes.push("description");
  if (current.duration !== lesson.duration) changes.push(`duration ${current.duration} -> ${lesson.duration}`);
  if (current.videoUrl !== null) changes.push("videoUrl -> null");
  if (current.body !== lesson.body) {
    changes.push(`body ${current.body?.length ?? 0} -> ${lesson.body.length} chars`);
  }

  return changes;
}

function lessonsMatch(existing: ExistingModule, lessons: LoadedChapter2Lesson[]) {
  return (
    existing.lessons.length === lessons.length &&
    lessons.every((lesson, index) => {
      const current = existing.lessons[index];

      return (
        current.sortOrder === lesson.sortOrder &&
        current.title === lesson.title &&
        getLessonChanges(current, lesson).length === 0
      );
    })
  );
}

function getLessonSet(existing: ExistingModule) {
  return getExistingChapter2LessonSet(existing.lessons.map((lesson) => lesson.title));
}

function isUpToDate(existing: ExistingModule, lessons: LoadedChapter2Lesson[]) {
  return (
    Object.keys(getChapter2ModuleUpdate(existing)).length === 0 &&
    lessonsMatch(existing, lessons)
  );
}

function assertModuleTitleIsVisible(existing: ExistingModule) {
  if (!isVisibleFoundationModuleTitle(existing.title)) {
    throw new Error(
      `Unexpected Chapter 2 module title "${existing.title}": it is not in the Foundation visibility allow-list.`
    );
  }
}

function assertExpectedExistingState(existing: ExistingModule) {
  assertModuleTitleIsVisible(existing);

  const titles = existing.lessons.map((lesson) => lesson.title);

  if (getExistingChapter2LessonSet(titles) === "unexpected") {
    throw new Error(
      `Module "${existing.title}" contains neither the obsolete nor the approved Chapter 2 lessons. Found:\n- ${titles.join("\n- ")}`
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

      // Content fields only: the title, id and sortOrder are left as they are.
      const moduleUpdate = getChapter2ModuleUpdate(current);

      if (Object.keys(moduleUpdate).length > 0) {
        await tx.module.update({ where: { id: moduleId }, data: moduleUpdate });
      }
    },
    { isolationLevel: "Serializable", timeout: 30_000 }
  );
}

// The approved lessons are already in place: update their content and the
// module fields by id. Nothing is deleted, so lesson ids, numbering, and any
// student progress are kept.
async function updateChapter2InPlace(
  prisma: PrismaClient,
  moduleId: string,
  lessons: LoadedChapter2Lesson[]
) {
  await prisma.$transaction(
    async (tx) => {
      const current = await findChapter2Module(tx);

      if (current.id !== moduleId || getLessonSet(current) !== "current") {
        throw new Error("Chapter 2 changed during import.");
      }

      assertModuleTitleIsVisible(current);

      for (const [index, lesson] of lessons.entries()) {
        const existingLesson = current.lessons[index];

        if (getLessonChanges(existingLesson, lesson).length > 0) {
          await tx.lesson.update({
            where: { id: existingLesson.id },
            data: {
              description: lesson.description,
              duration: lesson.duration,
              body: lesson.body,
              videoUrl: null,
            },
          });
        }
      }

      const moduleUpdate = getChapter2ModuleUpdate(current);

      if (Object.keys(moduleUpdate).length > 0) {
        await tx.module.update({ where: { id: moduleId }, data: moduleUpdate });
      }
    },
    { isolationLevel: "Serializable", timeout: 30_000 }
  );
}

function printPlan(
  existing: ExistingModule,
  lessons: LoadedChapter2Lesson[],
  replaceLessons: boolean
) {
  const moduleUpdate = getChapter2ModuleUpdate(existing);

  console.log(`\nPlan (one Serializable transaction):`);
  console.log(
    `\nModule ${existing.id}: title "${existing.title}" and sortOrder ${existing.sortOrder} unchanged.`
  );

  for (const key of Object.keys(chapter2Module) as (keyof typeof chapter2Module)[]) {
    console.log(
      key in moduleUpdate
        ? `  update ${key}: ${JSON.stringify(existing[key])} -> ${JSON.stringify(chapter2Module[key])}`
        : `  keep   ${key}: ${JSON.stringify(existing[key])}`
    );
  }

  if (!replaceLessons) {
    console.log(`\nUpdate in place (no lessons deleted or created; ids, numbering, and progress kept):`);
    for (const [index, lesson] of lessons.entries()) {
      const current = existing.lessons[index];
      const changes = getLessonChanges(current, lesson);

      console.log(
        `  2.${lesson.sortOrder} ${current.id} "${lesson.title}": ${
          changes.length > 0 ? changes.join(", ") : "unchanged"
        } (progress rows: ${current._count.progress})`
      );
    }
    return;
  }

  console.log(`\nDelete ${existing.lessons.length} lessons:`);
  for (const lesson of existing.lessons) {
    console.log(
      `  ${lesson.sortOrder}. ${lesson.id} "${lesson.title}" (progress rows: ${lesson._count.progress})`
    );
  }

  console.log(`\nCreate ${lessons.length} text lessons:`);
  for (const lesson of lessons) {
    console.log(`  2.${lesson.sortOrder} "${lesson.title}" (${lesson.duration}, ${lesson.body.length} chars)`);
  }
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

    // The obsolete lessons are replaced (only while nobody has progress on
    // them); the approved lessons are updated in place.
    const replaceLessons = getLessonSet(existing) !== "current";

    if (replaceLessons) {
      assertExpectedExistingState(existing);
    } else {
      assertModuleTitleIsVisible(existing);
    }

    printPlan(existing, lessons, replaceLessons);

    if (!apply) {
      console.log("\nDry run only. Re-run with --apply to write.");
      return;
    }

    if (replaceLessons) {
      await replaceChapter2Lessons(prisma, existing.id, lessons);
    } else {
      await updateChapter2InPlace(prisma, existing.id, lessons);
    }

    const verified = await findChapter2Module(prisma);

    if (
      verified.id !== existing.id ||
      verified.title !== existing.title ||
      verified.sortOrder !== existing.sortOrder ||
      !isUpToDate(verified, lessons)
    ) {
      throw new Error("Verification failed: Chapter 2 does not match the content files after import.");
    }

    console.log(
      replaceLessons
        ? `Import complete: module ${verified.id} now has ${verified.lessons.length} text lessons.`
        : `Import complete: module ${verified.id} and its lessons updated in place.`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
