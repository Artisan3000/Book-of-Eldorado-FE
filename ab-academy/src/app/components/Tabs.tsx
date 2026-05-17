"use client";

import { ReactNode, useState } from "react";

type TabItem = {
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  initialTab?: string;
  navClassName?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  inactiveButtonClassName?: string;
  activeIndicatorClassName?: string;
  contentClassName?: string;
  contentInnerClassName?: string;
};

export default function Tabs({
  tabs,
  initialTab,
  navClassName = "flex border-b border-black text-sm uppercase tracking-wide",
  buttonClassName = "relative px-6 py-3 border-r border-black last:border-r-0 transition-colors duration-300",
  activeButtonClassName = "bg-black text-white",
  inactiveButtonClassName = "hover:bg-gray-100 hover:text-gray-800",
  activeIndicatorClassName = "absolute bottom-0 left-0 w-full h-0.5 animate-underline",
  contentClassName = "px-8 py-12 max-w-3xl mx-auto min-h-[300px] transition-all duration-500",
  contentInnerClassName = "animate-fadeIn",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.label || "");
  const activeContent = tabs.find((tab) => tab.label === activeTab)?.content;

  return (
    <>
      <nav className={navClassName}>
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`${buttonClassName} ${
              activeTab === tab.label
                ? activeButtonClassName
                : inactiveButtonClassName
            }`}
          >
            {tab.label}
            {activeTab === tab.label && (
              <span className={activeIndicatorClassName} />
            )}
          </button>
        ))}
      </nav>

      <section className={contentClassName}>
        <div key={activeTab} className={contentInnerClassName}>
          {activeContent}
        </div>
      </section>
    </>
  );
}
