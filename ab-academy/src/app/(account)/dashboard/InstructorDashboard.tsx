"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";
import {
  BookOpen,
  DollarSign,
  Users,
  Edit,
  PlusCircle,
  Star,
} from "lucide-react";

export default function InstructorDashboard() {
  const tabs = ["Overview", "Courses", "Lessons", "Profile"];
  const [activeTab, setActiveTab] = useState("Overview");

  // Mock Data (replace with Laravel API later)
  const stats = [
    {
      icon: <Users className="w-5 h-5" />,
      label: "Total Students",
      value: 248,
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Active Courses",
      value: 5,
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: "Average Rating",
      value: "4.8 ★",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "Monthly Sales",
      value: "$3,240",
    },
  ];

  const mockCourses = [
    { id: 1, title: "Luxury Service 101", students: 112, status: "Published" },
    {
      id: 2,
      title: "Cultural Competence in Grooming",
      students: 68,
      status: "Active",
    },
    { id: 3, title: "Texture & Technique", students: 45, status: "Draft" },
  ];

  const mockLessons = [
    {
      id: 1,
      title: "Consultation & Reading Clients",
      course: "Luxury Service 101",
      type: "Video",
    },
    {
      id: 2,
      title: "Fading for Diverse Hair Types",
      course: "Texture & Technique",
      type: "PDF",
    },
    {
      id: 3,
      title: "Luxury Rituals & Tone Setting",
      course: "Luxury Service 101",
      type: "Audio",
    },
  ];

  const mockProfile = {
    name: "Jordan Rivera",
    bio: "Instructor specializing in precision fades, client psychology, and service excellence.",
    expertise: ["Luxury Service", "Cultural Competence", "Texture & Technique"],
    social: {
      instagram: "@jordanrivera",
      youtube: "youtube.com/jordanrivera",
    },
  };

  return (
    <DashboardLayout
      title="Instructor Dashboard"
      subtitle="Manage your courses, lessons, and profile"
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

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border border-black p-6 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="mb-3">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="border border-dashed border-gray-400 p-10 text-center text-gray-500 italic">
            [Course Performance Chart Placeholder]
          </div>
        </section>
      )}

      {/* --- Courses --- */}
      {activeTab === "Courses" && (
        <section className="animate-fadeIn px-16 py-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Course Management</h2>
            <button className="flex items-center gap-2 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
              <PlusCircle className="w-4 h-4" /> Add Course
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-t border-black">
              <thead>
                <tr className="border-b border-black bg-gray-50">
                  <th className="py-2 text-left px-2">Title</th>
                  <th className="text-left px-2">Students</th>
                  <th className="text-left px-2">Status</th>
                  <th className="text-left px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td className="py-2 px-2">{course.title}</td>
                    <td className="px-2">{course.students}</td>
                    <td className="px-2">{course.status}</td>
                    <td className="px-2">
                      <button className="flex items-center gap-1 text-xs hover:underline">
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* --- Lessons --- */}
      {activeTab === "Lessons" && (
        <section className="animate-fadeIn px-16 py-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Lesson & Quiz Builder</h2>
            <button className="flex items-center gap-2 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
              <PlusCircle className="w-4 h-4" /> Add Lesson
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-t border-black">
              <thead>
                <tr className="border-b border-black bg-gray-50">
                  <th className="py-2 text-left px-2">Title</th>
                  <th className="text-left px-2">Course</th>
                  <th className="text-left px-2">Type</th>
                  <th className="text-left px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockLessons.map((lesson) => (
                  <tr
                    key={lesson.id}
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td className="py-2 px-2">{lesson.title}</td>
                    <td className="px-2">{lesson.course}</td>
                    <td className="px-2">{lesson.type}</td>
                    <td className="px-2">
                      <button className="flex items-center gap-1 text-xs hover:underline">
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* --- Profile --- */}
      {activeTab === "Profile" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl font-bold mb-6">Profile Management</h2>

          <div className="border border-black p-6 max-w-2xl">
            <p className="font-semibold mb-2">{mockProfile.name}</p>
            <p className="text-sm text-gray-700 mb-4">{mockProfile.bio}</p>

            <h3 className="font-semibold mb-2">Areas of Expertise:</h3>
            <ul className="list-disc list-inside mb-4">
              {mockProfile.expertise.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>

            <h3 className="font-semibold mb-2">Social Links:</h3>
            <ul className="text-sm">
              <li>
                Instagram:{" "}
                <a
                  href={`https://instagram.com/${mockProfile.social.instagram.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {mockProfile.social.instagram}
                </a>
              </li>
              <li>
                YouTube:{" "}
                <a
                  href={`https://${mockProfile.social.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {mockProfile.social.youtube}
                </a>
              </li>
            </ul>
          </div>
        </section>
      )}
    </DashboardLayout>
  );
}
