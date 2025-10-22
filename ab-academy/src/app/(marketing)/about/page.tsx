"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function AboutPage() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const [offsetY, setOffsetY] = useState(0);

  // Observe sections for fade-up
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeUp");
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Smooth parallax motion for the sticky image
  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const distanceFromTop = rect.top;
        const progress = Math.min(
          Math.max(1 - distanceFromTop / viewportHeight, 0),
          1
        );
        setOffsetY(progress * 10); // moves up to 10px smoothly
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const registerSection = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <main className="px-8 py-16 relative">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,black,transparent_70%)] pointer-events-none" />

      <header className="text-center mb-20 relative z-10">
        <h1 className="text-6xl mb-4 animate-fadeUp">
          About Barbering Academy
        </h1>
        <p className="text-lg italic text-gray-700 animate-fadeUp">
          Tradition meets modern craft.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Image Column */}
        <div
          ref={imageRef}
          className="order-1 md:order-2 opacity-0 animate-fadeUp 
               relative w-full md:w-auto flex-shrink-0
               md:sticky md:top-24 self-start"
          style={{
            transform: `translateY(${offsetY * 0.05}px)`, // gentle parallax
            transition: "transform 0.2s ease-out",
          }}
        >
          <div className="relative w-full h-[380px] md:w-[400px] md:h-[500px] overflow-hidden">
            <Image
              src="/charles-mccoy-portrait.jpg"
              alt="Charles McCoy"
              fill
              className="object-cover transition-transform duration-[4000ms] hover:scale-110"
              priority
            />
          </div>
        </div>

        {/* Text Column */}
        <div className="flex-1 max-w-3xl mx-auto space-y-24 relative z-10 order-2 md:order-1">
          {/* Story */}
          <section ref={registerSection} className="opacity-0">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-lg leading-relaxed mb-4">
              The Barbering Academy began as a small neighborhood shop with a
              big dream: to make the craft of barbering accessible to anyone
              with the passion to learn. Over the years, what started with a
              single chair and a handful of loyal clients has grown into a
              learning community that welcomes students from all walks of life.
              Our roots are in tradition, but our outlook is forward-looking —
              blending classic techniques with modern approaches that prepare
              students for real careers.
            </p>
          </section>

          {/* Teaching Philosophy */}
          <section ref={registerSection} className="opacity-0">
            <h2 className="text-2xl font-bold mb-4">Teaching Philosophy</h2>
            <p className="text-lg leading-relaxed mb-4">
              We believe barbering is more than a trade — it’s an art form, a
              service, and a calling. Our teaching philosophy centers around
              hands-on practice, mentorship, and discipline. Students aren’t
              just shown how to fade or line up hair; they are taught how to
              approach every cut with confidence, precision, and respect for the
              person in the chair. Our goal is to build not only technical skill
              but also professionalism, creativity, and pride in the work.
            </p>
          </section>

          {/* Credentials */}
          <section ref={registerSection} className="opacity-0">
            <h2 className="text-2xl font-bold mb-4">
              Credentials & Experience
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              The Academy is led by licensed barbers and educators with decades
              of combined experience behind the chair and in the classroom. Our
              instructors have worked in high-end shops, owned their own
              businesses, and trained hundreds of apprentices. They bring
              expertise not only in cutting and grooming but also in client
              service, shop management, and entrepreneurship.
            </p>

            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>Licensed Master Barber with 15+ years experience</li>
              <li>Educator in state-certified barbering programs</li>
              <li>Owner/operator of successful barbershops</li>
              <li>
                Mentor to dozens of working professionals across the industry
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
