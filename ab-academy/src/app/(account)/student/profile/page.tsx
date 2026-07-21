import AccountProfile from "@/app/(account)/components/AccountProfile";
import { requireRole } from "@/lib/current-user";
import { STUDENT_EXPERIENCE_ROLES } from "@/lib/roles";
import { toAppUser } from "@/lib/user";

export default async function StudentProfile() {
  const user = await requireRole(STUDENT_EXPERIENCE_ROLES);

  return <AccountProfile user={toAppUser(user)} />;
}
