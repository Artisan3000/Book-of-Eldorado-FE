import { requireRole } from "@/lib/current-user";
import { INSTRUCTOR_ROLES } from "@/lib/roles";
import { toAppUser } from "@/lib/user";
import InstructorShell from "./InstructorShell";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(INSTRUCTOR_ROLES);

  return <InstructorShell user={toAppUser(user)}>{children}</InstructorShell>;
}
