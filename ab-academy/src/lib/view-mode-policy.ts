import type { Role } from "@prisma/client";
import { INSTRUCTOR_ROLES, STUDENT_EXPERIENCE_ROLES } from "@/lib/roles";
import { userHasRole } from "@/lib/role-utils";

export function isInstructorSideRole(role: Role) {
  return userHasRole(role, INSTRUCTOR_ROLES);
}

export function canRenderViewSwitcher(role: Role) {
  return role === "ADMIN" || role === "INSTRUCTOR";
}

export function isStudentExperienceRole(role: Role) {
  return userHasRole(role, STUDENT_EXPERIENCE_ROLES);
}

export function isViewMode(value: unknown): value is "instructor" | "student" {
  return value === "instructor" || value === "student";
}
