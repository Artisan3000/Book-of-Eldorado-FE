"use client";
import Link from "next/link";
import { Scissors, Star, Award, Users } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Home() {
  // Simple intersection observer to trigger scroll reveals
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeUp");
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const registerSection = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative px-8 py-24 border-b border-black text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl mb-8 font-light italic leading-relaxed animate-fadeUp">
            Learn the craft, grow your business, and join a community of barbers
            building the future of the trade.
          </h1>
          <p className="text-3xl font-extrabold mb-12 tracking-tight animate-float">
            Barbering as an art, a skill, and a career. Hell yeah.
          </p>
          <Link
            href="/courses"
            className="border border-black bg-black text-white px-6 py-3 text-sm font-medium hover:scale-105 transition-transform duration-300"
          >
            Explore Courses
          </Link>
        </div>
      </section>

      {/* Entrepreneur Membership */}
      <section
        ref={registerSection}
        className="px-8 py-16 border-b border-black opacity-0"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-6">Entrepreneur Membership</h2>
          <p className="text-lg mb-8 max-w-2xl font-light leading-relaxed">
            Designed for barbers who want to go beyond the chair and build a
            business. Learn how to launch, brand, and scale your own barbershop
            with monthly mentorship and a library of business-focused modules.
          </p>
          <div className="border border-black p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <p className="text-2xl font-black mb-2">$49/month or $470/year</p>
            <ul className="list-disc ml-6 space-y-2 text-sm mb-6 font-medium">
              <li>Shop setup & finances</li>
              <li>Branding & marketing strategies</li>
              <li>Team building & leadership</li>
              <li>Client retention & growth</li>
            </ul>
            <Link
              href="/membership"
              className="border border-black bg-black text-white px-4 py-2 text-sm hover:bg-gray-900 hover:scale-105 transition-all duration-300"
            >
              Join Membership
            </Link>
          </div>
        </div>
      </section>

      {/* Barber Courses */}
      <section
        ref={registerSection}
        className="px-8 py-16 border-b border-black opacity-0"
      >
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">The Artisan Progression</h2>
          <p className="text-lg font-light">
            A three-part journey designed to transform beginners into confident
            professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "Foundation",
              subtitle: "Learn the craft. Build your confidence.",
              desc: "Get grounded in the essentials of barbering — from tool handling and cutting techniques to understanding face shapes, fades, and client service.",
              link: "/courses/foundation",
              highlight: false,
            },
            {
              title: "Refinement",
              subtitle: "Sharpen your eye. Strengthen your flow.",
              desc: "Take your skills to the next level with advanced techniques, styling precision, and workflow discipline.",
              link: "/courses/refinement",
              highlight: true,
            },
            {
              title: "Mastery",
              subtitle: "Define your style. Lead with excellence.",
              desc: "Develop your personal artistry and professional identity. Learn the nuances that separate good barbers from great ones.",
              link: "/courses/mastery",
              highlight: false,
            },
          ].map((course, i) => (
            <div
              key={course.title}
              style={{ animationDelay: `${i * 0.1}s` }}
              className={`border border-black p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg opacity-0`}
              ref={registerSection}
            >
              {course.highlight && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-black text-white px-3 py-1 text-xs font-semibold uppercase">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-sm mb-4 italic">{course.subtitle}</p>
              <p className="text-sm mb-6">{course.desc}</p>
              <Link
                href={course.link}
                className={`mt-auto border border-black px-4 py-2 text-sm transition-transform duration-300 hover:scale-105 ${
                  course.highlight
                    ? "bg-black text-white hover:bg-gray-900"
                    : "hover:bg-gray-100"
                }`}
              >
                Explore {course.title}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* What’s Included */}
      <section
        ref={registerSection}
        className="px-8 py-16 border-b border-black opacity-0"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What’s Included</h2>
          <div className="grid md:grid-cols-4 gap-8 text-sm">
            {[Users, Scissors, Star, Award].map((Icon, i) => (
              <div key={i} className="group">
                <Icon className="w-6 h-6 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" />
                <p className="font-medium animate-pulseGlow">
                  {[
                    "Access to a supportive learning community",
                    "Step-by-step video lessons & resources",
                    "Personalized feedback & mentorship",
                    "Certificates upon completion",
                  ][i]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-8 py-16 bg-black text-white text-center animate-fadeUp">
        <h2 className="text-3xl font-extrabold mb-6 uppercase">
          Join the Academy Today
        </h2>
        <p className="mb-8 max-w-xl mx-auto text-lg font-light leading-relaxed">
          Whether you’re just starting out, ready to refine your craft, or
          building a barbershop business, Artisan Barber Academy has a course
          for you.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/membership"
            className="border border-white bg-white text-black px-6 py-3 text-sm font-medium hover:scale-105 transition-transform duration-300"
          >
            Join Membership
          </Link>
          <Link
            href="/courses"
            className="border border-white px-6 py-3 text-sm font-medium hover:bg-gray-800 hover:scale-105 transition-transform duration-300"
          >
            View Courses
          </Link>
        </div>
      </section>
    </main>
  );
}
