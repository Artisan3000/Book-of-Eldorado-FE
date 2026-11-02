import "server-only";

import { absoluteUrl } from "@/lib/site-config";

function requiredEmailConfig(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required for password-reset delivery.`);
  return value;
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const apiKey = requiredEmailConfig("RESEND_API_KEY");
  const from = requiredEmailConfig("ACADEMY_EMAIL_FROM");
  const resetUrl = absoluteUrl(`/reset-password?token=${encodeURIComponent(token)}`);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Reset your Artisan Barber Academy password",
      text: [
        "Use the link below to choose a new Artisan Barber Academy password.",
        "",
        resetUrl,
        "",
        "This link expires in 30 minutes and can only be used once.",
      ].join("\n"),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Password-reset email provider returned HTTP ${response.status}.`);
  }
}
