import { isIP } from "node:net";
import { authJson } from "./responses";

const PRODUCTION_ORIGIN = "https://academy.artisanbarber.com";
const MAX_IP_LENGTH = 64;

function configuredOrigins() {
  const origins = new Set([PRODUCTION_ORIGIN]);
  const configured = process.env.ACADEMY_ALLOWED_ORIGINS;

  for (const origin of configured?.split(",") ?? []) {
    const normalized = origin.trim().replace(/\/$/, "");
    if (normalized) origins.add(normalized);
  }

  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://localhost:3001");
    origins.add("http://127.0.0.1:3000");
    origins.add("http://127.0.0.1:3001");
  }

  return origins;
}

export function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isJsonRequest(request: Request) {
  const contentType = request.headers.get("content-type");
  if (!contentType) return false;

  return contentType.split(";", 1)[0].trim().toLowerCase() === "application/json";
}

export function isTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return false;

  try {
    const parsed = new URL(origin);

    if (
      parsed.username ||
      parsed.password ||
      parsed.pathname !== "/" ||
      parsed.search ||
      parsed.hash ||
      origin !== parsed.origin
    ) {
      return false;
    }

    return configuredOrigins().has(parsed.origin);
  } catch {
    return false;
  }
}

export function requireBrowserMutation(
  request: Request,
  { json = true }: { json?: boolean } = {}
) {
  if (!isTrustedOrigin(request)) {
    return authJson({ error: "Request origin is not allowed." }, { status: 403 });
  }

  if (json && !isJsonRequest(request)) {
    return authJson(
      { error: "Content-Type must be application/json." },
      { status: 415 }
    );
  }

  return null;
}

export function getClientIp(request: Request) {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    return "development";
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const candidate = forwarded?.split(",", 1)[0].trim() ?? "";

  if (
    !candidate ||
    candidate.length > MAX_IP_LENGTH ||
    /\s/.test(candidate) ||
    isIP(candidate) === 0
  ) {
    return "unknown";
  }

  return candidate;
}
