import assert from "node:assert/strict";
import test from "node:test";
import {
  generatePasswordResetToken,
  hashPasswordResetToken,
  isUsablePasswordResetToken,
  PASSWORD_RESET_REVOKES_SESSIONS,
  passwordResetUserUpdate,
  passwordResetExpiry,
} from "./password-reset";

const now = new Date("2026-11-02T12:00:00.000Z");

test("accepts a valid password reset token", () => {
  const token = generatePasswordResetToken();
  const record = {
    tokenHash: hashPasswordResetToken(token),
    expiresAt: passwordResetExpiry(now),
    usedAt: null,
  };

  assert.equal(token.length, 43);
  assert.equal(isUsablePasswordResetToken(record, token, now), true);
});

test("rejects expired, used, and forged password reset tokens", () => {
  const token = generatePasswordResetToken();
  const record = {
    tokenHash: hashPasswordResetToken(token),
    expiresAt: new Date(now.getTime() - 1),
    usedAt: null,
  };

  assert.equal(isUsablePasswordResetToken(record, token, now), false);
  assert.equal(
    isUsablePasswordResetToken(
      { ...record, expiresAt: passwordResetExpiry(now), usedAt: now },
      token,
      now
    ),
    false
  );
  assert.equal(
    isUsablePasswordResetToken(
      { ...record, expiresAt: passwordResetExpiry(now), usedAt: null },
      `${token}forged`,
      now
    ),
    false
  );
});

test("password reset updates only the password and revokes sessions", () => {
  for (const role of ["STUDENT", "INSTRUCTOR", "EMPLOYEE", "ADMIN"]) {
    const user = {
      role,
      isActive: true,
      enrollments: ["enrollment-1"],
      passwordHash: "old-hash",
    };

    const updated = { ...user, ...passwordResetUserUpdate("new-hash") };
    assert.deepEqual(updated, { ...user, passwordHash: "new-hash" });
  }
  assert.equal(PASSWORD_RESET_REVOKES_SESSIONS, true);
});
