import { PlayCircle, FileText, MessageSquare } from "lucide-react";
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
                  This course is organized into short lesson modules with
                  workbook and text sections added as materials are finalized.
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
              <div className="space-y-6">
                {course.modules.map((module) => (
                  <section key={module.id} className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold">{module.title}</h3>
                      {module.description && (
                        <p className="text-sm text-gray-600">
                          {module.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center justify-between border border-gray-300 p-4 hover:bg-gray-50 transition ${
                            lesson.completed ? "opacity-70" : ""
                          }`}
                        >
                          <div>
                            <h4 className="font-semibold">{lesson.title}</h4>
                            {lesson.description && (
                              <p className="text-sm text-gray-600">
                                {lesson.description}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              {lesson.duration}
                            </p>
                          </div>
                          <button className="flex items-center gap-2 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
                            <PlayCircle className="w-4 h-4" />
                            {lesson.completed ? "Rewatch" : "Start Lesson"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ),
          },
          {
            label: "Resources",
            content: (
              <div className="border border-gray-300 p-6 text-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4" />
                  <h3 className="font-semibold text-black">
                    Workbook Materials
                  </h3>
                </div>
                <p className="text-sm">
                  Workbook and supporting text resources will be added as the
                  course materials are finalized.
                </p>
              </div>
            ),
          },
          {
            label: "Discussion",
            content: (
              <div className="border border-gray-300 p-6 italic text-gray-500 text-center">
                <MessageSquare className="w-5 h-5 mx-auto mb-2" />
                <p>Discussion tools will be added later.</p>
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
