import Link from "next/link";

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="min-h-[70vh] bg-[#fffff8] px-6 py-16 font-serif text-black sm:px-10 sm:py-24 lg:px-16"
    >
      <div className="mx-auto flex min-h-[55vh] max-w-3xl flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
          Artisan Barber Academy
        </p>
        <h1
          id="not-found-title"
          className="mt-5 max-w-2xl text-4xl font-bold leading-tight sm:text-6xl"
        >
          404 — This page doesn’t exist
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-700">
          The page you’re looking for may have moved or the address may be
          incorrect.
        </p>
        <nav
          aria-label="Page-not-found navigation"
          className="mt-10 flex flex-col gap-3 text-sm sm:flex-row sm:items-center"
        >
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center border border-black bg-black px-5 py-3 font-medium text-white transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Back to Academy home
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center border border-black px-5 py-3 font-medium text-black transition-colors hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </section>
  );
}
