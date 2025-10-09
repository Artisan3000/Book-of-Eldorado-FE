"use client";

import { Book, FileText, Video, Headphones } from "lucide-react";
import React from "react";

const mediaItems = [
  {
    id: 1,
    type: "PDF",
    title: "The Fundamentals of Barbering",
    description: "A step-by-step visual guide to essential techniques.",
    fileSize: "12 MB",
  },
  {
    id: 2,
    type: "Article",
    title: "Understanding Client Psychology",
    description: "Building trust and loyalty through communication.",
    fileSize: "5 MB",
  },
  {
    id: 3,
    type: "Video",
    title: "The Art of the Fade",
    description: "Advanced fade theory and clipper control.",
    duration: "14:27",
  },
  {
    id: 4,
    type: "Audio",
    title: "Mentor Talk: Building Confidence Behind the Chair",
    description: "An intimate conversation with industry leaders.",
    duration: "32:19",
  },
];

export default function MediaLibrary() {
  const icons: Record<string, React.ReactNode> = {
    PDF: <FileText className="w-5 h-5" />,
    Article: <Book className="w-5 h-5" />,
    Video: <Video className="w-5 h-5" />,
    Audio: <Headphones className="w-5 h-5" />,
  };

  return (
    <section className="border border-black p-8 mb-12">
      <h2 className="text-xl mb-4 underline">Media Library</h2>

      <div className="grid md:grid-cols-4 gap-6">
        {mediaItems.map((item) => (
          <div key={item.id} className="border border-black p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 font-semibold">
                {icons[item.type]} {item.type}
              </span>
              <span className="text-xs text-gray-600">
                {item.fileSize || item.duration}
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1">{item.title}</h3>
            <p className="text-sm text-gray-800 mb-2">{item.description}</p>
            <button className="mt-auto border border-black px-3 py-1 text-xs uppercase tracking-wide hover:bg-gray-100">
              View
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
