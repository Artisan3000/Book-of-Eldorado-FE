"use client";

import { ReactNode } from "react";
import type { AppUser } from "@/lib/user";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  user?: AppUser | null;
}

export default function DashboardLayout({
  title,
  subtitle,
  children,
  tabs = [],
  activeTab,
  onTabChange,
  user,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-black px-8 py-6 flex items-center justify-between">
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
        <nav className="flex border-b border-black text-sm uppercase">
          {tabs.map((tab) => {
            const isActive = activeTab?.toLowerCase() === tab.toLowerCase();

            return (
              <button
                key={tab}
                onClick={() => onTabChange?.(tab)}
                className={`relative px-6 py-3 border-r border-black last:border-r-0 transition-colors duration-300 ${
                  isActive
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
      <footer className="border-t border-black px-8 py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Artisan Barber Foundation. All rights reserved.
      </footer>
    </div>
  );
}
