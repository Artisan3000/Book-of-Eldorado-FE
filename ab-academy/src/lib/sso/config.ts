import "server-only";

import { timingSafeEqual } from "node:crypto";

const DEFAULT_CLIENT_ID = "artisan-employee-portal";
const DEFAULT_PRODUCTION_REDIRECT =
  "https://www.artisanbarber.com/api/auth/callback/academy";
const DEFAULT_LOCAL_REDIRECT =
  "http://localhost:3000/api/auth/callback/academy";

export type EnabledSsoConfig = {
  enabled: true;
  clientId: string;
  clientSecret: string;
  stateSecret: string;
  redirectUris: ReadonlySet<string>;
  codeTtlSeconds: number;
};

export type SsoConfig = { enabled: false } | EnabledSsoConfig;

function requiredSecret(name: string) {
  const value = process.env[name] ?? "";
  if (Buffer.byteLength(value, "utf8") < 32) {
    throw new Error(`${name} must contain at least 32 bytes.`);
  }
  return value;
}

function requiredValue(name: string, fallback?: string) {
  const value = (process.env[name] ?? fallback ?? "").trim();
  if (!value) throw new Error(`${name} is required when SSO is enabled.`);
  return value;
}

function registeredRedirect(value: string, allowLocalHttp: boolean) {
  const parsed = new URL(value);
  const isLocal =
    parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";

  if (
    parsed.username ||
    parsed.password ||
    parsed.hash ||
    parsed.search ||
    (parsed.protocol !== "https:" &&
      !(allowLocalHttp && isLocal && parsed.protocol === "http:")) ||
    parsed.toString() !== value
  ) {
    throw new Error(`Invalid registered SSO redirect URI: ${value}`);
  }

  return value;
}

export function getSsoConfig(): SsoConfig {
  if (process.env.ARTISAN_SSO_ENABLED !== "true") return { enabled: false };

  const deploymentEnvironment =
    process.env.VERCEL_ENV ??
    (process.env.NODE_ENV === "production" ? "production" : "development");
  let redirectUri: string;

  if (deploymentEnvironment === "preview") {
    redirectUri = registeredRedirect(
      requiredValue("ARTISAN_SSO_PREVIEW_REDIRECT_URI"),
      false
    );
  } else if (deploymentEnvironment === "production") {
    redirectUri = registeredRedirect(
      requiredValue(
        "ARTISAN_SSO_PRODUCTION_REDIRECT_URI",
        DEFAULT_PRODUCTION_REDIRECT
      ),
      false
    );
  } else {
    redirectUri =
      registeredRedirect(
        requiredValue("ARTISAN_SSO_LOCAL_REDIRECT_URI", DEFAULT_LOCAL_REDIRECT),
        true
      );
  }

  const ttl = Number.parseInt(
    process.env.ARTISAN_SSO_CODE_TTL_SECONDS ?? "120",
    10
  );

  return {
    enabled: true,
    clientId: requiredValue("ARTISAN_SSO_CLIENT_ID", DEFAULT_CLIENT_ID),
    clientSecret: requiredSecret("ARTISAN_SSO_CLIENT_SECRET"),
    stateSecret: requiredSecret("ARTISAN_SSO_STATE_SECRET"),
    redirectUris: new Set([redirectUri]),
    codeTtlSeconds: Number.isFinite(ttl) ? Math.min(300, Math.max(30, ttl)) : 120,
  };
}

export function secretMatches(candidate: string, expected: string) {
  const candidateBuffer = Buffer.from(candidate, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return (
    candidateBuffer.length === expectedBuffer.length &&
    timingSafeEqual(candidateBuffer, expectedBuffer)
  );
}
