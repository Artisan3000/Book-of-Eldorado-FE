"use client";

import Player from "@vimeo/player";
import { useCallback, useEffect, useRef, useState } from "react";
import type { VimeoUrl } from "@vimeo/player/types/formats";

type LessonProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
type PositionSaveReason = "checkpoint" | "pause" | "ended" | "unmount";
type LessonScopedMessage = {
  lessonKey: string;
  message: string;
};

type VimeoPlayerProps = {
  playerUrl: string;
  title: string;
  courseSlug: string;
  lessonSlug: string;
  progressStatus: LessonProgressStatus;
  savedPositionSeconds: number;
  onDurationChange: (durationLabel: string) => void;
  onProgressStatusChange: (progressStatus: LessonProgressStatus) => void;
};

const POSITION_SAVE_INTERVAL_MS = 15_000;
const MIN_RESUME_POSITION_SECONDS = 5;
const MIN_SECONDS_FROM_END_TO_RESUME = 10;

function getValidatedVimeoPlayerUrl(playerUrl: string) {
  let parsed: URL;

  try {
    parsed = new URL(playerUrl);
  } catch {
    throw new Error("Invalid Vimeo player URL.");
  }

  if (
    parsed.protocol !== "https:" ||
    parsed.hostname !== "player.vimeo.com" ||
    !/^\/video\/\d+$/.test(parsed.pathname) ||
    parsed.search !== "" ||
    parsed.hash !== ""
  ) {
    throw new Error("Invalid Vimeo player URL.");
  }

  return parsed.toString();
}

function formatDuration(seconds: number) {
  const totalMinutes = Math.ceil(seconds / 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
}

function formatTimestamp(seconds: number) {
  const wholeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = wholeSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function VimeoPlayer({
  playerUrl,
  title,
  courseSlug,
  lessonSlug,
  progressStatus,
  savedPositionSeconds,
  onDurationChange,
  onProgressStatusChange,
}: VimeoPlayerProps) {
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(
    null
  );
  const playerRef = useRef<Player | null>(null);
  const hasMarkedStartedRef = useRef(false);
  const progressStatusRef = useRef<LessonProgressStatus>(progressStatus);
  const currentPositionSecondsRef = useRef(0);
  const lastSavedPositionSecondsRef = useRef(savedPositionSeconds);
  const inFlightPositionSavesRef = useRef(new Set<number>());
  const hasPlaybackStartedRef = useRef(false);
  const isApplyingResumeRef = useRef(false);
  const isMountedRef = useRef(false);
  const activeLessonKeyRef = useRef("");
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [progressErrorState, setProgressErrorState] =
    useState<LessonScopedMessage>({
      lessonKey: "",
      message: "",
    });
  const [resumeMessageState, setResumeMessageState] =
    useState<LessonScopedMessage>({
      lessonKey: "",
      message: "",
    });
  const src = getValidatedVimeoPlayerUrl(playerUrl);
  const lessonKey = `${courseSlug}/${lessonSlug}/${src}`;
  const progressError =
    progressErrorState.lessonKey === lessonKey ? progressErrorState.message : "";
  const resumeMessage =
    resumeMessageState.lessonKey === lessonKey ? resumeMessageState.message : "";
  const setPlayerContainer = useCallback((node: HTMLDivElement | null) => {
    setContainerElement(node);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    progressStatusRef.current = progressStatus;
  }, [progressStatus]);

  const setProgressErrorForActiveLesson = useCallback(
    (requestLessonKey: string, message: string) => {
      if (
        isMountedRef.current &&
        activeLessonKeyRef.current === requestLessonKey
      ) {
        setProgressErrorState({
          lessonKey: requestLessonKey,
          message,
        });
      }
    },
    []
  );

  const clearProgressErrorForActiveLesson = useCallback(
    (requestLessonKey: string) => {
      if (
        isMountedRef.current &&
        activeLessonKeyRef.current === requestLessonKey
      ) {
        setProgressErrorState({
          lessonKey: requestLessonKey,
          message: "",
        });
      }
    },
    []
  );

  const savePlaybackPosition = useCallback(
    async (reason: PositionSaveReason) => {
      const requestLessonKey = activeLessonKeyRef.current;
      const positionSeconds = Math.floor(currentPositionSecondsRef.current);
      const shouldUpdateLastViewedAt = reason === "pause";

      if (
        progressStatusRef.current === "COMPLETED" ||
        !Number.isFinite(positionSeconds) ||
        positionSeconds < 0 ||
        (positionSeconds <= lastSavedPositionSecondsRef.current &&
          !shouldUpdateLastViewedAt)
      ) {
        return true;
      }

      if (
        inFlightPositionSavesRef.current.has(positionSeconds) ||
        (reason === "checkpoint" && inFlightPositionSavesRef.current.size > 0)
      ) {
        return true;
      }

      inFlightPositionSavesRef.current.add(positionSeconds);

      try {
        const response = await fetch(
          `/api/student/courses/${courseSlug}/lessons/${lessonSlug}/progress`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "SAVE_POSITION",
              positionSeconds,
              interaction: shouldUpdateLastViewedAt ? "pause" : "checkpoint",
            }),
            keepalive: reason === "unmount",
          }
        );
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            typeof payload?.error === "string"
              ? payload.error
              : "Playback position could not be saved."
          );
        }

        const savedPosition = payload?.progress?.lastPositionSeconds;

        if (
          typeof savedPosition === "number" &&
          activeLessonKeyRef.current === requestLessonKey
        ) {
          lastSavedPositionSecondsRef.current =
            payload?.progress?.status === "COMPLETED"
              ? 0
              : Math.max(lastSavedPositionSecondsRef.current, savedPosition);
          clearProgressErrorForActiveLesson(requestLessonKey);
        }

        return true;
      } catch (error) {
        setProgressErrorForActiveLesson(
          requestLessonKey,
          error instanceof Error
            ? error.message
            : "Playback position could not be saved."
        );

        return false;
      } finally {
        inFlightPositionSavesRef.current.delete(positionSeconds);
      }
    },
    [
      clearProgressErrorForActiveLesson,
      courseSlug,
      lessonSlug,
      setProgressErrorForActiveLesson,
    ]
  );

  const saveProgress = useCallback(
    async (status: Exclude<LessonProgressStatus, "NOT_STARTED">) => {
      const requestLessonKey = activeLessonKeyRef.current;

      if (isMountedRef.current) {
        setIsSavingProgress(true);
        setProgressErrorState({
          lessonKey: requestLessonKey,
          message: "",
        });
      }

      try {
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

        const nextStatus = payload?.progress?.status;
        const nextPosition = payload?.progress?.lastPositionSeconds;

        if (
          isMountedRef.current &&
          activeLessonKeyRef.current === requestLessonKey &&
          (nextStatus === "IN_PROGRESS" || nextStatus === "COMPLETED")
        ) {
          progressStatusRef.current = nextStatus;
          onProgressStatusChange(nextStatus);

          if (typeof nextPosition === "number") {
            lastSavedPositionSecondsRef.current =
              nextStatus === "COMPLETED" ? 0 : nextPosition;
          }

          if (nextStatus === "COMPLETED") {
            currentPositionSecondsRef.current = 0;
            setResumeMessageState({
              lessonKey: requestLessonKey,
              message: "",
            });
          }
        }
      } catch (error) {
        setProgressErrorForActiveLesson(
          requestLessonKey,
          error instanceof Error ? error.message : "Progress could not be saved."
        );
      } finally {
        if (
          isMountedRef.current &&
          activeLessonKeyRef.current === requestLessonKey
        ) {
          setIsSavingProgress(false);
        }
      }
    },
    [
      courseSlug,
      lessonSlug,
      onProgressStatusChange,
      setProgressErrorForActiveLesson,
    ]
  );

  useEffect(() => {
    if (!containerElement || !src) {
      return;
    }

    let isActive = true;
    let checkpointInterval: ReturnType<typeof setInterval> | null = null;
    let resumeMessageTimeout: ReturnType<typeof setTimeout> | null = null;
    activeLessonKeyRef.current = lessonKey;
    containerElement.replaceChildren();
    currentPositionSecondsRef.current = 0;
    lastSavedPositionSecondsRef.current = Math.max(0, savedPositionSeconds);
    inFlightPositionSavesRef.current.clear();
    hasPlaybackStartedRef.current = false;
    hasMarkedStartedRef.current = progressStatusRef.current !== "NOT_STARTED";
    onDurationChange("—");

    const clearCheckpointInterval = () => {
      if (checkpointInterval) {
        clearInterval(checkpointInterval);
        checkpointInterval = null;
      }
    };
    const startCheckpointInterval = () => {
      clearCheckpointInterval();
      checkpointInterval = setInterval(() => {
        if (isActive) {
          void savePlaybackPosition("checkpoint");
        }
      }, POSITION_SAVE_INTERVAL_MS);
    };
    const clearResumeMessageTimeout = () => {
      if (resumeMessageTimeout) {
        clearTimeout(resumeMessageTimeout);
        resumeMessageTimeout = null;
      }
    };

    const player = new Player(containerElement, {
      url: src as VimeoUrl,
    });
    playerRef.current = player;
    const handleTimeUpdate = ({ seconds }: { seconds: number }) => {
      if (Number.isFinite(seconds)) {
        currentPositionSecondsRef.current = Math.floor(seconds);
      }
    };
    const handlePlay = () => {
      hasPlaybackStartedRef.current = true;
      setResumeMessageState({
        lessonKey,
        message: "",
      });
      startCheckpointInterval();

      if (
        hasMarkedStartedRef.current ||
        progressStatusRef.current !== "NOT_STARTED"
      ) {
        return;
      }

      hasMarkedStartedRef.current = true;
      void saveProgress("IN_PROGRESS");
    };
    const handlePause = () => {
      clearCheckpointInterval();

      if (
        isApplyingResumeRef.current ||
        !hasPlaybackStartedRef.current ||
        progressStatusRef.current === "COMPLETED"
      ) {
        return;
      }

      void savePlaybackPosition("pause");
    };
    const handleEnded = () => {
      clearCheckpointInterval();

      if (progressStatusRef.current === "COMPLETED") {
        return;
      }

      void (async () => {
        await savePlaybackPosition("ended");
        await saveProgress("COMPLETED");
      })();
    };

    void player
      .ready()
      .then(() => {
        const iframe = containerElement.querySelector("iframe");

        iframe?.setAttribute("title", `Vimeo video for ${title}`);
        iframe?.setAttribute(
          "allow",
          "autoplay; fullscreen; picture-in-picture"
        );
        iframe?.setAttribute("allowfullscreen", "");
        iframe?.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");

        return player.getDuration();
      })
      .then(async (durationSeconds) => {
        if (!isActive) {
          return;
        }

        onDurationChange(formatDuration(durationSeconds));

        if (
          progressStatusRef.current !== "IN_PROGRESS" ||
          savedPositionSeconds < MIN_RESUME_POSITION_SECONDS ||
          durationSeconds - savedPositionSeconds <= MIN_SECONDS_FROM_END_TO_RESUME
        ) {
          return;
        }

        try {
          isApplyingResumeRef.current = true;
          await player.setCurrentTime(savedPositionSeconds);

          if (isActive) {
            setResumeMessageState({
              lessonKey,
              message: `Resuming from ${formatTimestamp(savedPositionSeconds)}`,
            });
            clearResumeMessageTimeout();
            resumeMessageTimeout = setTimeout(() => {
              if (isActive) {
                setResumeMessageState({
                  lessonKey,
                  message: "",
                });
              }
            }, 5000);
          }
        } catch {
          // Leave playback at 0:00 if Vimeo rejects the resume seek.
        } finally {
          isApplyingResumeRef.current = false;
        }
      })
      .catch(() => undefined);

    player.on("timeupdate", handleTimeUpdate);
    player.on("play", handlePlay);
    player.on("pause", handlePause);
    player.on("ended", handleEnded);

    return () => {
      isActive = false;
      clearCheckpointInterval();
      clearResumeMessageTimeout();
      void savePlaybackPosition("unmount");
      player.off("timeupdate", handleTimeUpdate);
      player.off("play", handlePlay);
      player.off("pause", handlePause);
      player.off("ended", handleEnded);
      playerRef.current = null;
      void player.destroy().catch(() => undefined);
    };
  }, [
    containerElement,
    lessonKey,
    onDurationChange,
    savedPositionSeconds,
    savePlaybackPosition,
    saveProgress,
    src,
    title,
  ]);

  return (
    <div className="space-y-3">
      <div className="aspect-video overflow-hidden border border-black bg-black">
        <div
          ref={setPlayerContainer}
          className="h-full w-full [&_iframe]:h-full [&_iframe]:w-full"
        />
      </div>

      {resumeMessage && <p className="text-sm text-gray-600">{resumeMessage}</p>}
      {progressError && <p className="text-sm text-red-700">{progressError}</p>}
      {isSavingProgress && (
        <p className="text-sm text-gray-600">Saving progress...</p>
      )}
    </div>
  );
}
