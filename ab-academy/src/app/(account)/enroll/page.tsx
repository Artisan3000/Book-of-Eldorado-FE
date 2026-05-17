import Link from "next/link";

export default function EnrollPage() {
  return (
    <main className="px-8 py-16 font-serif text-black max-w-md mx-auto">
      <h1 className="text-6xl font-bold mb-8">Sign Up</h1>

      <div className="border border-black p-6 text-center animate-fadeIn">
        <p className="text-sm text-gray-700 mb-6 leading-relaxed">
          Artisan Barber Academy accounts are currently created privately. If
          you already have access, log in with the credentials provided by the
          academy.
        </p>

        <Link
          href="/login"
          className="inline-block w-full py-3 border border-black bg-black text-white text-sm font-medium hover:bg-gray-900"
        >
          Log In
        </Link>
      </div>
    </main>
  );
}
