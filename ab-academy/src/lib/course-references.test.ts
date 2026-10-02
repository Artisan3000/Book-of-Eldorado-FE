import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  courseReferences,
  findPublishedCourseReference,
  getModuleReferences,
} from "./course-references";
import { isPlaceholderLessonBody } from "./lessons/lesson-content";

const CORE_PRODUCTS = [
  "All-Purpose Pomade",
  "Texturizing Paste",
  "Clay Pomade",
  "40 Proof Sea Salt Spray",
  "30 Proof Styling Cream",
  "Advanced Volumizing Foam",
  "Hair Pomade",
  "Equilibrium Shampoo",
  "Everyday Conditioner",
  "Beard Balm",
];

test("published references have approved, apprentice-neutral content", () => {
  for (const reference of courseReferences.filter((candidate) => candidate.published)) {
    const body = readFileSync(reference.file, "utf8");

    assert.equal(isPlaceholderLessonBody(body), false, reference.slug);
    assert.doesNotMatch(body, /\bJuan\b/, reference.slug);
    assert.doesNotMatch(body, /^# /m, reference.slug);
  }
});

test("draft references stay hidden from lists and their route", () => {
  for (const reference of courseReferences.filter((candidate) => !candidate.published)) {
    assert.equal(findPublishedCourseReference(reference.courseSlug, reference.slug), null);
    assert.ok(
      !getModuleReferences(reference.courseSlug, reference.moduleSortOrder).some(
        (listed) => listed.slug === reference.slug
      )
    );
  }
});

test("the Core Product Guide belongs to Chapter 2 and covers the ten core products", () => {
  const guide = findPublishedCourseReference("foundation", "core-product-guide");

  assert.ok(guide);
  assert.equal(guide.moduleSortOrder, 20);

  const body = readFileSync(guide.file, "utf8");
  const headings = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1]);

  assert.deepEqual(headings, CORE_PRODUCTS);
  assert.equal((body.match(/^\*\*Client-friendly explanation:\*\* /gm) ?? []).length, 10);
});

test("the Client-Building Method belongs to Chapter 1", () => {
  const method = courseReferences.find((reference) => reference.slug === "client-building-method");

  assert.equal(method?.moduleSortOrder, 10);
});

test("references live under /reference, apart from lesson URLs", () => {
  assert.deepEqual(
    getModuleReferences("foundation", 20).map((reference) => reference.href),
    ["/student/courses/foundation/reference/core-product-guide"]
  );
});
