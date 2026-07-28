import { cookies } from "next/headers";
import { authJson } from "@/lib/auth/responses";
import { getSsoConfig } from "@/lib/sso/config";
import {
  authorizationRequestUrl,
  parseAuthorizationRequest,
} from "@/lib/sso/request";
import {
  readResumeToken,
  SSO_RESUME_COOKIE,
} from "@/lib/sso/resume";
import { ssoRedirect } from "@/lib/sso/response";

export async function GET(request: Request) {
  const config = getSsoConfig();
  if (!config.enabled) {
    return authJson({ error: "Not found." }, { status: 404 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SSO_RESUME_COOKIE)?.value ?? "";
  cookieStore.set(SSO_RESUME_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/sso",
    expires: new Date(0),
    maxAge: 0,
  });

  const resumed = readResumeToken(token, config.stateSecret);
  if (!resumed) {
    return authJson({ error: "Authorization request expired." }, { status: 400 });
  }

  const authorizePath = authorizationRequestUrl(resumed);
  if (!parseAuthorizationRequest(new URL(authorizePath, request.url), config)) {
    return authJson({ error: "Invalid authorization request." }, { status: 400 });
  }

  return ssoRedirect(new URL(authorizePath, request.url));
}

export const dynamic = "force-dynamic";
