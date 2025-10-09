import { Scissors, Star, Award, Check } from "lucide-react";
import Link from "next/link";

export default function CoursesOverview() {
  return (
    <main className="px-8 py-16 font-serif text-black">
      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl mb-4">The Artisan Progression</h1>
        <p className="text-lg mb-8">
          A three-part journey designed to transform beginners into confident professionals.
          Each stage builds on the last — from mastering the fundamentals to defining
          your signature style behind the chair. Whether you’re just starting out or ready
          to refine your artistry, there’s a course that meets you where you are.
        </p>
        <Link
          href="/membership"
          className="inline-block border border-black bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-900"
        >
          Join the Academy
        </Link>
      </section>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {/* Foundation */}
        <div className="border border-black p-8 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <Scissors className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Foundation</h2>
          </div>
          <p className="mb-4 text-sm">
            Learn the craft. Build your confidence. Get grounded in the essentials of
            barbering — from tool handling and cutting techniques to fades and client service.
          </p>
          <div className="text-3xl font-bold mb-2">$749</div>
          <p className="text-sm mb-6">Duration: 8 weeks (self-paced)</p>

          <ul className="space-y-3 flex-1">
            {[
              "Tool fundamentals & safety",
              "Clipper basics & classic fades",
              "Beard grooming essentials",
              "Client care & hygiene",
              "Portfolio starter guidance",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-1 text-black" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/courses/foundation"
            className="mt-8 py-3 border border-black text-sm font-medium hover:bg-gray-100 text-center"
          >
            Enroll in Foundation
          </Link>
        </div>

        {/* Refinement */}
        <div className="border border-black p-8 flex flex-col bg-gray-50 relative">
          <div className="absolute -top-3 left-6">
            <span className="bg-black text-white px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Most Popular
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <Star className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Refinement</h2>
          </div>
          <p className="mb-4 text-sm">
            Sharpen your eye. Strengthen your flow. Take your skills to the next level
            with advanced techniques, styling precision, and workflow discipline.
          </p>
          <div className="text-3xl font-bold mb-2">$1249</div>
          <p className="text-sm mb-6">Duration: 12 weeks (self-paced)</p>

          <ul className="space-y-3 flex-1">
            {[
              "Skin fades & precision blending",
              "Advanced scissor-over-comb",
              "Razor detailing & line artistry",
              "Business & branding essentials",
              "Mentorship & peer support",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-1 text-black" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/courses/refinement"
            className="mt-8 py-3 border border-black bg-black text-white text-sm font-medium hover:bg-gray-900 text-center"
          >
            Enroll in Refinement
          </Link>
        </div>

        {/* Mastery */}
        <div className="border border-black p-8 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Mastery</h2>
          </div>
          <p className="mb-4 text-sm">
            Define your style. Lead with excellence. Develop your personal artistry
            and professional identity. Learn the nuances that separate good barbers
            from great ones.
          </p>
          <div className="text-3xl font-bold mb-2">$899</div>
          <p className="text-sm mb-6">Duration: 16 weeks (self-paced)</p>

          <ul className="space-y-3 flex-1">
            {[
              "Signature detailing & creative fades",
              "Brand storytelling & client experience",
              "Mentorship & apprenticeship transition",
              "Portfolio & presentation mastery",
              "Certification as an Artisan Master Barber",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-1 text-black" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/courses/mastery"
            className="mt-8 py-3 border border-black text-sm font-medium hover:bg-gray-100 text-center"
          >
            Enroll in Mastery
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <section className="text-center bg-black text-white py-16 mb-16">
        <h2 className="text-3xl font-bold mb-4">Start Your Journey Today</h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg">
          Every great barber starts somewhere. Choose your path — whether you’re laying
          the foundation, refining your edge, or mastering your craft, Artisan Barber
          Academy will guide you every step of the way.
        </p>
        <Link
          href="/membership"
          className="inline-block border border-white bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-200"
        >
          Join the Academy
        </Link>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6 text-sm leading-relaxed">
          <div>
            <h3 className="font-bold text-lg mb-2">Do I need experience to start?</h3>
            <p>
              The <strong>Foundation</strong> course is designed for complete newcomers.
              <strong> Refinement</strong> and <strong>Mastery</strong> are ideal for
              experienced barbers looking to advance and define their signature style.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Will I receive a certification?</h3>
            <p>
              Yes. All courses include an Artisan Certificate of Completion,
              demonstrating your mastery of professional skills and standards.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">What kind of support is included?</h3>
            <p>
              Each course provides guided assignments, video tutorials, and feedback loops.
              Refinement and Mastery include mentorship sessions and community discussions.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Can I move between levels?</h3>
            <p>
              Absolutely. Start at your current level and progress at your own pace.
              You can upgrade anytime by paying only the difference between courses.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
