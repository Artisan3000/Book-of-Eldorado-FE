import assert from "node:assert/strict";
import test from "node:test";
import { Role } from "@prisma/client";
import {
  canRenderViewSwitcher,
  isInstructorSideRole,
  isStudentExperienceRole,
  isViewMode,
} from "./view-mode-policy";

test("the fixed switcher renders only for Admin and Instructor roles", () => {
  assert.equal(canRenderViewSwitcher(Role.ADMIN), true);
  assert.equal(canRenderViewSwitcher(Role.INSTRUCTOR), true);
  assert.equal(canRenderViewSwitcher(Role.STUDENT), false);
  assert.equal(canRenderViewSwitcher(Role.EMPLOYEE), false);
  assert.equal(canRenderViewSwitcher(Role.MEMBER), false);
});

test("only instructor-side roles can switch views", () => {
  assert.equal(isInstructorSideRole(Role.INSTRUCTOR), true);
  assert.equal(isInstructorSideRole(Role.ADMIN), true);
  assert.equal(isInstructorSideRole(Role.STUDENT), false);
  assert.equal(isInstructorSideRole(Role.EMPLOYEE), false);
});

test("ordinary students remain limited to the student experience", () => {
  assert.equal(isStudentExperienceRole(Role.STUDENT), true);
  assert.equal(isStudentExperienceRole(Role.EMPLOYEE), true);
  assert.equal(isStudentExperienceRole(Role.INSTRUCTOR), false);
});

test("view mode accepts only the two server-recognized modes", () => {
  assert.equal(isViewMode("instructor"), true);
  assert.equal(isViewMode("student"), true);
  assert.equal(isViewMode("admin"), false);
  assert.equal(isViewMode("student?role=INSTRUCTOR"), false);
  assert.equal(isViewMode(undefined), false);
});
