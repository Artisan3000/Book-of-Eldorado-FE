"use client";

import { useState } from "react";
import Image from "next/image";

export default function RefinementCoursePage() {
  const tabs = ["About", "Outcomes", "Courses", "Testimonials"];
  const [activeTab, setActiveTab] = useState("About");

  return (
    <main>
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 px-8 py-16 border-b border-black animate-fadeUp">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold leading-tight">Refinement</h1>
          <p className="text-lg leading-relaxed">
            Sharpen your eye. Strengthen your flow. Take your skills to the next
            level with advanced techniques, styling precision, and workflow
            discipline. This stage focuses on consistency, efficiency, and
            building your creative rhythm behind the chair.
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
                Designed for barbers ready to refine their craft, this course
                dives deeper into advanced cutting methods, precision styling,
                and professional workflow systems. You’ll learn how to deliver
                polished results efficiently while developing your personal
                rhythm behind the chair.
              </p>
            </>
          )}
          {activeTab === "Outcomes" && (
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
          )}
          {activeTab === "Courses" && (
            <>
              <h2 className="text-2xl font-bold mb-4">Course Breakdown</h2>
              <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                <li>Advanced Fading Techniques (8 hrs)</li>
                <li>Precision Scissor Work (10 hrs)</li>
                <li>Razor Design & Line Artistry (6 hrs)</li>
                <li>Workflow Efficiency & Shop Systems (8 hrs)</li>
                <li>Client Communication & Retention (6 hrs)</li>
                <li>Business & Branding Essentials (4 hrs)</li>
                <li>Capstone: Full Client Transformation (10 hrs)</li>
              </ol>
            </>
          )}
          {activeTab === "Testimonials" && (
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
          )}
        </div>
      </section>
    </main>
  );
}
