"use client";

import { User, MessageSquare, CalendarDays } from "lucide-react";

const mentors = [
  {
    id: 1,
    name: "Carlos R.",
    specialty: "Fade Techniques",
    experience: "10 years in professional barbering",
  },
  {
    id: 2,
    name: "Michelle L.",
    specialty: "Branding & Client Experience",
    experience: "Former shop owner & educator",
  },
  {
    id: 3,
    name: "Andre T.",
    specialty: "Men’s Grooming & Styling",
    experience: "Editorial stylist and instructor",
  },
];

export default function Mentorship() {
  return (
    <section className="border border-black p-8">
      <h2 className="text-xl mb-4 underline">Mentorship Program</h2>
      <p className="text-sm text-gray-800 mb-8 max-w-2xl">
        Gain direct access to experienced barbers and educators. Get feedback,
        schedule sessions, and build your professional network.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="border border-black p-4 flex flex-col">
            <User className="w-5 h-5 mb-2" />
            <h3 className="text-lg font-bold">{mentor.name}</h3>
            <p className="text-sm mb-1">{mentor.specialty}</p>
            <p className="text-xs text-gray-600 mb-3">{mentor.experience}</p>
            <div className="flex gap-2 mt-auto">
              <button className="border border-black px-3 py-1 text-xs uppercase hover:bg-gray-100">
                <MessageSquare className="w-3 h-3 inline mr-1" /> Message
              </button>
              <button className="border border-black px-3 py-1 text-xs uppercase hover:bg-gray-100">
                <CalendarDays className="w-3 h-3 inline mr-1" /> Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
