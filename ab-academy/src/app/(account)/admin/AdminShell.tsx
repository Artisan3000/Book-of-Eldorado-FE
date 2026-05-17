"use client";

import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import type { AppUser } from "@/lib/user";

export default function AdminShell({
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
    "Users",
    "Instructors",
    "Courses",
    "Certificates",
    "Workshops",
    "Memberships",
    "Revenue",
    "Logs",
    "Profile",
    "Settings",
    "Extras",
  ];

  const tabRoutes: Record<string, string> = {
    Dashboard: "/admin",
    Users: "/admin/users",
    Instructors: "/admin/instructors",
    Courses: "/admin/courses",
    Certificates: "/admin/certificates",
    Workshops: "/admin/workshops",
    Memberships: "/admin/memberships",
    Revenue: "/admin/revenue",
    Logs: "/admin/logs",
    Profile: "/admin/profile",
    Settings: "/admin/settings",
    Extras: "/admin/extras",
  };

  const activeTab =
    Object.entries(tabRoutes).find(([, path]) => pathname === path)?.[0] ||
    "Dashboard";

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Manage users, courses, and academy operations"
      tabs={tabs}
      activeTab={activeTab}
      user={user}
      onTabChange={(tab) => router.push(tabRoutes[tab])}
    >
      {children}
    </DashboardLayout>
  );
}
