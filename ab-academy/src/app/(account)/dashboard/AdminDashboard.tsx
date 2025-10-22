"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";
import {
  Users,
  BookOpen,
  DollarSign,
  FileText,
  PlusCircle,
  Edit,
  Settings,
  Activity,
} from "lucide-react";

export default function AdminDashboard() {
  const tabs = [
    "Overview",
    "Users",
    "Courses",
    "Revenue",
    "Logs",
    "Profile",
  ];
  const [activeTab, setActiveTab] = useState("Overview");

  // --- Mock Data (Replace with Laravel API data later) ---
  const stats = [
    { icon: <Users className="w-5 h-5" />, label: "Total Students", value: 1128 },
    { icon: <BookOpen className="w-5 h-5" />, label: "Courses", value: 12 },
    { icon: <DollarSign className="w-5 h-5" />, label: "Revenue", value: "$23,400" },
    { icon: <Activity className="w-5 h-5" />, label: "Active Enrollments", value: 842 },
  ];

  const mockUsers = [
    { id: 1, name: "Jordan A.", role: "Student", enrolled: "Refinement" },
    { id: 2, name: "Maya B.", role: "Instructor", enrolled: "Mastery" },
    { id: 3, name: "Luis G.", role: "Student", enrolled: "Foundation" },
  ];

  const mockCourses = [
    { id: 1, name: "Foundation", students: 128, status: "Active" },
    { id: 2, name: "Refinement", students: 76, status: "Active" },
    { id: 3, name: "Mastery", students: 54, status: "Draft" },
  ];

  const mockRevenue = [
    { id: 1, source: "Course Sales", amount: "$18,320", date: "Oct 20, 2025" },
    { id: 2, source: "Affiliate Payout", amount: "$2,400", date: "Oct 15, 2025" },
    { id: 3, source: "Workshop Tickets", amount: "$2,680", date: "Oct 10, 2025" },
  ];

  const mockLogs = [
    { id: 1, action: "Edited course: Foundation", date: "Oct 22, 2025" },
    { id: 2, action: "Added user: New Instructor", date: "Oct 21, 2025" },
    { id: 3, action: "Processed refund for student #454", date: "Oct 18, 2025" },
  ];

  const mockProfile = {
    name: "Admin User",
    email: "admin@artisanbarber.com",
    role: "Administrator",
    lastLogin: "Oct 20, 2025",
  };

  // --- Render ---
  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Manage users, courses, and academy operations"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* --- Overview --- */}
      {activeTab === "Overview" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl mb-6 flex items-center gap-2">
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
            [Revenue Chart / Enrollment Trend Placeholder]
          </div>
        </section>
      )}

      {/* --- Users --- */}
      {activeTab === "Users" && (
        <section className="animate-fadeIn px-16 py-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5" /> User Management
            </h2>
            <button className="flex items-center gap-2 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
              <PlusCircle className="w-4 h-4" /> Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-t border-black">
              <thead>
                <tr className="border-b border-black bg-gray-50">
                  <th className="py-2 text-left px-2">Name</th>
                  <th className="text-left px-2">Role</th>
                  <th className="text-left px-2">Course</th>
                  <th className="text-left px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td className="py-2 px-2">{user.name}</td>
                    <td className="px-2">{user.role}</td>
                    <td className="px-2">{user.enrolled}</td>
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

      {/* --- Courses --- */}
      {activeTab === "Courses" && (
        <section className="animate-fadeIn px-16 py-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Course Management
            </h2>
            <button className="flex items-center gap-2 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
              <PlusCircle className="w-4 h-4" /> Add Course
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-t border-black">
              <thead>
                <tr className="border-b border-black bg-gray-50">
                  <th className="py-2 text-left px-2">Course</th>
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
                    <td className="py-2 px-2">{course.name}</td>
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

      {/* --- Revenue --- */}
      {activeTab === "Revenue" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> Revenue & Transactions
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-t border-black">
              <thead>
                <tr className="border-b border-black bg-gray-50">
                  <th className="py-2 text-left px-2">Source</th>
                  <th className="text-left px-2">Amount</th>
                  <th className="text-left px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockRevenue.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td className="py-2 px-2">{entry.source}</td>
                    <td className="px-2">{entry.amount}</td>
                    <td className="px-2">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* --- Logs --- */}
      {activeTab === "Logs" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Activity Logs
          </h2>
          <ul className="divide-y divide-gray-300 border-t border-black">
            {mockLogs.map((log) => (
              <li key={log.id} className="py-3 flex justify-between text-sm">
                <span>{log.action}</span>
                <span className="text-gray-600">{log.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* --- Profile --- */}
      {activeTab === "Profile" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" /> Profile Management
          </h2>
          <div className="border border-black p-6 max-w-2xl">
            <p className="font-semibold mb-2">{mockProfile.name}</p>
            <p className="text-sm mb-2">Email: {mockProfile.email}</p>
            <p className="text-sm mb-2">Role: {mockProfile.role}</p>
            <p className="text-sm text-gray-700 mb-4">
              Last Login: {mockProfile.lastLogin}
            </p>
            <button className="border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
              Edit Profile
            </button>
          </div>
        </section>
      )}
    </DashboardLayout>
  );
}
