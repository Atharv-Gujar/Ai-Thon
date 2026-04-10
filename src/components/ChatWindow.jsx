import { useEffect, useRef } from "react";
import { MessageSquareText } from "lucide-react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

/**
 * Scrollable chat message list with auto-scroll and empty state.
 * @param {{ messages: Array<{id: string, role: "user"|"ai", content: string}>, isLoading: boolean }} props
 */
export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* ── Empty state ── */
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-5">
          <MessageSquareText size={36} className="text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-text">
          Ask anything about your research paper
        </h2>
        <p className="text-sm text-text-muted mt-1.5 max-w-sm">
          Your paper has been indexed. Ask questions and get instant, AI-powered
          answers backed by the paper's content.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
