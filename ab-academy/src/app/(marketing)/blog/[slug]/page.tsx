"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Post {
  title: string;
  content: string;
  author: string;
  date: string;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    // Mock data defined *inside* the effect — no dependency issues
    const mockPosts: Record<string, Post> = {
      "modern-barbering-curriculum": {
        title: "Building a Modern Barbering Curriculum",
        content:
          "Our curriculum is designed to bridge the gap between tradition and modern aesthetics...",
        author: "Charles McCoy",
        date: "2025-10-01",
      },
      "tools-of-the-trade": {
        title: "Tools of the Trade: A Barber’s Essentials",
        content:
          "Every barber has their favorite tools — the ones that feel like extensions of their hands...",
        author: "Team Artisan",
        date: "2025-09-22",
      },
    };

    // Later you can replace this with:
    // fetch(`/api/posts/${slug}`)
    //   .then(res => res.json())
    //   .then(setPost);

    if (slug && typeof slug === "string") {
      const foundPost = mockPosts[slug];
      setPost(foundPost || null);
    }
  }, [slug]); // ✅ only depends on slug

  if (!post)
    return <p className="text-center py-32 text-gray-500">Loading post...</p>;
  return (
    <main className="px-8 py-16 max-w-3xl mx-auto font-serif text-black">
      <p className="text-sm uppercase text-gray-500 mb-2">
        {new Date(post.date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="italic text-sm text-gray-600 mb-8">by {post.author}</p>

      <article className="prose prose-lg max-w-none leading-relaxed">
        {post.content}
      </article>
    </main>
  );
}
