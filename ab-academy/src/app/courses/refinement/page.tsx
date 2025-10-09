"use client";

import { useState } from "react";
import Image from "next/image";

export default function RefinementCoursePage() {
  const tabs = ["About", "Outcomes", "Courses", "Testimonials"];
  const [activeTab, setActiveTab] = useState("About");

  return (
    <main className="font-serif text-black">
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 px-8 py-16 border-b border-black animate-fadeUp">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold leading-tight">Refinement</h1>
          <p className="text-lg leading-relaxed">
            Sharpen your eye. Strengthen your flow. Take your skills to the next
            level with advanced techniques, styling precision, and workflow
            discipline. This stage focuses on consistency, efficiency, and
            building your creative rhythm.
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
              <p className="text-lg leading-relaxed">
                For barbers who already know the basics, this advanced track
                sharpens your craft. Learn advanced fading techniques, precision
                razor work, and styling mastery — plus shop management and brand
                building.
              </p>
            </>
          )}

          {activeTab === "Outcomes" && (
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
          )}

          {activeTab === "Courses" && (
            <>
              <h2 className="text-2xl font-bold mb-4">Course Breakdown</h2>
              <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                <li>Advanced Clipper Techniques (8 hrs)</li>
                <li>Scissor-Over-Comb Mastery (10 hrs)</li>
                <li>Advanced Fades & Tapers (12 hrs)</li>
                <li>Razor Design & Detailing (8 hrs)</li>
                <li>Styling for All Hair Types (8 hrs)</li>
                <li>Portfolio Building & Photography (6 hrs)</li>
                <li>Business & Shop Management (10 hrs)</li>
                <li>Capstone: Signature Style Project (15 hrs)</li>
              </ol>
            </>
          )}

          {activeTab === "Testimonials" && (
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
          )}
        </div>
      </section>
    </main>
  );
}
