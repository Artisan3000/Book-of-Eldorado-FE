import "server-only";

import { notFound } from "next/navigation";
import { LessonProgressStatus } from "@prisma/client";
import { getVisibleCourseModules } from "@/lib/data/course-visibility";
import { prisma } from "@/lib/prisma";

export type StudentEnrollmentSummary = Awaited<
  ReturnType<typeof getStudentDashboardData>
>["courses"][number];

function calculateProgress(completedLessons: number, totalLessons: number) {
  if (totalLessons === 0) {
    return 0;
  }

  return completedLessons / totalLessons;
}

export async function getStudentDashboardData(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      enrollments: {
        where: {
          status: {
            in: ["ACTIVE", "COMPLETED"],
          },
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

  return {
    profile: {
      name: user.name.split(" ")[0] || user.name,
      email: user.email,
      totalHours: 42,
      coursesInProgress: courses.filter((course) => course.status !== "Completed").length,
      certificates: 0,
      streak: 6,
    },
    courses,
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
      completed: progressByLesson.get(lesson.id) === LessonProgressStatus.COMPLETED,
    })),
  }));
  const lessons = modules.flatMap((module) => module.lessons);
  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const progress = calculateProgress(completedLessons, lessons.length);

  return {
    title: enrollment.course.title,
    description: enrollment.course.description || "",
    instructor: "Artisan Academy",
    progress,
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
