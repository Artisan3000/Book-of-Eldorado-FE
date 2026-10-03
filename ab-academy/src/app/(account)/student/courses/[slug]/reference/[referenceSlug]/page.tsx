import { ArrowLeft, BookOpen, FileText } from "lucide-react";
import Link from "next/link";
import LessonMarkdown from "@/app/components/LessonMarkdown";
import { requireRole } from "@/lib/current-user";
import { getStudentCourseReference } from "@/lib/data/student";
import { isPdfHref } from "@/lib/lessons/lesson-content";
import { STUDENT_EXPERIENCE_ROLES } from "@/lib/roles";

// A read-only chapter reference (e.g. the Core Product Guide). Not a lesson:
// no progress is recorded and it is not part of the lesson sequence.
export default async function CourseReferencePage({
  params,
}: {
  params: Promise<{ slug: string; referenceSlug: string }>;
}) {
  const user = await requireRole(STUDENT_EXPERIENCE_ROLES);
  const { slug, referenceSlug } = await params;
  const { course, module, reference, body } = await getStudentCourseReference(
    user.id,
    slug,
    referenceSlug
  );
  const printable = module.resource?.href ? module.resource : null;

  return (
    <section className="page-gutter py-8 animate-fadeIn md:px-16">
      <Link
        href={`/student/courses/${slug}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {course.title}
      </Link>

      <div className="mb-8 border-b border-gray-300 pb-6">
        <p className="mb-2 text-sm font-medium text-gray-600">{module.title}</p>
        <h1 className="text-3xl font-bold mb-3">{reference.title}</h1>
        <p className="max-w-3xl text-gray-700">{reference.summary}</p>
        <p className="mt-4 inline-flex items-center gap-2 text-sm text-gray-700">
          <BookOpen className="w-4 h-4" /> Chapter reference · not part of your lesson progress
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <main className="border border-gray-300 p-6 md:p-8">
          <LessonMarkdown markdown={body} />
        </main>

        {printable?.href && (
          <aside>
            <div className="space-y-2 border border-gray-300 p-5">
              <h2 className="inline-flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4" /> Printable version
              </h2>
              <a
                href={printable.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm underline underline-offset-4 hover:text-gray-600"
              >
                {printable.title}
                {isPdfHref(printable.href) && " (PDF)"}
              </a>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
