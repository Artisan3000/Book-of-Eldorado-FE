import { toAppUser } from "@/lib/user";
import { requireStudentExperience } from "@/lib/view-mode";
import StudentShell from "./StudentShell";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isPreview } = await requireStudentExperience();

  return (
    <StudentShell user={toAppUser(user)} isPreview={isPreview}>
      {children}
    </StudentShell>
  );
}
