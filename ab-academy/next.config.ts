// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Course files are read from disk by the logged-in resource route, so they
  // must ship with that function (they are deliberately not in public/).
  outputFileTracingIncludes: {
    "/student/courses/[slug]/resources/[file]": ["./course-resources/**/*"],
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
