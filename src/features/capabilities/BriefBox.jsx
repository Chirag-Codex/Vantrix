import * as React from 'react';
import { Upload, ArrowUp, Loader2, FileText, X, AlertCircle } from 'lucide-react';

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.md'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

/**
 * Brief input box with textarea, character counter, file attachment, and criteria extract trigger.
 * Frontend-only: no network calls, strictly validates extension and MIME type.
 */
export function BriefBox({
  prompt,
  onPromptChange,
  attachedFile,
  onFileAttach,
  onFileRemove,
  onExtract,
  isExtracting,
}) {
  const [fileError, setFileError] = React.useState('');
  const fileInputRef = React.useRef(null);

  const handleFileSelect = (e) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (2 MB)
    if (file.size > MAX_FILE_SIZE) {
      setFileError('File exceeds 2 MB limit.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Check extension
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const isValidExt = ALLOWED_EXTENSIONS.includes(ext);
    const isValidMime = !file.type || ALLOWED_MIME_TYPES.includes(file.type);

    if (!isValidExt || !isValidMime) {
      setFileError('Unsupported file type. Allowed: .pdf, .doc, .docx, .txt, .md');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // For .txt and .md, read at most the first 20 KB as brief text
    if (ext === '.txt' || ext === '.md') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = String(event.target?.result || '').slice(0, 20480);
        onPromptChange(text.slice(0, 2000));
        onFileAttach({
          name: file.name.slice(0, 80),
          size: file.size,
          type: file.type || 'text/plain',
        });
      };
      reader.readAsText(file.slice(0, 20480));
    } else {
      // For binary documents, attach metadata only without reading binary
      onFileAttach({
        name: file.name.slice(0, 80),
        size: file.size,
        type: file.type || 'application/octet-stream',
      });
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isExtractDisabled = isExtracting || (!prompt.trim() && !attachedFile);

  return (
    <div className="rounded-[20px] border border-[var(--line)] bg-[rgb(var(--c-chip))] p-4 transition-colors">
      <label htmlFor="brief-prompt-input" className="sr-only">
        Role brief or job description
      </label>
      <textarea
        id="brief-prompt-input"
        rows={3}
        maxLength={2000}
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="Write your role brief in plain language or upload a job spec..."
        className="w-full resize-none bg-transparent text-[14px] leading-relaxed text-[rgb(var(--c-text))] placeholder:text-[rgb(var(--c-muted-2))] focus:outline-none"
      />

      {fileError && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {attachedFile && (
        <div className="mt-2 flex items-center justify-between rounded-full border border-[var(--line)] bg-[rgb(var(--c-card))] px-3 py-1 text-[12px] text-[rgb(var(--c-text))]">
          <div className="flex items-center gap-1.5 truncate">
            <FileText className="h-3.5 w-3.5 text-[rgb(var(--c-indigo))] shrink-0" />
            <span className="truncate">{attachedFile.name}</span>
            <span className="text-[rgb(var(--c-muted-2))] text-[11px]">
              ({Math.round(attachedFile.size / 1024)} KB)
            </span>
          </div>
          <button
            type="button"
            onClick={onFileRemove}
            aria-label="Remove attached file"
            className="ml-2 text-[rgb(var(--c-muted-2))] hover:text-[rgb(var(--c-text))]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Action Row */}
      <div className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-3">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md"
            onChange={handleFileSelect}
            className="hidden"
            id="brief-file-upload"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] bg-[rgb(var(--c-card))] px-3 py-1.5 text-[12px] font-semibold text-[rgb(var(--c-text))] transition-colors hover:bg-[rgb(var(--c-chip))] cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload file</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[12px] text-[rgb(var(--c-muted-2))]">
            {prompt.length} / 2000
          </span>
          <button
            type="button"
            onClick={onExtract}
            disabled={isExtractDisabled}
            aria-label="Extract criteria"
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
              isExtractDisabled
                ? 'bg-[rgb(var(--c-muted-2)/0.3)] text-[rgb(var(--c-muted-2))] cursor-not-allowed'
                : 'bg-[rgb(var(--c-btn))] text-[rgb(var(--c-btn-text))] hover:opacity-90 cursor-pointer shadow-sm'
            }`}
          >
            {isExtracting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
