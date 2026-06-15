import { PrismaClient, Role, CourseStatus, EnrollmentStatus, LessonProgressStatus } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

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
    description?: string;
    sortOrder?: number;
    lessons: {
      title: string;
      description?: string;
      duration: string;
    }[];
  }[];
};

const seedCourses: SeedCourse[] = [
  {
    slug: "foundation",
    title: "Foundation",
    subtitle: "Learn the craft. Build your confidence.",
    description:
      "Build the client communication, retention, business, and branding foundations that support a sustainable barbering career.",
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
            duration: "8-10 min",
          },
          {
            title: "Managing Difficult Conversations",
            description:
              "Practice professional responses to unhappy clients, unrealistic requests, graceful declines, and recovery conversations.",
            duration: "10-12 min",
          },
          {
            title: "Building Your Chair-Side Presence",
            description:
              "Develop the tone, energy, focus, and room awareness that help clients feel fully seen during every appointment.",
            duration: "8-10 min",
          },
          {
            title: "Rebooking & Retention Habits",
            description:
              "Make rebooking a natural part of the service, handle cancellations professionally, and start tracking retention as a career metric.",
            duration: "9-11 min",
          },
          {
            title: "Digital Client Communication",
            description:
              "Bring Artisan-level professionalism into DMs, texts, Squire inquiries, expectation-setting, and written communication.",
            duration: "9-11 min",
          },
          {
            title: "Chapter Assessment",
            description:
              "Complete a mock consultation and scenario responses that test consultation, expectation-setting, communication, and retention judgment.",
            duration: "6-8 min",
          },
        ],
      },
      {
        title: "Business & Branding Essentials",
        description:
          "Understand how the shop makes money, how the Artisan brand works day to day, and how to build a professional identity within it.",
        sortOrder: 20,
        lessons: [
          {
            title: "How a Barbershop Actually Makes Money",
            description:
              "Learn the core revenue streams, how each chair affects shop profitability, where retail and add-ons fit, and why your book is a business asset.",
            duration: "8-10 min",
          },
          {
            title: "The Artisan Brand: What It Means Day-to-Day",
            description:
              "Understand what the Artisan brand stands for, what the shop is and is not, and how every barber extends the brand through daily practice.",
            duration: "7-9 min",
          },
          {
            title: "Building Your Personal Brand Within the Shop",
            description:
              "Define your identity as a barber, find your specialty, align with Artisan without losing your voice, and think about your long-term portfolio.",
            duration: "9-11 min",
          },
          {
            title: "Social Media for Barbers",
            description:
              "Practice what to post, how to shoot your work, caption and hashtag strategy, engaging with the Artisan account, and using social presence to support your book.",
            duration: "10-12 min",
          },
          {
            title: "Pricing, Upselling & Retail",
            description:
              "Understand your value, introduce add-ons naturally, recommend products without sounding pushy, and see how retail benefits everyone.",
            duration: "9-11 min",
          },
          {
            title: "Professionalism & Shop Etiquette",
            description:
              "Build standards around punctuality, station care, teamwork, slow days, and professionalism in a shared shop environment.",
            duration: "7-9 min",
          },
          {
            title: "Chapter Assessment",
            description:
              "Complete a brand alignment exercise, one-week content plan, and written scenarios covering business judgment, professionalism, and brand decisions.",
            duration: "6-8 min",
          },
        ],
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
      status: CourseStatus.PUBLISHED,
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
      status: CourseStatus.PUBLISHED,
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
      },
      create: {
        courseId: savedCourse.id,
        title: module.title,
        description: module.description,
        sortOrder: moduleSortOrder,
      },
    });

    for (const [lessonIndex, lesson] of module.lessons.entries()) {
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
        },
        create: {
          moduleId: savedModule.id,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
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
