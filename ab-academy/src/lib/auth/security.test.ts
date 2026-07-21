import assert from "node:assert/strict";
import test from "node:test";
import { createIdentifierHash, isStrongIdentifierSecret } from "./identifier-hash";
import { getSafeInternalPath } from "./redirects";
import {
  getClientIp,
  isJsonRequest,
  isTrustedOrigin,
  normalizeEmail,
} from "./request-security";

test("normalizes an email without extra transformations", () => {
  assert.equal(normalizeEmail("  Person@Example.COM "), "person@example.com");
  assert.equal(normalizeEmail(null), "");
});

test("accepts only the JSON media type", () => {
  assert.equal(
    isJsonRequest(
      new Request("https://academy.artisanbarber.com/api/auth/login", {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      })
    ),
    true
  );
  assert.equal(
    isJsonRequest(
      new Request("https://academy.artisanbarber.com/api/auth/login", {
        headers: { "Content-Type": "text/json" },
      })
    ),
    false
  );
});

test("allows configured exact origins and rejects lookalikes", () => {
  const originalAllowedOrigins = process.env.ACADEMY_ALLOWED_ORIGINS;
  process.env.ACADEMY_ALLOWED_ORIGINS = "https://academy-preview.example.com";

  try {
    assert.equal(
      isTrustedOrigin(
        new Request("https://academy.artisanbarber.com/api/auth/login", {
          headers: { Origin: "https://academy.artisanbarber.com" },
        })
      ),
      true
    );
    assert.equal(
      isTrustedOrigin(
        new Request("https://academy.artisanbarber.com/api/auth/login", {
          headers: { Origin: "https://academy-preview.example.com" },
        })
      ),
      true
    );
    assert.equal(
      isTrustedOrigin(
        new Request("https://academy.artisanbarber.com/api/auth/login", {
          headers: { Origin: "https://academy.artisanbarber.com.evil.test" },
        })
      ),
      false
    );
    assert.equal(
      isTrustedOrigin(
        new Request("https://academy.artisanbarber.com/api/auth/login")
      ),
      false
    );
    assert.equal(
      isTrustedOrigin(
        new Request("https://academy.artisanbarber.com/api/auth/login", {
          headers: { Origin: "https://academy.artisanbarber.com/path" },
        })
      ),
      false
    );
    assert.equal(
      isTrustedOrigin(
        new Request("https://academy.artisanbarber.com/api/auth/login", {
          headers: { Origin: "https://user@academy.artisanbarber.com" },
        })
      ),
      false
    );
  } finally {
    if (originalAllowedOrigins === undefined) {
      delete process.env.ACADEMY_ALLOWED_ORIGINS;
    } else {
      process.env.ACADEMY_ALLOWED_ORIGINS = originalAllowedOrigins;
    }
  }
});

test("HMAC identifiers are deterministic and domain separated", () => {
  const secret = "a-secure-test-secret-that-is-at-least-32-bytes";
  const accountHash = createIdentifierHash(
    secret,
    "account",
    "person@example.com"
  );
  const repeatedHash = createIdentifierHash(
    secret,
    "account",
    "person@example.com"
  );
  const ipHash = createIdentifierHash(secret, "ip", "person@example.com");

  assert.equal(accountHash, repeatedHash);
  assert.notEqual(accountHash, ipHash);
  assert.equal(accountHash.includes("person@example.com"), false);
  assert.equal(isStrongIdentifierSecret("short"), false);
  assert.equal(isStrongIdentifierSecret(secret), true);
});

test("uses a fixed local IP bucket outside Vercel", () => {
  const originalVercel = process.env.VERCEL;
  delete process.env.VERCEL;

  try {
    assert.equal(
      getClientIp(
        new Request("http://localhost:3001", {
          headers: { "X-Forwarded-For": "203.0.113.5" },
        })
      ),
      "development"
    );
  } finally {
    if (originalVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = originalVercel;
  }
});

test("accepts safe internal continuations", () => {
  assert.equal(
    getSafeInternalPath("/student/dashboard?tab=one#progress", "/fallback"),
    "/student/dashboard?tab=one#progress"
  );
});

test("rejects external and encoded redirect attacks", () => {
  const attacks = [
    "https://evil.test",
    "//evil.test/path",
    "/\\evil.test",
    "/%5c%5cevil.test",
    "/%255c%255cevil.test",
    "/%0d%0aLocation:https://evil.test",
    "/%zz",
    " javascript:alert(1)",
    "",
  ];

  for (const attack of attacks) {
    assert.equal(getSafeInternalPath(attack, "/fallback"), "/fallback");
  }
});
