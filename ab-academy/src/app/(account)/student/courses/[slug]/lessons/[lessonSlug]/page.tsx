import { requireRole } from "@/lib/current-user";
import { STUDENT_EXPERIENCE_ROLES } from "@/lib/roles";
import { getStudentLessonDetail } from "@/lib/data/student";
import LessonMarkdown from "@/app/components/LessonMarkdown";
import StudentLessonExperience from "./StudentLessonExperience";

export default async function StudentLessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const user = await requireRole(STUDENT_EXPERIENCE_ROLES);
  const { slug, lessonSlug } = await params;
  const { course, lesson, previousLesson, nextLesson } =
    await getStudentLessonDetail(user.id, slug, lessonSlug);

  return (
    <section className="page-gutter py-8 animate-fadeIn md:px-16">
      <StudentLessonExperience
        key={lesson.id}
        course={course}
        lesson={{
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          videoUrl: lesson.videoUrl,
          contentKind: lesson.contentKind,
          moduleTitle: lesson.moduleTitle,
          moduleResource: lesson.moduleResource,
          moduleReferences: lesson.moduleReferences,
          progressStatus: lesson.progressStatus,
          lastPositionSeconds: lesson.lastPositionSeconds,
        }}
        textContent={
          lesson.contentKind === "text" && lesson.body ? (
            <LessonMarkdown markdown={lesson.body} />
          ) : null
        }
        slug={slug}
        lessonSlug={lessonSlug}
        previousLesson={
          previousLesson && { href: previousLesson.href, title: previousLesson.title }
        }
        nextLesson={nextLesson && { href: nextLesson.href, title: nextLesson.title }}
      />
    </section>
  );
}
