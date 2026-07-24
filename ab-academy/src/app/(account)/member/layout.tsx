import { requireRole } from "@/lib/current-user";
import { MEMBER_ROLES } from "@/lib/roles";
import { toAppUser } from "@/lib/user";
import MemberShell from "./MemberShell";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(MEMBER_ROLES);

  return <MemberShell user={toAppUser(user)}>{children}</MemberShell>;
}
