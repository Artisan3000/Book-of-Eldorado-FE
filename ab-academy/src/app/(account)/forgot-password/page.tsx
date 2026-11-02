"use client";

import { useState } from "react";

const GENERIC_MESSAGE =
  "If an account exists for that email, a password reset link has been sent.";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error || "Unable to process that request.");
      } else {
        setMessage(data?.message || GENERIC_MESSAGE);
      }
    } catch {
      setError("Unable to process that request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-8 py-16 font-serif text-black max-w-md mx-auto">
      <h1 className="text-5xl font-bold mb-4">Reset your password</h1>
      <p className="text-sm text-gray-600 mb-8">
        Enter your Academy email and we’ll send a reset link if an account exists.
      </p>
      <form onSubmit={submit} className="flex flex-col space-y-6">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 block w-full border border-black px-3 py-2 text-sm"
            autoComplete="email"
            required
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 border border-black bg-black text-white text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
      <p className="text-sm mt-6">
        <a href="/login" className="underline hover:no-underline">Back to login</a>
      </p>
    </main>
  );
}
