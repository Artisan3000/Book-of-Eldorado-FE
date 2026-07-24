import { AuthEventType } from "@prisma/client";
import { getRoleHomeRoute, verifyPassword } from "@/lib/auth";
import { recordAuthEvent } from "@/lib/auth/audit";
import {
  checkLoginThrottle,
  clearSuccessfulAccountThrottle,
  getThrottleIdentity,
  recordLoginFailure,
} from "@/lib/auth/login-throttle";
import { getSafeInternalPath } from "@/lib/auth/redirects";
import {
  getClientIp,
  normalizeEmail,
  requireBrowserMutation,
} from "@/lib/auth/request-security";
import { authJson } from "@/lib/auth/responses";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

const INVALID_PASSWORD_HASH =
  "$2b$12$pmF9lEM.evMcpxjZTHmeFulKP0YIk9ybyioeAUMc2qjizqpYIoCpe";
const INVALID_CREDENTIALS = "Invalid email or password.";

export async function POST(request: Request) {
  const requestError = requireBrowserMutation(request);
  if (requestError) return requestError;

  const body = await request.json().catch(() => null);
  const email = normalizeEmail(body?.email);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return authJson(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const identity = getThrottleIdentity(email, getClientIp(request));

  try {
    const throttle = await checkLoginThrottle(identity);

    if (throttle.blocked) {
      return authJson(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(throttle.retryAfterSeconds) },
        }
      );
    }
  } catch (error) {
    console.error("Unable to evaluate login throttling.", error);
    return authJson(
      { error: "Login is temporarily unavailable." },
      { status: 503 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });
  const passwordMatches = await verifyPassword(
    password,
    user?.passwordHash ?? INVALID_PASSWORD_HASH
  );

  if (!user || !user.isActive || !passwordMatches) {
    try {
      const retryAfterSeconds = await recordLoginFailure(identity);

      await recordAuthEvent({
        type:
          retryAfterSeconds > 0
            ? AuthEventType.LOGIN_THROTTLED
            : AuthEventType.LOGIN_FAILED,
        userId: user?.id,
        identifierHash: identity.accountHash,
        ipHash: identity.ipHash,
      });

      if (retryAfterSeconds > 0) {
        return authJson(
          { error: "Too many login attempts. Please try again later." },
          {
            status: 429,
            headers: { "Retry-After": String(retryAfterSeconds) },
          }
        );
      }
    } catch (error) {
      console.error("Unable to record login throttling.", error);
      return authJson(
        { error: "Login is temporarily unavailable." },
        { status: 503 }
      );
    }

    return authJson({ error: INVALID_CREDENTIALS }, { status: 401 });
  }

  await clearSuccessfulAccountThrottle(identity.accountHash);
  await createSession(user.id);
  await recordAuthEvent({
    type: AuthEventType.LOGIN_SUCCEEDED,
    userId: user.id,
    identifierHash: identity.accountHash,
    ipHash: identity.ipHash,
  });

  const redirectTo = getSafeInternalPath(
    body?.next,
    getRoleHomeRoute(user.role)
  );

  return authJson({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    redirectTo,
  });
}
