"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/app/providers/UserProvider";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const { user, logout } = useUser();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/"); // redirect to home
  }

  return (
    <nav className="flex items-center justify-between border-b border-black px-8 py-4">
      {/* Logo / Title */}
      <div>
        <Link href="/">
          <Image
            src="/academy-logo.svg"
            alt="Academy Logo"
            width={100}
            height={100}
          />
        </Link>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex space-x-8 text-sm uppercase">
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/courses" className="hover:underline">
          Courses
        </Link>
        <Link href="/membership" className="hover:underline">
          Membership
        </Link>
        <Link href="/blog" className="hover:underline">
          Blog
        </Link>
      </div>

      {/* Auth / Dashboard Buttons */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link
              href="/login"
              className="text-sm font-medium flex items-center gap-1 hover:underline"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="border border-black bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-900"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/dashboard"
              className="text-sm font-medium flex items-center gap-1 hover:underline"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="border border-black px-4 py-2 text-sm font-medium bg-white hover:bg-gray-100 transition"
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
