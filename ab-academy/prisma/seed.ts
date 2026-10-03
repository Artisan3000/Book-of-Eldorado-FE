import { PrismaClient, Role, CourseStatus, EnrollmentStatus, LessonProgressStatus } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";
import { FOUNDATION_CHAPTER_2_TITLE } from "../src/lib/data/course-visibility";
import {
  CHAPTER_2_MODULE_SORT_ORDER,
  chapter2Module,
  loadChapter2Lessons,
} from "./foundation-chapter-2";

const prisma = new PrismaClient();

type SeedCourse = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  priceCents: number;
  duration: string;
  sortOrder: number;
  modules: {
    title: string;
    description?: string | null;
    sortOrder?: number;
    resourceTitle?: string | null;
    resourceUrl?: string | null;
    lessons: {
      title: string;
      description?: string | null;
      duration: string | null;
      videoUrl?: string;
      body?: string | null;
    }[];
  }[];
};

// Development only: this seed resets the seeded admin/student credentials and
// must never be run against production. Production Chapter 2 content is
// applied with prisma/import-chapter-2-text-lessons.ts instead.
const chapter2SeedLessons = loadChapter2Lessons();
const chapter2PlaceholderCount = chapter2SeedLessons.filter(
  (lesson) => lesson.isPlaceholder
).length;

const seedCourses: SeedCourse[] = [
  {
    slug: "foundation",
    title: "Foundation",
    subtitle: "Learn the craft. Build your confidence.",
    description:
      "Build the client communication, retention, haircut development, and product knowledge foundations that support a sustainable barbering career.",
    level: "Foundation",
    priceCents: 74900,
    duration: "8 weeks (self-paced)",
    sortOrder: 1,
    modules: [
      {
        title: "Client Communication & Retention",
        description:
          "Build the consultation, client communication, rebooking, and retention habits that support a professional barbering career.",
        sortOrder: 10,
        lessons: [
          {
            title: "The Artisan Consultation Framework",
            description:
              "Learn the four-part consultation framework: ask about lifestyle, listen fully, read what is already there, and set expectations before the service begins.",
            duration: "8 min",
            videoUrl: "https://player.vimeo.com/video/1208793359",
          },
          {
            title: "Managing Difficult Conversations",
            description:
              "Practice professional responses to unhappy clients, unrealistic requests, graceful declines, and recovery conversations.",
            duration: "11 min",
            videoUrl: "https://player.vimeo.com/video/1208793357",
          },
          {
            title: "Building Your Chair-Side Presence",
            description:
              "Develop the tone, energy, focus, and room awareness that help clients feel fully seen during every appointment.",
            duration: "11 min",
            videoUrl: "https://player.vimeo.com/video/1208793358",
          },
          {
            title: "Rebooking & Retention Habits",
            description:
              "Make rebooking a natural part of the service, handle cancellations professionally, and start tracking retention as a career metric.",
            duration: "11 min",
            videoUrl: "https://player.vimeo.com/video/1212377540",
          },
          {
            title: "Digital Client Communication",
            description:
              "Bring Artisan-level professionalism into DMs, texts, Squire inquiries, expectation-setting, and written communication.",
            duration: "11 min",
            videoUrl: "https://player.vimeo.com/video/1212387564",
          },
          {
            title: "Chapter Assessment",
            description:
              "Complete a mock consultation and scenario responses that test consultation, expectation-setting, communication, and retention judgment.",
            duration: "7 min",
            videoUrl: "https://player.vimeo.com/video/1212385517",
          },
        ],
      },
      {
        title: FOUNDATION_CHAPTER_2_TITLE,
        description: chapter2Module.description,
        sortOrder: CHAPTER_2_MODULE_SORT_ORDER,
        resourceTitle: chapter2Module.resourceTitle,
        resourceUrl: chapter2Module.resourceUrl,
        // Placeholder manuscript files seed as empty lessons ("coming soon")
        // rather than as student-facing text.
        lessons: chapter2SeedLessons.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          duration: lesson.isPlaceholder ? null : lesson.duration,
          body: lesson.isPlaceholder ? null : lesson.body,
        })),
      },
    ],
  },
  {
    slug: "refinement",
    title: "Refinement",
    subtitle: "Sharpen your eye. Strengthen your flow.",
    description:
      "Take your skills to the next level with advanced techniques, styling precision, and professional workflow discipline.",
    level: "Refinement",
    priceCents: 124900,
    duration: "12 weeks (self-paced)",
    sortOrder: 2,
    modules: [
      {
        title: "Advanced Technique",
        description: "Precision, styling theory, and clean technical execution.",
        lessons: [
          { title: "Advanced Fading Techniques", duration: "12 min" },
          { title: "Line Work & Detailing", duration: "8 min" },
          { title: "Styling for Texture", duration: "15 min" },
        ],
      },
      {
        title: "Professional Flow",
        description: "Client communication and repeatable service systems.",
        lessons: [
          { title: "Consultation & Client Retention", duration: "10 min" },
          { title: "Workflow Efficiency", duration: "11 min" },
        ],
      },
    ],
  },
  {
    slug: "mastery",
    title: "Mastery",
    subtitle: "Define your style. Lead with excellence.",
    description:
      "Develop your personal artistry, professional identity, and signature finishing standards.",
    level: "Mastery",
    priceCents: 89900,
    duration: "16 weeks (self-paced with mentorship)",
    sortOrder: 3,
    modules: [
      {
        title: "Signature Work",
        description: "Creative finishes and portfolio-ready service work.",
        lessons: [
          { title: "Creative Fades", duration: "16 min" },
          { title: "Razor Finishing", duration: "13 min" },
          { title: "Portfolio Presentation", duration: "18 min" },
        ],
      },
      {
        title: "Mentorship",
        description: "Capstone planning and live demonstration readiness.",
        lessons: [
          { title: "Capstone Planning", duration: "10 min" },
          { title: "Live Demo Preparation", duration: "14 min" },
        ],
      },
    ],
  },
];

async function seedUsers() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@artisanbarber.test";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin-password";
  const studentEmail = process.env.SEED_STUDENT_EMAIL || "student@artisanbarber.test";
  const studentPassword = process.env.SEED_STUDENT_PASSWORD || "student-password";
  const adminPasswordHash = await hashPassword(adminPassword);
  const studentPasswordHash = await hashPassword(studentPassword);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Artisan Admin",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      isActive: true,
    },
    create: {
      name: "Artisan Admin",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: studentEmail },
    update: {
      name: "Maria Student",
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      isActive: true,
    },
    create: {
      name: "Maria Student",
      email: studentEmail,
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
    },
  });

  console.log("Seeded login credentials:");
  console.log(`Admin:   ${adminEmail} / ${adminPassword}`);
  console.log(`Student: ${studentEmail} / ${studentPassword}`);

  return { admin, student };
}

async function seedCourse(course: SeedCourse) {
  const status =
    course.slug === "foundation" ? CourseStatus.PUBLISHED : CourseStatus.ARCHIVED;

  const savedCourse = await prisma.course.upsert({
    where: { slug: course.slug },
    update: {
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      level: course.level,
      priceCents: course.priceCents,
      duration: course.duration,
      sortOrder: course.sortOrder,
      status,
    },
    create: {
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      level: course.level,
      priceCents: course.priceCents,
      duration: course.duration,
      sortOrder: course.sortOrder,
      status,
    },
  });

  for (const [moduleIndex, module] of course.modules.entries()) {
    const moduleSortOrder = module.sortOrder ?? moduleIndex + 1;
    const savedModule = await prisma.module.upsert({
      where: {
        courseId_sortOrder: {
          courseId: savedCourse.id,
          sortOrder: moduleSortOrder,
        },
      },
      update: {
        title: module.title,
        description: module.description,
        resourceTitle: module.resourceTitle,
        resourceUrl: module.resourceUrl,
      },
      create: {
        courseId: savedCourse.id,
        title: module.title,
        description: module.description,
        sortOrder: moduleSortOrder,
        resourceTitle: module.resourceTitle,
        resourceUrl: module.resourceUrl,
      },
    });

    for (const [lessonIndex, lesson] of module.lessons.entries()) {
      const lessonVideoData =
        lesson.videoUrl === undefined ? {} : { videoUrl: lesson.videoUrl };
      const lessonBodyData = lesson.body === undefined ? {} : { body: lesson.body };

      await prisma.lesson.upsert({
        where: {
          moduleId_sortOrder: {
            moduleId: savedModule.id,
            sortOrder: lessonIndex + 1,
          },
        },
        update: {
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          ...lessonVideoData,
          ...lessonBodyData,
        },
        create: {
          moduleId: savedModule.id,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          ...lessonVideoData,
          ...lessonBodyData,
          sortOrder: lessonIndex + 1,
        },
      });
    }
  }

  return savedCourse;
}

async function seedEnrollments(studentId: string) {
  const foundation = await prisma.course.findUniqueOrThrow({
    where: { slug: "foundation" },
    include: { modules: { include: { lessons: true }, orderBy: { sortOrder: "asc" } } },
  });
  const refinement = await prisma.course.findUniqueOrThrow({
    where: { slug: "refinement" },
    include: { modules: { include: { lessons: true }, orderBy: { sortOrder: "asc" } } },
  });

  const foundationEnrollment = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: studentId,
        courseId: foundation.id,
      },
    },
    update: { status: EnrollmentStatus.ACTIVE },
    create: {
      userId: studentId,
      courseId: foundation.id,
      status: EnrollmentStatus.ACTIVE,
    },
  });

  const refinementEnrollment = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: studentId,
        courseId: refinement.id,
      },
    },
    update: { status: EnrollmentStatus.ACTIVE },
    create: {
      userId: studentId,
      courseId: refinement.id,
      status: EnrollmentStatus.ACTIVE,
    },
  });

  const foundationLessons = foundation.modules.flatMap((module) => module.lessons);
  const refinementLessons = refinement.modules.flatMap((module) => module.lessons);

  for (const lesson of foundationLessons.slice(0, 4)) {
    await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: foundationEnrollment.id,
          lessonId: lesson.id,
        },
      },
      update: {
        status: LessonProgressStatus.COMPLETED,
        completedAt: new Date(),
        lastViewedAt: new Date(),
      },
      create: {
        enrollmentId: foundationEnrollment.id,
        lessonId: lesson.id,
        status: LessonProgressStatus.COMPLETED,
        completedAt: new Date(),
        lastViewedAt: new Date(),
      },
    });
  }

  for (const lesson of refinementLessons.slice(0, 2)) {
    await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: refinementEnrollment.id,
          lessonId: lesson.id,
        },
      },
      update: {
        status: LessonProgressStatus.IN_PROGRESS,
        lastViewedAt: new Date(),
      },
      create: {
        enrollmentId: refinementEnrollment.id,
        lessonId: lesson.id,
        status: LessonProgressStatus.IN_PROGRESS,
        lastViewedAt: new Date(),
      },
    });
  }
}

async function main() {
  if (chapter2PlaceholderCount > 0) {
    console.warn(
      `Chapter 2: ${chapter2PlaceholderCount} lesson file(s) are still placeholders and will be seeded without a body.`
    );
  }

  const { student } = await seedUsers();

  for (const course of seedCourses) {
    await seedCourse(course);
  }

  await seedEnrollments(student.id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
