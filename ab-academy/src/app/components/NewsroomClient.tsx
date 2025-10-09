"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface NewsItem {
  title: string;
  date: string;
  source: string;
  summary?: string;
  url: string;
  category?: string;
}

export default function NewsroomClient({ articles }: { articles: NewsItem[] }) {
  // Filter setup
  const uniqueCategories = Array.from(
    new Set(
      articles
        .map((a) => a.category)
        .filter((c): c is string => Boolean(c)) // type guard
    )
  );

  const categories = ["All", ...uniqueCategories];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredArticles, setFilteredArticles] = useState<NewsItem[]>(articles);
  const [isAnimating, setIsAnimating] = useState(false);

  // Smooth transition when changing filters
  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      setFilteredArticles(
        selectedCategory === "All"
          ? articles
          : articles.filter((a) => a.category === selectedCategory)
      );
      setIsAnimating(false);
    }, 150); // small delay for fade-out

    return () => clearTimeout(timeout);
  }, [selectedCategory, articles]);

  return (
    <main className="px-8 py-16 font-serif text-black">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Newsroom</h1>
        <p className="text-lg leading-relaxed mb-8">
          Organization news, press releases, and updates from across the
          community. Explore how Artisan Barber Academy is shaping the
          conversation in craft, education, and entrepreneurship.
        </p>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 border-t border-b border-black py-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid with subtle fade transition */}
      <section
        className={`max-w-5xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 transition-all duration-500 ${
          isAnimating
            ? "opacity-0 translate-y-2"
            : "opacity-100 translate-y-0"
        }`}
      >
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <a
              key={article.title}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border border-black p-6 hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  {new Date(article.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                {article.category && (
                  <span className="text-[10px] uppercase px-2 py-1 border border-black text-black tracking-wide">
                    {article.category}
                  </span>
                )}
              </div>

              <div className="flex items-start justify-between mb-1">
                <h2 className="text-xl font-bold leading-tight group-hover:underline">
                  {article.title}
                </h2>
                <ExternalLink className="w-4 h-4 ml-2 text-gray-500 group-hover:text-black flex-shrink-0" />
              </div>

              <p className="text-sm mb-2 text-gray-700">{article.source}</p>

              {article.summary && (
                <p className="text-sm leading-snug text-gray-800">
                  {article.summary}
                </p>
              )}
            </a>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No articles found in this category.
          </p>
        )}
      </section>
    </main>
  );
}
