"use client";

import { useState } from "react";
import Image from "next/image";

export default function AdvancedCoursePage() {
  const tabs = ["About", "Outcomes", "Courses", "Testimonials"];
  const [activeTab, setActiveTab] = useState("About");

  return (
    <main>
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 px-8 py-12 border-b border-black">
        <div>
          <h1 className="text-4xl font-bold mb-4">Advanced Barbering</h1>
          <p className="mb-6 text-lg">
            Take your barbering craft to the next level. Explore advanced fades, 
            scissor-over-comb artistry, razor design, styling, and business 
            strategies for running your own shop.
          </p>
          <button className="bg-black text-white px-6 py-3 font-medium uppercase tracking-wide">
            Enroll Now
          </button>
        </div>
        <div className="relative w-full h-80">
          <Image
            src="/stephen-romary-5Typ4csSmY0-unsplash.jpg"
            alt="Advanced Barbering"
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
              For barbers who already know the basics, this advanced track sharpens 
              your craft. Learn advanced fading techniques, precision razor work, 
              and styling mastery — plus shop management and brand building.
            </p>
          </>
        )}
        {activeTab === "Outcomes" && (
          <>
            <h2 className="text-2xl font-bold mb-4">What You’ll Achieve</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Perfect advanced fades, tapers, and blends</li>
              <li>Master scissor-over-comb precision cutting</li>
              <li>Create razor designs and hairline detailing</li>
              <li>Deliver high-level styling for diverse hair types</li>
              <li>Develop branding, pricing, and client retention strategies</li>
            </ul>
          </>
        )}
        {activeTab === "Courses" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Course Breakdown</h2>
            <ol className="list-decimal list-inside space-y-2">
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
            <blockquote className="italic mb-4">
              “The advanced fading and razor work set me apart from other barbers in my city.”  
              <span className="block font-bold mt-2">— Luis, Miami</span>
            </blockquote>
            <blockquote className="italic mb-4">
              “I finally feel ready to open my own shop. The business module gave me clarity.”  
              <span className="block font-bold mt-2">— Dana, NYC</span>
            </blockquote>
          </>
        )}
      </section>
    </main>
  );
}
