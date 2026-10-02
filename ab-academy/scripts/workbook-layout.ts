// Print layout for the Chapter 2 workbook PDF. Shared by
// scripts/build-chapter-2-workbook.ts and its test.

type Block =
  | { kind: "heading"; level: 1 | 2 | 3; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "line"; text: string };

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function parseWorkbook(markdown: string): { title: string; subtitle: string; blocks: Block[] } {
  const lines = markdown.split("\n").map((line) => line.trim()).filter(Boolean);
  const [title, subtitle, ...rest] = lines;
  const blocks: Block[] = [];

  for (const line of rest) {
    const heading = line.match(/^(#{1,3}) (.+)$/);

    if (heading) {
      blocks.push({ kind: "heading", level: heading[1].length as 1 | 2 | 3, text: heading[2] });
    } else if (line.startsWith("- ")) {
      const last = blocks.at(-1);

      if (last?.kind === "list") {
        last.items.push(line.slice(2));
      } else {
        blocks.push({ kind: "list", items: [line.slice(2)] });
      }
    } else {
      blocks.push({ kind: "line", text: line });
    }
  }

  return { title, subtitle, blocks };
}

// How many ruled lines to leave after a prompt. Lines that introduce a list
// or numbered entries, and plain instructions, get none.
function writingLines(text: string, next: Block | undefined) {
  const isNumberedEntry = /^\d+\. /.test(text);
  const introducesEntries =
    !isNumberedEntry &&
    (next?.kind === "list" || (next?.kind === "line" && /^\d+\. /.test(next.text)));

  if (introducesEntries) {
    return 0;
  }

  if (text.endsWith("?")) {
    return text.length > 60 ? 3 : 2;
  }

  if (text.endsWith(":")) {
    return text.length > 60 ? 3 : 1;
  }

  return 0;
}

export function renderWorkbook({ title, subtitle, blocks }: ReturnType<typeof parseWorkbook>) {
  const body: string[] = [];
  let sectionOpen = false;
  // The introduction shares the cover page; lessons and tools start new pages.
  const firstLessonIndex = blocks.findIndex(
    (block) => block.kind === "heading" && block.level === 1 && block.text.startsWith("Lesson ")
  );
  const closeSection = () => {
    if (sectionOpen) {
      body.push("</section>");
      sectionOpen = false;
    }
  };

  blocks.forEach((block, index) => {
    if (block.kind === "heading") {
      closeSection();
      const tag = `h${block.level}`;
      const newPage = block.level === 1 && index >= firstLessonIndex;
      body.push(`<section class="group level-${block.level}${newPage ? " new-page" : ""}">`);
      sectionOpen = true;
      body.push(`<${tag}>${escapeHtml(block.text)}</${tag}>`);
      return;
    }

    if (block.kind === "list") {
      body.push(`<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`);
      return;
    }

    const lines = writingLines(block.text, blocks[index + 1]);
    body.push(
      `<div class="line${lines ? " prompt" : ""}"><p>${escapeHtml(block.text)}</p>${'<div class="rule"></div>'.repeat(lines)}</div>`
    );
  });
  closeSection();

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  @page { size: Letter; margin: 0.7in 0.75in 0.85in; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; font-size: 10.5pt; line-height: 1.45; color: #111; margin: 0; }
  .cover { padding-top: 0.9in; margin-bottom: 28pt; }
  .cover .eyebrow { font-size: 9pt; letter-spacing: 0.18em; text-transform: uppercase; color: #555; margin: 0 0 14pt; }
  .cover h1 { font-size: 28pt; line-height: 1.15; margin: 0 0 10pt; }
  .cover .subtitle { font-size: 14pt; color: #333; margin: 0; }
  .cover hr { border: 0; border-top: 1.5pt solid #111; width: 1.2in; margin: 22pt 0 0; }
  .new-page { break-before: page; }
  .group.level-1:not(.new-page) h1 { margin-top: 22pt; }
  h1 { font-size: 17pt; line-height: 1.25; margin: 0 0 12pt; padding-bottom: 6pt; border-bottom: 1pt solid #111; }
  h2 { font-size: 12.5pt; margin: 16pt 0 6pt; break-after: avoid; }
  h3 { font-size: 10.5pt; text-transform: uppercase; letter-spacing: 0.08em; color: #333; margin: 14pt 0 4pt; break-after: avoid; }
  .group.level-3 { break-inside: avoid; }
  p { margin: 0; }
  .line { margin: 0 0 5pt; break-inside: avoid; }
  .prompt p { font-weight: bold; font-size: 9.5pt; }
  .rule { height: 22pt; border-bottom: 0.6pt solid #888; }
  ul { margin: 4pt 0 8pt; padding-left: 16pt; }
  li { margin: 0 0 3pt; }
</style>
</head>
<body>
<div class="cover">
  <p class="eyebrow">Artisan Barber Academy</p>
  <h1>${escapeHtml(title)}</h1>
  <p class="subtitle">${escapeHtml(subtitle)}</p>
  <hr>
</div>
${body.join("\n")}
</body>
</html>`;
}
