import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

/**
 * Visual status indicator for upload states.
 * @param {{ status: "idle" | "uploading" | "success" | "error" }} props
 */
export default function StatusBadge({ status }) {
  if (status === "idle") return null;

  if (status === "uploading") {
    return (
      <div className="flex items-center justify-center gap-2 mt-4 text-primary animate-fade-in-up">
        <Loader2 size={18} className="spinner" />
        <span className="text-sm font-medium">Indexing your paper…</span>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2 mt-4 text-success animate-fade-in-up">
        <svg
          className="check-animated"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm font-medium">
          Paper indexed successfully! Redirecting…
        </span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-xl bg-error-light text-error animate-fade-in-up">
        <AlertCircle size={18} />
        <span className="text-sm font-medium">
          Upload failed. Please try again.
        </span>
      </div>
    );
  }

  return null;
}
