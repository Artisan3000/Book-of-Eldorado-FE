import { AuthEventType } from "@prisma/client";
import { cookies } from "next/headers";
import { userHasRole } from "@/lib/auth";
import { recordAuthEvent } from "@/lib/auth/audit";
import { authJson } from "@/lib/auth/responses";
import { prisma } from "@/lib/prisma";
import { ARTISAN_PORTAL_ROLES } from "@/lib/roles";
import { getCurrentUser } from "@/lib/session";
import { getSsoConfig } from "@/lib/sso/config";
import {
  generateAuthorizationCode,
  hashAuthorizationCode,
} from "@/lib/sso/crypto";
import { parseAuthorizationRequest } from "@/lib/sso/request";
import {
  createResumeToken,
  SSO_RESUME_COOKIE,
  SSO_RESUME_MAX_AGE_SECONDS,
} from "@/lib/sso/resume";
import { ssoRedirect } from "@/lib/sso/response";

export async function GET(request: Request) {
  const config = getSsoConfig();
  if (!config.enabled) {
    return authJson({ error: "Not found." }, { status: 404 });
  }

  const authorizationRequest = parseAuthorizationRequest(
    new URL(request.url),
    config
  );
  if (!authorizationRequest) {
    return authJson({ error: "Invalid authorization request." }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    const cookieStore = await cookies();
    cookieStore.set(
      SSO_RESUME_COOKIE,
      createResumeToken(authorizationRequest, config.stateSecret),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/sso",
        maxAge: SSO_RESUME_MAX_AGE_SECONDS,
      }
    );
    return ssoRedirect(new URL("/login?next=/api/sso/resume", request.url));
  }

  if (!userHasRole(user.role, ARTISAN_PORTAL_ROLES)) {
    return authJson(
      { error: "This account is not eligible for the employee portal." },
      { status: 403 }
    );
  }

  const code = generateAuthorizationCode();
  await prisma.authorizationCode.create({
    data: {
      codeHash: hashAuthorizationCode(code),
      userId: user.id,
      clientId: authorizationRequest.clientId,
      redirectUri: authorizationRequest.redirectUri,
      codeChallenge: authorizationRequest.codeChallenge,
      expiresAt: new Date(Date.now() + config.codeTtlSeconds * 1000),
    },
  });
  await recordAuthEvent({
    type: AuthEventType.AUTHORIZATION_CODE_ISSUED,
    userId: user.id,
  });

  const callback = new URL(authorizationRequest.redirectUri);
  callback.searchParams.set("code", code);
  callback.searchParams.set("state", authorizationRequest.state);
  return ssoRedirect(callback);
}

export const dynamic = "force-dynamic";
