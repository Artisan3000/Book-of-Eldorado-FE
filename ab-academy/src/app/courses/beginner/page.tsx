"use client";

import { useState } from "react";
import Image from "next/image";

export default function BeginnerCoursePage() {
  const tabs = ["About", "Outcomes", "Courses", "Testimonials"];
  const [activeTab, setActiveTab] = useState("About");

  return (
    <main>
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 px-8 py-12 border-b border-black">
        <div>
          <h1 className="text-4xl font-bold mb-4">Beginner Barbering</h1>
          <p className="mb-6 text-lg">
            Start your journey into barbering. Learn the fundamentals of cutting, 
            fading, and client service. Build confidence and master the basics.
          </p>
          <button className="bg-black text-white px-6 py-3 font-medium uppercase tracking-wide">
            Enroll Now
          </button>
        </div>
        <div className="relative w-full h-80">
          <Image
            src="/stephen-romary-5Typ4csSmY0-unsplash.jpg"
            alt="Beginner Barbering"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Tabs */}
      <nav className="flex border-b border-black text-sm uppercase tracking-wide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 border-r border-black ${
              activeTab === tab ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <section className="px-8 py-12">
        {activeTab === "About" && (
          <>
            <h2 className="text-2xl font-bold mb-4">About This Course</h2>
            <p>
              Designed for newcomers, this course introduces barbering tools,
              basic haircutting techniques, hygiene practices, and client care.
              No prior experience required.
            </p>
          </>
        )}
        {activeTab === "Outcomes" && (
          <>
            <h2 className="text-2xl font-bold mb-4">What You’ll Achieve</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Confidently use clippers, shears, and razors</li>
              <li>Master beginner-level fades and trims</li>
              <li>Understand sanitation & safety essentials</li>
              <li>Perform simple beard grooming & shaping</li>
              <li>Build a starter portfolio with practice cuts</li>
            </ul>
          </>
        )}
        {activeTab === "Courses" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Course Breakdown</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Introduction to Barbering (4 hrs)</li>
              <li>Tools & Maintenance (6 hrs)</li>
              <li>Clipper Basics (8 hrs)</li>
              <li>Foundations of Fading (10 hrs)</li>
              <li>Beard Grooming 101 (6 hrs)</li>
              <li>Sanitation & Hygiene (4 hrs)</li>
              <li>Capstone: Full Basic Haircut (12 hrs)</li>
            </ol>
          </>
        )}
        {activeTab === "Testimonials" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Student Testimonials</h2>
            <blockquote className="italic mb-4">
              “I had never picked up clippers before — this course gave me the 
              foundation I needed to start cutting confidently.”  
              <span className="block font-bold mt-2">— Alex, Chicago</span>
            </blockquote>
          </>
        )}
      </section>
    </main>
  );
}
