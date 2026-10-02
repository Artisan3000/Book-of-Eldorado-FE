import Markdown from "react-markdown";

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
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
