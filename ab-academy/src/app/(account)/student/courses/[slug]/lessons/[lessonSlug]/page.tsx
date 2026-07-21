import { requireRole } from "@/lib/current-user";
import { STUDENT_EXPERIENCE_ROLES } from "@/lib/roles";
import { getStudentLessonDetail } from "@/lib/data/student";
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
    <section className="px-8 py-8 animate-fadeIn md:px-16">
      <StudentLessonExperience
        key={lesson.id}
        course={course}
        lesson={{
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          videoUrl: lesson.videoUrl,
          moduleTitle: lesson.moduleTitle,
          progressStatus: lesson.progressStatus,
          lastPositionSeconds: lesson.lastPositionSeconds,
        }}
        slug={slug}
        lessonSlug={lessonSlug}
        previousLesson={previousLesson}
        nextLesson={nextLesson}
      />
    </section>
  );
}
