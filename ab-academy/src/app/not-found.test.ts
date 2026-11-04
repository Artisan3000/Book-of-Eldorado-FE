import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

test("Academy not-found route includes accessible recovery navigation", () => {
  const source = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "not-found.tsx"),
    "utf8",
  );

  assert.match(source, /404 — This page doesn’t exist/);
  assert.match(source, /aria-labelledby="not-found-title"/);
  assert.match(source, /href="\/"/);
  assert.match(source, /href="\/login"/);
});
