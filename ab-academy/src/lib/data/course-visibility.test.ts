import assert from "node:assert/strict";
import test from "node:test";
import {
  FOUNDATION_CHAPTER_2_TITLE,
  LEGACY_FOUNDATION_CHAPTER_2_TITLE,
  getVisibleCourseModules,
} from "./course-visibility";

const chapter1 = { title: "Client Communication & Retention" };

test("Foundation shows Chapter 1 and the new Chapter 2", () => {
  const modules = [chapter1, { title: FOUNDATION_CHAPTER_2_TITLE }];

  assert.deepEqual(getVisibleCourseModules("foundation", modules), modules);
});

test("the current production Chapter 2 title stays visible", () => {
  const modules = [chapter1, { title: LEGACY_FOUNDATION_CHAPTER_2_TITLE }];

  assert.deepEqual(getVisibleCourseModules("foundation", modules), modules);
});

test("Foundation hides modules that are not allow-listed", () => {
  assert.deepEqual(
    getVisibleCourseModules("foundation", [chapter1, { title: "Unreleased Chapter" }]),
    [chapter1]
  );
});

test("other courses show every module", () => {
  const modules = [{ title: "Advanced Technique" }, { title: "Professional Flow" }];

  assert.deepEqual(getVisibleCourseModules("refinement", modules), modules);
});
