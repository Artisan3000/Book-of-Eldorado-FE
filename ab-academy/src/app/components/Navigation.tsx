"use client"

import Image from "next/image";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between border-b border-black px-8 py-4">
      {/* Logo / Title */}
      <div>
        <Link href="/">
          <Image src="/academy-logo.svg" alt="Academy Logo" width={100} height={100} />
        </Link>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex space-x-8 text-sm uppercase">
      <Link href="/about" className="hover:underline">About</Link>
        <Link href="/courses" className="hover:underline">Courses</Link>
        <Link href="/membership" className="hover:underline">Membership</Link>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        <Link
          href="/student/login"
          className="text-sm font-medium flex items-center gap-1 hover:underline"
        >
          Log In
        </Link>
        <Link
          href="/student/signup"
          className="border border-black bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-900"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  )
}
