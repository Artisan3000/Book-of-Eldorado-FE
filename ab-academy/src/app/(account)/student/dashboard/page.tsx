import {
  BookOpen,
  Award,
  Clock,
  Flame,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import MediaLibrary from "../../dashboard/components/MediaLibrary";
import Mentorship from "../../dashboard/components/Mentorship";
import ProgressTracker from "../../dashboard/components/ProgressTracker";
import { requireRole } from "@/lib/current-user";
import { getStudentDashboardData } from "@/lib/data/student";

export default async function StudentDashboardPage() {
  const user = await requireRole(["STUDENT", "ADMIN"]);
  const { profile, courses } = await getStudentDashboardData(user.id);

  const wishlist = [
    { id: 4, title: "Luxury Service 101", price: "$60" },
    { id: 5, title: "Texture & Technique", price: "$75" },
  ];

  const stats = [
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Total Hours Watched",
      value: `${profile.totalHours}h`,
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Courses in Progress",
      value: profile.coursesInProgress,
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: "Certificates Earned",
      value: profile.certificates,
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      label: "Learning Streak",
      value: `${profile.streak} days`,
    },
  ];

  return (
    <section className="px-8 md:px-16 py-12 animate-fadeIn">
      {/* --- Personalized Greeting --- */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">
          Hi {profile.name}, ready to keep learning?
        </h1>
        <p className="text-gray-600 italic">
          Keep up your streak — consistency makes mastery.
        </p>
      </div>

      {/* --- Snapshot Cards --- */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-black bg-white p-6 flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="mb-3">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* --- Activity & Recommendations --- */}
      <div className="border border-dashed border-gray-400 p-10 text-center text-gray-500 italic my-10">
        [Upcoming Live Sessions, New Course Drops, or Recommended Lessons
        Placeholder]
      </div>

      {/* --- Courses in Progress --- */}
      <div className="mb-16">
        <h3 className="text-xl mb-4 font-semibold underline">
          Courses in Progress
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/student/courses/${course.slug}`}
              className="border border-black p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 group"
            >
              <div>
                <h3 className="font-semibold mb-2 group-hover:underline">
                  {course.title}
                </h3>
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
              <div className="flex items-center gap-1 mt-4 border border-black px-3 py-1 text-sm group-hover:bg-gray-100 transition">
                <PlayCircle className="w-4 h-4" /> Continue
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* --- Progress Tracker --- */}
      <div className="mb-16">
        <h3 className="text-xl mb-4 font-semibold underline">
          Weekly Progress
        </h3>
        <ProgressTracker />
      </div>

      {/* --- Media Library --- */}
      <div className="mb-16">
        <h3 className="text-xl mb-4 font-semibold underline">
          Your Media Library
        </h3>
        <MediaLibrary />
      </div>

      {/* --- Mentorship --- */}
      <div className="mb-16">
        <h3 className="text-xl mb-4 font-semibold underline">
          Mentorship Opportunities
        </h3>
        <Mentorship />
      </div>

      {/* --- Wishlist / Explore More --- */}
      <div className="mb-16">
        <h3 className="text-xl mb-4 font-semibold underline">
          Explore More Courses
        </h3>
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
      </div>
    </section>
  );
}
