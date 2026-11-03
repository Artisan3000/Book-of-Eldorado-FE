import AccountProfile from "@/app/(account)/components/AccountProfile";
import { toAppUser } from "@/lib/user";
import { requireStudentExperience } from "@/lib/view-mode";

export default async function StudentProfile() {
  const { user, isPreview } = await requireStudentExperience();

  return <AccountProfile user={toAppUser(user)} readOnly={isPreview} />;
}
