import { Scissors, Star, Award, Check } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "@/app/components/Reveal";
import {
  formatCoursePrice,
  getPublishedCourses,
  type PublishedCourse,
} from "@/lib/data/courses";

type CoursePresentation = {
  icon: ReactNode;
  features: string[];
  badge?: string;
  dark?: boolean;
};

const coursePresentation: Record<string, CoursePresentation> = {
  foundation: {
    icon: <Scissors className="w-6 h-6" />,
    features: [
      "Client communication foundations",
      "Consultation habits & retention",
      "Brand positioning basics",
      "Service menu & client experience",
      "Workbook reflections and action plans",
    ],
  },
  refinement: {
    icon: <Star className="w-6 h-6" />,
    badge: "Most Popular",
    dark: true,
    features: [
      "Skin fades & precision blending",
      "Advanced scissor-over-comb",
      "Razor detailing & line artistry",
      "Professional workflow systems",
      "Mentorship & peer support",
    ],
  },
  mastery: {
    icon: <Award className="w-6 h-6" />,
    features: [
      "Signature detailing & creative fades",
      "Brand storytelling & client experience",
      "Mentorship & apprenticeship transition",
      "Portfolio & presentation mastery",
      "Certification as an Artisan Master Barber",
    ],
  },
};

export const dynamic = "force-dynamic";

export default async function CoursesOverview() {
  const courses = await getPublishedCourses();

  return (
    <main className="px-8 py-16 font-serif text-black overflow-hidden">
      {/* Hero */}
      <Reveal className="max-w-4xl mx-auto text-center mb-16 opacity-0">
        <h1 className="text-6xl font-bold mb-4">Foundation</h1>
        <p className="text-lg mb-8 leading-relaxed">
          Start with the habits that support a sustainable barbering career:
          client communication, retention, business awareness, brand judgment,
          and professional shop standards.
        </p>
        <Link
          href="/membership"
          className="inline-block border border-black bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-900 transition-transform duration-300 hover:scale-105"
        >
          Join the Academy
        </Link>
      </Reveal>

      {/* Course Comparison Grid */}
      <Reveal className="grid md:grid-cols-3 gap-8 mb-16 opacity-0">
        {courses.map((course) => {
          const presentation = coursePresentation[course.slug] || {
            icon: <Scissors className="w-6 h-6" />,
            features: [],
          };

          return (
            <CourseCard
              key={course.id}
              course={course}
              icon={presentation.icon}
              badge={presentation.badge}
              dark={presentation.dark}
              features={presentation.features}
            />
          );
        })}
      </Reveal>

      {/* CTA Section */}
      <Reveal className="text-center bg-black text-white py-16 mb-16 opacity-0">
        <h2 className="text-3xl font-bold mb-4 animate-fadeUp">Start With Foundation</h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg font-light leading-relaxed">
          Every great barber starts somewhere. Foundation is the first course in
          the academy, built around the real-world habits students need before
          advanced programs are introduced.
        </p>
        <Link
          href="/membership"
          className="inline-block border border-white bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-200 transition-transform duration-300 hover:scale-105"
        >
          Join the Academy
        </Link>
      </Reveal>

      {/* FAQ */}
      <Reveal className="max-w-3xl mx-auto opacity-0">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6 text-sm leading-relaxed">
          <FaqItem
            question="Do I need experience to start?"
            answer="No. Foundation is designed for complete newcomers and early-career barbers who want stronger professional habits."
          />
          <FaqItem
            question="Will I receive a certification?"
            answer="Yes. All courses include an Artisan Certificate of Completion, demonstrating your mastery of professional skills and standards."
          />
          <FaqItem
            question="What kind of support is included?"
            answer="Foundation includes guided lessons and assignments. More support options will be added as the academy expands."
          />
          <FaqItem
            question="Can I move between levels?"
            answer="Foundation is the only active course right now. Additional course paths will appear once they are ready."
          />
        </div>
      </Reveal>
    </main>
  );
}

/* ====================
   Subcomponents
==================== */

function CourseCard({
  course,
  features,
  icon,
  badge,
  dark,
}: {
  course: PublishedCourse;
  features: string[];
  icon: ReactNode;
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
        <h2 className="text-2xl font-bold">{course.title}</h2>
      </div>
      <p className="mb-4 text-sm">{course.description}</p>
      <div className="text-3xl font-bold mb-2">
        {formatCoursePrice(course.priceCents)}
      </div>
      <p className="text-sm mb-6">{course.duration}</p>

      <ul className="space-y-3 flex-1">
        {features.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-1 text-black" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/courses/${course.slug}`}
        className={`mt-8 py-3 border border-black text-sm font-medium text-center transition-colors duration-300 ${
          dark
            ? "bg-black text-white hover:bg-gray-900"
            : "hover:bg-gray-100 text-black"
        }`}
      >
        Enroll in {course.title}
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
