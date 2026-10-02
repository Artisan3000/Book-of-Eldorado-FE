import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { parseWorkbook, renderWorkbook } from "./workbook-layout";

const source = readFileSync(
  join(__dirname, "..", "prisma", "content", "foundation-chapter-2", "workbook.md"),
  "utf8"
);

function words(text: string) {
  return text.split(/\s+/).filter(Boolean);
}

test("the printed workbook contains the source wording exactly", () => {
  const html = renderWorkbook(parseWorkbook(source));
  const body = html
    .slice(html.indexOf("<body>"))
    .replace('<p class="eyebrow">Artisan Barber Academy</p>', "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');

  assert.deepEqual(words(body), words(source.replace(/^(#{1,3} |- )/gm, "")));
});

test("the printed workbook leaves writing space after prompts and numbered entries", () => {
  const html = renderWorkbook(parseWorkbook(source));
  const ruleAfter = (text: string) =>
    new RegExp(`<p>${text.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}</p><div class="rule">`).test(html);

  assert.ok(ruleAfter("Client goal:"));
  assert.ok(ruleAfter("1. Name / relationship / best contact method:"));
  assert.ok(ruleAfter("What is the clearest difference between them?"));
  assert.ok(!ruleAfter("Three confirmed supervised model appointments:"));
});
