import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { getCurrentUser } from "@/lib/current-user";
import { toAppUser } from "@/lib/user";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  const user = currentUser ? toAppUser(currentUser) : null;
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    parentOrganization: {
      "@type": "Organization",
      name: "Artisan Barber",
      url: "https://www.artisanbarber.com",
    },
  };

  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Navigation user={user} />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <GoogleAnalytics
          measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
        />
      </body>
    </html>
  );
}
