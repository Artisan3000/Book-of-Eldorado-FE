import Link from "next/link"
import { Gift, Scissors, Star, Award, Users } from "lucide-react"

export default function GiftsPage() {
  return (
    <main className="px-8 py-16 font-serif text-black">
      {/* Hero / Banner */}
      <section className="relative text-center mb-20">
        <h1 className="text-4xl font-extrabold mb-4">
          Give the Gift of Mastery
        </h1>
        <p className="text-lg font-light leading-relaxed max-w-2xl mx-auto mb-8">
          Share more than a product — gift someone the tools, skills, and confidence 
          to build their craft and their business. With artisan training and mentorship, 
          it’s a gift that lasts a lifetime.
        </p>
        <Link
          href="/gifts/options"
          className="border border-black bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-900"
        >
          Explore Gift Options
        </Link>
      </section>

      {/* Gift Options Section */}
      <section className="mb-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          {/* Option 1: Membership Gift */}
          <div className="border border-black p-8 flex flex-col">
            <Gift className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Entrepreneur Membership Gift</h3>
            <p className="text-sm mb-4 font-light">
              A full year of business modules, live Q&A’s, and mentorship for any barber ready to scale.
            </p>
            <p className="text-2xl font-extrabold mb-2">$399</p>
            <p className="text-sm italic mb-6">1-year access as a gift</p>
            <Link
              href="/membership"
              className="mt-auto border border-black px-4 py-2 text-sm hover:bg-gray-100"
            >
              Give Membership
            </Link>
          </div>

          {/* Option 2: Beginner Course Gift */}
          <div className="border border-black p-8 flex flex-col">
            <Scissors className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Beginner Course Gift</h3>
            <p className="text-sm mb-4 font-light">
              Full access to the intro barbering course — perfect for someone ready to begin their journey.
            </p>
            <p className="text-2xl font-extrabold mb-2">$749</p>
            <p className="text-sm italic mb-6">Gift access to the 8-week program</p>
            <Link
              href="/courses/beginner"
              className="mt-auto border border-black px-4 py-2 text-sm hover:bg-gray-100"
            >
              Give Beginner
            </Link>
          </div>

          {/* Option 3: Advanced / Finishing Course Gift */}
          <div className="border border-black p-8 flex flex-col">
            <Star className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Advanced / Finishing Gift</h3>
            <p className="text-sm mb-4 font-light">
              Grant advanced skills or finishing techniques — ideal for someone already practicing.
            </p>
            <p className="text-2xl font-extrabold mb-2">$1249</p>
            <p className="text-sm italic mb-6">Gift access to an advanced track</p>
            <Link
              href="/courses/advanced"
              className="mt-auto border border-black px-4 py-2 text-sm hover:bg-gray-100"
            >
              Give Advanced
            </Link>
          </div>
        </div>
      </section>

      {/* What’s Included / Benefits */}
      <section className="pb-20 border-b border-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What’s Included in a Gift</h2>
          <div className="grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <Users className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">Lifetime access to gifted course</p>
            </div>
            <div>
              <Scissors className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">Video lessons, tutorials & support</p>
            </div>
            <div>
              <Star className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">Mentorship & feedback</p>
            </div>
            <div>
              <Award className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">Certificates upon completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Redemption & FAQs */}
      <section className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Gift Redeeming & FAQs</h2>
        <div className="space-y-8 text-sm">
          <div>
            <h3 className="font-bold mb-2">How will the recipient access their gift?</h3>
            <p>
              After purchase, the recipient will receive an email with instructions and a unique redemption link. They’ll use that to activate access.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Is the gift transferable?</h3>
            <p>
              Yes — gifting is flexible. You can send it to the recipient’s email or claim it later. Access begins once redeemed.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Do I get a certificate gift copy?</h3>
            <p>
              Yes. Once the recipient completes the course, they receive their certificate just like a paid student — no difference.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">What if they already have access?</h3>
            <p>
              Our checkout flow will guide you. You can convert it to “membership credits” or choose another course as a gift.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-16 bg-black text-white text-center mt-20">
        <h2 className="text-3xl font-extrabold mb-6">
          Give the gift of growth
        </h2>
        <p className="mb-8 max-w-xl mx-auto text-lg font-light">
          Whether it’s the path to entrepreneurship or a leap into mastery, a gift from Artisan Barber Academy opens doors that last a lifetime.
        </p>
        <Link
          href="/gifts/options"
          className="border border-white bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-200"
        >
          View Gift Options
        </Link>
      </section>
    </main>
  )
}
