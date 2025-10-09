import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t border-black px-8 py-12 font-serif text-black">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        {/* Left: Logo / Brand */}
        <div className="flex flex-col mr-8">
          <Link href="/">
            <Image src="/academy-logo.svg" alt="Academy Logo" width={75} height={75} />
          </Link>
          <p className="text-sm text-gray-600 mt-4">
            Elevating the craft of barbering with education, mentorship, 
            and community. Learn at your own pace, anywhere.
          </p>
        </div>

        {/* Center: Nav Links */}
        <div className="flex flex-col space-y-2 text-sm">
            <h3 className="italic font-semibold">Explore</h3>
          <Link href="/courses" className="hover:underline">Courses</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/membership" className="hover:underline">Membership</Link>
          <Link href="/gifts" className="hover:underline">Gifts</Link>
        </div>

        {/* Center: Nav Links */}
        <div className="flex flex-col space-y-2 text-sm">
          <h3 className="italic font-semibold">Resources</h3>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/support" className="hover:underline">Support</Link>
          <Link href="/social-impact" className="hover:underline">Social Impact</Link>
          <Link href="/newsroom" className="hover:underline">Newsroom</Link>

        </div>

        {/* Right: Social / Contact */}
        <div className="flex flex-col items-start md:items-end space-y-4">
          <div className="flex gap-4">
            <Link href="#" aria-label="Instagram">
              <Instagram className="w-5 h-5 hover:text-gray-600" />
            </Link>
            <Link href="#" aria-label="Facebook">
              <Facebook className="w-5 h-5 hover:text-gray-600" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter className="w-5 h-5 hover:text-gray-600" />
            </Link>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Artisan Barber Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
