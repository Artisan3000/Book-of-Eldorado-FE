"use client";

import { useState } from "react";

type FormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const initialState: FormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => null);

    setIsSubmitting(false);

    if (!response.ok) {
      setError(data?.error || "Unable to change password.");
      return;
    }

    setForm(initialState);
    setSuccess("Password updated.");
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium">
          Current password
        </label>
        <input
          id="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={(event) => updateField("currentPassword", event.target.value)}
          className="mt-1 w-full border border-black px-3 py-2 text-sm"
          autoComplete="current-password"
          required
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium">
          New password
        </label>
        <input
          id="newPassword"
          type="password"
          value={form.newPassword}
          onChange={(event) => updateField("newPassword", event.target.value)}
          className="mt-1 w-full border border-black px-3 py-2 text-sm"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          className="mt-1 w-full border border-black px-3 py-2 text-sm"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="border border-black bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Updating..." : "Change Password"}
      </button>
    </form>
  );
}
