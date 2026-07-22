import { getBlogPost } from "@/lib/blog-posts";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return <p className="text-center py-32 text-gray-500">Loading post...</p>;
  }

  return (
    <main className="px-8 py-16 max-w-3xl mx-auto font-serif text-black">
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
