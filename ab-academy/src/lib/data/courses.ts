import "server-only";

import { notFound } from "next/navigation";
import { CourseStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PublishedCourse = Awaited<ReturnType<typeof getPublishedCourses>>[number];
export type CourseWithCurriculum = NonNullable<Awaited<ReturnType<typeof getCourseBySlug>>>;

export async function getPublishedCourses() {
  return prisma.course.findMany({
    where: {
      status: CourseStatus.PUBLISHED,
    },
    orderBy: {
      sortOrder: "asc",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      description: true,
      level: true,
      priceCents: true,
      duration: true,
      sortOrder: true,
    },
  });
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findFirst({
    where: {
      slug,
      status: CourseStatus.PUBLISHED,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      description: true,
      level: true,
      priceCents: true,
      duration: true,
      modules: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          sortOrder: true,
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
  });
}

export async function getRequiredCourseBySlug(slug: string) {
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return course;
}

export function formatCoursePrice(priceCents: number | null) {
  if (priceCents == null) {
    return "";
  }

  return `$${Math.round(priceCents / 100).toLocaleString()}`;
}
