// The approved Chapter 2 title (Oct. 2026). Applied to the database with
// prisma/rename-chapter-2-module.ts, never by the content import.
export const FOUNDATION_CHAPTER_2_TITLE = "Haircut Development & Product Knowledge";

const visibleFoundationModuleTitles = new Set([
  "Client Communication & Retention",
  FOUNDATION_CHAPTER_2_TITLE,
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
