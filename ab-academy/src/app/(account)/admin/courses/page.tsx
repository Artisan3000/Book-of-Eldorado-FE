import { prisma } from "@/lib/prisma";

function getChapterNumber(sortOrder: number) {
  if (sortOrder >= 10) {
    return Math.trunc(sortOrder / 10);
  }

  return sortOrder;
}

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      description: true,
      modules: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          sortOrder: true,
          lessons: {
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              title: true,
              duration: true,
              sortOrder: true,
            },
          },
        },
      },
    },
  });

  return (
    <section className="animate-fadeIn px-8 py-2 md:px-16">
      <div className="mb-6">
        <h2 className="text-2xl italic">Courses</h2>
        <p className="mt-2 text-sm text-gray-600">
          Existing courses, chapters, and lessons currently in the academy.
        </p>
      </div>

      <div className="space-y-8">
        {courses.map((course) => {
          const lessonCount = course.modules.reduce(
            (count, module) => count + module.lessons.length,
            0
          );

          return (
            <article key={course.id} className="border border-black">
              <header className="border-b border-black p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{course.title}</h3>
                    <p className="text-sm text-gray-600">/{course.slug}</p>
                  </div>
                  <div className="text-sm text-gray-700 md:text-right">
                    <p>{course.status}</p>
                    <p>
                      {course.modules.length} chapter
                      {course.modules.length === 1 ? "" : "s"} / {lessonCount}{" "}
                      lesson{lessonCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                {course.description && (
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-700">
                    {course.description}
                  </p>
                )}
              </header>

              <div className="divide-y divide-black">
                {course.modules.map((module) => (
                  <section key={module.id} className="p-5">
                    <div className="mb-4">
                      <h4 className="font-semibold">
                        Chapter {getChapterNumber(module.sortOrder)}:{" "}
                        {module.title}
                      </h4>
                      {module.description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {module.description}
                        </p>
                      )}
                    </div>

                    {module.lessons.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                          <thead>
                            <tr className="border-b border-gray-300 text-gray-600">
                              <th className="py-2 pr-4 font-medium">Lesson</th>
                              <th className="py-2 pr-4 font-medium">Title</th>
                              <th className="py-2 pr-4 font-medium">
                                Duration
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {module.lessons.map((lesson) => (
                              <tr
                                key={lesson.id}
                                className="border-b border-gray-200 last:border-b-0"
                              >
                                <td className="py-3 pr-4">
                                  {getChapterNumber(module.sortOrder)}.
                                  {lesson.sortOrder}
                                </td>
                                <td className="py-3 pr-4 font-medium">
                                  {lesson.title}
                                </td>
                                <td className="py-3 pr-4 text-gray-600">
                                  {lesson.duration || "Not set"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gray-400 p-6 text-center text-sm text-gray-600">
                        No lessons have been added for this chapter yet.
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
