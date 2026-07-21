import AccountProfile from "@/app/(account)/components/AccountProfile";
import { requireRole } from "@/lib/current-user";
import { ADMIN_ROLES } from "@/lib/roles";
import { toAppUser } from "@/lib/user";

export default async function AdminProfile() {
  const user = await requireRole(ADMIN_ROLES);

  return <AccountProfile user={toAppUser(user)} />;
}
