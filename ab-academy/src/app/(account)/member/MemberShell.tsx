"use client";

import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import type { AppUser } from "@/lib/user";

export default function MemberShell({
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
    "Community",
    "Events",
    "Resources",
    "Growth Tracker",
    "Settings",
  ];

  const tabRoutes: Record<string, string> = {
    Dashboard: "/member",
    Community: "/member/community",
    Events: "/member/events",
    Resources: "/member/resources",
    "Growth Tracker": "/member/growth-tracker",
    Settings: "/member/settings",
  };

  const activeTab =
    Object.entries(tabRoutes).find(([, path]) => pathname === path)?.[0] ||
    "Dashboard";

  return (
    <DashboardLayout
      title="Member Portal"
      subtitle="Your community, events, and resources"
      tabs={tabs}
      activeTab={activeTab}
      user={user}
      onTabChange={(tab) => router.push(tabRoutes[tab])}
    >
      {children}
    </DashboardLayout>
  );
}
