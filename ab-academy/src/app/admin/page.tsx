"use client";

import { Users, BookOpen, DollarSign, FileText, PlusCircle, Edit } from "lucide-react";

export default function AdminDashboard() {
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
    <main className="px-8 py-16">
      <h1 className="text-4xl mb-12">Dashboard</h1>

      {/* Metrics */}
      <section className="grid md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-black p-6 flex flex-col items-center text-center"
          >
            <div className="mb-3">{stat.icon}</div>
            <div className="text-2xl">{stat.value}</div>
            <div className="text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* User Management */}
      <section className="border border-black p-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">User Management</h2>
          <button className="flex items-center gap-2 border border-black px-3 py-1 text-sm hover:bg-gray-100">
            <PlusCircle className="w-4 h-4" /> Add User
          </button>
        </div>
        <table className="w-full text-sm border-t border-black">
          <thead>
            <tr className="border-b border-black">
              <th className="py-2 text-left">Name</th>
              <th className="text-left">Role</th>
              <th className="text-left">Course</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-300">
                <td className="py-2">{user.name}</td>
                <td>{user.role}</td>
                <td>{user.enrolled}</td>
                <td>
                  <button className="flex items-center gap-1 text-xs hover:underline">
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Course Management */}
      <section className="border border-black p-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Course Management</h2>
          <button className="flex items-center gap-2 border border-black px-3 py-1 text-sm hover:bg-gray-100">
            <PlusCircle className="w-4 h-4" /> Add Course
          </button>
        </div>
        <table className="w-full text-sm border-t border-black">
          <thead>
            <tr className="border-b border-black">
              <th className="py-2 text-left">Course</th>
              <th className="text-left">Students</th>
              <th className="text-left">Status</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockCourses.map((course) => (
              <tr key={course.id} className="border-b border-gray-300">
                <td className="py-2">{course.name}</td>
                <td>{course.students}</td>
                <td>{course.status}</td>
                <td>
                  <button className="flex items-center gap-1 text-xs hover:underline">
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Donation Management */}
      <section className="border border-black p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Donations</h2>
          <button className="flex items-center gap-2 border border-black px-3 py-1 text-sm hover:bg-gray-100">
            <PlusCircle className="w-4 h-4" /> Add Donation
          </button>
        </div>
        <table className="w-full text-sm border-t border-black">
          <thead>
            <tr className="border-b border-black">
              <th className="py-2 text-left">Donor</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {mockDonations.map((donation) => (
              <tr key={donation.id} className="border-b border-gray-300">
                <td className="py-2">{donation.donor}</td>
                <td>{donation.amount}</td>
                <td>{donation.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
