import { createHash, randomBytes } from "node:crypto";

export const PASSWORD_RESET_TOKEN_BYTES = 32;
export const PASSWORD_RESET_TOKEN_TTL_SECONDS = 30 * 60;
export const PASSWORD_RESET_REVOKES_SESSIONS = true;

export type PasswordResetTokenRecord = {
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
};

export function generatePasswordResetToken() {
  return randomBytes(PASSWORD_RESET_TOKEN_BYTES).toString("base64url");
}

export function hashPasswordResetToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function isUsablePasswordResetToken(
  record: PasswordResetTokenRecord | null,
  token: string,
  now = new Date()
) {
  return Boolean(
    record &&
      record.usedAt === null &&
      record.expiresAt > now &&
      record.tokenHash === hashPasswordResetToken(token)
  );
}

export function passwordResetExpiry(now = new Date()) {
  return new Date(now.getTime() + PASSWORD_RESET_TOKEN_TTL_SECONDS * 1000);
}

export function passwordResetUserUpdate(passwordHash: string) {
  return { passwordHash } as const;
}
