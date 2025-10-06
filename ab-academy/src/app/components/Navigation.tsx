import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between border-b border-black px-8 py-4">
      {/* Logo / Title */}
      <div className="text-2xl font-bold">
        <Link href="/">Artisan Barber Academy</Link>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex space-x-8 text-sm">
      <Link href="/about/" className="hover:underline">About</Link>
        <Link href="/courses/" className="hover:underline">Courses</Link>
      </div>

      {/* Login Icon */}
      <button className="text-2xl bg-black text-white px-6 py-3">
        <Link href="/student/login/">Log In</Link>
      </button>
    </nav>
  );
}
