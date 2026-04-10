import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowUpRight, Search, FileSearch } from "lucide-react";
import FileUploader from "../components/FileUploader";
import StatusBadge from "../components/StatusBadge";
import { uploadPaper } from "../api/ragApi";

/**
 * Upload Page — hero card with drag/drop PDF uploader.
 */
export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file || status === "uploading") return;

    setStatus("uploading");
    try {
      await uploadPaper(file);
      setStatus("success");
      setTimeout(() => navigate("/chat"), 1500);
    } catch {
      setStatus("error");
    }
  };

  const isUploading = status === "uploading";

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-12">
      {/* ── Main Card ── */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-black/[0.04] border border-border p-8 sm:p-10 animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/20">
            <FileSearch size={32} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-text">
          Research Paper Q&A
        </h1>
        <p className="text-sm text-text-muted text-center mt-2 max-w-sm mx-auto">
          Upload a research paper PDF and ask questions about it instantly.
        </p>

        {/* Upload Zone */}
        <div className="mt-8">
          <FileUploader
            file={file}
            onFileSelect={setFile}
            disabled={isUploading || status === "success"}
          />
        </div>

        {/* CTA Button */}
        <button
          disabled={!file || isUploading || status === "success"}
          onClick={handleUpload}
          className={`
            w-full mt-6 flex items-center justify-center gap-2
            rounded-xl py-3.5 px-6 text-sm font-semibold
            transition-all duration-300 ease-out
            ${
              !file || isUploading || status === "success"
                ? "bg-primary/30 text-white/70 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
            }
          `}
        >
          {isUploading ? (
            <>
              <Loader2 size={18} className="spinner" />
              Indexing your paper…
            </>
          ) : status === "success" ? (
            "Redirecting…"
          ) : (
            <>
              Upload & Index Paper
              <ArrowUpRight size={16} />
            </>
          )}
        </button>

        {/* Status */}
        <StatusBadge status={status} />
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-text-muted/60 flex items-center gap-1.5">
        <Search size={12} />
        Built for Hackathon 2025
      </p>
    </div>
  );
}
