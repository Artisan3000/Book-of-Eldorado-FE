import { PlayCircle } from "lucide-react";
import Link from "next/link";
import { requireRole } from "@/lib/current-user";
import { getStudentDashboardData } from "@/lib/data/student";

export default async function StudentCourses() {
  const user = await requireRole(["STUDENT", "ADMIN"]);
  const { courses } = await getStudentDashboardData(user.id);

  return (
    <section className="px-8 py-8 animate-fadeIn md:px-16">
      <h2 className="text-2xl mb-6">My Courses</h2>

      {courses.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.enrollmentId}
              href={`/student/courses/${course.slug}`}
              className="border border-black p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform group"
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-semibold group-hover:underline">
                    {course.title}
                  </h3>
                  <span className="text-xs uppercase text-gray-600">
                    {course.status}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 mb-2">
                  <div
                    className="h-2 bg-black"
                    style={{ width: `${course.progress * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  {course.completedLessons} of {course.totalLessons} lessons
                  completed
                </p>
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
      ) : (
        <div className="border border-dashed border-gray-400 p-8 text-center">
          <p className="font-semibold text-black">
            No active course enrollments yet.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Courses will appear here once this student is enrolled.
          </p>
        </div>
      )}
    </section>
  );
}
