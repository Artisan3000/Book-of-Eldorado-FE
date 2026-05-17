import { PlayCircle, FileText, MessageSquare, Download } from "lucide-react";
import Tabs from "@/app/components/Tabs";
import { requireRole } from "@/lib/current-user";
import { getStudentCourseDetail } from "@/lib/data/student";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireRole(["STUDENT", "ADMIN"]);
  const { slug } = await params;
  const course = await getStudentCourseDetail(user.id, slug);

  return (
    <section className="px-16 py-8 animate-fadeIn">
      {/* --- Header --- */}
      <div className="mb-8 border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-3">{course.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-700">
          <p>
            <strong>Instructor:</strong> {course.instructor}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200">
              <div
                className="h-2 bg-black"
                style={{ width: `${course.progress * 100}%` }}
              />
            </div>
            <span>{Math.round(course.progress * 100)}%</span>
          </div>
        </div>
      </div>

      <Tabs
        navClassName="flex gap-6 mb-8 border-b border-gray-300"
        buttonClassName="pb-2 text-sm font-medium"
        activeButtonClassName="border-b-2 border-black text-black"
        inactiveButtonClassName="text-gray-500 hover:text-black"
        activeIndicatorClassName="hidden"
        contentClassName=""
        tabs={[
          {
            label: "Overview",
            content: (
              <div className="space-y-6">
                <p>
                  This course is designed to help you refine your craft and elevate your technical precision. 
                  Continue to the next lesson to keep progressing.
                </p>
                <button className="flex items-center gap-2 border border-black px-4 py-2 text-sm hover:bg-gray-100 transition">
                  <PlayCircle className="w-4 h-4" /> Continue where you left off
                </button>
              </div>
            ),
          },
          {
            label: "Lessons",
            content: (
              <div className="space-y-4">
                {course.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between border border-gray-300 p-4 hover:bg-gray-50 transition ${
                      lesson.completed ? "opacity-70" : ""
                    }`}
                  >
                    <div>
                      <h3 className="font-semibold">{lesson.title}</h3>
                      <p className="text-sm text-gray-600">{lesson.duration}</p>
                    </div>
                    <button className="flex items-center gap-2 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
                      <PlayCircle className="w-4 h-4" />
                      {lesson.completed ? "Rewatch" : "Start Lesson"}
                    </button>
                  </div>
                ))}
              </div>
            ),
          },
          {
            label: "Resources",
            content: (
              <div className="space-y-4">
                {course.resources.map((res) => (
                  <a
                    key={res.id}
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border border-gray-300 p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{res.name}</span>
                    </div>
                    <Download className="w-4 h-4" />
                  </a>
                ))}
              </div>
            ),
          },
          {
            label: "Discussion",
            content: (
              <div className="border border-gray-300 p-6 italic text-gray-500 text-center">
                <MessageSquare className="w-5 h-5 mx-auto mb-2" />
                <p>[Discussion forum placeholder — coming soon]</p>
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
