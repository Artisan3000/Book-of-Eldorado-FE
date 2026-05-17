"use client";

import {
  Award,
  Trophy,
  Share2,
  Target,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default function StudentAchievements() {
  const milestones = [
    {
      id: 1,
      title: "Foundation",
      description: "Completed all beginner modules and first assessment.",
      status: "completed",
      date: "Aug 2025",
    },
    {
      id: 2,
      title: "Refinement",
      description: "Currently working on advanced haircutting techniques.",
      status: "in-progress",
      date: "Due Oct 30, 2025",
    },
    {
      id: 3,
      title: "Mastery",
      description: "Final stage: mentorship project & live demo.",
      status: "upcoming",
      date: "Starts Nov 2025",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "Foundation Certificate",
      date: "Aug 2025",
      badge: "🎓",
      shareLink: "#",
    },
    {
      id: 2,
      title: "Refinement Certificate",
      date: "Sep 2025",
      badge: "🏆",
      shareLink: "#",
    },
  ];

  return (
    <section className="px-8 md:px-16 py-12 animate-fadeIn">
      {/* --- Header --- */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-semibold flex items-center gap-2 mb-2 md:mb-0">
          Achievements & Learning Path{" "}
          <Award className="w-6 h-6 text-yellow-500" />
        </h2>
        <p className="italic text-gray-600 text-sm">
          Track your milestones and celebrate your progress.
        </p>
      </div>

      {/* --- Learning Path --- */}
      <h3 className="text-xl mb-4 underline">Learning Path</h3>
      <div className="relative border-l border-black pl-8 mb-16">
        {milestones.map((m, idx) => (
          <div
            key={m.id}
            className="mb-10 relative before:absolute before:w-4 before:h-4 before:rounded-full before:-left-[2.5rem] before:top-4 before:border before:border-black before:bg-white z-999"
          >
            <div
              className={`p-6 border border-black bg-white ${
                m.status === "completed"
                  ? "opacity-100"
                  : m.status === "in-progress"
                  ? "opacity-90"
                  : "opacity-60"
              } hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold flex items-center gap-2">
                  {m.status === "completed" && (
                    <Trophy className="w-4 h-4 text-yellow-500" />
                  )}
                  {m.status === "in-progress" && (
                    <BookOpen className="w-4 h-4 text-blue-500" />
                  )}
                  {m.status === "upcoming" && (
                    <Target className="w-4 h-4 text-gray-400" />
                  )}
                  {m.title}
                </h4>
                <span className="text-xs text-gray-600">{m.date}</span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{m.description}</p>
              <div className="flex gap-2">
                {m.status === "in-progress" && (
                  <>
                    <Link
                      href="/student/courses/refinement"
                      className="border border-black px-3 py-1 text-xs hover:bg-gray-100 transition"
                    >
                      Continue Course
                    </Link>
                    <button className="border border-black px-3 py-1 text-xs hover:bg-gray-100 transition">
                      View Discussions
                    </button>
                    <button className="border border-black px-3 py-1 text-xs hover:bg-gray-100 transition">
                      Take Quiz
                    </button>
                  </>
                )}
                {m.status === "upcoming" && (
                  <button className="border border-black px-3 py-1 text-xs hover:bg-gray-100 transition">
                    Preview Content
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Achievements Section --- */}
      <h3 className="text-xl mb-4 underline">Your Certificates</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {achievements.map((a) => (
          <div
            key={a.id}
            className="border border-black p-6 bg-white flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform"
          >
            <div className="text-4xl mb-3">{a.badge}</div>
            <h3 className="font-semibold mb-1">{a.title}</h3>
            <p className="text-sm text-gray-700 mb-4">Completed {a.date}</p>
            <div className="flex gap-3">
              <button className="border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
                View Certificate
              </button>
              <button className="flex items-center gap-1 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Optional Portfolio / Motivation Block --- */}
      <div className="border border-dashed border-gray-400 p-8 text-center text-gray-500 italic mt-16">
        [Keep up the momentum — unlock new badges and share your journey with
        the community.]
      </div>
    </section>
  );
}
