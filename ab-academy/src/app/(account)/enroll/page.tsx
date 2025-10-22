"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";

export default function EnrollPage() {
  const router = useRouter();
  const { setUser } = useUser();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Replace with real Laravel endpoint later
      await new Promise((resolve) => setTimeout(resolve, 700));
      const mockUser = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        role: "student" as const,
    };
      setUser(mockUser);
      router.push("/dashboard");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-8 py-16 font-serif text-black max-w-md mx-auto">
      <h1 className="text-6xl font-bold mb-8">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-2 block w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Jordan Rivera"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-2 block w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="mt-2 block w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="••••••••"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 border border-black bg-black text-white text-sm font-medium hover:bg-gray-900 flex justify-center items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-6">
        Already have an account?{" "}
        <Link href="/login" className="underline hover:text-black">
          Log in
        </Link>
      </p>
    </main>
  );
}
