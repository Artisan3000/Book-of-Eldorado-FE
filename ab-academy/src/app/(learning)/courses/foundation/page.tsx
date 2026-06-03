import Image from "next/image";
import Link from "next/link";
import Tabs from "@/app/components/Tabs";
import { getVisibleCourseModules } from "@/lib/data/course-visibility";
import { getRequiredCourseBySlug } from "@/lib/data/courses";

export const dynamic = "force-dynamic";

export default async function FoundationCoursePage() {
  const course = await getRequiredCourseBySlug("foundation");
  const modules = getVisibleCourseModules(course.slug, course.modules);

  return (
    <main>
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 px-8 py-16 border-b border-black animate-fadeUp">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold leading-tight">{course.title}</h1>
          <p className="text-lg leading-relaxed">
            {course.description}
          </p>
          <Link
            href="/enroll"
            className="inline-block bg-black text-white px-6 py-3 font-medium uppercase tracking-wide transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            Enroll Now
          </Link>
        </div>
        <div className="relative w-full h-80 overflow-hidden rounded-lg">
          <Image
            src="/sinval-carvalho-WbEibGKHBMY-unsplash.jpg"
            alt="Foundation course workspace"
            fill
            className="object-cover transform transition-transform duration-[4000ms] hover:scale-110"
            priority
          />
        </div>
      </section>

      <Tabs
        tabs={[
          {
            label: "About",
            content: (
            <>
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <p className="text-lg leading-relaxed">
                Foundation introduces the client, communication, and business
                practices that support a sustainable barbering career. These
                modules are scaffolded for short video lessons, workbook
                exercises, and practical reflection prompts.
              </p>
            </>
            ),
          },
          {
            label: "Outcomes",
            content: (
            <>
              <h2 className="text-2xl font-bold mb-4">What You’ll Achieve</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Practice clear client consultation habits</li>
                <li>Understand follow-up and retention foundations</li>
                <li>Begin shaping a simple barber brand position</li>
                <li>Outline service menu and client experience basics</li>
                <li>Use workbook prompts to prepare for deeper coursework</li>
              </ul>
            </>
            ),
          },
          {
            label: "Modules",
            content: (
            <>
              <h2 className="text-2xl font-bold mb-4">Module Scaffold</h2>
              <div className="space-y-6">
                {modules.map((module) => (
                  <section key={module.id} className="border border-black p-5">
                    <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                    {module.description && (
                      <p className="text-sm text-gray-700 mb-4">
                        {module.description}
                      </p>
                    )}
                    <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                      {module.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          {lesson.title}
                          {lesson.duration ? ` (${lesson.duration})` : ""}
                          {lesson.description && (
                            <p className="ml-6 text-sm text-gray-600">
                              {lesson.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            </>
            ),
          },
          {
            label: "Workbook",
            content: (
            <>
              <h2 className="text-2xl font-bold mb-4">Workbook Materials</h2>
              <p className="text-lg leading-relaxed">
                Workbook and text sections will be added as the Foundation
                course materials are finalized.
              </p>
            </>
            ),
          },
        ]}
      />
    </main>
  );
}
