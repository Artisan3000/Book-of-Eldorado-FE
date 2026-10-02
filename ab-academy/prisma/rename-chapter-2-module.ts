import { PrismaClient } from "@prisma/client";
import { isVisibleFoundationModuleTitle } from "../src/lib/data/course-visibility";
import {
  CHAPTER_2_MODULE_SORT_ORDER,
  FOUNDATION_COURSE_SLUG,
} from "./foundation-chapter-2";
import { loadDotEnv } from "./load-dot-env";

// Renames the Foundation Chapter 2 module. Kept separate from the content
// import so the title only changes once a final title is approved.
//
// Usage:
//   npx tsx prisma/rename-chapter-2-module.ts --title "New Title"          # dry run
//   npx tsx prisma/rename-chapter-2-module.ts --title "New Title" --apply  # writes
//
// The new title must already be allow-listed in
// src/lib/data/course-visibility.ts and deployed; otherwise students would stop
// seeing Chapter 2.

function getTitleArgument() {
  const index = process.argv.indexOf("--title");
  const title = index === -1 ? undefined : process.argv[index + 1]?.trim();

  if (!title) {
    throw new Error('Usage: rename-chapter-2-module.ts --title "New Title" [--apply]');
  }

  return title;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const newTitle = getTitleArgument();

  if (!isVisibleFoundationModuleTitle(newTitle)) {
    throw new Error(
      `"${newTitle}" is not in the Foundation visibility allow-list (src/lib/data/course-visibility.ts). Add it and deploy before renaming.`
    );
  }

  loadDotEnv();

  const prisma = new PrismaClient();

  try {
    const where = {
      sortOrder: CHAPTER_2_MODULE_SORT_ORDER,
      course: { slug: FOUNDATION_COURSE_SLUG },
    };
    const modules = await prisma.module.findMany({
      where,
      select: { id: true, title: true },
    });

    if (modules.length !== 1) {
      throw new Error(`Expected exactly one Chapter 2 module, found ${modules.length}`);
    }

    const [existing] = modules;

    if (!isVisibleFoundationModuleTitle(existing.title)) {
      throw new Error(`Unexpected Chapter 2 module title "${existing.title}".`);
    }

    if (existing.title === newTitle) {
      console.log(`Module ${existing.id} is already titled "${newTitle}". Nothing to do.`);
      return;
    }

    console.log(`Module ${existing.id}: title "${existing.title}" -> "${newTitle}"`);

    if (!apply) {
      console.log("Dry run only. Re-run with --apply to write.");
      return;
    }

    // Only matches if the title is still what we just read.
    const updated = await prisma.module.updateMany({
      where: { id: existing.id, title: existing.title },
      data: { title: newTitle },
    });

    if (updated.count !== 1) {
      throw new Error("Chapter 2 module changed during rename; nothing was written.");
    }

    console.log("Rename complete.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
