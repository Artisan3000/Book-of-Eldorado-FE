export function getSafeInternalPath(
  value: unknown,
  fallback: string
) {
  if (typeof value !== "string" || !value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.includes("\\")) return fallback;
  if (/\p{Cc}/u.test(value) || /^\s/.test(value)) return fallback;
  if (/%(?![0-9a-f]{2})/iu.test(value)) return fallback;

  try {
    let decoded = value;

    for (let pass = 0; pass < 2; pass += 1) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }

    if (
      decoded.startsWith("//") ||
      decoded.includes("\\") ||
      /\p{Cc}/u.test(decoded)
    ) {
      return fallback;
    }

    const base = new URL("https://academy.artisanbarber.com");
    const resolved = new URL(value, base);

    if (resolved.origin !== base.origin) return fallback;

    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return fallback;
  }
}
