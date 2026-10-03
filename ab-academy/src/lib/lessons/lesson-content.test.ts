import assert from "node:assert/strict";
import test from "node:test";
import {
  countMarkdownWords,
  getLessonContentKind,
  getReadingTimeLabel,
  getSafeResourceHref,
  isPlaceholderLessonBody,
} from "./lesson-content";

const vimeoUrl = "https://player.vimeo.com/video/1208793359";

test("a mapped Vimeo video always takes precedence over a text body", () => {
  assert.equal(getLessonContentKind({ videoUrl: vimeoUrl, body: null }), "video");
  assert.equal(
    getLessonContentKind({ videoUrl: vimeoUrl, body: "# Also has text" }),
    "video"
  );
});

test("lessons without a video render as text only when the body has content", () => {
  assert.equal(getLessonContentKind({ videoUrl: null, body: "Lesson text" }), "text");
  assert.equal(getLessonContentKind({ videoUrl: null, body: null }), "missing");
  assert.equal(getLessonContentKind({ videoUrl: null, body: "  \n " }), "missing");
  assert.equal(getLessonContentKind({ videoUrl: "", body: "" }), "missing");
  assert.equal(getLessonContentKind({ videoUrl: null }), "missing");
});

test("placeholder and empty manuscript bodies are detected", () => {
  assert.equal(isPlaceholderLessonBody(null), true);
  assert.equal(isPlaceholderLessonBody("   "), true);
  assert.equal(
    isPlaceholderLessonBody("<!-- PLACEHOLDER: Replace this entire file -->"),
    true
  );
  assert.equal(isPlaceholderLessonBody("## Approved lesson text"), false);
});

test("word count ignores Markdown syntax, link targets, and comments", () => {
  assert.equal(
    countMarkdownWords(
      "## Heading here\n\n- **Bold** item\n- [Link text](https://example.com/a/b)\n\n<!-- note to editors -->\n\n| a | b |\n| --- | --- |"
    ),
    8
  );
});

test("reading time rounds up at 200 words per minute", () => {
  const words = (count: number) => Array.from({ length: count }, () => "word").join(" ");

  assert.equal(getReadingTimeLabel(words(1)), "1 min read");
  assert.equal(getReadingTimeLabel(words(200)), "1 min read");
  assert.equal(getReadingTimeLabel(words(201)), "2 min read");
  assert.equal(getReadingTimeLabel(words(1600)), "8 min read");
  assert.equal(getReadingTimeLabel(""), "1 min read");
});

test("resource links allow in-app routes and https only", () => {
  assert.equal(
    getSafeResourceHref("/student/resources/chapter-2-workbook"),
    "/student/resources/chapter-2-workbook"
  );
  assert.equal(
    getSafeResourceHref("https://example.com/workbook.pdf"),
    "https://example.com/workbook.pdf"
  );
  assert.equal(getSafeResourceHref(null), null);
  assert.equal(getSafeResourceHref(""), null);
  assert.equal(getSafeResourceHref("//evil.example.com"), null);
  assert.equal(getSafeResourceHref("http://example.com/workbook.pdf"), null);
  assert.equal(getSafeResourceHref("javascript:alert(1)"), null);
});
