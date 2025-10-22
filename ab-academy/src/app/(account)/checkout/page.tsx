"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CheckoutContent() {
  const params = useSearchParams();
  const courseName = params.get("course") || "Selected Course";
  const paymentId = params.get("payment") || "ABC123";

  return (
    <main className="px-8 py-16 font-serif text-black max-w-2xl mx-auto text-center">
      <h1 className="text-5xl font-bold mb-4">Enrollment Confirmed</h1>
      <p className="italic text-gray-700 mb-8">
        You’re officially enrolled in <strong>{courseName}</strong>.
      </p>

      <div className="border border-black p-6 mb-8">
        <p className="text-sm mb-2 text-gray-600">Payment Reference:</p>
        <p className="font-mono text-lg">{paymentId}</p>
      </div>

      <p className="text-gray-700 mb-8">
        You can now access your dashboard to begin learning, track your progress, or
        download your materials. If you purchased a membership, check your email for
        exclusive access details.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/dashboard"
          className="border border-black bg-black text-white px-6 py-3 text-sm hover:bg-gray-900"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/courses"
          className="border border-black px-6 py-3 text-sm hover:bg-gray-100"
        >
          Explore More Courses
        </Link>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="p-8 text-gray-500">Loading checkout...</p>}>
      <CheckoutContent />
    </Suspense>
  );
}
