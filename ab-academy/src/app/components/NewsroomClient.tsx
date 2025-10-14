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
  // Collect unique categories
  const uniqueCategories = Array.from(
    new Set(
      articles
        .map((a) => a.category)
        .filter((c): c is string => Boolean(c))
    )
  );

  const categories = ["All", ...uniqueCategories];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredArticles, setFilteredArticles] = useState<NewsItem[]>(articles);
  const [isAnimating, setIsAnimating] = useState(false);

  // Smooth transition on filter change
  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      setFilteredArticles(
        selectedCategory === "All"
          ? articles
          : articles.filter((a) => a.category === selectedCategory)
      );
      setIsAnimating(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [selectedCategory, articles]);

  return (
    <>
      {/* Filter Bar */}
      <section className="sticky top-4 z-50 text-center max-w-3xl mx-auto mb-12 animate-fadeUp bg-[var(--background)]">
        <div className="flex flex-wrap justify-center gap-3 border-t border-b border-black py-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-medium relative overflow-hidden transition-all duration-300 ${
                selectedCategory === cat
                  ? "text-white bg-black"
                  : "hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section
        className={`max-w-5xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-500 ${
          isAnimating
            ? "opacity-0 translate-y-4"
            : "opacity-100 translate-y-0"
        }`}
      >
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, i) => (
            <a
              key={article.title}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border border-black p-6 hover:bg-gray-50 hover:shadow-[4px_4px_0px_black] transition-all duration-300 ease-out animate-fadeUp"
              style={{
                animationDelay: `${i * 80}ms`,
                animationFillMode: "forwards",
              }}
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
                <h2 className="text-lg font-bold leading-tight group-hover:underline transition-colors">
                  {article.title}
                </h2>
                <ExternalLink className="w-4 h-4 ml-2 text-gray-500 group-hover:text-black flex-shrink-0 transition-colors" />
              </div>

              <p className="text-sm mb-2 text-gray-700">{article.source}</p>

              {article.summary && (
                <p className="text-sm leading-snug text-gray-800 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  {article.summary}
                </p>
              )}
            </a>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full animate-fadeIn">
            No articles found in this category.
          </p>
        )}
      </section>
    </>
  );
}
