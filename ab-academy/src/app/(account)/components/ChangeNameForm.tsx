"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
};

function splitName(name: string): FormState {
  const [firstName = "", ...rest] = name.trim().split(/\s+/);

  return {
    firstName,
    lastName: rest.join(" "),
  };
}

export default function ChangeNameForm({ name }: { name: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => splitName(name));
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

    const response = await fetch("/api/account/name", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => null);

    setIsSubmitting(false);

    if (!response.ok) {
      setError(data?.error || "Unable to update your name.");
      return;
    }

    setSuccess("Name updated.");
    router.refresh();
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            value={form.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            className="mt-1 w-full border border-black px-3 py-2 text-sm"
            autoComplete="given-name"
            maxLength={80}
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            value={form.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            className="mt-1 w-full border border-black px-3 py-2 text-sm"
            autoComplete="family-name"
            maxLength={80}
            required
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="border border-black bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save Name"}
      </button>
    </form>
  );
}
