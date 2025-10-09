"use client"

import { useState } from "react"
import { Check } from "lucide-react"

export default function MembershipPage() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <main className="px-8 py-16 font-serif text-black">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-3">The Blueprint Membership</h1>
        <p className="italic text-lg mb-6 tracking-wide">Build what lasts.</p>
        <p className="text-lg leading-relaxed mb-8">
          A monthly membership for creative entrepreneurs, makers, and professionals
          ready to master the business side of their craft.  
          Born from the spirit of the barbershop — where skill, independence, and
          community intersect — <strong>The Blueprint Membership</strong> teaches you
          how to turn creativity into structure and passion into profit.
        </p>
      </section>

      {/* Pricing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex border border-black">
          {["Monthly", "Yearly"].map((period) => (
            <button
              key={period}
              onClick={() => setIsYearly(period === "Yearly")}
              className={`px-6 py-2 text-sm font-medium ${
                (period === "Yearly") === isYearly
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Card */}
      <section className="max-w-xl mx-auto border border-black p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">The Blueprint Membership</h2>
        <div className="text-4xl font-bold mb-2">
          ${isYearly ? "2490" : "249"}
        </div>
        <p className="text-sm mb-6">
          {isYearly ? "per year (2 months free)" : "per month"} — cancel anytime
        </p>

        <ul className="text-left space-y-3 mb-8">
          {[
            "Monthly workshops & live mentorship",
            "Business playbooks and systems templates",
            "Access to private online community",
            "Brand strategy & storytelling guidance",
            "Exclusive course and event discounts",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="w-4 h-4 mt-1 text-black" />
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>

        <button className="w-full py-3 border border-black bg-black text-white text-sm font-medium hover:bg-gray-900">
          Join The Blueprint
        </button>
      </section>

      {/* Core Pillars */}
      <section className="max-w-5xl mx-auto mt-24 text-center">
        <h2 className="text-3xl font-bold mb-12">The Three Pillars</h2>

        <div className="grid md:grid-cols-3 gap-12 text-left">
          <div className="border border-black p-6">
            <h3 className="text-xl font-bold mb-2">Structure</h3>
            <p className="text-sm">
              Systems, pricing, and workflows that give your business both stability
              and freedom. Learn how to set boundaries, scale sustainably, and
              operate like a pro.
            </p>
          </div>

          <div className="border border-black p-6 bg-gray-50">
            <h3 className="text-xl font-bold mb-2">Brand</h3>
            <p className="text-sm">
              Define your voice, tell your story, and build trust across every
              touchpoint. Develop a brand identity that resonates with clients
              and lasts for years.
            </p>
          </div>

          <div className="border border-black p-6">
            <h3 className="text-xl font-bold mb-2">Growth</h3>
            <p className="text-sm">
              Leadership, client experience, and long-term strategy that turn
              momentum into legacy. Learn how to grow without burning out.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 text-center bg-black text-white py-16">
        <h2 className="text-3xl font-bold mb-6">
          Build What Lasts.
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg">
          Whether you’re behind the chair, behind a brand, or behind a vision — The
          Blueprint gives you the foundation, structure, and support to grow with
          purpose.
        </p>
        <button className="border border-white bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-200">
          Join The Blueprint
        </button>
      </section>

      {/* FAQ */}
      <section className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Membership FAQs</h2>
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-bold mb-2">Who is The Blueprint for?</h3>
            <p>
              The membership is built for barbers, artists, makers, and independent
              professionals who want to master business skills — structure, strategy,
              and brand storytelling — without losing their creative edge.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Do I get access to barbering courses?</h3>
            <p>
              The Blueprint is a separate membership focused on entrepreneurship,
              branding, and systems. However, members receive exclusive discounts
              on all Artisan Academy courses.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Can I cancel anytime?</h3>
            <p>
              Yes. You can pause or cancel your membership anytime — no hidden fees,
              no penalties. You’ll keep access until the end of your billing cycle.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
