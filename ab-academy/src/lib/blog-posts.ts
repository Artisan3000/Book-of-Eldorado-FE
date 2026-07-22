export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building a Modern Barbering Curriculum",
    slug: "modern-barbering-curriculum",
    excerpt: "How we combine tradition and innovation in barbering education.",
    content:
      "Our curriculum is designed to bridge the gap between tradition and modern aesthetics...",
    author: "Charles McCoy",
    date: "2025-10-01",
  },
  {
    id: 2,
    title: "Tools of the Trade: A Barber’s Essentials",
    slug: "tools-of-the-trade",
    excerpt: "The everyday gear that separates professionals from amateurs.",
    content:
      "Every barber has their favorite tools — the ones that feel like extensions of their hands...",
    author: "Team Artisan",
    date: "2025-09-22",
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
