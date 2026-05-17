import Image from "next/image";
import Tabs from "@/app/components/Tabs";
import { getRequiredCourseBySlug } from "@/lib/data/courses";

export const dynamic = "force-dynamic";

export default async function MasteryCoursePage() {
  const course = await getRequiredCourseBySlug("mastery");

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
            alt="Finishing Barbering"
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
              <p className="mb-4 text-lg leading-relaxed">
                The Finishing School is where barbers evolve into master artisans.
                Building on <em>Milady’s Standard Professional Barbering</em>, the
                curriculum integrates Artisan’s philosophy of discipline,
                creativity, and community into every lesson. Students refine
                technical precision while also developing professional identity
                and brand consciousness.
              </p>
              <p className="text-lg">
                Duration: <strong>{course.duration}</strong>
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
                <li>Refine advanced fade, blend, and detailing skills</li>
                <li>
                  Master scissor refinement, texturizing, and razor finishing
                </li>
                <li>
                  Develop brand storytelling and client experience strategies
                </li>
                <li>Create a professional portfolio of Artisan signature cuts</li>
                <li>
                  Transition into mentorship and apprenticeship opportunities
                </li>
                <li>
                  Earn a certificate of completion as an Artisan Master Barber
                </li>
              </ul>
            </>
            ),
          },
          {
            label: "Curriculum",
            content: (
            <>
              <h2 className="text-2xl font-bold mb-4">Curriculum Breakdown</h2>
              <ol className="list-decimal list-inside space-y-4 leading-relaxed">
                {course.modules.map((module) => (
                  <li key={module.id}>
                    <strong>{module.title}</strong>
                    {module.description && <p>{module.description}</p>}
                    <ul className="list-disc list-inside ml-4 mt-2">
                      {module.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          {lesson.title}
                          {lesson.duration ? ` (${lesson.duration})` : ""}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
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
                “The Finishing School didn’t just sharpen my technical skills — it
                gave me the confidence to run my chair like a business and my art
                like a brand.”
                <span className="block font-bold mt-2 text-black">
                  — Jordan, New York
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
