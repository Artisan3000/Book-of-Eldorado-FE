import fs from "fs";
import path from "path";
import NewsroomClient from "../components/NewsroomClient";

export default function NewsroomPage() {
  const newsroomDir = path.join(process.cwd(), "public/newsroom");
  const files = fs.readdirSync(newsroomDir);

  const articles = files
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const content = fs.readFileSync(path.join(newsroomDir, file), "utf-8");
      return JSON.parse(content);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="px-8 py-16 font-serif text-black overflow-hidden">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-20 animate-fadeUp">
        <h1 className="text-6xl font-bold mb-4 tracking-tight">
          Newsroom
        </h1>
        <p className="text-lg leading-relaxed mb-10 text-gray-700 animate-fadeIn delay-150">
          Organization news, press releases, and updates from across the
          community. Explore how Artisan Barber Academy is shaping the
          conversation in craft, education, and entrepreneurship.
        </p>

        {/* Divider line that subtly grows on mount */}
        <div className="w-0 h-px bg-black mx-auto mb-12 animate-growLine" />
      </section>

      {/* Articles Section */}
      <section className="animate-fadeIn delay-300">
        <NewsroomClient articles={articles} />
      </section>
    </main>
  );
}
