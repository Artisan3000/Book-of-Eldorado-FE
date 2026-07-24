import { requireRole } from "@/lib/current-user";
import { STUDENT_EXPERIENCE_ROLES } from "@/lib/roles";
import { toAppUser } from "@/lib/user";
import StudentShell from "./StudentShell";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(STUDENT_EXPERIENCE_ROLES);

  return <StudentShell user={toAppUser(user)}>{children}</StudentShell>;
}
