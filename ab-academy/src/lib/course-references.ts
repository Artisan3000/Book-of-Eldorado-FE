import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Read-only reference pages attached to a chapter (module). They are not
// lessons: they live in Markdown files rather than the database, so they never
// change lesson numbering, lesson slugs, or course progress. Served at
// /student/courses/[slug]/reference/[referenceSlug] to enrolled students.

const REFERENCES_DIRECTORY = join(process.cwd(), "course-resources");

export type CourseReference = {
  courseSlug: string;
  // Module.sortOrder of the chapter the reference belongs to.
  moduleSortOrder: number;
  slug: string;
  title: string;
  summary: string;
  file: string;
  // Drafts are hidden everywhere until their approved content is in place.
  published: boolean;
};

export const courseReferences: readonly CourseReference[] = [
  {
    courseSlug: "foundation",
    moduleSortOrder: 10,
    slug: "client-building-method",
    title: "The Artisan Client-Building Method",
    summary: "Attract, convert, retain, and generate referrals while you work under supervision.",
    file: join(REFERENCES_DIRECTORY, "foundation", "references", "client-building-method.md"),
    published: false,
  },
  {
    courseSlug: "foundation",
    moduleSortOrder: 20,
    slug: "core-product-guide",
    title: "Artisan Core Product Guide",
    summary: "The ten core products: what to know, best haircut pairings, and how to explain each to a client.",
    file: join(REFERENCES_DIRECTORY, "foundation", "references", "core-product-guide.md"),
    published: true,
  },
];

export function getCourseReferenceHref(courseSlug: string, referenceSlug: string) {
  return `/student/courses/${courseSlug}/reference/${referenceSlug}`;
}

export function getModuleReferences(courseSlug: string, moduleSortOrder: number) {
  return courseReferences
    .filter(
      (reference) =>
        reference.published &&
        reference.courseSlug === courseSlug &&
        reference.moduleSortOrder === moduleSortOrder
    )
    .map((reference) => ({
      slug: reference.slug,
      title: reference.title,
      summary: reference.summary,
      href: getCourseReferenceHref(courseSlug, reference.slug),
    }));
}

export function findPublishedCourseReference(courseSlug: string, referenceSlug: string) {
  return (
    courseReferences.find(
      (reference) =>
        reference.published &&
        reference.courseSlug === courseSlug &&
        reference.slug === referenceSlug
    ) ?? null
  );
}

export async function loadCourseReferenceBody(reference: CourseReference) {
  return (await readFile(reference.file, "utf8")).trim();
}
