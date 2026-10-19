"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ExpandableLessonImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export default function ExpandableLessonImage({
  src,
  alt,
  width,
  height,
}: ExpandableLessonImageProps) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateExpansionAvailability = () => {
      setCanExpand(mediaQuery.matches);
      if (!mediaQuery.matches) {
        setExpanded(false);
      }
    };

    updateExpansionAvailability();
    mediaQuery.addEventListener("change", updateExpansionAvailability);

    return () => {
      mediaQuery.removeEventListener("change", updateExpansionAvailability);
    };
  }, []);

  const isExpanded = canExpand && expanded;
  const label = isExpanded
    ? "Collapse instructional diagram"
    : canExpand
      ? "Expand instructional diagram"
      : "Instructional diagram shown at full available width";

  return (
    <button
      type="button"
      className="lesson-image-trigger"
      data-expanded={isExpanded}
      aria-expanded={isExpanded}
      aria-label={label}
      onClick={() => {
        if (canExpand) {
          setExpanded((current) => !current);
        }
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 70ch"
        className="block h-auto w-full border border-gray-300"
      />
    </button>
  );
}
