import "server-only";

import { cookies } from "next/headers";
import { getCurrentUser, requireUser } from "@/lib/current-user";
import { getRoleHomeRoute } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  isInstructorSideRole,
  isStudentExperienceRole,
  isViewMode,
} from "./view-mode-policy";

export { isViewMode } from "./view-mode-policy";

export const VIEW_MODE_COOKIE = "academy_view_mode";
export const VIEW_MODES = ["instructor", "student"] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

async function getStoredViewMode(): Promise<ViewMode> {
  const value = (await cookies()).get(VIEW_MODE_COOKIE)?.value;
  return isViewMode(value) ? value : "instructor";
}

export async function requireStudentExperience() {
  const user = await requireUser();
  const mode = await getStoredViewMode();

  if (!isStudentExperienceRole(user.role) && !isInstructorSideRole(user.role)) {
    redirect(getRoleHomeRoute(user.role));
  }

  if (user.role === "INSTRUCTOR" && mode !== "student") {
    redirect("/instructor");
  }

  return {
    user,
    isPreview: mode === "student" && isInstructorSideRole(user.role),
  };
}

export async function isStudentPreviewRequest() {
  const user = await getCurrentUser();
  if (!user || !isInstructorSideRole(user.role)) {
    return false;
  }

  return (await getStoredViewMode()) === "student";
}
