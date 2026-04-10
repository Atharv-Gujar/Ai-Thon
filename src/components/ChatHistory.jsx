import { MessageSquare, Plus, Trash2, X, Clock } from "lucide-react";

/**
 * Sidebar showing chat history with new chat & clear actions.
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   sessions: Array<{ id: string, title: string, timestamp: number, messages: Array }>,
 *   activeSessionId: string | null,
 *   onSelectSession: (id: string) => void,
 *   onNewChat: () => void,
 *   onDeleteSession: (id: string) => void,
 *   onClearChat: () => void,
 * }} props
 */
export default function ChatHistory({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearChat,
}) {
  const formatTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white border-r border-border
          shadow-2xl shadow-black/10 z-50 flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-text">Chat History</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-alt transition-colors"
          >
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 py-3">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl
                       border border-dashed border-primary/30 text-primary text-sm font-medium
                       hover:bg-primary/5 hover:border-primary/50 transition-all duration-200"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare size={28} className="text-text-muted/30 mb-2" />
              <p className="text-xs text-text-muted/50">No chat history yet</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`
                  group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer
                  transition-all duration-200
                  ${
                    session.id === activeSessionId
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-surface-alt border border-transparent"
                  }
                `}
                onClick={() => {
                  onSelectSession(session.id);
                  onClose();
                }}
              >
                <MessageSquare
                  size={14}
                  className={
                    session.id === activeSessionId
                      ? "text-primary flex-shrink-0"
                      : "text-text-muted flex-shrink-0"
                  }
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text truncate">{session.title}</p>
                  <p className="text-[10px] text-text-muted/60">
                    {session.messages.length} messages · {formatTime(session.timestamp)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg
                             flex items-center justify-center flex-shrink-0
                             hover:bg-error/10 text-text-muted hover:text-error transition-all"
                  aria-label="Delete session"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Clear All */}
        {sessions.length > 0 && (
          <div className="px-3 py-3 border-t border-border">
            <button
              onClick={() => {
                onClearChat();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2
                         rounded-xl text-xs font-medium text-error/70
                         hover:bg-error/5 hover:text-error transition-all duration-200"
            >
              <Trash2 size={13} />
              Clear All History
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
