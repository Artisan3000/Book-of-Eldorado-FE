import Link from "next/link";
import { Scissors, Star, Award, Users } from "lucide-react";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative px-8 py-24 border-b border-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-xl mb-8 font-light italic leading-relaxed">
            Learn the craft, grow your business, and join a community of barbers
            building the future of the trade. From fundamentals to advanced
            mastery, we teach barbering as an art, a skill, and a career.
          </h1>
          <p className="text-3xl font-extrabold mb-12 tracking-tight">
            Barbering as an art, a skill, and a career.
          </p>
          <Link
            href="/courses"
            className="border border-black bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-900"
          >
            Explore Courses
          </Link>
        </div>
      </section>

      {/* Entrepreneur Membership */}
      <section className="px-8 py-16 border-b border-black">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-6">
            Entrepreneur Membership
          </h2>
          <p className="text-lg mb-8 max-w-2xl font-light leading-relaxed">
            Designed for barbers who want to go beyond the chair and build a
            business. Learn how to launch, brand, and scale your own barbershop
            with monthly mentorship and a library of business-focused modules.
          </p>
          <div className="border border-black p-6">
            <p className="text-2xl font-black mb-2">$49/month or $470/year</p>
            <ul className="list-disc ml-6 space-y-2 text-sm mb-6 font-medium">
              <li>Shop setup & finances</li>
              <li>Branding & marketing strategies</li>
              <li>Team building & leadership</li>
              <li>Client retention & growth</li>
            </ul>
            <Link
              href="/membership"
              className="border border-black bg-black text-white px-4 py-2 text-sm hover:bg-gray-900"
            >
              Join Membership
            </Link>
          </div>
        </div>
      </section>

      {/* Barber Courses */}
      <section className="px-8 py-16 border-b border-black">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">The Artisan Progression</h2>
          <p className="text-lg font-light">
            A three-part journey designed to transform beginners into confident
            professionals. Each stage builds on the last — from mastering the
            fundamentals to defining your signature style behind the chair.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {/* Foundation */}
          <div className="border border-black p-6 flex flex-col">
            <h3 className="text-xl font-bold mb-2">Foundation</h3>
            <p className="text-sm mb-4 italic">
              Learn the craft. Build your confidence.
            </p>
            <p className="text-sm mb-6">
              Get grounded in the essentials of barbering — from tool handling
              and cutting techniques to understanding face shapes, fades, and
              client service.
            </p>
            <Link
              href="/courses/foundation"
              className="mt-auto border border-black px-4 py-2 text-sm hover:bg-gray-100"
            >
              Explore Foundation
            </Link>
          </div>

          {/* Refinement */}
          <div className="border border-black p-6 flex flex-col bg-gray-50 relative">
            <div className="absolute -top-3 left-6">
              <span className="bg-black text-white px-3 py-1 text-xs font-semibold uppercase">
                Most Popular
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">Refinement</h3>
            <p className="text-sm mb-4 italic">
              Sharpen your eye. Strengthen your flow.
            </p>
            <p className="text-sm mb-6">
              Take your skills to the next level with advanced techniques,
              styling precision, and workflow discipline.
            </p>
            <Link
              href="/courses/refinement"
              className="mt-auto border border-black bg-black text-white px-4 py-2 text-sm hover:bg-gray-900"
            >
              Explore Refinement
            </Link>
          </div>

          {/* Mastery */}
          <div className="border border-black p-6 flex flex-col">
            <h3 className="text-xl font-bold mb-2">Mastery</h3>
            <p className="text-sm mb-4 italic">
              Define your style. Lead with excellence.
            </p>
            <p className="text-sm mb-6">
              Develop your personal artistry and professional identity. Learn
              the nuances that separate good barbers from great ones.
            </p>
            <Link
              href="/courses/mastery"
              className="mt-auto border border-black px-4 py-2 text-sm hover:bg-gray-100"
            >
              Explore Mastery
            </Link>
          </div>
        </div>
      </section>

      {/* What’s Included */}
      <section className="px-8 py-16 border-b border-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What’s Included</h2>
          <div className="grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <Users className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">
                Access to a supportive learning community
              </p>
              <p className="text-xs italic text-gray-600">
                Connect, share, grow
              </p>
            </div>
            <div>
              <Scissors className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">
                Step-by-step video lessons & resources
              </p>
              <p className="text-xs italic text-gray-600">
                Learn at your own pace
              </p>
            </div>
            <div>
              <Star className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">Personalized feedback & mentorship</p>
              <p className="text-xs italic text-gray-600">Direct guidance</p>
            </div>
            <div>
              <Award className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">Certificates upon completion</p>
              <p className="text-xs italic text-gray-600">
                Showcase your skills
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-8 py-16 bg-black text-white text-center">
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
            className="border border-white bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-200"
          >
            Join Membership
          </Link>
          <Link
            href="/courses"
            className="border border-white px-6 py-3 text-sm font-medium hover:bg-gray-800"
          >
            View Courses
          </Link>
        </div>
      </section>
    </main>
  );
}
