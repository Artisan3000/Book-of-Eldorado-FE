export type LessonContentKind = "video" | "text" | "missing";

const WORDS_PER_MINUTE = 200;
const PLACEHOLDER_MARKER = "<!-- PLACEHOLDER";

export function hasLessonBody(body: string | null | undefined): body is string {
  return typeof body === "string" && body.trim().length > 0;
}

// A mapped video always wins, so existing Vimeo lessons never reach the text experience.
export function getLessonContentKind({
  videoUrl,
  body,
}: {
  videoUrl: string | null | undefined;
  body?: string | null;
}): LessonContentKind {
  if (videoUrl) {
    return "video";
  }

  if (hasLessonBody(body)) {
    return "text";
  }

  return "missing";
}

export function isPlaceholderLessonBody(body: string | null | undefined) {
  return !hasLessonBody(body) || body.includes(PLACEHOLDER_MARKER);
}

export function countMarkdownWords(markdown: string) {
  const text = markdown
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ");

  return text
    .split(/\s+/)
    .filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
}

export function getReadingTimeLabel(markdown: string) {
  const minutes = Math.max(
    1,
    Math.ceil(countMarkdownWords(markdown) / WORDS_PER_MINUTE)
  );

  return `${minutes} min read`;
}

// Resource links may point at an in-app route (e.g. a future logged-in-only
// workbook download) or an https URL. Anything else is not rendered as a link.
export function getSafeResourceHref(url: string | null | undefined) {
  const value = url?.trim();

  if (!value) {
    return null;
  }

  if (value.startsWith("/")) {
    return value.startsWith("//") || value.startsWith("/\\") ? null : value;
  }

  try {
    const parsed = new URL(value);

    return parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}
