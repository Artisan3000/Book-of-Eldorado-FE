import { requireRole } from "@/lib/current-user";
import { toAppUser } from "@/lib/user";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["ADMIN"]);

  return <AdminShell user={toAppUser(user)}>{children}</AdminShell>;
}
