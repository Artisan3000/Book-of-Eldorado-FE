import { createHash, randomBytes } from "crypto";
import type { Role } from "@prisma/client";
import bcrypt from "bcrypt";

const BCRYPT_ROUNDS = 12;

export const roleHomeRoutes: Record<Role, string> = {
  ADMIN: "/admin",
  INSTRUCTOR: "/instructor",
  STUDENT: "/student/dashboard",
  MEMBER: "/member",
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, storedHash: string) {
  if (!storedHash.startsWith("$2")) {
    return false;
  }

  return bcrypt.compare(password, storedHash);
}

export function generateSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getRoleHomeRoute(role: Role) {
  return roleHomeRoutes[role] ?? "/student";
}

export function userHasRole(userRole: Role, allowedRoles: Role[]) {
  return allowedRoles.includes(userRole);
}
