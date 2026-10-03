import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { chapter2Module } from "../../prisma/foundation-chapter-2";
import {
  CHAPTER_2_WORKBOOK_FILE,
  CHAPTER_2_WORKBOOK_HREF,
  findCourseResourceFile,
  moduleLinksToResource,
} from "./course-resources";
import { getSafeResourceHref, isPdfHref } from "./lessons/lesson-content";

test("the Chapter 2 workbook links to the logged-in PDF route, not public/ or Google Docs", () => {
  assert.equal(CHAPTER_2_WORKBOOK_HREF, "/student/courses/foundation/resources/chapter-2-workbook.pdf");
  assert.equal(chapter2Module.resourceUrl, CHAPTER_2_WORKBOOK_HREF);
  assert.equal(getSafeResourceHref(chapter2Module.resourceUrl), CHAPTER_2_WORKBOOK_HREF);
  assert.ok(existsSync(CHAPTER_2_WORKBOOK_FILE), "run scripts/build-chapter-2-workbook.ts");
  assert.ok(!CHAPTER_2_WORKBOOK_FILE.includes("/public/"));
});

test("only registered files in the matching course can be served", () => {
  assert.ok(findCourseResourceFile("foundation", "chapter-2-workbook.pdf"));
  assert.equal(findCourseResourceFile("refinement", "chapter-2-workbook.pdf"), null);
  assert.equal(findCourseResourceFile("foundation", "../.env"), null);
  assert.equal(findCourseResourceFile("foundation", "chapter-3-workbook.pdf"), null);
});

test("a file is downloadable only while a visible module links to it", () => {
  assert.equal(
    moduleLinksToResource([{ resourceUrl: CHAPTER_2_WORKBOOK_HREF }], "foundation", "chapter-2-workbook.pdf"),
    true
  );
  assert.equal(
    moduleLinksToResource([{ resourceUrl: null }], "foundation", "chapter-2-workbook.pdf"),
    false
  );
});

test("PDF resource links are labelled as PDFs", () => {
  assert.equal(isPdfHref(CHAPTER_2_WORKBOOK_HREF), true);
  assert.equal(isPdfHref("/student/courses/foundation/resources/notes.pdf?v=2"), true);
  assert.equal(isPdfHref("https://example.com/guide"), false);
});
