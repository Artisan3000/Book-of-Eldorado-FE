import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

const PKCE_VERIFIER = /^[A-Za-z0-9\-._~]{43,128}$/;
const PKCE_CHALLENGE = /^[A-Za-z0-9_-]{43}$/;

export function isValidPkceVerifier(value: unknown): value is string {
  return typeof value === "string" && PKCE_VERIFIER.test(value);
}

export function isValidPkceChallenge(value: unknown): value is string {
  return typeof value === "string" && PKCE_CHALLENGE.test(value);
}

export function createPkceChallenge(verifier: string) {
  return createHash("sha256").update(verifier, "ascii").digest("base64url");
}

export function generateAuthorizationCode() {
  return randomBytes(32).toString("base64url");
}

export function hashAuthorizationCode(code: string) {
  return createHash("sha256").update(code, "ascii").digest("hex");
}

export function signValue(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function signatureMatches(
  value: string,
  signature: string,
  secret: string
) {
  const expected = Buffer.from(signValue(value, secret), "ascii");
  const received = Buffer.from(signature, "ascii");
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}
