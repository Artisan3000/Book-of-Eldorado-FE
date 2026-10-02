import assert from "node:assert/strict";
import test from "node:test";
import {
  chapter2Lessons,
  chapter2Module,
  loadChapter2Lessons,
} from "./foundation-chapter-2";

test("Chapter 2 defines the ten approved lessons in order", () => {
  assert.deepEqual(
    chapter2Lessons.map((lesson) => `2.${lesson.sortOrder} ${lesson.title}`),
    [
      "2.1 The Artisan Standard & Client Consultation",
      "2.2 Buzz Cut & Classic Clipper Foundation",
      "2.3 Classic Taper & Low Taper Family",
      "2.4 The Skin-Fade Family",
      "2.5 Clipper-and-Scissor Classic",
      "2.6 Texture, Volume & Modern Styling",
      "2.7 Scissor-Only Haircutting",
      "2.8 Beard Design & Hair-and-Beard Coordination",
      "2.9 Children’s Services & Advanced Elective Work",
      "2.10 Capstone, Product Examination & Client Book",
    ]
  );
});

test("every Chapter 2 content file loads with a reading-time duration", () => {
  const lessons = loadChapter2Lessons();

  assert.equal(lessons.length, 10);

  for (const lesson of lessons) {
    assert.match(lesson.duration, /^\d+ min read$/);
  }
});

test("the workbook is a chapter resource, not a Google Docs link", () => {
  assert.ok(chapter2Module.resourceTitle);
  assert.ok(
    chapter2Module.resourceUrl === null || chapter2Module.resourceUrl.startsWith("/")
  );
});
