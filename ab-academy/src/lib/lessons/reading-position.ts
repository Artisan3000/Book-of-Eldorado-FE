// Reading position for text lessons: how far the lesson body has scrolled
// through the viewport. It drives reading auto-completion only. It is not
// lesson completion itself, course progress, or workbook/practical sign-off.

// Small allowance so sub-pixel layouts and mobile browser chrome still count
// as reaching the end.
const END_TOLERANCE_PX = 8;

export type ReadingPosition = {
  // 0 when the body's top is at the bottom of the viewport, 1 once its end is in view.
  progress: number;
  reachedEnd: boolean;
};

export function measureReadingPosition(
  body: { top: number; height: number },
  viewportHeight: number
): ReadingPosition {
  if (body.height <= 0 || viewportHeight <= 0) {
    return { progress: 0, reachedEnd: false };
  }

  const bottom = body.top + body.height;
  const reachedEnd = bottom <= viewportHeight + END_TOLERANCE_PX;
  const progress = reachedEnd
    ? 1
    : Math.min(1, Math.max(0, (viewportHeight - body.top) / body.height));

  return { progress, reachedEnd };
}

// Reading completes only when the reader scrolls the end of the body into
// view. A lesson whose end was already visible when it opened never
// auto-completes (the reader uses "Mark lesson complete" instead), and a
// lesson that is completed or being completed is never sent again.
export function shouldAutoCompleteReading({
  reachedEnd,
  endWasBelowViewport,
  isScroll,
  alreadyCompletedOrPending,
}: {
  reachedEnd: boolean;
  endWasBelowViewport: boolean;
  isScroll: boolean;
  alreadyCompletedOrPending: boolean;
}) {
  return reachedEnd && endWasBelowViewport && isScroll && !alreadyCompletedOrPending;
}
