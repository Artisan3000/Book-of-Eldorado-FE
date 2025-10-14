"use client";

import Link from "next/link";
import { Gift, Scissors, Star, Award, Users } from "lucide-react";

export default function GiftsPage() {
  return (
    <main className="px-8 py-16 overflow-hidden">
      {/* Hero / Banner */}
      <section className="relative text-center mb-20 animate-fadeUp">
        <h1 className="text-6xl font-bold mb-4">Give the Gift of Mastery</h1>
        <p className="text-lg font-light leading-relaxed max-w-2xl mx-auto mb-8 animate-fadeIn delay-150">
          Share more than a product — gift someone the tools, skills, and confidence 
          to build their craft and their business. With artisan training and mentorship, 
          it’s a gift that lasts a lifetime.
        </p>
        <Link
          href="/gifts/options"
          className="inline-block border border-black bg-black text-white px-6 py-3 text-sm font-medium transition-transform duration-300 hover:scale-105 active:scale-95 hover:bg-gray-900"
        >
          Explore Gift Options
        </Link>
      </section>

      {/* Gift Options Section */}
      <section className="mb-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <Gift className="w-8 h-8 mb-4" />,
              title: "Entrepreneur Membership Gift",
              desc: "A full year of business modules, live Q&A’s, and mentorship for any barber ready to scale.",
              price: "$399",
              sub: "1-year access as a gift",
              link: "/membership",
              label: "Give Membership",
            },
            {
              icon: <Scissors className="w-8 h-8 mb-4" />,
              title: "Beginner Course Gift",
              desc: "Full access to the intro barbering course — perfect for someone ready to begin their journey.",
              price: "$749",
              sub: "Gift access to the 8-week program",
              link: "/courses/beginner",
              label: "Give Beginner",
            },
            {
              icon: <Star className="w-8 h-8 mb-4" />,
              title: "Advanced / Finishing Gift",
              desc: "Grant advanced skills or finishing techniques — ideal for someone already practicing.",
              price: "$1249",
              sub: "Gift access to an advanced track",
              link: "/courses/advanced",
              label: "Give Advanced",
            },
          ].map((gift, i) => (
            <div
              key={gift.title}
              className={`border border-black p-8 flex flex-col opacity-0 animate-fadeUp`}
              style={{ animationDelay: `${i * 150}ms`, animationFillMode: "forwards" }}
            >
              {gift.icon}
              <h3 className="text-xl font-bold mb-2">{gift.title}</h3>
              <p className="text-sm mb-4 font-light">{gift.desc}</p>
              <p className="text-2xl font-extrabold mb-2">{gift.price}</p>
              <p className="text-sm italic mb-6">{gift.sub}</p>
              <Link
                href={gift.link}
                className="mt-auto border border-black px-4 py-2 text-sm text-center transition-transform duration-300 hover:scale-105 hover:bg-gray-100"
              >
                {gift.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* What’s Included / Benefits */}
      <section className="pb-20 border-b border-black">
        <div className="max-w-5xl mx-auto text-center animate-fadeIn">
          <h2 className="text-3xl font-bold mb-8">What’s Included in a Gift</h2>
          <div className="grid md:grid-cols-4 gap-8 text-sm">
            {[
              { icon: <Users className="w-6 h-6 mx-auto mb-2" />, text: "Lifetime access to gifted course" },
              { icon: <Scissors className="w-6 h-6 mx-auto mb-2" />, text: "Video lessons, tutorials & support" },
              { icon: <Star className="w-6 h-6 mx-auto mb-2" />, text: "Mentorship & feedback" },
              { icon: <Award className="w-6 h-6 mx-auto mb-2" />, text: "Certificates upon completion" },
            ].map((item, i) => (
              <div
                key={item.text}
                className="transform transition-all duration-300 hover:scale-105 hover:text-burgundy"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {item.icon}
                <p className="font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Redemption & FAQs */}
      <section className="mt-20 max-w-3xl mx-auto animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-center">Gift Redeeming & FAQs</h2>
        <div className="space-y-8 text-sm">
          {[
            {
              q: "How will the recipient access their gift?",
              a: "After purchase, the recipient will receive an email with instructions and a unique redemption link. They’ll use that to activate access.",
            },
            {
              q: "Is the gift transferable?",
              a: "Yes — gifting is flexible. You can send it to the recipient’s email or claim it later. Access begins once redeemed.",
            },
            {
              q: "Do I get a certificate gift copy?",
              a: "Yes. Once the recipient completes the course, they receive their certificate just like a paid student — no difference.",
            },
            {
              q: "What if they already have access?",
              a: "Our checkout flow will guide you. You can convert it to “membership credits” or choose another course as a gift.",
            },
          ].map((faq, i) => (
            <div
              key={faq.q}
              className="border-l-2 border-black pl-4 animate-fadeUp"
              style={{ animationDelay: `${i * 200}ms`, animationFillMode: "forwards" }}
            >
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-16 bg-black text-white text-center mt-20 animate-fadeUp">
        <h2 className="text-3xl font-extrabold mb-6">Give the gift of growth</h2>
        <p className="mb-8 max-w-xl mx-auto text-lg font-light">
          Whether it’s the path to entrepreneurship or a leap into mastery, a gift from
          Artisan Barber Academy opens doors that last a lifetime.
        </p>
        <Link
          href="/gifts/options"
          className="inline-block border border-white bg-white text-black px-6 py-3 text-sm font-medium transition-transform duration-300 hover:scale-105 hover:bg-gray-200"
        >
          View Gift Options
        </Link>
      </section>
    </main>
  );
}