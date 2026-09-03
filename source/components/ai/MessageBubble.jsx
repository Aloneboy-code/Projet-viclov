import ReactMarkdown from "react-markdown";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
        isUser
          ? "bg-primary text-white"
          : "bg-card border border-border text-foreground"
      )}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown
            className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
            components={{
              p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              ul: ({ children }) => <ul className="my-1 ml-4 list-disc space-y-0.5">{children}</ul>,
              ol: ({ children }) => <ol className="my-1 ml-4 list-decimal space-y-0.5">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              h1: ({ children }) => <h1 className="text-base font-bold my-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-bold my-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold my-1">{children}</h3>,
              code: ({ inline, children }) => inline
                ? <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                : <pre className="bg-muted rounded-lg p-3 overflow-x-auto my-2 text-xs"><code>{children}</code></pre>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/40 pl-3 my-2 text-muted-foreground italic">{children}</blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-2">
                  <table className="w-full text-xs border-collapse border border-border">{children}</table>
                </div>
              ),
              th: ({ children }) => <th className="border border-border bg-muted px-2 py-1 font-semibold text-left">{children}</th>,
              td: ({ children }) => <td className="border border-border px-2 py-1">{children}</td>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}