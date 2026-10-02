import assert from "node:assert/strict";
import test from "node:test";
import {
  chapter2Lessons,
  chapter2Module,
  getChapter2ModuleUpdate,
  getExistingChapter2LessonSet,
  legacyChapter2,
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

test("Chapter 2 lesson bodies are real manuscript content without a title heading", () => {
  for (const lesson of loadChapter2Lessons()) {
    assert.equal(lesson.isPlaceholder, false, lesson.file);
    assert.doesNotMatch(lesson.body, /^# /m, lesson.file);
    assert.ok(!lesson.body.includes(lesson.title), lesson.file);
  }
});

test("web lessons stay read-only: no assignment lists, a closing workbook handoff", () => {
  for (const lesson of loadChapter2Lessons()) {
    assert.doesNotMatch(lesson.body, /^## Practical assignment$/m, lesson.file);
    assert.match(lesson.body, /^## Workbook handoff\n\n(?:(?!^## ).)+$/ms, lesson.file);
  }
});

test("the workbook is a chapter resource, not a Google Docs link", () => {
  assert.ok(chapter2Module.resourceTitle);
  assert.ok(
    chapter2Module.resourceUrl === null || chapter2Module.resourceUrl.startsWith("/")
  );
});

test("the import updates only the description and resource fields, never the title", () => {
  const legacyModule = {
    title: "Business & Branding Essentials",
    description: "Understand how the shop makes money.",
    resourceTitle: null,
    resourceUrl: null,
  };

  assert.deepEqual(getChapter2ModuleUpdate(legacyModule), {
    description: chapter2Module.description,
    resourceTitle: chapter2Module.resourceTitle,
    resourceUrl: chapter2Module.resourceUrl,
  });
  assert.ok(!("title" in chapter2Module));
  assert.deepEqual(getChapter2ModuleUpdate({ ...legacyModule, ...chapter2Module }), {});
});

test("the import only replaces the obsolete or the approved Chapter 2 lessons", () => {
  assert.equal(getExistingChapter2LessonSet(legacyChapter2.lessonTitles), "legacy");
  assert.equal(
    getExistingChapter2LessonSet(chapter2Lessons.map((lesson) => lesson.title)),
    "current"
  );
  assert.equal(
    getExistingChapter2LessonSet(legacyChapter2.lessonTitles.slice(1)),
    "unexpected"
  );
});
