"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";
import {
  CalendarDays,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  MessageCircle,
} from "lucide-react";

export default function BlueprintDashboard() {
  const tabs = ["Overview", "Community", "Events", "Resources", "Growth Tracker", "Settings"];
  const [activeTab, setActiveTab] = useState("Overview");

  // Mock Data (to replace later with Laravel API)
  const overviewStats = [
    { icon: <Users className="w-5 h-5" />, label: "Members", value: 312 },
    { icon: <CalendarDays className="w-5 h-5" />, label: "Upcoming Events", value: 4 },
    { icon: <FileText className="w-5 h-5" />, label: "Guides & Templates", value: 28 },
    { icon: <Briefcase className="w-5 h-5" />, label: "Businesses Launched", value: 57 },
  ];

  const mockEvents = [
    { id: 1, title: "Building Systems That Scale", date: "Nov 3, 2025", type: "Workshop" },
    { id: 2, title: "Brand Storytelling for Creators", date: "Nov 10, 2025", type: "Live Q&A" },
  ];

  const mockResources = [
    { id: 1, title: "Pricing Calculator Template", type: "Spreadsheet" },
    { id: 2, title: "Brand Audit Checklist", type: "PDF" },
    { id: 3, title: "Client Onboarding Script", type: "Google Doc" },
  ];

  const mockGrowth = [
    { area: "Revenue Systems", progress: 0.6 },
    { area: "Brand Storytelling", progress: 0.8 },
    { area: "Client Experience", progress: 0.4 },
  ];

  const profile = {
    name: "Blueprint Member",
    email: "member@artisanbarber.com",
    tier: "The Blueprint Membership",
    renewal: "Dec 1, 2025",
  };

  return (
    <DashboardLayout
      title="Blueprint Dashboard"
      subtitle="Build what lasts — connect, learn, and grow with your community."
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* --- Overview --- */}
      {activeTab === "Overview" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl italic mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Overview
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {overviewStats.map((stat) => (
              <div
                key={stat.label}
                className="border border-black p-6 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="mb-3">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="border border-dashed border-gray-400 p-10 text-center text-gray-500 italic">
            [Community Highlights or Announcements Placeholder]
          </div>
        </section>
      )}

      {/* --- Community --- */}
      {activeTab === "Community" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Member Community
          </h2>
          <div className="border border-dashed border-gray-400 p-10 text-center text-gray-500 italic">
            [Community Forum Feed or Discord Integration Placeholder]
          </div>
        </section>
      )}

      {/* --- Events --- */}
      {activeTab === "Events" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> Upcoming Events
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mockEvents.map((event) => (
              <div
                key={event.id}
                className="border border-black p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
              >
                <h3 className="font-semibold mb-1">{event.title}</h3>
                <p className="text-sm text-gray-700">{event.type}</p>
                <p className="text-xs text-gray-500 mt-2">{event.date}</p>
                <button className="mt-4 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
                  Join Event
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Resources --- */}
      {activeTab === "Resources" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Business Playbooks & Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mockResources.map((res) => (
              <div
                key={res.id}
                className="border border-black p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
              >
                <h3 className="font-semibold mb-1">{res.title}</h3>
                <p className="text-sm text-gray-700">{res.type}</p>
                <button className="mt-4 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
                  View Resource
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Growth Tracker --- */}
      {activeTab === "Growth Tracker" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5" /> Business Growth Tracker
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mockGrowth.map((item) => (
              <div
                key={item.area}
                className="border border-black p-6 flex flex-col hover:scale-[1.02] transition-transform duration-300"
              >
                <h3 className="font-semibold mb-2">{item.area}</h3>
                <div className="h-2 bg-gray-200 mb-2">
                  <div
                    className="h-2 bg-black"
                    style={{ width: `${item.progress * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  {Math.round(item.progress * 100)}% complete
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Settings --- */}
      {activeTab === "Settings" && (
        <section className="animate-fadeIn px-16 py-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" /> Account Settings
          </h2>
          <div className="border border-black p-6 max-w-2xl">
            <p className="font-semibold mb-2">{profile.name}</p>
            <p className="text-sm mb-1">Email: {profile.email}</p>
            <p className="text-sm mb-1">Membership: {profile.tier}</p>
            <p className="text-sm text-gray-700 mb-4">
              Renewal Date: {profile.renewal}
            </p>
            <button className="border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
              Edit Profile
            </button>
          </div>
        </section>
      )}
    </DashboardLayout>
  );
}
