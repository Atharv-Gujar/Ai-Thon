import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, History, Plus, Trash2 } from "lucide-react";
import ChatWindow from "../components/ChatWindow";
import ChatHistory from "../components/ChatHistory";
import { queryPaper } from "../api/ragApi";

/* ── Session helpers (localStorage) ── */
const STORAGE_KEY = "rag-chat-sessions";

const loadSessions = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveSessions = (sessions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

const createSession = () => ({
  id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
  title: "New Chat",
  timestamp: Date.now(),
  messages: [],
});

/* ── Message ID generator (unchanged) ── */
let messageId = 0;
const nextId = () => String(++messageId);

/**
 * Chat Page — full-height chat UI with fixed navbar, input bar, and history sidebar.
 */
export default function ChatPage() {
  const [sessions, setSessions] = useState(() => {
    const saved = loadSessions();
    return saved.length > 0 ? saved : [createSession()];
  });
  const [activeId, setActiveId] = useState(() => {
    const saved = loadSessions();
    return saved.length > 0 ? saved[0].id : sessions[0]?.id;
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const navigate = useNavigate();

  /* Active session's messages */
  const activeSession = sessions.find((s) => s.id === activeId);
  const messages = activeSession?.messages || [];

  /* Persist sessions to localStorage on every change */
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  /* Update messages for the active session */
  const updateActiveMessages = useCallback(
    (updater) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeId) return s;
          const newMsgs = typeof updater === "function" ? updater(s.messages) : updater;
          /* Auto-title from first user message */
          const title =
            s.title === "New Chat"
              ? (newMsgs.find((m) => m.role === "user")?.content.slice(0, 40) || "New Chat")
              : s.title;
          return { ...s, messages: newMsgs, title, timestamp: Date.now() };
        })
      );
    },
    [activeId]
  );

  /* ── Send message (existing logic preserved) ── */
  const sendMessage = useCallback(async () => {
    const query = input.trim();
    if (!query || isLoading) return;

    const userMsg = { id: nextId(), role: "user", content: query };
    updateActiveMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await queryPaper(query);
      updateActiveMessages((prev) => [
        ...prev,
        { id: nextId(), role: "ai", content: response },
      ]);
    } catch {
      updateActiveMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "ai",
          content:
            "⚠️ Sorry, something went wrong. Please try again or rephrase your question.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, updateActiveMessages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ── History actions ── */
  const handleNewChat = () => {
    const newSession = createSession();
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(newSession.id);
    setInput("");
  };

  const handleSelectSession = (id) => {
    setActiveId(id);
    setInput("");
  };

  const handleDeleteSession = (id) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fresh = createSession();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(filtered[0].id);
      return filtered;
    });
  };

  const handleClearAll = () => {
    const fresh = createSession();
    setSessions([fresh]);
    setActiveId(fresh.id);
    setInput("");
  };

  const handleClearCurrent = () => {
    updateActiveMessages([]);
  };

  return (
    <div className="h-screen flex flex-col bg-surface">
      {/* ── History Sidebar ── */}
      <ChatHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onClearChat={handleClearAll}
      />

      {/* ── Top Navbar ── */}
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-lg border-b border-border px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-alt transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={18} className="text-text-muted" />
          </button>

          {/* History toggle */}
          <button
            onClick={() => setHistoryOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-alt transition-colors"
            aria-label="Chat history"
          >
            <History size={18} className="text-text-muted" />
          </button>

          <div className="h-5 w-px bg-border mx-1" />

          <h1 className="text-base font-semibold text-text truncate max-w-[180px] sm:max-w-none">
            {activeSession?.title || "Research Paper Q&A"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* New Chat */}
          <button
            onClick={handleNewChat}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                       text-primary border border-primary/20 hover:bg-primary/5 transition-all"
            aria-label="New chat"
          >
            <Plus size={14} />
            New Chat
          </button>

          {/* Clear current chat */}
          {messages.length > 0 && (
            <button
              onClick={handleClearCurrent}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                         text-text-muted border border-border hover:bg-error/5 hover:text-error hover:border-error/20 transition-all"
              aria-label="Clear chat"
            >
              <Trash2 size={13} />
              Clear
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-alt border border-border text-[11px] font-medium text-text-muted">
            <Sparkles size={12} className="text-primary" />
            Powered by Gemini + Pinecone
          </div>
        </div>
      </header>

      {/* ── Chat Messages ── */}
      <ChatWindow messages={messages} isLoading={isLoading} />

      {/* ── Bottom Input Bar ── */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-lg border-t border-border px-4 sm:px-6 py-3.5">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask a question about the paper…"
              className="w-full rounded-xl border border-border bg-surface-alt
                         px-4 py-3 pr-12 text-sm text-text placeholder:text-text-muted/50
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`
              w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
              transition-all duration-300 ease-out
              ${
                !input.trim() || isLoading
                  ? "bg-primary/20 text-white/50 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 active:scale-95"
              }
            `}
            aria-label="Send message"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
