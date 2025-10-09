"use client";

import { useState } from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  FileText,
  PlusCircle,
  Edit,
  BarChart3,
} from "lucide-react";

export default function AdminDashboard() {
  const tabs = ["Overview", "Users", "Courses", "Donations"];
  const [activeTab, setActiveTab] = useState("Overview");

  const stats = [
    { icon: <Users className="w-5 h-5" />, label: "Active Users", value: 328 },
    { icon: <BookOpen className="w-5 h-5" />, label: "Courses", value: 6 },
    { icon: <FileText className="w-5 h-5" />, label: "Articles", value: 14 },
    { icon: <DollarSign className="w-5 h-5" />, label: "Donations", value: "$8,430" },
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

  const mockDonations = [
    { id: 1, donor: "Anonymous", amount: "$250", date: "Oct 10, 2025" },
    { id: 2, donor: "CutCraft Tools", amount: "$500", date: "Oct 8, 2025" },
    { id: 3, donor: "Fade Culture", amount: "$1200", date: "Oct 2, 2025" },
  ];

  return (
    <main className="px-8 py-16 font-serif text-black">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2 animate-fadeUp">Admin Dashboard</h1>
        <p className="text-gray-600 text-sm animate-fadeIn">
          Manage users, courses, and contributions across the academy.
        </p>
      </header>

      {/* Tabs */}
      <nav className="flex border-b border-black mb-10 text-sm uppercase tracking-wide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-3 border-r border-black last:border-r-0 transition-colors duration-300 ${
              activeTab === tab
                ? "bg-black text-white"
                : "hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 animate-underline" />
            )}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <section key={activeTab} className="animate-fadeIn">
        {activeTab === "Overview" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> Overview
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
          </div>
        )}

        {activeTab === "Users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">User Management</h2>
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
                    <tr key={user.id} className="border-b border-gray-300 hover:bg-gray-50">
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
          </div>
        )}

        {activeTab === "Courses" && (
          <div>
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
                    <th className="py-2 text-left px-2">Course</th>
                    <th className="text-left px-2">Students</th>
                    <th className="text-left px-2">Status</th>
                    <th className="text-left px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCourses.map((course) => (
                    <tr key={course.id} className="border-b border-gray-300 hover:bg-gray-50">
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
          </div>
        )}

        {activeTab === "Donations" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Donation Management</h2>
              <button className="flex items-center gap-2 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
                <PlusCircle className="w-4 h-4" /> Add Donation
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-t border-black">
                <thead>
                  <tr className="border-b border-black bg-gray-50">
                    <th className="py-2 text-left px-2">Donor</th>
                    <th className="text-left px-2">Amount</th>
                    <th className="text-left px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDonations.map((donation) => (
                    <tr
                      key={donation.id}
                      className="border-b border-gray-300 hover:bg-gray-50"
                    >
                      <td className="py-2 px-2">{donation.donor}</td>
                      <td className="px-2">{donation.amount}</td>
                      <td className="px-2">{donation.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
