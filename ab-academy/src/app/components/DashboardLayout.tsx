"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import type { AppUser } from "@/lib/user";
import type { ViewMode } from "@/lib/view-mode";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  disabledTabs?: string[];
  user?: AppUser | null;
  viewMode?: ViewMode;
  canSwitchViews?: boolean;
}

export default function DashboardLayout({
  title,
  subtitle,
  children,
  tabs = [],
  activeTab,
  onTabChange,
  disabledTabs = [],
  user,
  viewMode = "instructor",
  canSwitchViews = false,
}: DashboardLayoutProps) {
  const router = useRouter();
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState("");
  const disabledTabSet = new Set(
    disabledTabs.map((tab) => tab.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      {canSwitchViews && (
        <div className="fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full border border-black bg-white p-1 text-xs uppercase shadow-lg sm:bottom-6">
          {(["instructor", "student"] as const).map((mode) => {
            const active = viewMode === mode;
            return (
              <button
                key={mode}
                type="button"
                aria-pressed={active}
                disabled={active || isSwitching}
                onClick={async () => {
                  setIsSwitching(true);
                  setSwitchError("");
                  try {
                    const response = await fetch("/api/account/view-mode", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ mode }),
                    });
                    if (!response.ok) throw new Error("View switch unavailable.");
                    router.push(mode === "student" ? "/student/dashboard" : "/instructor");
                    router.refresh();
                  } catch (error) {
                    setSwitchError(
                      error instanceof Error ? error.message : "View switch unavailable."
                    );
                    setIsSwitching(false);
                  }
                }}
                className={`min-w-24 rounded-full px-3 py-2 font-semibold transition sm:min-w-28 ${
                  active
                    ? "bg-black text-white"
                    : "text-black hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60"
                }`}
              >
                {mode === "instructor" ? "Instructor" : "Student"}
              </button>
            );
          })}
          {switchError && <span className="sr-only" role="alert">{switchError}</span>}
        </div>
      )}
      {/* Header */}
      <header className="border-b border-black page-gutter py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl">{title}</h1>
          {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-800">
            {user ? user.name : "Guest"}
            {user?.role && (
              <span className="ml-2 text-gray-500 italic capitalize">
                ({user.role})
              </span>
            )}
          </span>
        </div>
      </header>

      {/* Tabs (if provided) */}
      {tabs.length > 0 && (
        // Scrolls sideways on its own when the tabs are wider than a phone,
        // instead of widening the whole page.
        <nav className="flex overflow-x-auto border-b border-black text-sm uppercase">
          {tabs.map((tab) => {
            const isActive = activeTab?.toLowerCase() === tab.toLowerCase();
            const isDisabled = disabledTabSet.has(tab.toLowerCase());

            return (
              <button
                key={tab}
                onClick={() => {
                  if (!isDisabled) {
                    onTabChange?.(tab);
                  }
                }}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                className={`relative shrink-0 whitespace-nowrap px-4 py-3 sm:px-6 border-r border-black last:border-r-0 transition-colors duration-300 ${
                  isDisabled
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : isActive
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400" />
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-black page-gutter py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Artisan Barber Foundation. All rights reserved.
      </footer>
    </div>
  );
}
