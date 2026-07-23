import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-posts";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Barbering education, tools, professional development, and Academy news.",
  alternates: { canonical: absoluteUrl("/blog") },
};

export default function BlogPage() {
  return (
    <main className="px-8 py-16 font-serif text-black">
      <h1 className="text-6xl font-bold mb-12">The Journal</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="border border-black p-6 hover:-translate-y-1 transition-transform duration-300"
          >
            <p className="text-sm uppercase text-gray-500 mb-2">
              {new Date(post.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-sm mb-4 text-gray-700">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="border border-black px-4 py-2 text-xs uppercase hover:bg-gray-100 transition"
            >
              Read More
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
