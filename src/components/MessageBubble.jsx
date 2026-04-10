import { Bot, User } from "lucide-react";

/**
 * A single chat message bubble — user (right) or AI (left).
 * @param {{ role: "user" | "ai", content: string }} props
 */
export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-end gap-3 animate-fade-in-up ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-primary text-white"
            : "bg-primary/10 text-primary"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? "bg-primary text-white rounded-2xl rounded-br-md shadow-md"
            : "bg-white text-text border border-border rounded-2xl rounded-bl-md shadow-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
