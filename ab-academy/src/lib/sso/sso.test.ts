import assert from "node:assert/strict";
import test from "node:test";
import type { EnabledSsoConfig } from "./config";
import {
  createPkceChallenge,
  generateAuthorizationCode,
  hashAuthorizationCode,
  isValidPkceChallenge,
  isValidPkceVerifier,
} from "./crypto";
import {
  authorizationRequestUrl,
  parseAuthorizationRequest,
} from "./request";
import { createResumeToken, readResumeToken } from "./resume";

const verifier = "a".repeat(43);
const challenge = createPkceChallenge(verifier);
const request = {
  clientId: "artisan-employee-portal",
  redirectUri: "https://www.artisanbarber.com/api/auth/callback/academy",
  state: "state-value",
  codeChallenge: challenge,
};
const config: EnabledSsoConfig = {
  enabled: true,
  clientId: request.clientId,
  clientSecret: "c".repeat(32),
  stateSecret: "s".repeat(32),
  redirectUris: new Set([request.redirectUri]),
  codeTtlSeconds: 120,
};

test("validates PKCE S256 inputs", () => {
  assert.equal(isValidPkceVerifier(verifier), true);
  assert.equal(isValidPkceVerifier("short"), false);
  assert.equal(isValidPkceChallenge(challenge), true);
  assert.equal(isValidPkceChallenge(`${challenge}=`), false);
});

test("generates high-entropy codes and stores only hashes", () => {
  const code = generateAuthorizationCode();
  assert.match(code, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(hashAuthorizationCode(code).length, 64);
  assert.equal(hashAuthorizationCode(code).includes(code), false);
});

test("accepts only exact registered authorization requests", () => {
  const path = authorizationRequestUrl(request);
  assert.deepEqual(
    parseAuthorizationRequest(new URL(path, "https://academy.artisanbarber.com"), config),
    request
  );

  const lookalike = new URL(path, "https://academy.artisanbarber.com");
  lookalike.searchParams.set(
    "redirect_uri",
    "https://www.artisanbarber.com.evil.test/api/auth/callback/academy"
  );
  assert.equal(parseAuthorizationRequest(lookalike, config), null);

  const duplicate = new URL(path, "https://academy.artisanbarber.com");
  duplicate.searchParams.append("client_id", request.clientId);
  assert.equal(parseAuthorizationRequest(duplicate, config), null);
});

test("resume tokens are expiring and tamper resistant", () => {
  const now = 1_000_000;
  const token = createResumeToken(request, config.stateSecret, now);
  assert.deepEqual(readResumeToken(token, config.stateSecret, now + 1), request);
  assert.equal(
    readResumeToken(`${token.slice(0, -1)}x`, config.stateSecret, now + 1),
    null
  );
  assert.equal(readResumeToken(token, config.stateSecret, now + 301_000), null);
});
