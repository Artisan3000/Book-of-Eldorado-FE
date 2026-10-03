import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CHAPTER_2_WORKBOOK_HREF } from "../src/lib/course-resources";
import {
  getReadingTimeLabel,
  isPlaceholderLessonBody,
} from "../src/lib/lessons/lesson-content";

// Shared by prisma/seed.ts (development databases) and
// prisma/import-chapter-2-text-lessons.ts (guarded production import).

export const FOUNDATION_COURSE_SLUG = "foundation";
export const CHAPTER_2_MODULE_SORT_ORDER = 20;

const CONTENT_DIRECTORY = join(__dirname, "content", "foundation-chapter-2");

type Chapter2LessonMetadata = {
  sortOrder: number;
  title: string;
  // Optional one-line summary shown in lesson lists. Leave null until the
  // approved manuscript provides one.
  description: string | null;
  file: string;
};

// The module title is deliberately not here: the content import never changes
// it. Renaming Chapter 2 is a separate, explicit operation
// (prisma/rename-chapter-2-module.ts) once the final title is approved.

// The only module fields the content import writes.
export const chapter2Module = {
  description:
    "The core of your apprenticeship. Turn consultations into clear haircut plans, build clipper, scissor, texture, and beard work through supervised services, choose and explain products with intention, and start building a returning clientele.",
  resourceTitle: "Chapter 2 Companion Workbook",
  // The logged-in-only PDF route. Never point this at the editable Google Doc.
  resourceUrl: CHAPTER_2_WORKBOOK_HREF as string | null,
};

export const chapter2Lessons: readonly Chapter2LessonMetadata[] = [
  {
    sortOrder: 1,
    title: "The Artisan Standard & Client Consultation",
    description: null,
    file: "2-01-the-artisan-standard-and-client-consultation.md",
  },
  {
    sortOrder: 2,
    title: "Buzz Cut & Classic Clipper Foundation",
    description: null,
    file: "2-02-buzz-cut-and-classic-clipper-foundation.md",
  },
  {
    sortOrder: 3,
    title: "Classic Taper & Low Taper Family",
    description: null,
    file: "2-03-classic-taper-and-low-taper-family.md",
  },
  {
    sortOrder: 4,
    title: "The Skin-Fade Family",
    description: null,
    file: "2-04-the-skin-fade-family.md",
  },
  {
    sortOrder: 5,
    title: "Clipper-and-Scissor Classic",
    description: null,
    file: "2-05-clipper-and-scissor-classic.md",
  },
  {
    sortOrder: 6,
    title: "Texture, Volume & Modern Styling",
    description: null,
    file: "2-06-texture-volume-and-modern-styling.md",
  },
  {
    sortOrder: 7,
    title: "Scissor-Only Haircutting",
    description: null,
    file: "2-07-scissor-only-haircutting.md",
  },
  {
    sortOrder: 8,
    title: "Beard Design & Hair-and-Beard Coordination",
    description: null,
    file: "2-08-beard-design-and-hair-and-beard-coordination.md",
  },
  {
    sortOrder: 9,
    title: "Children’s Services & Advanced Elective Work",
    description: null,
    file: "2-09-childrens-services-and-advanced-elective-work.md",
  },
  {
    sortOrder: 10,
    title: "Capstone, Product Examination & Client Book",
    description: null,
    file: "2-10-capstone-product-examination-and-client-book.md",
  },
];

// The obsolete Chapter 2 lessons, used to confirm the production module is
// exactly what we expect before it is replaced.
export const legacyChapter2 = {
  lessonTitles: [
    "How a Barbershop Actually Makes Money",
    "The Artisan Brand: What It Means Day-to-Day",
    "Building Your Personal Brand Within the Shop",
    "Social Media for Barbers",
    "Pricing, Upselling & Retail",
    "Professionalism & Shop Etiquette",
    "Chapter Assessment",
  ],
} as const;

type Chapter2ModuleContent = Record<keyof typeof chapter2Module, string | null>;

// The module fields the import would change, compared against the database.
// Never includes the title.
export function getChapter2ModuleUpdate(
  existing: Chapter2ModuleContent
): Partial<Chapter2ModuleContent> {
  const update: Partial<Chapter2ModuleContent> = {};

  for (const key of Object.keys(chapter2Module) as (keyof Chapter2ModuleContent)[]) {
    if (existing[key] !== chapter2Module[key]) {
      Object.assign(update, { [key]: chapter2Module[key] });
    }
  }

  return update;
}

// The import only replaces lessons it recognises: the obsolete seven, or the
// approved ten from an earlier import of these content files.
export function getExistingChapter2LessonSet(
  lessonTitles: readonly string[]
): "legacy" | "current" | "unexpected" {
  const titles = lessonTitles.join("\n");

  if (titles === legacyChapter2.lessonTitles.join("\n")) {
    return "legacy";
  }

  if (titles === chapter2Lessons.map((lesson) => lesson.title).join("\n")) {
    return "current";
  }

  return "unexpected";
}

export type LoadedChapter2Lesson = Chapter2LessonMetadata & {
  body: string;
  duration: string;
  isPlaceholder: boolean;
};

export function loadChapter2Lessons(): LoadedChapter2Lesson[] {
  return chapter2Lessons.map((lesson) => {
    const body = readFileSync(join(CONTENT_DIRECTORY, lesson.file), "utf8").trim();

    return {
      ...lesson,
      body,
      duration: getReadingTimeLabel(body),
      isPlaceholder: isPlaceholderLessonBody(body),
    };
  });
}
