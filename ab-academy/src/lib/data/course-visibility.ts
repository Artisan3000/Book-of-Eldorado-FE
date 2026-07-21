const visibleFoundationModuleTitles = new Set([
  "Client Communication & Retention",
  "Business & Branding Essentials",
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
