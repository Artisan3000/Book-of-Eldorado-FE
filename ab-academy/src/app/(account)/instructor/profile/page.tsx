import AccountProfile from "@/app/(account)/components/AccountProfile";
import { requireRole } from "@/lib/current-user";
import { INSTRUCTOR_ROLES } from "@/lib/roles";
import { toAppUser } from "@/lib/user";

export default async function InstructorProfile() {
  const user = await requireRole(INSTRUCTOR_ROLES);

  return <AccountProfile user={toAppUser(user)} />;
}
