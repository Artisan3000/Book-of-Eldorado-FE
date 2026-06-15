import { ArrowLeft, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { requireRole } from "@/lib/current-user";
import { getStudentLessonDetail } from "@/lib/data/student";

export default async function StudentLessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const user = await requireRole(["STUDENT", "ADMIN"]);
  const { slug, lessonSlug } = await params;
  const { course, lesson, previousLesson, nextLesson } =
    await getStudentLessonDetail(user.id, slug, lessonSlug);

  return (
    <section className="px-8 py-8 animate-fadeIn md:px-16">
      <Link
        href={`/student/courses/${slug}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {course.title}
      </Link>

      <div className="mb-8 border-b border-gray-300 pb-6">
        <p className="mb-2 text-sm font-medium text-gray-600">
          {lesson.moduleTitle}
        </p>
        <h1 className="text-3xl font-bold mb-3">{lesson.title}</h1>
        {lesson.description && (
          <p className="max-w-3xl text-gray-700">{lesson.description}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-700">
          <span>
            <strong>Instructor:</strong> {course.instructor}
          </span>
          {lesson.duration && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-4 h-4" /> {lesson.duration}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            {lesson.completed ? "Completed" : "Not started"}
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <main className="space-y-6">
          <div className="flex aspect-video items-center justify-center border border-black bg-gray-50">
            <div className="text-center">
              <PlayCircle className="mx-auto mb-3 h-10 w-10" />
              <p className="font-semibold">Lesson video coming soon</p>
              <p className="mt-2 text-sm text-gray-600">
                This lesson page is ready for the video, workbook, and
                completion tools when those assets are added.
              </p>
            </div>
          </div>

          <section className="border border-gray-300 p-6">
            <h2 className="mb-3 text-xl font-semibold">Lesson Notes</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Use this page as the lesson home for {lesson.title}. The current
              course data includes the lesson summary and estimated runtime;
              full lesson materials can be attached here once the media and
              workbook model is ready.
            </p>
          </section>
        </main>

        <aside className="space-y-4">
          <div className="border border-gray-300 p-5">
            <h2 className="mb-2 font-semibold">Course Progress</h2>
            <div className="mb-2 h-2 bg-gray-200">
              <div
                className="h-2 bg-black"
                style={{ width: `${course.progress * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {Math.round(course.progress * 100)}% complete
            </p>
          </div>

          <div className="space-y-3">
            {previousLesson && (
              <Link
                href={previousLesson.href}
                className="block border border-black px-4 py-3 text-sm hover:bg-gray-100"
              >
                Previous: {previousLesson.title}
              </Link>
            )}
            {nextLesson && (
              <Link
                href={nextLesson.href}
                className="block border border-black bg-black px-4 py-3 text-sm text-white hover:bg-gray-900"
              >
                Next: {nextLesson.title}
              </Link>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
