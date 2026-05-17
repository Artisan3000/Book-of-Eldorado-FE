"use client";

export default function CoursesError() {
  return (
    <main className="px-8 py-16 font-serif text-black">
      <section className="max-w-3xl mx-auto border border-black p-8 text-center animate-fadeIn">
        <h1 className="text-3xl font-bold mb-4">Courses unavailable</h1>
        <p className="text-sm text-gray-700">
          The course catalog could not be loaded. Please try again shortly.
        </p>
      </section>
    </main>
  );
}
