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

  return <NewsroomClient articles={articles} />;
}
