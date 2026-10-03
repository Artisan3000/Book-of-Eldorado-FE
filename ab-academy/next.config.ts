// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Course files and reference pages are read from disk by logged-in routes,
  // so they must ship with those functions (they are deliberately not in public/).
  outputFileTracingIncludes: {
    "/student/courses/[slug]/resources/[file]": ["./course-resources/**/*"],
    "/student/courses/[slug]/reference/[referenceSlug]": [
      "./course-resources/*/references/*.md",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;
