"use client";
import Link from "next/link";
import { useState } from "react"; // ✅ remove useEffect since unused

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
}

export default function BlogPage() {
  // Mock data for now — backend will replace this
  const [posts] = useState<Post[]>([
    {
      id: 1,
      title: "Building a Modern Barbering Curriculum",
      slug: "modern-barbering-curriculum",
      excerpt: "How we combine tradition and innovation in barbering education.",
      author: "Charles McCoy",
      date: "2025-10-01",
    },
    {
      id: 2,
      title: "Tools of the Trade: A Barber’s Essentials",
      slug: "tools-of-the-trade",
      excerpt: "The everyday gear that separates professionals from amateurs.",
      author: "Team Artisan",
      date: "2025-09-22",
    },
  ]);

  return (
    <main className="px-8 py-16 font-serif text-black">
      <h1 className="text-6xl font-bold mb-12">The Journal</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {posts.map((post) => (
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
