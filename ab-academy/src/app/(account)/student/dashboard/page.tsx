import {
  BookOpen,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import MediaLibrary from "../../dashboard/components/MediaLibrary";
import Mentorship from "../../dashboard/components/Mentorship";
import { requireRole } from "@/lib/current-user";
import {
  getStudentDashboardData,
  type WeeklyLessonProgress,
} from "@/lib/data/student";

function formatActivityDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export default async function StudentDashboardPage() {
  const user = await requireRole(["STUDENT", "ADMIN"]);
  const { profile, courses, weeklyProgress } = await getStudentDashboardData(
    user.id
  );

  const stats = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Courses in Progress",
      value: profile.coursesInProgress,
    },
    {
      icon: <PlayCircle className="w-5 h-5" />,
      label: "Lessons This Week",
      value: profile.lessonsThisWeek,
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
          Your course activity is shown from your current enrollments.
        </p>
      </div>

      {/* --- Snapshot Cards --- */}
      <div className="grid gap-6 mb-12 md:grid-cols-2">
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

      {/* --- Courses in Progress --- */}
      <div className="mb-16">
        <h3 className="text-xl mb-4 font-semibold underline">
          Courses in Progress
        </h3>
        {courses.length > 0 ? (
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
          <EmptyState
            title="No active course enrollments yet."
            description="Courses will appear here once this student is enrolled."
          />
        )}
      </div>

      {/* --- Progress Tracker --- */}
      <div className="mb-16">
        <h3 className="text-xl mb-4 font-semibold underline">
          Weekly Progress
        </h3>
        <WeeklyProgressList progress={weeklyProgress} />
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
        <EmptyState
          title="No additional courses are available yet."
          description="New course options will appear here after the first course is built out."
        />
      </div>
    </section>
  );
}

function WeeklyProgressList({
  progress,
}: {
  progress: WeeklyLessonProgress[];
}) {
  if (progress.length === 0) {
    return (
      <EmptyState
        title="No lesson progress in the last seven days."
        description="Recent lesson activity will appear here once online lessons are available and started."
      />
    );
  }

  return (
    <div className="space-y-3">
      {progress.map((item) => (
        <div
          key={item.id}
          className="border border-black p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="font-semibold">{item.lessonTitle}</p>
            <p className="text-sm text-gray-600">
              {item.courseTitle} / {item.moduleTitle}
            </p>
            {item.duration && (
              <p className="text-xs text-gray-600">{item.duration}</p>
            )}
          </div>
          <div className="text-sm text-gray-700 md:text-right">
            <p>{item.status}</p>
            <p>{formatActivityDate(item.activityAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-dashed border-gray-400 p-8 text-center">
      <p className="font-semibold text-black">{title}</p>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}
