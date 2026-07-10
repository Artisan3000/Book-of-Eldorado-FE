"use client";

import { ArrowLeft, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import VimeoPlayer from "@/app/components/VimeoPlayer";

type LessonProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

type LessonLink = {
  href: string;
  title: string;
} | null;

type StudentLessonExperienceProps = {
  course: {
    title: string;
    instructor: string;
    progress: number;
  };
  lesson: {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string | null;
    moduleTitle: string;
    progressStatus: LessonProgressStatus;
  };
  slug: string;
  lessonSlug: string;
  previousLesson: LessonLink;
  nextLesson: LessonLink;
};

function getLessonStatusLabel(status: LessonProgressStatus) {
  if (status === "COMPLETED") {
    return "Completed";
  }

  if (status === "IN_PROGRESS") {
    return "In progress";
  }

  return "Not started";
}

export default function StudentLessonExperience({
  course,
  lesson,
  slug,
  lessonSlug,
  previousLesson,
  nextLesson,
}: StudentLessonExperienceProps) {
  const [progressStatus, setProgressStatus] =
    useState<LessonProgressStatus>(lesson.progressStatus);
  const [durationLabel, setDurationLabel] = useState("—");
  const handleDurationChange = useCallback((nextDurationLabel: string) => {
    setDurationLabel(nextDurationLabel);
  }, []);
  const handleProgressStatusChange = useCallback(
    (nextProgressStatus: LessonProgressStatus) => {
      setProgressStatus(nextProgressStatus);
    },
    []
  );

  return (
    <>
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
          <span className="inline-flex items-center gap-1">
            <Clock className="w-4 h-4" /> {durationLabel}
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            {getLessonStatusLabel(progressStatus)}
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <main className="space-y-6">
          {lesson.videoUrl ? (
            <VimeoPlayer
              playerUrl={lesson.videoUrl}
              title={lesson.title}
              courseSlug={slug}
              lessonSlug={lessonSlug}
              progressStatus={progressStatus}
              onDurationChange={handleDurationChange}
              onProgressStatusChange={handleProgressStatusChange}
            />
          ) : (
            <div className="flex aspect-video items-center justify-center border border-black bg-gray-50">
              <div className="px-6 text-center">
                <PlayCircle className="mx-auto mb-3 h-10 w-10" />
                <p className="font-semibold">Video coming soon</p>
                <p className="mt-2 text-sm text-gray-600">
                  This lesson does not have a video mapped yet.
                </p>
              </div>
            </div>
          )}

          <section className="border border-gray-300 p-6">
            <h2 className="mb-3 text-xl font-semibold">Lesson Notes</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Use this page as the lesson home for {lesson.title}. The current
              course data includes the lesson summary; full lesson materials can
              be attached here once the media and workbook model is ready.
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
    </>
  );
}
