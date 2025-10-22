"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

export default function MembershipPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(249); // start at monthly price

  // Animate the number when switching between monthly and yearly
  useEffect(() => {
    const start = displayPrice;
    const end = isYearly ? 2490 : 249;
    const duration = 400;
    const startTime = performance.now();
  
    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = Math.floor(start + (end - start) * progress);
      setDisplayPrice(value);
      if (progress < 1) requestAnimationFrame(step);
    };
  
    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYearly]);
  

  return (
    <main className="px-8 py-16 font-serif text-black overflow-hidden">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-16 animate-fadeUp">
        <h1 className="text-6xl font-bold mb-3">The Blueprint Membership</h1>
        <p className="italic text-lg mb-6 text-gray-700">Build what lasts.</p>
        <p className="text-lg leading-relaxed mb-8 animate-fadeIn delay-150">
          A monthly membership for creative entrepreneurs, makers, and
          professionals ready to master the business side of their craft. Born
          from the spirit of the barbershop — where skill, independence, and
          community intersect — <strong>The Blueprint Membership</strong>{" "}
          teaches you how to turn creativity into structure and passion into
          profit.
        </p>
      </section>

      {/* Pricing Toggle */}
      <div className="flex justify-center mb-12 animate-fadeIn">
        <div className="relative inline-flex border border-black overflow-hidden">
          {/* Sliding highlight bar */}
          <span
            className={`absolute top-0 bottom-0 w-1/2 bg-black transition-transform duration-300 ease-out ${
              isYearly ? "translate-x-full" : "translate-x-0"
            }`}
          />
          {["Monthly", "Yearly"].map((period) => {
            const active = (period === "Yearly") === isYearly;
            return (
              <button
                key={period}
                onClick={() => setIsYearly(period === "Yearly")}
                className={`relative z-10 w-24 py-2 text-sm font-medium transition-colors duration-300 ${
                  active ? "text-white" : "text-black hover:bg-gray-100"
                }`}
              >
                {period}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing Card */}
      <section className="max-w-xl mx-auto border border-black p-8 text-center animate-fadeUp">
        <h2 className="text-2xl mb-4 font-bold">The Blueprint Membership</h2>
        <div className="text-4xl font-extrabold mb-2 tracking-tight transition-all duration-300">
          ${displayPrice.toLocaleString()}
        </div>
        <p className="text-sm mb-6 text-gray-700">
          {isYearly ? "per year (2 months free)" : "per month"} — cancel anytime
        </p>

        <ul className="text-left space-y-3 mb-8">
          {[
            "Monthly workshops & live mentorship",
            "Business playbooks and systems templates",
            "Access to private online community",
            "Brand strategy & storytelling guidance",
            "Exclusive course and event discounts",
          ].map((item, i) => (
            <li
              key={item}
              className="flex items-start gap-2 opacity-0 animate-fadeUp"
              style={{
                animationDelay: `${i * 150}ms`,
                animationFillMode: "forwards",
              }}
            >
              <Check className="w-4 h-4 mt-1 text-black" />
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>

        <button className="w-full py-3 border border-black bg-black text-white text-sm font-medium transition-transform duration-300 hover:scale-105 hover:bg-gray-900">
          Join The Blueprint
        </button>
      </section>

      {/* Core Pillars */}
      <section className="max-w-5xl mx-auto mt-24 text-center animate-fadeIn">
        <h2 className="text-3xl mb-12 font-bold">The Three Pillars</h2>

        <div className="grid md:grid-cols-3 gap-12 text-left">
          {[
            {
              title: "Structure",
              desc: "Systems, pricing, and workflows that give your business both stability and freedom. Learn how to set boundaries, scale sustainably, and operate like a pro.",
            },
            {
              title: "Brand",
              desc: "Define your voice, tell your story, and build trust across every touchpoint. Develop a brand identity that resonates with clients and lasts for years.",
              bg: "bg-gray-50",
            },
            {
              title: "Growth",
              desc: "Leadership, client experience, and long-term strategy that turn momentum into legacy. Learn how to grow without burning out.",
            },
          ].map((pillar, i) => (
            <div
              key={pillar.title}
              className={`border border-black p-6 transform transition-all duration-300 hover:scale-[1.02] ${
                pillar.bg || ""
              }`}
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <h3 className="text-xl font-bold mb-2">{pillar.title}</h3>
              <p className="text-sm leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 text-center bg-black text-white py-16 animate-fadeUp">
        <h2 className="text-3xl mb-6 font-extrabold uppercase">
          Build What Lasts.
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg font-light leading-relaxed">
          Whether you’re behind the chair, behind a brand, or behind a vision —
          The Blueprint gives you the foundation, structure, and support to grow
          with purpose.
        </p>
        <button className="border border-white bg-white text-black px-6 py-3 text-sm font-medium transition-transform duration-300 hover:scale-105 hover:bg-gray-200">
          Join The Blueprint
        </button>
      </section>

      {/* FAQ */}
      <section className="mt-20 max-w-3xl mx-auto animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-center">Membership FAQs</h2>
        <div className="space-y-6 text-sm">
          {[
            {
              q: "Who is The Blueprint for?",
              a: "The membership is built for barbers, artists, makers, and independent professionals who want to master business skills — structure, strategy, and brand storytelling — without losing their creative edge.",
            },
            {
              q: "Do I get access to barbering courses?",
              a: "The Blueprint is a separate membership focused on entrepreneurship, branding, and systems. However, members receive exclusive discounts on all Artisan Academy courses.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. You can pause or cancel your membership anytime — no hidden fees, no penalties. You’ll keep access until the end of your billing cycle.",
            },
          ].map((faq, i) => (
            <div
              key={faq.q}
              className="border-l-2 border-black pl-4 animate-fadeUp"
              style={{
                animationDelay: `${i * 200}ms`,
                animationFillMode: "forwards",
              }}
            >
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
