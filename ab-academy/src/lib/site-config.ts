export const siteConfig = {
  name: "Artisan Barber Academy",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://academy.artisanbarber.com",
  description:
    "Professional barbering education, courses, and career development from Artisan Barber Academy.",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

/**
 * Builds server-generated links from deployment configuration, never request
 * headers. Production falls back to the canonical Academy origin; Preview can
 * provide its own trusted environment value.
 */
export function trustedAppUrl(path = "/") {
  const baseUrl = process.env.ACADEMY_BASE_URL?.trim() || siteConfig.url;
  return new URL(path, baseUrl).toString();
}
