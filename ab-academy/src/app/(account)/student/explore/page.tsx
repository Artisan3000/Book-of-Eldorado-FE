"use client";

import { useState } from "react";
import { Sparkles, Star, Bookmark, CalendarDays, Flame } from "lucide-react";

export default function StudentExplore() {
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const offerings = [
    {
      id: 1,
      title: "Blueprint Membership",
      description:
        "Exclusive mentorship, live Q&As, and priority workshop invites.",
      price: "$120/year",
    },
    {
      id: 2,
      title: "Mastery Program",
      description:
        "Take your craft to the next level with advanced barbering techniques.",
      price: "$85",
    },
  ];

  const recommendations = [
    {
      id: 3,
      title: "Color Grading with DaVinci Resolve",
      description:
        "Because you liked Mastering Lighting — explore professional-grade post-production techniques.",
      price: "$65",
    },
    {
      id: 4,
      title: "Client Psychology & Consultation Skills",
      description:
        "Deepen your understanding of communication and client experience for luxury service.",
      price: "$45",
    },
  ];

  const upcoming = [
    {
      id: 5,
      title: "Workshop: Texture & Technique Live",
      date: "November 12, 2025",
      location: "Brooklyn Studio",
    },
    {
      id: 6,
      title: "Live Q&A: Building Your Barber Portfolio",
      date: "November 28, 2025",
      location: "Virtual Session",
    },
  ];

  return (
    <section className="px-8 md:px-16 py-12 animate-fadeIn">
      {/* --- Header --- */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl flex items-center gap-2 mb-2 md:mb-0">
          Explore New Opportunities <Sparkles className="w-6 h-6 text-yellow-400" />
        </h2>
        <p className="italic text-gray-600 text-sm">
          Keep your momentum going — new paths open every week.
        </p>
      </div>

      {/* --- Featured Offerings --- */}
      <h3 className="text-xl mb-4 underline">Featured Programs</h3>
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {offerings.map((offer) => (
          <div
            key={offer.id}
            className="border border-black p-6 flex flex-col justify-between bg-white hover:bg-gray-50 hover:scale-[1.02] transition-transform"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{offer.title}</h3>
              <button onClick={() => toggleBookmark(offer.id)}>
                {bookmarked.includes(offer.id) ? (
                  <Bookmark className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ) : (
                  <Bookmark className="w-4 h-4 text-gray-400 hover:text-black" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-3">{offer.description}</p>
            <p className="text-sm font-semibold mb-4">{offer.price}</p>
            <button className="border border-black px-3 py-1 text-sm hover:bg-black hover:text-white transition">
              Learn More
            </button>
          </div>
        ))}
      </div>

      {/* --- Personalized Recommendations --- */}
      <h3 className="text-xl mb-4 underline">Recommended for You</h3>
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="border border-black p-6 flex flex-col justify-between hover:scale-[1.02] bg-white hover:bg-gray-50 transition-transform"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{rec.title}</h3>
              <button onClick={() => toggleBookmark(rec.id)}>
                {bookmarked.includes(rec.id) ? (
                  <Bookmark className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ) : (
                  <Bookmark className="w-4 h-4 text-gray-400 hover:text-black" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
            <p className="text-sm font-semibold mb-4">{rec.price}</p>
            <button className="border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* --- Upcoming Events --- */}
      <h3 className="text-xl mb-4 underline">Upcoming Events</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {upcoming.map((event) => (
          <div
            key={event.id}
            className="border border-black p-6 bg-white hover:bg-gray-50 flex flex-col justify-between transition-transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                {event.title}
              </h4>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Date:</strong> {event.date}
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Location:</strong> {event.location}
            </p>
            <button className="border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
              RSVP or Add to Calendar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
