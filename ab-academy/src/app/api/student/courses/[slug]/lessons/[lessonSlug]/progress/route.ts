import { NextResponse } from "next/server";
import {
  CourseStatus,
  EnrollmentStatus,
  LessonProgressStatus,
  Prisma,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getVisibleCourseModules } from "@/lib/data/course-visibility";
import { getLessonSlug } from "@/lib/data/student";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

const supportedStatuses = new Set<LessonProgressStatus>([
  LessonProgressStatus.IN_PROGRESS,
  LessonProgressStatus.COMPLETED,
]);

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

async function findExistingProgress(enrollmentId: string, lessonId: string) {
  return prisma.lessonProgress.findUnique({
    where: {
      enrollmentId_lessonId: {
        enrollmentId,
        lessonId,
      },
    },
    select: {
      id: true,
      status: true,
      completedAt: true,
      lastViewedAt: true,
    },
  });
}

async function markInProgress({
  enrollmentId,
  lessonId,
  now,
}: {
  enrollmentId: string;
  lessonId: string;
  now: Date;
}) {
  const existingProgress = await findExistingProgress(enrollmentId, lessonId);

  if (existingProgress) {
    return prisma.lessonProgress.update({
      where: {
        id: existingProgress.id,
      },
      data:
        existingProgress.status === LessonProgressStatus.COMPLETED
          ? {
              lastViewedAt: now,
            }
          : {
              status: LessonProgressStatus.IN_PROGRESS,
              lastViewedAt: now,
            },
      select: {
        id: true,
        status: true,
        completedAt: true,
        lastViewedAt: true,
      },
    });
  }

  try {
    return await prisma.lessonProgress.create({
      data: {
        enrollmentId,
        lessonId,
        status: LessonProgressStatus.IN_PROGRESS,
        lastViewedAt: now,
      },
      select: {
        id: true,
        status: true,
        completedAt: true,
        lastViewedAt: true,
      },
    });
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    return markInProgress({ enrollmentId, lessonId, now });
  }
}

async function markCompleted({
  enrollmentId,
  lessonId,
  now,
}: {
  enrollmentId: string;
  lessonId: string;
  now: Date;
}) {
  const existingProgress = await findExistingProgress(enrollmentId, lessonId);

  if (existingProgress) {
    return prisma.lessonProgress.update({
      where: {
        id: existingProgress.id,
      },
      data: {
        status: LessonProgressStatus.COMPLETED,
        completedAt: existingProgress.completedAt ?? now,
        lastViewedAt: now,
      },
      select: {
        id: true,
        status: true,
        completedAt: true,
        lastViewedAt: true,
      },
    });
  }

  try {
    return await prisma.lessonProgress.create({
      data: {
        enrollmentId,
        lessonId,
        status: LessonProgressStatus.COMPLETED,
        completedAt: now,
        lastViewedAt: now,
      },
      select: {
        id: true,
        status: true,
        completedAt: true,
        lastViewedAt: true,
      },
    });
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    return markCompleted({ enrollmentId, lessonId, now });
  }
}

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ slug: string; lessonSlug: string }>;
  }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const requestedStatus = body?.status as LessonProgressStatus | undefined;

  if (!requestedStatus || !supportedStatuses.has(requestedStatus)) {
    return NextResponse.json(
      { error: "Unsupported lesson progress status." },
      { status: 400 }
    );
  }

  const { slug, lessonSlug } = await params;
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: user.id,
      status: {
        in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED],
      },
      course: {
        slug,
        status: CourseStatus.PUBLISHED,
      },
    },
    select: {
      id: true,
      course: {
        select: {
          slug: true,
          modules: {
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              title: true,
              sortOrder: true,
              lessons: {
                orderBy: {
                  sortOrder: "asc",
                },
                select: {
                  id: true,
                  title: true,
                  sortOrder: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!enrollment) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  const visibleModules = getVisibleCourseModules(
    enrollment.course.slug,
    enrollment.course.modules
  );
  const lessons = visibleModules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      slug: getLessonSlug({
        moduleSortOrder: module.sortOrder,
        lessonSortOrder: lesson.sortOrder,
        title: lesson.title,
      }),
    }))
  );
  const lesson = lessons.find((candidate) => candidate.slug === lessonSlug);

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  const now = new Date();
  const progress =
    requestedStatus === LessonProgressStatus.COMPLETED
      ? await markCompleted({
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
          now,
        })
      : await markInProgress({
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
          now,
        });

  revalidatePath("/student/dashboard");
  revalidatePath("/student/courses");
  revalidatePath(`/student/courses/${slug}`);
  revalidatePath(`/student/courses/${slug}/lessons/${lessonSlug}`);

  return NextResponse.json({
    progress: {
      status: progress.status,
      completed: progress.status === LessonProgressStatus.COMPLETED,
      completedAt: progress.completedAt,
      lastViewedAt: progress.lastViewedAt,
    },
  });
}
