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
const MAX_PLAYBACK_POSITION_SECONDS = 12 * 60 * 60;

const progressSelect = {
  id: true,
  status: true,
  completedAt: true,
  lastViewedAt: true,
  lastPositionSeconds: true,
} satisfies Prisma.LessonProgressSelect;

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function getValidatedPlaybackPosition(value: unknown) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < 0 ||
    value > MAX_PLAYBACK_POSITION_SECONDS
  ) {
    return null;
  }

  return value;
}

async function findExistingProgress(enrollmentId: string, lessonId: string) {
  return prisma.lessonProgress.findUnique({
    where: {
      enrollmentId_lessonId: {
        enrollmentId,
        lessonId,
      },
    },
    select: progressSelect,
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
      select: progressSelect,
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
      select: progressSelect,
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
        lastPositionSeconds: 0,
      },
      select: progressSelect,
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
        lastPositionSeconds: 0,
      },
      select: progressSelect,
    });
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    return markCompleted({ enrollmentId, lessonId, now });
  }
}

async function savePlaybackPosition({
  enrollmentId,
  lessonId,
  positionSeconds,
  updateLastViewedAt,
  now,
}: {
  enrollmentId: string;
  lessonId: string;
  positionSeconds: number;
  updateLastViewedAt: boolean;
  now: Date;
}) {
  const existingProgress = await findExistingProgress(enrollmentId, lessonId);

  if (existingProgress) {
    if (existingProgress.status === LessonProgressStatus.COMPLETED) {
      if (existingProgress.lastPositionSeconds === 0) {
        return existingProgress;
      }

      return prisma.lessonProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          lastPositionSeconds: 0,
        },
        select: progressSelect,
      });
    }

    if (positionSeconds > existingProgress.lastPositionSeconds) {
      const updateResult = await prisma.lessonProgress.updateMany({
        where: {
          id: existingProgress.id,
          status: {
            not: LessonProgressStatus.COMPLETED,
          },
          lastPositionSeconds: {
            lte: positionSeconds,
          },
        },
        data: {
          lastPositionSeconds: positionSeconds,
          ...(updateLastViewedAt ? { lastViewedAt: now } : {}),
        },
      });

      if (updateResult.count > 0) {
        const updatedProgress = await findExistingProgress(enrollmentId, lessonId);

        if (!updatedProgress) {
          throw new Error("Lesson progress could not be found after update.");
        }

        return updatedProgress;
      }

      return savePlaybackPosition({
        enrollmentId,
        lessonId,
        positionSeconds,
        updateLastViewedAt,
        now,
      });
    }

    if (updateLastViewedAt) {
      return prisma.lessonProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          lastViewedAt: now,
        },
        select: progressSelect,
      });
    }

    return existingProgress;
  }

  try {
    return await prisma.lessonProgress.create({
      data: {
        enrollmentId,
        lessonId,
        lastPositionSeconds: positionSeconds,
        ...(updateLastViewedAt ? { lastViewedAt: now } : {}),
      },
      select: progressSelect,
    });
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    return savePlaybackPosition({
      enrollmentId,
      lessonId,
      positionSeconds,
      updateLastViewedAt,
      now,
    });
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
  const requestedAction = body?.action;
  const requestedStatus = body?.status as LessonProgressStatus | undefined;

  if (
    requestedAction !== "SAVE_POSITION" &&
    (!requestedStatus || !supportedStatuses.has(requestedStatus))
  ) {
    return NextResponse.json(
      { error: "Unsupported lesson progress status." },
      { status: 400 }
    );
  }

  const requestedPositionSeconds =
    requestedAction === "SAVE_POSITION"
      ? getValidatedPlaybackPosition(body?.positionSeconds)
      : null;

  if (requestedAction === "SAVE_POSITION" && requestedPositionSeconds === null) {
    return NextResponse.json(
      { error: "Playback position must be a finite non-negative whole number." },
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
    requestedAction === "SAVE_POSITION"
      ? await savePlaybackPosition({
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
          positionSeconds: requestedPositionSeconds ?? 0,
          updateLastViewedAt: body?.interaction === "pause",
          now,
        })
      : requestedStatus === LessonProgressStatus.COMPLETED
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

  if (requestedAction !== "SAVE_POSITION" || body?.interaction === "pause") {
    revalidatePath("/student/dashboard");
    revalidatePath("/student/courses");
    revalidatePath(`/student/courses/${slug}`);
    revalidatePath(`/student/courses/${slug}/lessons/${lessonSlug}`);
  }

  return NextResponse.json({
    progress: {
      status: progress.status,
      completed: progress.status === LessonProgressStatus.COMPLETED,
      completedAt: progress.completedAt,
      lastViewedAt: progress.lastViewedAt,
      lastPositionSeconds: progress.lastPositionSeconds,
    },
  });
}
