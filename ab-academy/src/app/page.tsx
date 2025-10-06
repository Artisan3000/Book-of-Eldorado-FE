import Link from "next/link"
import Pricing from "./components/Pricing"
import { Scissors, Star } from "lucide-react"

export default function Home() {
  const tiers = [
    {
      name: "Beginner",
      price: {
        oneTime: 749,
        installments: { count: 3, amount: 250 },
      },
      description: "Learn the fundamentals — perfect for those starting out.",
      icon: <Scissors className="w-6 h-6" />,
      features: [
        { name: "Tools & Basics", description: "Intro to clippers, shears, combs", included: true },
        { name: "Basic Fades", description: "Low and mid fades step by step", included: true },
        { name: "Beard Grooming", description: "Entry-level shaping techniques", included: true },
        { name: "Portfolio Starter", description: "Begin documenting your cuts", included: true },
      ],
    },
    {
      name: "Advanced",
      price: {
        oneTime: 1249,
        installments: { count: 4, amount: 325 },
      },
      description: "For barbers ready to master advanced techniques.",
      highlight: true,
      badge: "Most Popular", 
      icon: <Star className="w-6 h-6" />,
      features: [
        { name: "Advanced Fades", description: "Skin fades, precision blends", included: true },
        { name: "Razor Design", description: "Line work and hair tattoos", included: true },
        { name: "Scissor Mastery", description: "Scissor-over-comb perfection", included: true },
        { name: "Business Tools", description: "Branding, pricing, and growth", included: true },
      ],
    },
  ]  

  return (
    <main className="px-8 py-16">
      {/* Hero / Intro */}
      <p className="text-lg mb-12 leading-relaxed">
        This academy was created for anyone ready to step into the world of
        barbering, whether you’ve never touched a clipper or you’ve been cutting
        hair for years and want to refine your edge.
      </p>

      {/* Course Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Link href="/courses/beginner" className=" bg-yellow-50 p-6 hover:bg-gray-100 transition block">
          <h2 className="text-2xl font-bold mb-4">Beginner Barbering</h2>
          <p className="mb-2">Learn the fundamentals — tools, fades, beard grooming, and client care.</p>
          <p className="uppercase text-sm font-medium">View Course →</p>
        </Link>

        <Link href="/courses/advanced" className="bg-yellow-50 p-6 hover:bg-gray-100 transition block">
          <h2 className="text-2xl font-bold mb-4">Advanced Barbering</h2>
          <p className="mb-2">Push your skills further with advanced styling, precision fades, razor artistry, and business mastery.</p>
          <p className="uppercase text-sm font-medium">View Course →</p>
        </Link>
      </div>

      {/* Pricing Section */}
      <Pricing tiers={tiers} />
    </main>
  )
}
