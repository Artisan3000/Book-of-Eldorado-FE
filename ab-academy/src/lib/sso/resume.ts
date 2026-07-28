import type { AuthorizationRequest } from "./request";
import { signatureMatches, signValue } from "./crypto";

export const SSO_RESUME_COOKIE = "academy_sso_resume";
export const SSO_RESUME_MAX_AGE_SECONDS = 300;

type ResumePayload = AuthorizationRequest & {
  expiresAt: number;
};

export function createResumeToken(
  request: AuthorizationRequest,
  secret: string,
  now = Date.now()
) {
  const payload = Buffer.from(
    JSON.stringify({
      ...request,
      expiresAt: now + SSO_RESUME_MAX_AGE_SECONDS * 1000,
    } satisfies ResumePayload),
    "utf8"
  ).toString("base64url");
  return `${payload}.${signValue(payload, secret)}`;
}

export function readResumeToken(
  token: string,
  secret: string,
  now = Date.now()
): AuthorizationRequest | null {
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  if (!signatureMatches(payload, signature, secret)) return null;

  try {
    const value = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as Partial<ResumePayload>;

    if (
      typeof value.clientId !== "string" ||
      typeof value.redirectUri !== "string" ||
      typeof value.state !== "string" ||
      typeof value.codeChallenge !== "string" ||
      typeof value.expiresAt !== "number" ||
      value.expiresAt <= now
    ) {
      return null;
    }

    return {
      clientId: value.clientId,
      redirectUri: value.redirectUri,
      state: value.state,
      codeChallenge: value.codeChallenge,
    };
  } catch {
    return null;
  }
}
