import { CourseStatus } from "@prisma/client";
import { Users, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [totalUsers, activeCourses] = await Promise.all([
    prisma.user.count(),
    prisma.course.count({
      where: {
        status: CourseStatus.PUBLISHED,
      },
    }),
  ]);

  const stats = [
    {
      icon: <Users className="w-5 h-5" />,
      label: "Total Users",
      value: totalUsers.toLocaleString(),
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Active Courses",
      value: activeCourses.toLocaleString(),
    },
  ];

  return (
    <section className="animate-fadeIn px-16 py-2">
      <h2 className="text-2xl italic mb-6 flex items-center gap-2">Overview</h2>

      <div className="grid gap-6 mb-16 md:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-black p-6 flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform"
          >
            <div className="mb-3">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="border border-dashed border-gray-400 p-10 text-center text-gray-500 italic">
        Admin activity will appear here once audit logging is connected.
      </div>
    </section>
  );
}
