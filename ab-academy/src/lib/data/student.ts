import "server-only";

import { notFound } from "next/navigation";
import { LessonProgressStatus } from "@prisma/client";
import { getVisibleCourseModules } from "@/lib/data/course-visibility";
import { prisma } from "@/lib/prisma";

export type StudentEnrollmentSummary = Awaited<
  ReturnType<typeof getStudentDashboardData>
>["courses"][number];
export type WeeklyLessonProgress = Awaited<
  ReturnType<typeof getStudentDashboardData>
>["weeklyProgress"][number];

const WEEKLY_PROGRESS_DAYS = 7;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getChapterNumber(moduleSortOrder: number) {
  if (moduleSortOrder >= 10) {
    return Math.trunc(moduleSortOrder / 10);
  }

  return moduleSortOrder;
}

function getLessonSlug({
  moduleSortOrder,
  lessonSortOrder,
  title,
}: {
  moduleSortOrder: number;
  lessonSortOrder: number;
  title: string;
}) {
  return `chapter-${getChapterNumber(moduleSortOrder)}-lesson-${lessonSortOrder}-${slugify(title)}`;
}

function calculateProgress(completedLessons: number, totalLessons: number) {
  if (totalLessons === 0) {
    return 0;
  }

  return completedLessons / totalLessons;
}

export async function getStudentDashboardData(userId: string) {
  const weeklyProgressStart = new Date(
    Date.now() - WEEKLY_PROGRESS_DAYS * 24 * 60 * 60 * 1000
  );
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      enrollments: {
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          startedAt: "asc",
        },
        select: {
          id: true,
          status: true,
          course: {
            select: {
              id: true,
              slug: true,
              title: true,
              modules: {
                select: {
                  title: true,
                  lessons: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
          progress: {
            select: {
              lessonId: true,
              status: true,
            },
          },
        },
      },
    },
  });
  const recentLessonProgress = await prisma.lessonProgress.findMany({
    where: {
      enrollment: {
        userId,
        status: {
          in: ["ACTIVE", "COMPLETED"],
        },
      },
      status: {
        in: [LessonProgressStatus.IN_PROGRESS, LessonProgressStatus.COMPLETED],
      },
      OR: [
        {
          lastViewedAt: {
            gte: weeklyProgressStart,
          },
        },
        {
          completedAt: {
            gte: weeklyProgressStart,
          },
        },
      ],
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      status: true,
      completedAt: true,
      lastViewedAt: true,
      updatedAt: true,
      lesson: {
        select: {
          id: true,
          title: true,
          duration: true,
          module: {
            select: {
              id: true,
              title: true,
              course: {
                select: {
                  slug: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const courses = user.enrollments.map((enrollment) => {
    const modules = getVisibleCourseModules(
      enrollment.course.slug,
      enrollment.course.modules
    );
    const visibleLessonIds = new Set(
      modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))
    );
    const totalLessons = modules.reduce(
      (count, module) => count + module.lessons.length,
      0
    );
    const completedLessons = enrollment.progress.filter(
      (progress) =>
        visibleLessonIds.has(progress.lessonId) &&
        progress.status === LessonProgressStatus.COMPLETED
    ).length;

    return {
      enrollmentId: enrollment.id,
      id: enrollment.course.id,
      slug: enrollment.course.slug,
      title: enrollment.course.title,
      status: enrollment.status === "COMPLETED" ? "Completed" : "Active",
      progress: calculateProgress(completedLessons, totalLessons),
      completedLessons,
      totalLessons,
    };
  });
  const weeklyProgress = recentLessonProgress
    .filter((progress) => {
      const visibleModules = getVisibleCourseModules(
        progress.lesson.module.course.slug,
        [progress.lesson.module]
      );

      return visibleModules.length > 0;
    })
    .map((progress) => ({
      id: progress.id,
      lessonId: progress.lesson.id,
      lessonTitle: progress.lesson.title,
      moduleTitle: progress.lesson.module.title,
      courseTitle: progress.lesson.module.course.title,
      status:
        progress.status === LessonProgressStatus.COMPLETED
          ? "Completed"
          : "In progress",
      activityAt:
        progress.lastViewedAt ?? progress.completedAt ?? progress.updatedAt,
      duration: progress.lesson.duration,
    }));

  return {
    profile: {
      name: user.name.split(" ")[0] || user.name,
      email: user.email,
      coursesInProgress: courses.length,
      lessonsThisWeek: weeklyProgress.length,
    },
    courses,
    weeklyProgress,
  };
}

export async function getStudentCourseDetail(userId: string, slug: string) {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      course: {
        slug,
      },
    },
    select: {
      id: true,
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          slug: true,
          modules: {
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              id: true,
              title: true,
              sortOrder: true,
              description: true,
              lessons: {
                orderBy: {
                  sortOrder: "asc",
                },
                select: {
                  id: true,
                  title: true,
                  description: true,
                  duration: true,
                  sortOrder: true,
                },
              },
            },
          },
        },
      },
      progress: {
        select: {
          lessonId: true,
          status: true,
        },
      },
    },
  });

  if (!enrollment) {
    notFound();
  }

  const progressByLesson = new Map(
    enrollment.progress.map((progress) => [progress.lessonId, progress.status])
  );
  const visibleModules = getVisibleCourseModules(
    enrollment.course.slug,
    enrollment.course.modules
  );
  const modules = visibleModules.map((module) => ({
    ...module,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      slug: getLessonSlug({
        moduleSortOrder: module.sortOrder,
        lessonSortOrder: lesson.sortOrder,
        title: lesson.title,
      }),
      href: `/student/courses/${enrollment.course.slug}/lessons/${getLessonSlug({
        moduleSortOrder: module.sortOrder,
        lessonSortOrder: lesson.sortOrder,
        title: lesson.title,
      })}`,
      completed: progressByLesson.get(lesson.id) === LessonProgressStatus.COMPLETED,
    })),
  }));
  const lessons = modules.flatMap((module) => module.lessons);
  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const progress = calculateProgress(completedLessons, lessons.length);
  const nextLesson = lessons.find((lesson) => !lesson.completed) ?? lessons[0];

  return {
    title: enrollment.course.title,
    description: enrollment.course.description || "",
    instructor: "Charles McCoy",
    progress,
    nextLessonHref: nextLesson?.href ?? null,
    modules,
    lessons,
    resources: [
      {
        id: 1,
        name: `${enrollment.course.title} Handbook (PDF)`,
        link: `/resources/${enrollment.course.slug}.pdf`,
      },
      {
        id: 2,
        name: "Style Reference Board",
        link: `/resources/${enrollment.course.slug}-board.jpg`,
      },
    ],
  };
}

export async function getStudentLessonDetail(
  userId: string,
  courseSlug: string,
  lessonSlug: string
) {
  const course = await getStudentCourseDetail(userId, courseSlug);
  const lessons = course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleTitle: module.title,
      moduleDescription: module.description,
    }))
  );
  const lessonIndex = lessons.findIndex((lesson) => lesson.slug === lessonSlug);

  if (lessonIndex === -1) {
    notFound();
  }

  const lesson = lessons[lessonIndex];

  return {
    course: {
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      progress: course.progress,
    },
    lesson,
    previousLesson: lessons[lessonIndex - 1] ?? null,
    nextLesson: lessons[lessonIndex + 1] ?? null,
  };
}
