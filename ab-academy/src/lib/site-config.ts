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
