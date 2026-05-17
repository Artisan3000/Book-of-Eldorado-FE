import Image from "next/image";
import Tabs from "@/app/components/Tabs";
import { getRequiredCourseBySlug } from "@/lib/data/courses";

export const dynamic = "force-dynamic";

export default async function FoundationCoursePage() {
  const course = await getRequiredCourseBySlug("foundation");

  return (
    <main>
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
            src="/refinement-barber.jpg"
            alt="Refinement Barbering"
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
                Designed for barbers ready to refine their craft, this course
                dives deeper into advanced cutting methods, precision styling,
                and professional workflow systems. You’ll learn how to deliver
                polished results efficiently while developing your personal
                rhythm behind the chair.
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
                <li>Execute advanced fades and precision blends</li>
                <li>Enhance scissor-over-comb technique</li>
                <li>Refine razor line artistry and detailing</li>
                <li>Improve time management and consistency</li>
                <li>Develop an efficient, creative workflow</li>
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
                “This course helped me find my rhythm — I finally feel like a
                professional instead of a beginner with talent. My cuts are
                faster, cleaner, and sharper.”
                <span className="block font-bold mt-2 text-black">
                  — Jordan, Los Angeles
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
