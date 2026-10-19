import Markdown from "react-markdown";
import ExpandableLessonImage from "@/app/components/ExpandableLessonImage";

const LESSON_IMAGE_DIMENSIONS = {
  "/lesson-diagrams/chapter-2-lesson-2-6-texture-volume-guide.png": {
    width: 1536,
    height: 1024,
  },
  "/lesson-diagrams/chapter-2-lesson-2-9-childrens-haircut-comfort-guide.png": {
    width: 1536,
    height: 1024,
  },
  "/lesson-diagrams/chapter-2-lesson-2-10-capstone-service-decision-chain.png": {
    width: 1536,
    height: 1024,
  },
} as const;

// Rendered on the server so the Markdown parser never ships to the browser.
// Raw HTML in lesson bodies is dropped rather than rendered.
export default function LessonMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="lesson-body">
      <Markdown
        skipHtml
        components={{
          // The page already renders the lesson title as the only h1.
          h1: ({ children }) => <h2>{children}</h2>,
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http");

            return (
              <a
                href={href}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => {
            if (typeof src !== "string" || !src) {
              return null;
            }

            const dimensions =
              LESSON_IMAGE_DIMENSIONS[src as keyof typeof LESSON_IMAGE_DIMENSIONS] ??
              { width: 1672, height: 941 };

            return (
              <ExpandableLessonImage
                src={src}
                alt={alt || ""}
                width={dimensions.width}
                height={dimensions.height}
              />
            );
          },
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
