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
// - when the lessons already match, updates only the module fields and keeps
//   lessons and progress untouched;
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

function lessonsMatch(existing: ExistingModule, lessons: LoadedChapter2Lesson[]) {
  return (
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

// When the lessons already match the content files, only the module fields
// change and the lessons (and any student progress on them) are untouched.
async function updateChapter2ModuleFields(
  prisma: PrismaClient,
  moduleId: string,
  lessons: LoadedChapter2Lesson[]
) {
  await prisma.$transaction(
    async (tx) => {
      const current = await findChapter2Module(tx);

      if (current.id !== moduleId || !lessonsMatch(current, lessons)) {
        throw new Error("Chapter 2 changed during import.");
      }

      assertModuleTitleIsVisible(current);

      await tx.module.update({
        where: { id: moduleId },
        data: getChapter2ModuleUpdate(current),
      });
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
    const progressRows = existing.lessons.reduce((sum, lesson) => sum + lesson._count.progress, 0);
    console.log(
      `\nLessons: all ${existing.lessons.length} already match the content files; unchanged (${progressRows} progress rows kept).`
    );
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

    const replaceLessons = !lessonsMatch(existing, lessons);

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
      await updateChapter2ModuleFields(prisma, existing.id, lessons);
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
        : `Import complete: module ${verified.id} fields updated; lessons unchanged.`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
