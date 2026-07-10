"use client";

import Player from "@vimeo/player";
import { useCallback, useEffect, useRef, useState } from "react";
import type { VimeoUrl } from "@vimeo/player/types/formats";

type LessonProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

type VimeoPlayerProps = {
  playerUrl: string;
  title: string;
  courseSlug: string;
  lessonSlug: string;
  progressStatus: LessonProgressStatus;
  onDurationChange: (durationLabel: string) => void;
  onProgressStatusChange: (progressStatus: LessonProgressStatus) => void;
};

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

export default function VimeoPlayer({
  playerUrl,
  title,
  courseSlug,
  lessonSlug,
  progressStatus,
  onDurationChange,
  onProgressStatusChange,
}: VimeoPlayerProps) {
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(
    null
  );
  const playerRef = useRef<Player | null>(null);
  const hasMarkedStartedRef = useRef(false);
  const progressStatusRef = useRef<LessonProgressStatus>(progressStatus);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [progressError, setProgressError] = useState("");
  const src = getValidatedVimeoPlayerUrl(playerUrl);
  const setPlayerContainer = useCallback((node: HTMLDivElement | null) => {
    setContainerElement(node);
  }, []);

  useEffect(() => {
    progressStatusRef.current = progressStatus;
  }, [progressStatus]);

  const saveProgress = useCallback(
    async (status: Exclude<LessonProgressStatus, "NOT_STARTED">) => {
      setIsSavingProgress(true);
      setProgressError("");

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

        if (nextStatus === "IN_PROGRESS" || nextStatus === "COMPLETED") {
          progressStatusRef.current = nextStatus;
          onProgressStatusChange(nextStatus);
        }
      } catch (error) {
        setProgressError(
          error instanceof Error ? error.message : "Progress could not be saved."
        );
      } finally {
        setIsSavingProgress(false);
      }
    },
    [courseSlug, lessonSlug, onProgressStatusChange]
  );

  useEffect(() => {
    if (!containerElement || !src) {
      return;
    }

    let isActive = true;
    containerElement.replaceChildren();
    hasMarkedStartedRef.current = progressStatusRef.current !== "NOT_STARTED";
    onDurationChange("—");

    const player = new Player(containerElement, {
      url: src as VimeoUrl,
    });
    playerRef.current = player;
    const handlePlay = () => {
      if (
        hasMarkedStartedRef.current ||
        progressStatusRef.current !== "NOT_STARTED"
      ) {
        return;
      }

      hasMarkedStartedRef.current = true;
      void saveProgress("IN_PROGRESS");
    };
    const handleEnded = () => {
      if (progressStatusRef.current === "COMPLETED") {
        return;
      }

      void saveProgress("COMPLETED");
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
      .then((durationSeconds) => {
        if (isActive) {
          onDurationChange(formatDuration(durationSeconds));
        }
      })
      .catch(() => undefined);

    player.on("play", handlePlay);
    player.on("ended", handleEnded);

    return () => {
      isActive = false;
      player.off("play", handlePlay);
      player.off("ended", handleEnded);
      playerRef.current = null;
      void player.destroy().catch(() => undefined);
    };
  }, [containerElement, onDurationChange, saveProgress, src, title]);

  return (
    <div className="space-y-3">
      <div className="aspect-video overflow-hidden border border-black bg-black">
        <div ref={setPlayerContainer} className="h-full w-full [&_iframe]:h-full [&_iframe]:w-full" />
      </div>

      {progressError && <p className="text-sm text-red-700">{progressError}</p>}
      {isSavingProgress && (
        <p className="text-sm text-gray-600">Saving progress...</p>
      )}
    </div>
  );
}
