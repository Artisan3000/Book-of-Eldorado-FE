import assert from "node:assert/strict";
import test from "node:test";
import { Role } from "@prisma/client";
import { getRoleHomeRoute } from "./auth";
import {
  ADMIN_ROLES,
  ARTISAN_PORTAL_ROLES,
  INSTRUCTOR_ROLES,
  MEMBER_ROLES,
  STUDENT_EXPERIENCE_ROLES,
} from "./roles";

test("employees receive the student Academy experience", () => {
  assert.equal(getRoleHomeRoute(Role.EMPLOYEE), "/student/dashboard");
  assert.equal(STUDENT_EXPERIENCE_ROLES.includes(Role.EMPLOYEE), true);
});

test("only employees and admins are eligible for the Artisan portal", () => {
  const portalRoles = new Set<Role>(ARTISAN_PORTAL_ROLES);

  assert.deepEqual(ARTISAN_PORTAL_ROLES, [Role.EMPLOYEE, Role.ADMIN]);
  assert.equal(portalRoles.has(Role.STUDENT), false);
  assert.equal(portalRoles.has(Role.INSTRUCTOR), false);
  assert.equal(portalRoles.has(Role.MEMBER), false);
});

test("members retain their Academy access", () => {
  assert.equal(MEMBER_ROLES.includes(Role.MEMBER), true);
  assert.equal(getRoleHomeRoute(Role.MEMBER), "/member");
});

test("Academy role matrices remain exact", () => {
  assert.deepEqual(STUDENT_EXPERIENCE_ROLES, [
    Role.STUDENT,
    Role.EMPLOYEE,
    Role.ADMIN,
  ]);
  assert.deepEqual(INSTRUCTOR_ROLES, [Role.INSTRUCTOR, Role.ADMIN]);
  assert.deepEqual(MEMBER_ROLES, [Role.MEMBER, Role.ADMIN]);
  assert.deepEqual(ADMIN_ROLES, [Role.ADMIN]);

  assert.equal(getRoleHomeRoute(Role.ADMIN), "/admin");
  assert.equal(getRoleHomeRoute(Role.INSTRUCTOR), "/instructor");
  assert.equal(getRoleHomeRoute(Role.STUDENT), "/student/dashboard");
  assert.equal(getRoleHomeRoute(Role.EMPLOYEE), "/student/dashboard");
  assert.equal(getRoleHomeRoute(Role.MEMBER), "/member");
});
