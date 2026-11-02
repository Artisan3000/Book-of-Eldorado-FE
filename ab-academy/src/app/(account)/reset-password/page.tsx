"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error || "Unable to reset your password.");
      } else {
        setMessage("Your password has been reset. You can now log in.");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("Unable to reset your password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-8 py-16 font-serif text-black max-w-md mx-auto">
      <h1 className="text-5xl font-bold mb-4">Choose a new password</h1>
      <p className="text-sm text-gray-600 mb-8">
        Your reset link expires after 30 minutes and can only be used once.
      </p>
      <form onSubmit={submit} className="flex flex-col space-y-6">
        <label htmlFor="newPassword" className="block text-sm font-medium">
          New password
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="mt-2 block w-full border border-black px-3 py-2 text-sm"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm new password
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-2 block w-full border border-black px-3 py-2 text-sm"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button
          type="submit"
          disabled={loading || !token}
          className="w-full py-3 border border-black bg-black text-white text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Updating..." : "Reset password"}
        </button>
      </form>
    </main>
  );
}
