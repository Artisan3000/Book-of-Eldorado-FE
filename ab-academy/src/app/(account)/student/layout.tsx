import { requireRole } from "@/lib/current-user";
import { toAppUser } from "@/lib/user";
import StudentShell from "./StudentShell";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["STUDENT", "ADMIN"]);

  return <StudentShell user={toAppUser(user)}>{children}</StudentShell>;
}
