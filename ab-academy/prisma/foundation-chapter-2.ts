import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  FOUNDATION_CHAPTER_2_TITLE,
  LEGACY_FOUNDATION_CHAPTER_2_TITLE,
} from "../src/lib/data/course-visibility";
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

export const chapter2Module = {
  title: FOUNDATION_CHAPTER_2_TITLE,
  description:
    "The core of your apprenticeship. Turn consultations into clear haircut plans, build clipper, scissor, texture, and beard work through supervised services, choose and explain products with intention, and start building a returning clientele.",
  resourceTitle: "Chapter 2 Companion Workbook",
  // Stays null until the workbook PDF is served from a logged-in-only Academy
  // route. Never point this at the editable Google Doc.
  resourceUrl: null as string | null,
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
  title: LEGACY_FOUNDATION_CHAPTER_2_TITLE,
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
