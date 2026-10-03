// The approved Chapter 2 title (Oct. 2026). Applied to the database with
// prisma/rename-chapter-2-module.ts, never by the content import.
export const FOUNDATION_CHAPTER_2_TITLE = "Haircut Development & Product Knowledge";

// The title production still has until the rename runs there. Remove it from
// the allow-list once production is renamed.
export const LEGACY_FOUNDATION_CHAPTER_2_TITLE = "Business & Branding Essentials";

const visibleFoundationModuleTitles = new Set([
  "Client Communication & Retention",
  FOUNDATION_CHAPTER_2_TITLE,
  LEGACY_FOUNDATION_CHAPTER_2_TITLE,
]);

export function isVisibleFoundationModuleTitle(title: string) {
  return visibleFoundationModuleTitles.has(title);
}

export function getVisibleCourseModules<T extends { title: string }>(
  courseSlug: string,
  modules: readonly T[]
): T[] {
  if (courseSlug !== "foundation") {
    return [...modules];
  }

  return modules.filter((module) => isVisibleFoundationModuleTitle(module.title));
}
