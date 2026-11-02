import { normalizeEmail, getClientIp, requireBrowserMutation } from "@/lib/auth/request-security";
import { authJson } from "@/lib/auth/responses";
import { prisma } from "@/lib/prisma";
import { hashPasswordResetToken, generatePasswordResetToken, passwordResetExpiry } from "@/lib/auth/password-reset";
import { sendPasswordResetEmail } from "@/lib/auth/password-reset-mail";
import { checkLoginThrottle, getPasswordResetThrottleIdentity, recordLoginFailure } from "@/lib/auth/password-reset-throttle";

const GENERIC_RESPONSE = {
  ok: true,
  message: "If an account exists for that email, a password reset link has been sent.",
};

export async function POST(request: Request) {
  const requestError = requireBrowserMutation(request);
  if (requestError) return requestError;

  const body = await request.json().catch(() => null);
  const email = normalizeEmail(body?.email);
  const identity = getPasswordResetThrottleIdentity(email || "invalid", getClientIp(request));
  const throttle = await checkLoginThrottle(identity);

  if (throttle.blocked) {
    return authJson(GENERIC_RESPONSE, { status: 200 });
  }

  const retryAfterSeconds = await recordLoginFailure(identity);
  if (retryAfterSeconds > 0) {
    return authJson(GENERIC_RESPONSE, { status: 200 });
  }

  if (!email || email.length > 320) {
    return authJson(GENERIC_RESPONSE);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    return authJson(GENERIC_RESPONSE);
  }

  const token = generatePasswordResetToken();
  const record = await prisma.passwordResetToken.create({
    data: {
      tokenHash: hashPasswordResetToken(token),
      userId: user.id,
      expiresAt: passwordResetExpiry(),
    },
  });

  try {
    await sendPasswordResetEmail(user.email, token);
  } catch (error) {
    await prisma.passwordResetToken.delete({ where: { id: record.id } });
    console.error("Password-reset email delivery failed.", error instanceof Error ? error.message : "Unknown provider error.");
  }

  return authJson(GENERIC_RESPONSE);
}

export const dynamic = "force-dynamic";
