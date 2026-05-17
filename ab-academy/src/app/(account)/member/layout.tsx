import { requireRole } from "@/lib/current-user";
import { toAppUser } from "@/lib/user";
import MemberShell from "./MemberShell";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["MEMBER", "ADMIN"]);

  return <MemberShell user={toAppUser(user)}>{children}</MemberShell>;
}
