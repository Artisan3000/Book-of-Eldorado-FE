"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";
import {
  BookOpen,
  Heart,
  Settings,
  Award,
  PlayCircle,
} from "lucide-react";

import CourseList from "./components/CourseList";
import ProgressTracker from "./components/ProgressTracker";
import Certificates from "./components/Certificates";
import MediaLibrary from "./components/MediaLibrary";
import Mentorship from "./components/Mentorship";

export default function StudentDashboard() {
  const tabs = [
    "Overview",
    "My Courses",
    "Wishlist",
    "Certificates",
    "Settings",
  ];
  const [activeTab, setActiveTab] = useState("Overview");

  // --- Mock Data (replace with Laravel API responses later) ---
  const courses = [
    { id: 1, title: "Foundation", progress: 0.75, status: "Active" },
    { id: 2, title: "Refinement", progress: 0.4, status: "In Progress" },
    { id: 3, title: "Mastery", progress: 0.1, status: "Enrolled" },
  ];

  const wishlist = [
    { id: 4, title: "Luxury Service 101", price: "$60" },
    { id: 5, title: "Texture & Technique", price: "$75" },
  ];

  const certificates = [
    { id: 1, title: "Foundation", date: "Aug 2025" },
    { id: 2, title: "Refinement", date: "Sep 2025" },
  ];

  const profile = {
    name: "Brian Felix",
    email: "brian@student.artisanbarber.com",
    plan: "Pro Student",
    renewal: "Nov 15, 2025",
  };

  // --- Render ---
  return (
    <DashboardLayout
      title="Student Dashboard"
      subtitle="Track your learning journey and manage your courses"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* --- Overview --- */}
      {activeTab === "Overview" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl italic mb-6 flex items-center gap-2">
            Overview
          </h2>

          <p className="italic text-gray-600 mb-10">
            Welcome back — let’s keep your momentum going.
          </p>

          <div className="border border-dashed border-gray-400 p-10 text-center text-gray-500 italic my-6">
            [Upcoming Live Sessions or Recommendations Placeholder]
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border border-black p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
              >
                <div>
                  <h3 className="font-semibold mb-2">{course.title}</h3>
                  <div className="h-2 bg-gray-200 mb-2">
                    <div
                      className="h-2 bg-black"
                      style={{ width: `${course.progress * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    Progress: {Math.round(course.progress * 100)}%
                  </p>
                </div>
                <button className="flex items-center gap-1 mt-4 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
                  <PlayCircle className="w-4 h-4" /> Continue
                </button>
              </div>
            ))}
          </div>
          <div className="mb-16">
            <h3 className="text-xl mb-4 underline">Progress Tracking</h3>
            <ProgressTracker />
          </div>

          <div className="mb-16">
            <h3 className="text-xl mb-4 underline">Your Courses</h3>
            <CourseList />
          </div>

          <div className="mb-16">
            <MediaLibrary />
          </div>

          <div className="mb-16">
            <Mentorship />
          </div>

          <div>
            <h3 className="text-xl mb-4 underline">Certificates</h3>
            <Certificates />
          </div>

        </section>
      )}

      {/* --- My Courses --- */}
      {activeTab === "My Courses" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> My Courses
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border border-black p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
              >
                <div>
                  <h3 className="font-semibold mb-2">{course.title}</h3>
                  <div className="h-2 bg-gray-200 mb-2">
                    <div
                      className="h-2 bg-black"
                      style={{ width: `${course.progress * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    {Math.round(course.progress * 100)}% complete
                  </p>
                </div>
                <button className="flex items-center gap-1 mt-4 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
                  <PlayCircle className="w-4 h-4" /> Resume
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Wishlist --- */}
      {activeTab === "Wishlist" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5" /> Wishlist & Enrollments
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="border border-black p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
              >
                <div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-700 text-sm">{item.price}</p>
                </div>
                <button className="mt-4 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Certificates --- */}
      {activeTab === "Certificates" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-5 h-5" /> Course Certificates
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="border border-black p-6 flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform duration-300"
              >
                <h3 className="font-semibold mb-1">{cert.title}</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Completed {cert.date}
                </p>
                <button className="border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
                  View Certificate
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Settings --- */}
      {activeTab === "Settings" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" /> Account & Profile Settings
          </h2>

          <div className="border border-black p-6 max-w-2xl">
            <p className="font-semibold mb-2">{profile.name}</p>
            <p className="text-sm mb-1">Email: {profile.email}</p>
            <p className="text-sm mb-1">Plan: {profile.plan}</p>
            <p className="text-sm text-gray-700 mb-4">
              Renewal Date: {profile.renewal}
            </p>

            <div className="flex gap-3">
              <button className="border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
                Edit Profile
              </button>
              <button className="border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
                Change Password
              </button>
            </div>
          </div>
        </section>
      )}
    </DashboardLayout>
  );
}
