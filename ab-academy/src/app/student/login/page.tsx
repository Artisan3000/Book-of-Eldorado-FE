import Link from "next/link";

export default function StudentLogin() {
    return (
      <main className="px-8 py-16 font-serif text-black max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8">Student Login</h1>
  
        <form className="flex flex-col space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-2 block w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="you@example.com"
            />
          </div>
  
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-2 block w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="••••••••"
            />
          </div>
  
          <button
            type="submit"
            className="w-full py-3 border border-black bg-black text-white text-sm font-medium hover:bg-gray-900"
          >
            <Link href="/student/dashboard/">Log In</Link>
          </button>
        </form>
      </main>
    )
  }
  