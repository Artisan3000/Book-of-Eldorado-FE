import { requireRole } from "@/lib/current-user";
import { ADMIN_ROLES } from "@/lib/roles";
import { toAppUser } from "@/lib/user";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(ADMIN_ROLES);

  return <AdminShell user={toAppUser(user)}>{children}</AdminShell>;
}
