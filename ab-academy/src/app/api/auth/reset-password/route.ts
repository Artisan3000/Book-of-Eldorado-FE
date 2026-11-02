import { AuthEventType } from "@prisma/client";
import { hashPassword } from "@/lib/auth";
import { hashAuthIdentifier } from "@/lib/auth/identifiers";
import { getClientIp, requireBrowserMutation } from "@/lib/auth/request-security";
import { authJson } from "@/lib/auth/responses";
import { prisma } from "@/lib/prisma";
import {
  hashPasswordResetToken,
  isUsablePasswordResetToken,
  passwordResetUserUpdate,
} from "@/lib/auth/password-reset";
import { recordAuthEvent } from "@/lib/auth/audit";

const MIN_PASSWORD_LENGTH = 8;
const INVALID_TOKEN = "This reset link is invalid or has expired.";

export async function POST(request: Request) {
  const requestError = requireBrowserMutation(request);
  if (requestError) return requestError;

  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";
  const confirmPassword = typeof body?.confirmPassword === "string" ? body.confirmPassword : "";

  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return authJson({ error: INVALID_TOKEN }, { status: 400 });
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return authJson({ error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` }, { status: 400 });
  }
  if (newPassword !== confirmPassword) {
    return authJson({ error: "New password and confirmation do not match." }, { status: 400 });
  }

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashPasswordResetToken(token) },
    include: { user: true },
  });
  const now = new Date();

  if (!tokenRecord || !tokenRecord.user.isActive || !isUsablePasswordResetToken(tokenRecord, token, now)) {
    return authJson({ error: INVALID_TOKEN }, { status: 400 });
  }

  const passwordHash = await hashPassword(newPassword);
  try {
    await prisma.$transaction(async (transaction) => {
      const consumed = await transaction.passwordResetToken.updateMany({
        where: { id: tokenRecord.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (consumed.count !== 1) throw new Error("Password reset token was already used.");

      await transaction.user.update({
        where: { id: tokenRecord.userId },
        data: passwordResetUserUpdate(passwordHash),
      });
      await transaction.session.deleteMany({ where: { userId: tokenRecord.userId } });
    });
  } catch {
    return authJson({ error: INVALID_TOKEN }, { status: 400 });
  }

  await recordAuthEvent({
    type: AuthEventType.PASSWORD_RESET,
    userId: tokenRecord.userId,
    identifierHash: hashAuthIdentifier("account", tokenRecord.user.email),
    ipHash: hashAuthIdentifier("ip", getClientIp(request)),
  });

  return authJson({ ok: true, redirectTo: "/login?reset=success" });
}

export const dynamic = "force-dynamic";
