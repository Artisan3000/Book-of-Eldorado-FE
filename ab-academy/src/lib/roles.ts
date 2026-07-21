import { Role } from "@prisma/client";

export const STUDENT_EXPERIENCE_ROLES = [
  Role.STUDENT,
  Role.EMPLOYEE,
  Role.ADMIN,
] as const satisfies readonly Role[];

export const INSTRUCTOR_ROLES = [Role.INSTRUCTOR, Role.ADMIN] as const satisfies readonly Role[];

export const MEMBER_ROLES = [Role.MEMBER, Role.ADMIN] as const satisfies readonly Role[];

export const ARTISAN_PORTAL_ROLES = [Role.EMPLOYEE, Role.ADMIN] as const satisfies readonly Role[];

export const ADMIN_ROLES = [Role.ADMIN] as const satisfies readonly Role[];
