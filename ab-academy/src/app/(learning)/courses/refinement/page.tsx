import Image from "next/image";
import Tabs from "@/app/components/Tabs";
import { getRequiredCourseBySlug } from "@/lib/data/courses";

export const dynamic = "force-dynamic";

export default async function RefinementCoursePage() {
  const course = await getRequiredCourseBySlug("refinement");

  return (
    <main className="font-serif text-black">
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 px-8 py-16 border-b border-black animate-fadeUp">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold leading-tight">{course.title}</h1>
          <p className="text-lg leading-relaxed">
            {course.description}
          </p>
          <button className="bg-black text-white px-6 py-3 font-medium uppercase tracking-wide transition-transform duration-300 hover:scale-105 active:scale-95">
            Enroll Now
          </button>
        </div>
        <div className="relative w-full h-80 overflow-hidden rounded-lg">
          <Image
            src="/stephen-romary-5Typ4csSmY0-unsplash.jpg"
            alt="Advanced Barbering"
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
                For barbers who already know the basics, this advanced track
                sharpens your craft. Learn advanced fading techniques, precision
                razor work, and styling mastery — plus shop management and brand
                building.
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
                <li>Perfect advanced fades, tapers, and blends</li>
                <li>Master scissor-over-comb precision cutting</li>
                <li>Create razor designs and hairline detailing</li>
                <li>Deliver high-level styling for diverse hair types</li>
                <li>
                  Develop branding, pricing, and client retention strategies
                </li>
              </ul>
            </>
            ),
          },
          {
            label: "Courses",
            content: (
            <>
              <h2 className="text-2xl font-bold mb-4">Course Breakdown</h2>
              <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                {course.modules.flatMap((module) =>
                  module.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      {lesson.title}
                      {lesson.duration ? ` (${lesson.duration})` : ""}
                    </li>
                  ))
                )}
              </ol>
            </>
            ),
          },
          {
            label: "Testimonials",
            content: (
            <>
              <h2 className="text-2xl font-bold mb-4">Student Testimonials</h2>
              <blockquote className="italic mb-4 border-l-4 border-black pl-4 text-gray-700">
                “The advanced fading and razor work set me apart from other
                barbers in my city.”
                <span className="block font-bold mt-2 text-black">
                  — Luis, Miami
                </span>
              </blockquote>
              <blockquote className="italic mb-4 border-l-4 border-black pl-4 text-gray-700">
                “I finally feel ready to open my own shop. The business module
                gave me clarity.”
                <span className="block font-bold mt-2 text-black">
                  — Dana, NYC
                </span>
              </blockquote>
            </>
            ),
          },
        ]}
      />
    </main>
  );
}
