"use client";

import { useEffect, useState } from "react";

export default function ProgressTracker() {
  const progress = [
    { course: "Beginner Barbering", completed: 6, total: 12 },
    { course: "Advanced Barbering", completed: 3, total: 18 },
  ];

  const [animatedWidths, setAnimatedWidths] = useState<number[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedWidths(progress.map((p) => (p.completed / p.total) * 100));
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {progress.map((p, i) => (
        <div key={p.course} className="opacity-0 animate-fadeUp">
          <p className="text-sm font-medium mb-1">{p.course}</p>

          <div className="w-full bg-gray-200 h-3 overflow-hidden">
            <div
              className="bg-black h-3 transition-all duration-[1800ms] ease-out"
              style={{
                width: `${animatedWidths[i] || 0}%`,
              }}
            />
          </div>

          <p className="text-xs mt-1 text-gray-700">
            {p.completed} of {p.total} lessons completed
          </p>
        </div>
      ))}
    </div>
  );
}
