import CourseList from "@/app/components/CourseList"
import ProgressTracker from "@/app/components/ProgressTracker"
import Certificates from "@/app/components/Certificates"
import MediaLibrary from "@/app/student/dashboard/MediaLibrary"
import Mentorship from "@/app/student/dashboard/Mentorship"

export default function StudentDashboard() {
  return (
    <main className="px-8 py-16 font-serif text-black">
      <h1 className="text-3xl mb-12">Dashboard</h1>

      <section className="mb-16">
        <h2 className="text-xl mb-4 underline">Progress Tracking</h2>
        <ProgressTracker />
      </section>

      <section className="mb-16">
        <h2 className="text-xl mb-4 underline">Your Courses</h2>
        <CourseList />
      </section>

      <section className="mb-16">
        <MediaLibrary />
      </section>

      <section className="mb-16">
        <Mentorship />
      </section>

      <section>
        <h2 className="text-xl mb-4 underline">Certificates</h2>
        <Certificates />
      </section>
    </main>
  )
}
