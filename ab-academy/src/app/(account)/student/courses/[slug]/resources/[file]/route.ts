import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { CourseStatus, EnrollmentStatus } from "@prisma/client";
import { userHasRole } from "@/lib/auth";
import { findCourseResourceFile, moduleLinksToResource } from "@/lib/course-resources";
import { getVisibleCourseModules } from "@/lib/data/course-visibility";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { STUDENT_EXPERIENCE_ROLES } from "@/lib/roles";

// Serves a course file (e.g. the Chapter 2 workbook PDF) to students enrolled
// in that course. proxy.ts already redirects requests without a session
// cookie to /login; this handler checks the session, role, and enrollment.
export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ slug: string; file: string }>;
  }
) {
  const { slug, file } = await params;
  const resource = findCourseResourceFile(slug, file);

  if (!resource) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  }

  const user = await getCurrentUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", new URL(request.url).pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (!userHasRole(user.role, STUDENT_EXPERIENCE_ROLES)) {
    return NextResponse.json(
      { error: "You are not allowed to download course resources." },
      { status: 403 }
    );
  }

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
      course: {
        select: {
          slug: true,
          modules: {
            select: {
              title: true,
              resourceUrl: true,
            },
          },
        },
      },
    },
  });

  if (
    !enrollment ||
    !moduleLinksToResource(
      getVisibleCourseModules(enrollment.course.slug, enrollment.course.modules),
      slug,
      file
    )
  ) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  }

  const data = await readFile(resource.path);

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": resource.contentType,
      "Content-Length": String(data.length),
      // Inline so it opens in the browser's viewer, where it can be printed or saved.
      "Content-Disposition": `inline; filename="${resource.downloadName}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
