import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/blog-posts";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return [
    { slug: "modern-barbering-curriculum" },
    { slug: "tools-of-the-trade" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) return { title: "Article Not Found", robots: { index: false } };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`),
      siteName: siteConfig.name,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "EducationalOrganization", name: siteConfig.name },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };

  return (
    <main className="px-8 py-16 max-w-3xl mx-auto font-serif text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <p className="text-sm uppercase text-gray-500 mb-2">
        {new Date(post.date).toLocaleDateString("en-US", {
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
