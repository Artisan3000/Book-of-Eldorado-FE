import { requireRole } from "@/lib/current-user";
import { toAppUser } from "@/lib/user";
import InstructorShell from "./InstructorShell";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["INSTRUCTOR", "ADMIN"]);

  return <InstructorShell user={toAppUser(user)}>{children}</InstructorShell>;
}
