import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CHAPTER_2_WORKBOOK_FILE } from "../src/lib/course-resources";
import { escapeHtml, parseWorkbook, renderWorkbook } from "./workbook-layout";

// Builds the printable Chapter 2 workbook PDF from
// prisma/content/foundation-chapter-2/workbook.md (a word-for-word export of
// the "Artisan Academy — Chapter 2 Workbook" Google Doc).
//
// The wording is never changed. The layout adds what a printed workbook
// needs: writing space after each prompt, a new page per lesson, and footers.
//
// Usage (local only; needs Google Chrome):
//   npx tsx scripts/build-chapter-2-workbook.ts
// Set CHROME_PATH to use a different Chrome or Chromium binary.

const SOURCE = join(__dirname, "..", "prisma", "content", "foundation-chapter-2", "workbook.md");
const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function printToPdf(html: string, footerTitle: string) {
  const profile = mkdtempSync(join(tmpdir(), "workbook-chrome-"));
  const htmlPath = join(profile, "workbook.html");
  writeFileSync(htmlPath, html);

  const port = 9400 + Math.floor(Math.random() * 400);
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    let pageUrl: string | undefined;

    for (let attempt = 0; attempt < 50 && !pageUrl; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const targets = (await fetch(`http://127.0.0.1:${port}/json/list`)
        .then((response) => response.json())
        .catch(() => [])) as { type: string; webSocketDebuggerUrl: string }[];
      pageUrl = targets.find((target) => target.type === "page")?.webSocketDebuggerUrl;
    }

    if (!pageUrl) {
      throw new Error(`Could not start Chrome at ${CHROME}`);
    }

    const socket = new WebSocket(pageUrl);
    await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));

    let nextId = 0;
    const pending = new Map<number, (message: { result?: unknown; error?: unknown }) => void>();
    const events: ((method: string) => void)[] = [];

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));

      if (message.id && pending.has(message.id)) {
        pending.get(message.id)?.(message);
        pending.delete(message.id);
      } else if (message.method) {
        events.forEach((listener) => listener(message.method));
      }
    });

    const send = <T>(method: string, params: Record<string, unknown> = {}) =>
      new Promise<T>((resolve, reject) => {
        const id = ++nextId;
        pending.set(id, (message) =>
          message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result as T)
        );
        socket.send(JSON.stringify({ id, method, params }));
      });

    await send("Page.enable");
    const loaded = new Promise<void>((resolve) =>
      events.push((method) => method === "Page.loadEventFired" && resolve())
    );
    await send("Page.navigate", { url: `file://${htmlPath}` });
    await loaded;

    const footer = `<div style="width:100%;font-family:Georgia,serif;font-size:8px;color:#666;padding:0 0.75in;display:flex;justify-content:space-between;">
      <span>${escapeHtml(footerTitle)}</span>
      <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
    </div>`;
    const { data } = await send<{ data: string }>("Page.printToPDF", {
      preferCSSPageSize: true,
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: footer,
    });

    socket.close();
    return Buffer.from(data, "base64");
  } finally {
    const exited = new Promise((resolve) => chrome.once("exit", resolve));
    chrome.kill();
    await exited;
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}

async function main() {
  const workbook = parseWorkbook(readFileSync(SOURCE, "utf8"));
  const pdf = await printToPdf(renderWorkbook(workbook), workbook.title);

  writeFileSync(CHAPTER_2_WORKBOOK_FILE, pdf);
  console.log(`Wrote ${CHAPTER_2_WORKBOOK_FILE} (${pdf.length} bytes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
