import { Scissors, Star, Check } from "lucide-react"

export default function CoursesOverview() {
  return (
    <main className="px-8 py-16 font-serif text-black">
      <h1 className="text-4xl font-bold mb-12">Courses Overview</h1>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Beginner */}
        <div className="border border-black p-8 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <Scissors className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Beginner Barbering</h2>
          </div>
          <p className="mb-4 text-sm">
            Build a solid foundation in barbering. Perfect for those starting
            with no prior experience.
          </p>
          <div className="text-3xl font-bold mb-2">$749</div>
          <p className="text-sm mb-6">Duration: 8 weeks (self-paced)</p>

          <ul className="space-y-3 flex-1">
            {[
              "Intro to tools and safety",
              "Clipper basics & first fades",
              "Beard trimming fundamentals",
              "Client care & hygiene",
              "Portfolio starter guidance",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-1 text-black" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>

          <button className="mt-8 py-3 border border-black text-sm font-medium hover:bg-gray-100">
            Enroll in Beginner
          </button>
        </div>

        {/* Advanced */}
        <div className="border border-black p-8 flex flex-col bg-gray-50 relative">
          {/* Badge */}
          <div className="absolute -top-3 left-6">
            <span className="bg-black text-white px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Most Popular
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <Star className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Advanced Barbering</h2>
          </div>
          <p className="mb-4 text-sm">
            Take your barbering skills to the next level. Ideal for barbers with
            some experience who want to refine their craft and grow their
            business.
          </p>
          <div className="text-3xl font-bold mb-2">$1249</div>
          <p className="text-sm mb-6">Duration: 12 weeks (self-paced)</p>

          <ul className="space-y-3 flex-1">
            {[
              "Skin fades & precision blending",
              "Razor design & line artistry",
              "Advanced scissor-over-comb",
              "Business & branding essentials",
              "Mentorship & career support",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-1 text-black" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>

          <button className="mt-8 py-3 border border-black bg-black text-white text-sm font-medium hover:bg-gray-900">
            Enroll in Advanced
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">
              Do I need experience to start?
            </h3>
            <p className="text-sm">
              The Beginner course is designed for complete newcomers. The
              Advanced course is best if you already have basic skills and want
              to refine your techniques or expand into business.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">
              Will I receive a certification?
            </h3>
            <p className="text-sm">
              Yes. Both courses include a certificate of completion that you can
              use to showcase your skills to employers or clients.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">
              What kind of support is included?
            </h3>
            <p className="text-sm">
              You’ll get access to community forums, peer reviews, and direct
              feedback from instructors in the Advanced course. The Beginner
              course includes guided assignments and checklists.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">
              Can I switch courses later?
            </h3>
            <p className="text-sm">
              Absolutely. You can start with the Beginner track and upgrade to
              Advanced at any time by paying the difference.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
