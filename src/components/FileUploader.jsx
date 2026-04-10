import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";

/**
 * Drag-and-drop & click-to-browse PDF upload zone.
 * @param {{ file: File | null, onFileSelect: (f: File | null) => void, disabled: boolean }} props
 */
export default function FileUploader({ file, onFileSelect, disabled }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile?.type === "application/pdf") {
        onFileSelect(droppedFile);
      }
    },
    [disabled, onFileSelect]
  );

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed
        transition-all duration-300 ease-out
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${
          isDragOver
            ? "border-primary bg-primary/5 drag-pulse"
            : file
            ? "border-primary/40 bg-primary/[0.03]"
            : "border-border bg-surface-alt hover:border-primary/40 hover:bg-primary/[0.02]"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center justify-center py-10 px-6">
        {file ? (
          /* ── File Selected State ── */
          <div className="flex flex-col items-center gap-3 animate-fade-in-up">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileText size={28} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-text truncate max-w-[260px]">
                {file.name}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {formatSize(file.size)}
              </span>
            </div>
            {!disabled && (
              <button
                onClick={handleRemove}
                className="mt-1 flex items-center gap-1 text-xs text-text-muted hover:text-error transition-colors"
              >
                <X size={14} />
                Remove
              </button>
            )}
          </div>
        ) : (
          /* ── Empty / Idle State ── */
          <>
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                isDragOver ? "bg-primary/15" : "bg-surface"
              }`}
            >
              <UploadCloud
                size={28}
                className={`transition-colors duration-300 ${
                  isDragOver ? "text-primary" : "text-text-muted"
                }`}
              />
            </div>
            <p className="text-sm font-medium text-text">
              {isDragOver ? "Drop your PDF here" : "Drag & drop your PDF here"}
            </p>
            <p className="text-xs text-text-muted mt-1">
              or{" "}
              <span className="text-primary font-medium hover:underline">
                click to browse
              </span>
            </p>
            <p className="text-[11px] text-text-muted/60 mt-3">
              Accepts .pdf files only
            </p>
          </>
        )}
      </div>
    </div>
  );
}
