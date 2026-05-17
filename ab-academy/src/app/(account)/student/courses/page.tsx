"use client";

import { PlayCircle } from "lucide-react";
import ProgressTracker from "../../dashboard/components/ProgressTracker";
import { useRouter } from "next/navigation";

export default function StudentCourses() {
  const router = useRouter();
  const courses = [
    { id: 1, title: "Foundation", progress: 0.75, slug: "courses/foundation" },
    { id: 2, title: "Refinement", progress: 0.4, slug: "courses/refinement" },
    { id: 3, title: "Mastery", progress: 0.1, slug: "courses/mastery" },
  ];

  return (
    <>
    <section className="px-16 py-8 animate-fadeIn">
      <h2 className="text-2xl mb-6">My Courses</h2>
        <div className=" pb-16">
      <ProgressTracker />
        </div>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border border-black p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform"
          >
            <div>
              <h3 className="font-semibold mb-2">{course.title}</h3>
              <div className="h-2 bg-gray-200 mb-2">
                <div
                  className="h-2 bg-black"
                  style={{ width: `${course.progress * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600">
                Progress: {Math.round(course.progress * 100)}%
              </p>
            </div>
            <button 
            onClick={() => router.push(`/student/${course.slug}`)}
            className="flex items-center gap-1 mt-4 border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
              <PlayCircle className="w-4 h-4" /> Continue
            </button>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}
