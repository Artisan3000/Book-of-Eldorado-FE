"use client";

import { useState } from "react";
import Image from "next/image";

export default function MasteryCoursePage() {
  const tabs = ["About", "Outcomes", "Curriculum", "Testimonials"];
  const [activeTab, setActiveTab] = useState("About");

  return (
    <main className="font-serif text-black">
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 px-8 py-16 border-b border-black animate-fadeUp">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold leading-tight">Mastery</h1>
          <p className="text-lg leading-relaxed">
            Define your style. Lead with excellence. Develop your personal
            artistry and professional identity. Learn the nuances that separate
            good barbers from great ones — detail work, client experience, and
            signature finishes that carry your name.
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

      {/* Tabs */}
      <nav className="flex border-b border-black text-sm uppercase tracking-wide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-3 border-r border-black last:border-r-0 transition-colors duration-300 ${
              activeTab === tab
                ? "bg-black text-white"
                : "hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 animate-underline" />
            )}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <section className="px-8 py-12 max-w-3xl mx-auto min-h-[300px] transition-all duration-500">
        <div key={activeTab} className="animate-fadeIn">
          {activeTab === "About" && (
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
                Duration: <strong>16 weeks</strong> (self-paced with mentorship)
              </p>
            </>
          )}

          {activeTab === "Outcomes" && (
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
          )}

          {activeTab === "Curriculum" && (
            <>
              <h2 className="text-2xl font-bold mb-4">Curriculum Breakdown</h2>
              <ol className="list-decimal list-inside space-y-4 leading-relaxed">
                <li>
                  <strong>Core Refresher & Evaluation (2 weeks)</strong>
                  <p>
                    Fundamentals of sanitation, tool management, scalp health,
                    clipper and razor safety, with both written and live
                    assessments.
                  </p>
                </li>
                <li>
                  <strong>Advanced Technique & Specialty (4 weeks)</strong>
                  <p>
                    Creative fades, precision detailing, shear mastery, beard
                    sculpting, hot towel artistry, and innovation labs with guest
                    stylists.
                  </p>
                </li>
                <li>
                  <strong>Brand & Client Experience (2 weeks)</strong>
                  <p>
                    Client communication, time management, retail education, and
                    storytelling to deliver the Artisan signature experience.
                  </p>
                </li>
                <li>
                  <strong>Artisan Signature Work (2 weeks)</strong>
                  <p>
                    Students perfect Artisan brand aesthetics through signature
                    cuts, beard designs, and documented portfolios.
                  </p>
                </li>
                <li>
                  <strong>Mentorship & Apprenticeship Transition (4 weeks)</strong>
                  <p>
                    Hands-on client services under mentor supervision, peer
                    evaluations, and final mystery-client assessments.
                  </p>
                </li>
                <li>
                  <strong>Ongoing Mastery (Continuous)</strong>
                  <p>
                    Graduates stay engaged through clinics, peer reviews, and
                    contributing back as mentors and educators.
                  </p>
                </li>
              </ol>
            </>
          )}

          {activeTab === "Testimonials" && (
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
          )}
        </div>
      </section>
    </main>
  );
}
