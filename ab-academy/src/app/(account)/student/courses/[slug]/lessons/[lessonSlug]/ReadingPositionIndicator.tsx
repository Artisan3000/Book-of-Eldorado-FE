// Reading position only, with no completion meaning: a 2px hairline across the
// top of the viewport, and while the reader is inside the body, a small
// "N min left" tag just under its right end. Both follow the scroll with no
// transition and are hidden from assistive tech, because they change on every
// scroll; the stored reading time in the lesson details stays readable.
export default function ReadingPositionIndicator({
  progress,
  remainingMinutes,
}: {
  progress: number;
  remainingMinutes: number | null;
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="h-0.5">
        <div
          className="h-full origin-left bg-[var(--accent-burgundy)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      {remainingMinutes !== null && (
        <p className="page-gutter flex justify-end">
          <span className="bg-[var(--background)] px-1.5 py-0.5 text-[11px] leading-4 tabular-nums text-[var(--accent-burgundy)]">
            {remainingMinutes} min left
          </span>
        </p>
      )}
    </div>
  );
}
