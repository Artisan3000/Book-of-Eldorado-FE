import { join } from "node:path";

// Downloadable course files (e.g. chapter workbooks). They live outside
// public/ so they are only served through the logged-in route
// /student/courses/[slug]/resources/[file], which checks course access.
// Kept free of server-only imports so scripts/build-chapter-2-workbook.ts can
// share the file location.

const COURSE_RESOURCES_DIRECTORY = join(process.cwd(), "course-resources");

type CourseResourceFile = {
  courseSlug: string;
  fileName: string;
  path: string;
  contentType: string;
  downloadName: string;
};

export function getCourseResourceHref(courseSlug: string, fileName: string) {
  return `/student/courses/${courseSlug}/resources/${fileName}`;
}

export const CHAPTER_2_WORKBOOK_FILE = join(
  COURSE_RESOURCES_DIRECTORY,
  "foundation",
  "chapter-2-workbook.pdf"
);

export const CHAPTER_2_WORKBOOK_HREF = getCourseResourceHref(
  "foundation",
  "chapter-2-workbook.pdf"
);

const courseResourceFiles: readonly CourseResourceFile[] = [
  {
    courseSlug: "foundation",
    fileName: "chapter-2-workbook.pdf",
    path: CHAPTER_2_WORKBOOK_FILE,
    contentType: "application/pdf",
    downloadName: "Artisan Academy - Chapter 2 Workbook.pdf",
  },
];

export function findCourseResourceFile(courseSlug: string, fileName: string) {
  return (
    courseResourceFiles.find(
      (file) => file.courseSlug === courseSlug && file.fileName === fileName
    ) ?? null
  );
}

// A file is only downloadable while a module the student can see links to it.
export function moduleLinksToResource(
  modules: readonly { resourceUrl: string | null }[],
  courseSlug: string,
  fileName: string
) {
  const href = getCourseResourceHref(courseSlug, fileName);

  return modules.some((module) => module.resourceUrl === href);
}
