import { Bot } from "lucide-react";

/**
 * Animated 3-dot typing indicator shown while the AI is generating a response.
 */
export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 animate-fade-in-up">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot size={16} className="text-primary" />
      </div>

      {/* Dots bubble */}
      <div className="bg-white shadow-sm border border-border rounded-2xl rounded-bl-md px-5 py-3.5 flex items-center gap-1.5">
        <span className="dot-animation w-2 h-2 rounded-full bg-text-muted inline-block" />
        <span className="dot-animation w-2 h-2 rounded-full bg-text-muted inline-block" />
        <span className="dot-animation w-2 h-2 rounded-full bg-text-muted inline-block" />
      </div>
    </div>
  );
}
