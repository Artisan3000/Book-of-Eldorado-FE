"use client";

import { useEffect, useRef } from "react";
import { Scissors, Star, Award, Check } from "lucide-react";
import Link from "next/link";

export default function CoursesOverview() {
  const sectionRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-fadeUp");
        });
      },
      { threshold: 0.15 }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const registerSection = (el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  };

  return (
    <main className="px-8 py-16 font-serif text-black overflow-hidden">
      {/* Hero */}
      <section
        ref={registerSection}
        className="max-w-4xl mx-auto text-center mb-16 opacity-0"
      >
        <h1 className="text-6xl font-bold mb-4">The Artisan Progression</h1>
        <p className="text-lg mb-8 leading-relaxed">
          A three-part journey designed to transform beginners into confident professionals.
          Each stage builds on the last — from mastering the fundamentals to defining your
          signature style behind the chair. Whether you’re just starting out or ready to refine
          your artistry, there’s a course that meets you where you are.
        </p>
        <Link
          href="/membership"
          className="inline-block border border-black bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-900 transition-transform duration-300 hover:scale-105"
        >
          Join the Academy
        </Link>
      </section>

      {/* Course Comparison Grid */}
      <div
        ref={registerSection}
        className="grid md:grid-cols-3 gap-8 mb-16 opacity-0"
      >
        {/* Foundation */}
        <CourseCard
          title="Foundation"
          icon={<Scissors className="w-6 h-6" />}
          description="Learn the craft. Build your confidence. Get grounded in the essentials of barbering — from tool handling and cutting techniques to fades and client service."
          price="$749"
          duration="8 weeks (self-paced)"
          link="/courses/foundation"
          features={[
            "Tool fundamentals & safety",
            "Clipper basics & classic fades",
            "Beard grooming essentials",
            "Client care & hygiene",
            "Portfolio starter guidance",
          ]}
        />

        {/* Refinement */}
        <CourseCard
          title="Refinement"
          icon={<Star className="w-6 h-6" />}
          badge="Most Popular"
          description="Sharpen your eye. Strengthen your flow. Take your skills to the next level with advanced techniques, styling precision, and workflow discipline."
          price="$1249"
          duration="12 weeks (self-paced)"
          link="/courses/refinement"
          dark
          features={[
            "Skin fades & precision blending",
            "Advanced scissor-over-comb",
            "Razor detailing & line artistry",
            "Business & branding essentials",
            "Mentorship & peer support",
          ]}
        />

        {/* Mastery */}
        <CourseCard
          title="Mastery"
          icon={<Award className="w-6 h-6" />}
          description="Define your style. Lead with excellence. Develop your personal artistry and professional identity. Learn the nuances that separate good barbers from great ones."
          price="$899"
          duration="16 weeks (self-paced)"
          link="/courses/mastery"
          features={[
            "Signature detailing & creative fades",
            "Brand storytelling & client experience",
            "Mentorship & apprenticeship transition",
            "Portfolio & presentation mastery",
            "Certification as an Artisan Master Barber",
          ]}
        />
      </div>

      {/* CTA Section */}
      <section
        ref={registerSection}
        className="text-center bg-black text-white py-16 mb-16 opacity-0"
      >
        <h2 className="text-3xl font-bold mb-4 animate-fadeUp">Start Your Journey Today</h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg font-light leading-relaxed">
          Every great barber starts somewhere. Choose your path — whether you’re laying the foundation,
          refining your edge, or mastering your craft, Artisan Barber Academy will guide you every step of the way.
        </p>
        <Link
          href="/membership"
          className="inline-block border border-white bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-200 transition-transform duration-300 hover:scale-105"
        >
          Join the Academy
        </Link>
      </section>

      {/* FAQ */}
      <section
        ref={registerSection}
        className="max-w-3xl mx-auto opacity-0"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6 text-sm leading-relaxed">
          <FaqItem
            question="Do I need experience to start?"
            answer="The Foundation course is designed for complete newcomers. Refinement and Mastery are ideal for experienced barbers looking to advance and define their signature style."
          />
          <FaqItem
            question="Will I receive a certification?"
            answer="Yes. All courses include an Artisan Certificate of Completion, demonstrating your mastery of professional skills and standards."
          />
          <FaqItem
            question="What kind of support is included?"
            answer="Each course provides guided assignments, video tutorials, and feedback loops. Refinement and Mastery include mentorship sessions and community discussions."
          />
          <FaqItem
            question="Can I move between levels?"
            answer="Absolutely. Start at your current level and progress at your own pace. You can upgrade anytime by paying only the difference between courses."
          />
        </div>
      </section>
    </main>
  );
}

/* ====================
   Subcomponents
==================== */

function CourseCard({
  title,
  description,
  price,
  duration,
  link,
  features,
  icon,
  badge,
  dark,
}: {
  title: string;
  description: string;
  price: string;
  duration: string;
  link: string;
  features: string[];
  icon: React.ReactNode;
  badge?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`border border-black p-8 flex flex-col relative transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 ${
        dark ? "bg-gray-50" : ""
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-6">
          <span className="bg-black text-white px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            {badge}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        {icon}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <p className="mb-4 text-sm">{description}</p>
      <div className="text-3xl font-bold mb-2">{price}</div>
      <p className="text-sm mb-6">{duration}</p>

      <ul className="space-y-3 flex-1">
        {features.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-1 text-black" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>

      <Link
        href={link}
        className={`mt-8 py-3 border border-black text-sm font-medium text-center transition-colors duration-300 ${
          dark
            ? "bg-black text-white hover:bg-gray-900"
            : "hover:bg-gray-100 text-black"
        }`}
      >
        Enroll in {title}
      </Link>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="group transition-all duration-300">
      <h3 className="font-bold text-lg mb-2 group-hover:text-gray-600 transition-colors">
        {question}
      </h3>
      <p className="text-sm text-gray-800">{answer}</p>
    </div>
  );
}
