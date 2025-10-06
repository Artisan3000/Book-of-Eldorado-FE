import CourseList from "@/app/components/CourseList"
import ProgressTracker from "@/app/components/ProgressTracker"
import Certificates from "@/app/components/Certificates"

export default function StudentDashboard() {
  return (
    <main className="px-8 py-16 font-serif text-black">
      <h1 className="text-3xl font-bold mb-12">Student Dashboard</h1>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
        <CourseList />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Progress Tracking</h2>
        <ProgressTracker />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Certificates</h2>
        <Certificates />
      </section>
    </main>
  )
}
