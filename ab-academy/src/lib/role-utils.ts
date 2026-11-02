import type { Role } from "@prisma/client";

/** Pure role predicates safe to use from server and client components. */
export function userHasRole(userRole: Role, allowedRoles: readonly Role[]) {
  return allowedRoles.includes(userRole);
}
