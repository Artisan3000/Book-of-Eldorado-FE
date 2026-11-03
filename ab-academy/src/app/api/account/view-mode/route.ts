import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { requireBrowserMutation } from "@/lib/auth/request-security";
import { authJson } from "@/lib/auth/responses";
import { INSTRUCTOR_ROLES } from "@/lib/roles";
import { userHasRole } from "@/lib/role-utils";
import { VIEW_MODE_COOKIE, isViewMode } from "@/lib/view-mode";

export async function POST(request: Request) {
  const requestError = requireBrowserMutation(request);
  if (requestError) return requestError;

  const user = await getCurrentUser();
  if (!user) return authJson({ error: "You must be logged in." }, { status: 401 });
  if (!userHasRole(user.role, INSTRUCTOR_ROLES)) {
    return authJson(
      { error: "You are not allowed to switch Academy views." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!isViewMode(body?.mode)) {
    return authJson({ error: "Unsupported Academy view mode." }, { status: 400 });
  }

  const response = NextResponse.json({ mode: body.mode });
  response.cookies.set(VIEW_MODE_COOKIE, body.mode, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
