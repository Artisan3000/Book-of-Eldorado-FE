// A 2px hairline across the top of the viewport showing how far the reader is
// through the lesson body. Reading position only: no track, no completion
// meaning, and hidden from assistive tech because it changes on every scroll.
// It follows the scroll directly, with no transition.
export default function ReadingPositionEdge({ progress }: { progress: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5">
      <div
        className="h-full origin-left bg-[var(--accent-burgundy)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
