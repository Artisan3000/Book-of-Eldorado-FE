// Working title from the manuscript. Not approved as the final title.
export const FOUNDATION_CHAPTER_2_TITLE =
  "Haircut Development, Product Knowledge & Clientele Building";

// The current production Chapter 2 title. The content import keeps it; it
// changes only through prisma/rename-chapter-2-module.ts once a final title is
// approved (add that title here and deploy first).
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
