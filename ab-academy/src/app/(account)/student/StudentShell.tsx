"use client";

import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import type { AppUser } from "@/lib/user";

export default function StudentShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AppUser;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const tabRoutes: Record<string, string> = {
    Dashboard: "/student/dashboard",
    Courses: "/student/courses",
    Explore: "/student/explore",
    Achievements: "/student/achievements",
    Profile: "/student/profile",
  };

  const tabs = Object.keys(tabRoutes);

  const activeTab =
    Object.entries(tabRoutes).find(([label, path]) => {
      if (
        label === "Dashboard" &&
        (pathname === "/student" || pathname === "/student/dashboard")
      )
        return true;
      if (path !== "/student" && pathname.startsWith(path)) return true;
      return false;
    })?.[0] || "Dashboard";

  return (
    <DashboardLayout
      title="Student Dashboard"
      subtitle="Track your learning journey and discover new opportunities"
      tabs={tabs}
      activeTab={activeTab}
      user={user}
      onTabChange={(tab) => router.push(tabRoutes[tab])}
    >
      {children}
    </DashboardLayout>
  );
}
