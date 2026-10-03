import assert from "node:assert/strict";
import test from "node:test";
import {
  getRemainingReadingMinutes,
  measureReadingPosition,
  parseReadingMinutes,
  shouldAutoCompleteReading,
} from "./reading-position";

const viewportHeight = 800;

test("reading position runs from 0 to 1 as the body scrolls through the viewport", () => {
  assert.deepEqual(measureReadingPosition({ top: 800, height: 2000 }, viewportHeight), {
    progress: 0,
    reachedEnd: false,
  });
  assert.deepEqual(measureReadingPosition({ top: -200, height: 2000 }, viewportHeight), {
    progress: 0.5,
    reachedEnd: false,
  });
  assert.deepEqual(measureReadingPosition({ top: -1200, height: 2000 }, viewportHeight), {
    progress: 1,
    reachedEnd: true,
  });
});

test("the end counts as reached within a few pixels of the viewport bottom", () => {
  assert.equal(measureReadingPosition({ top: -1190, height: 2000 }, viewportHeight).reachedEnd, false);
  assert.equal(measureReadingPosition({ top: -1195, height: 2000 }, viewportHeight).reachedEnd, true);
});

test("an unmeasured body never reports reading progress", () => {
  assert.deepEqual(measureReadingPosition({ top: 0, height: 0 }, viewportHeight), {
    progress: 0,
    reachedEnd: false,
  });
});

const scrolledToEnd = {
  reachedEnd: true,
  endWasBelowViewport: true,
  isScroll: true,
  alreadyCompletedOrPending: false,
};

test("scrolling the end of the body into view completes reading", () => {
  assert.equal(shouldAutoCompleteReading(scrolledToEnd), true);
});

test("a short lesson that fits on screen when it opens never auto-completes", () => {
  assert.equal(shouldAutoCompleteReading({ ...scrolledToEnd, endWasBelowViewport: false }), false);
  assert.equal(shouldAutoCompleteReading({ ...scrolledToEnd, isScroll: false }), false);
});

test("reading completion is sent at most once", () => {
  assert.equal(
    shouldAutoCompleteReading({ ...scrolledToEnd, alreadyCompletedOrPending: true }),
    false
  );
});

test("not reaching the end never completes", () => {
  assert.equal(shouldAutoCompleteReading({ ...scrolledToEnd, reachedEnd: false }), false);
});

test("reading minutes come from the stored reading-time label", () => {
  assert.equal(parseReadingMinutes("3 min read"), 3);
  assert.equal(parseReadingMinutes("12 min read"), 12);
  assert.equal(parseReadingMinutes("8-10 min"), null);
  assert.equal(parseReadingMinutes(null), null);
});

test("time left counts down in whole minutes and disappears at the end", () => {
  const at = (progress: number, reachedEnd = false) =>
    getRemainingReadingMinutes(3, { progress, reachedEnd });

  assert.equal(at(0), null);
  assert.equal(at(0.2), null);
  assert.equal(at(0.4), 2);
  assert.equal(at(0.7), 1);
  assert.equal(at(0.99), 1);
  assert.equal(at(1, true), null);
  assert.equal(getRemainingReadingMinutes(null, { progress: 0.5, reachedEnd: false }), null);
});
