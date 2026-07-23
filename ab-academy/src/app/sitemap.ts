import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";
import { blogPosts } from "@/lib/blog-posts";

const publicRoutes = [
  "/",
  "/about",
  "/blog",
  "/courses",
  "/courses/foundation",
  "/courses/mastery",
  "/courses/refinement",
  "/gifts",
  "/membership",
  "/newsroom",
  "/privacy-terms",
  "/social-impact",
  "/support",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...publicRoutes.map((path) => ({ url: absoluteUrl(path) })),
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.date),
    })),
  ];
}
