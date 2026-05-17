"use client";

import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import type { AppUser } from "@/lib/user";

export default function InstructorShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AppUser;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    "Dashboard",
    "Courses",
    "Students",
    "Assignments",
    "Certificates",
    "Profile",
    "Settings",
  ];

  const tabRoutes: Record<string, string> = {
    Dashboard: "/instructor",
    Courses: "/instructor/courses",
    Students: "/instructor/students",
    Assignments: "/instructor/assignments",
    Certificates: "/instructor/certificates",
    Profile: "/instructor/profile",
    Settings: "/instructor/settings",
  };

  const activeTab =
    Object.entries(tabRoutes).find(([, path]) => pathname === path)?.[0] ||
    "Dashboard";

  return (
    <DashboardLayout
      title="Instructor Dashboard"
      subtitle="Manage your courses, assignments, and student progress"
      tabs={tabs}
      activeTab={activeTab}
      user={user}
      onTabChange={(tab) => router.push(tabRoutes[tab])}
    >
      {children}
    </DashboardLayout>
  );
}
