"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  type UserRole = "admin" | "instructor" | "student" | "blueprint_member";
  const [role, setRole] = useState<UserRole>("student");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Temporary mock user object for testing
      const mockUser = {
        id: Date.now(),
        name: "Johnny Appleseed",
        email: email || "johnny@artisanbarber.com",
        role,
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 700));

      // Save to context
      setUser(mockUser);

      // Redirect to unified dashboard
      router.push("/dashboard");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-8 py-16 font-serif text-black max-w-md mx-auto">
      <h1 className="text-6xl font-bold mb-8">Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 block w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="••••••••"
          />
        </div>

        {/* Temporary Role Selector */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium">
            Login As
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="mt-2 block w-full border border-black px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
            <option value="blueprint_member">Blueprint Member</option>
          </select>
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center -mt-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 border border-black bg-black text-white text-sm font-medium hover:bg-gray-900 flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
            </>
          ) : (
            "Log In"
          )}
        </button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-6">
        Don’t have an account?{" "}
        <Link href="/register" className="underline hover:text-black">
          Sign up
        </Link>
      </p>
    </main>
  );
}
