"use client";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { lazy, Suspense, memo } from "react";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

// Lazy load heavy components
const MarkdownToPdf = lazy(() => import("@/utils/markdown-to-pdf"));
const MarkdownToPreviewer = lazy(() => import("@/utils/preview-markdown"));

const md = new MarkdownIt();

type Message = {
  role: "Human" | "AI";
  content: string;
  reasoning: string;
  timestamp: string;
};

const ChatMessage: React.FC<{
  message: Message;
  threadId: string;
}> = memo(({ message, threadId }) => {
  const formattedTimestamp = new Date(message.timestamp).toLocaleString();

  const renderMarkdown = (content: string) => {
    const html = md.render(content);
    const sanitizedHtml = DOMPurify.sanitize(html);
    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        message.role === "Human" ? "justify-end" : "justify-start"
      )}
    >
      <div className="flex items-start gap-3 max-w-[85%]">
        {message.role === "AI" && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 shadow-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
        )}
        <div
          className={cn(
            "rounded-md shadow-md overflow-hidden",
            message.role === "Human"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 border-2 border-green-600 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          )}
        >
          <div className="px-5 py-4">
            {message.role === "AI" ? (
              renderMarkdown(message.content)
            ) : (
              <p className="whitespace-pre-wrap text-base">{message.content}</p>
            )}
          </div>

          <div
            className={cn(
              "px-5 py-2 text-sm border-t",
              message.role === "Human"
                ? "border-white/20 bg-white/10"
                : "border-green-600/20 bg-green-600/5"
            )}
          >
            {formattedTimestamp}
          </div>

          {message.role === "AI" && (
            <div className="px-5 py-2 border-t border-green-600/20 bg-green-600/5">
              <Suspense fallback={<div>Loading preview...</div>}>
                <MarkdownToPreviewer
                  markdown={message.reasoning}
                  filename={`reasoning_${threadId}_${message.timestamp}.pdf`}
                />
                <MarkdownToPdf
                  markdown={message.reasoning}
                  filename={`reasoning_${threadId}_${message.timestamp}.pdf`}
                />
              </Suspense>
            </div>
          )}
        </div>

        {message.role === "Human" && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 shadow-lg flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage"; // Add display name for debugging

export default ChatMessage;
