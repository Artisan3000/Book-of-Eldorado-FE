export const FOUNDATION_CHAPTER_2_TITLE =
  "Haircut Development, Product Knowledge & Clientele Building";

// The obsolete Chapter 2 title stays visible only until the production data
// import replaces it. Remove it once prisma/import-chapter-2-text-lessons.ts
// has been applied in production.
export const LEGACY_FOUNDATION_CHAPTER_2_TITLE = "Business & Branding Essentials";

const visibleFoundationModuleTitles = new Set([
  "Client Communication & Retention",
  FOUNDATION_CHAPTER_2_TITLE,
  LEGACY_FOUNDATION_CHAPTER_2_TITLE,
]);

export function getVisibleCourseModules<T extends { title: string }>(
  courseSlug: string,
  modules: readonly T[]
): T[] {
  if (courseSlug !== "foundation") {
    return [...modules];
  }

  return modules.filter((module) => visibleFoundationModuleTitles.has(module.title));
}
