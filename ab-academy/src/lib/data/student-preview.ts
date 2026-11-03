import "server-only";

import { notFound } from "next/navigation";
import { LessonProgressStatus } from "@prisma/client";
import {
  findPublishedCourseReference,
  getModuleReferences,
  loadCourseReferenceBody,
} from "@/lib/course-references";
import { getVisibleCourseModules } from "@/lib/data/course-visibility";
import { getLessonContentKind, getSafeResourceHref } from "@/lib/lessons/lesson-content";
import { getLessonSlug } from "@/lib/data/student";
import { prisma } from "@/lib/prisma";

export async function getStudentPreviewDashboardData() {
  return {
    profile: {
      name: "Preview Student",
      email: "student-preview@artisanbarber.test",
      coursesInProgress: 1,
      lessonsThisWeek: 0,
    },
    courses: [
      {
        enrollmentId: "preview-enrollment",
        id: "preview-foundation",
        slug: "foundation",
        title: "Foundation",
        status: "Active",
        progress: 0,
        completedLessons: 0,
        totalLessons: 2,
      },
    ],
    weeklyProgress: [],
  };
}

async function getPreviewCourse(slug: string) {
  const course = await prisma.course.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      modules: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          title: true,
          sortOrder: true,
          description: true,
          resourceTitle: true,
          resourceUrl: true,
          lessons: {
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              duration: true,
              videoUrl: true,
              sortOrder: true,
              body: true,
            },
          },
        },
      },
    },
  });

  if (!course) notFound();
  return course;
}

export async function getStudentPreviewCourseDetail(slug: string) {
  const course = await getPreviewCourse(slug);
  const visibleModules = getVisibleCourseModules(course.slug, course.modules);
  const modules = visibleModules.map(({ resourceTitle, resourceUrl, ...module }) => ({
    ...module,
    resource: resourceTitle
      ? { title: resourceTitle, href: getSafeResourceHref(resourceUrl) }
      : null,
    references: getModuleReferences(course.slug, module.sortOrder),
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      progressStatus: LessonProgressStatus.NOT_STARTED,
      lastPositionSeconds: 0,
      completed: false,
      slug: getLessonSlug({
        moduleSortOrder: module.sortOrder,
        lessonSortOrder: lesson.sortOrder,
        title: lesson.title,
      }),
      href: `/student/courses/${course.slug}/lessons/${getLessonSlug({
        moduleSortOrder: module.sortOrder,
        lessonSortOrder: lesson.sortOrder,
        title: lesson.title,
      })}`,
    })),
  }));
  const lessons = modules.flatMap((module) => module.lessons);
  const nextLesson = lessons[0];

  return {
    title: course.title,
    description: course.description || "",
    instructor: "Charles McCoy",
    progress: 0,
    nextLessonHref: nextLesson?.href ?? null,
    modules,
    lessons,
    resources: modules
      .filter((module) => module.resource || module.references.length > 0)
      .map((module) => ({
        id: module.id,
        moduleTitle: module.title,
        download: module.resource,
        references: module.references,
      })),
  };
}

export async function getStudentPreviewLessonDetail(
  courseSlug: string,
  lessonSlug: string
) {
  const course = await getStudentPreviewCourseDetail(courseSlug);
  const lessons = course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleTitle: module.title,
      moduleDescription: module.description,
      moduleResource: module.resource,
      moduleReferences: module.references,
    }))
  );
  const lessonIndex = lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  if (lessonIndex === -1) notFound();

  const listedLesson = lessons[lessonIndex];
  const body = listedLesson.videoUrl ? null : listedLesson.body;

  return {
    course: {
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      progress: 0,
    },
    lesson: {
      ...listedLesson,
      body,
      contentKind: getLessonContentKind({ videoUrl: listedLesson.videoUrl, body }),
    },
    previousLesson: lessons[lessonIndex - 1] ?? null,
    nextLesson: lessons[lessonIndex + 1] ?? null,
  };
}

export async function getStudentPreviewCourseReference(
  courseSlug: string,
  referenceSlug: string
) {
  const reference = findPublishedCourseReference(courseSlug, referenceSlug);
  if (!reference) notFound();

  const course = await getStudentPreviewCourseDetail(courseSlug);
  const courseModule = course.modules.find(
    (candidate) => candidate.sortOrder === reference.moduleSortOrder
  );
  if (!courseModule) notFound();

  const body = await loadCourseReferenceBody(reference);
  return {
    course: { title: course.title },
    module: { title: courseModule.title, resource: courseModule.resource },
    reference: { title: reference.title, summary: reference.summary },
    body,
  };
}
