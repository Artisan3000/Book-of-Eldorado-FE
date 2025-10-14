import CourseList from "@/app/student/dashboard/CourseList"
import ProgressTracker from "@/app/student/dashboard/ProgressTracker"
import Certificates from "@/app/student/dashboard/Certificates"
import MediaLibrary from "@/app/student/dashboard/MediaLibrary"
import Mentorship from "@/app/student/dashboard/Mentorship"

export default function StudentDashboard() {
  return (
    <main className="px-8 py-16">
      <h1 className="text-6xl mb-4 animate-fadeUp">Dashboard</h1>
      <p className="italic text-gray-600 animate-fadeIn">
      Welcome back — let’s keep your momentum going.
      </p>
        

      <section className="mb-16 mt-16 animate-fadeUp">
        <h2 className="text-xl mb-4 underline">Progress Tracking</h2>
        <ProgressTracker />
      </section>

      <section className="mb-16">
        <h2 className="text-xl mb-4 underline">Your Courses</h2>
        <CourseList />
      </section>

      <section className="mb-16 animate-fadeUp">
        <MediaLibrary />
      </section>

      <section className="mb-16">
        <Mentorship />
      </section>

      <section>
        <h2 className="text-xl mb-4 underline animate-fadeUp">Certificates</h2>
        <Certificates />
      </section>
    </main>
  )
}
