"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type LessonProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

type TextLessonProgressProps = {
  courseSlug: string;
  lessonSlug: string;
  progressStatus: LessonProgressStatus;
  onProgressStatusChange: (progressStatus: LessonProgressStatus) => void;
};

const statusRank: Record<LessonProgressStatus, number> = {
  NOT_STARTED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
};

// Text lessons use the same progress API as Vimeo lessons, but only ever send
// status updates: never playback positions.
export default function TextLessonProgress({
  courseSlug,
  lessonSlug,
  progressStatus,
  onProgressStatusChange,
}: TextLessonProgressProps) {
  const router = useRouter();
  const hasMarkedStartedRef = useRef(false);
  const progressStatusRef = useRef<LessonProgressStatus>(progressStatus);
  const [isCompleting, setIsCompleting] = useState(false);
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    progressStatusRef.current = progressStatus;
  }, [progressStatus]);

  // Late responses (e.g. the "started" request finishing after "complete")
  // must never move the lesson backwards.
  const applyStatus = useCallback(
    (nextStatus: unknown) => {
      if (
        (nextStatus === "IN_PROGRESS" || nextStatus === "COMPLETED") &&
        statusRank[nextStatus] > statusRank[progressStatusRef.current]
      ) {
        progressStatusRef.current = nextStatus;
        onProgressStatusChange(nextStatus);
      }
    },
    [onProgressStatusChange]
  );

  const saveProgress = useCallback(
    async (status: Exclude<LessonProgressStatus, "NOT_STARTED">) => {
      const response = await fetch(
        `/api/student/courses/${courseSlug}/lessons/${lessonSlug}/progress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof payload?.error === "string"
            ? payload.error
            : "Progress could not be saved."
        );
      }

      applyStatus(payload?.progress?.status);
    },
    [applyStatus, courseSlug, lessonSlug]
  );

  useEffect(() => {
    if (hasMarkedStartedRef.current || progressStatusRef.current !== "NOT_STARTED") {
      return;
    }

    hasMarkedStartedRef.current = true;
    saveProgress("IN_PROGRESS").catch((error: unknown) => {
      setProgressError(
        error instanceof Error ? error.message : "Progress could not be saved."
      );
    });
  }, [saveProgress]);

  const handleMarkComplete = async () => {
    setIsCompleting(true);
    setProgressError("");

    try {
      await saveProgress("COMPLETED");
      // Refresh server data so course progress reflects the completion.
      router.refresh();
    } catch (error) {
      setProgressError(
        error instanceof Error ? error.message : "Progress could not be saved."
      );
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-3 border border-black p-6">
      {progressStatus === "COMPLETED" ? (
        <p className="inline-flex items-center gap-2 font-semibold">
          <CheckCircle2 className="h-5 w-5" /> Lesson completed
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-700">
            Finished reading? Mark this lesson complete to record your progress.
          </p>
          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={isCompleting}
            className="inline-flex items-center gap-2 border border-black bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isCompleting ? "Saving..." : "Mark lesson complete"}
          </button>
        </>
      )}

      {progressError && (
        <p role="alert" className="text-sm text-red-700">
          {progressError}
        </p>
      )}
    </div>
  );
}
