import AccountProfile from "@/app/(account)/components/AccountProfile";
import { requireRole } from "@/lib/current-user";
import { toAppUser } from "@/lib/user";

export default async function InstructorProfile() {
  const user = await requireRole(["INSTRUCTOR", "ADMIN"]);

  return <AccountProfile user={toAppUser(user)} />;
}
