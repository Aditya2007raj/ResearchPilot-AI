import React, { useState, useRef } from 'react';
import { Upload, FileUp } from 'lucide-react';

export function DragAndDrop({ onFileSelected, onError }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;

    // Limitations validations
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      onError('invalid-file');
      return;
    }

    // Check size limit: Let's mock a 50MB limit
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_SIZE) {
      onError('file-too-large');
      return;
    }

    // Test triggers for mock errors based on filename (for testing error UI states)
    if (file.name.toLowerCase().includes('encrypted') || file.name.toLowerCase().includes('password')) {
      onError('password-protected');
      return;
    }
    if (file.name.toLowerCase().includes('fail') || file.name.toLowerCase().includes('error')) {
      onError('upload-failure');
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onButtonClick();
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Upload PDF document to initialize research workspace. Maximum file size 20 megabytes."
      className={`w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-12 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ${
        isDragActive
          ? 'border-[var(--accent-indigo)] bg-[var(--accent-indigo)]/5 shadow-[0_0_15px_rgba(99,102,241,0.15)] scale-[1.01]'
          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-indigo)]/50'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,application/pdf"
        onChange={handleChange}
      />

      <div className="w-12 h-12 rounded bg-[var(--bg-base)] flex items-center justify-center border border-[var(--border-subtle)] mb-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-indigo)] transition-colors">
        <Upload className={`w-5 h-5 ${isDragActive ? 'text-[var(--accent-indigo)] animate-bounce' : ''}`} />
      </div>

      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {isDragActive ? (
            <span className="text-[var(--accent-indigo)] font-semibold">Release to initialize workspace</span>
          ) : (
            <>
              Drag & drop paper PDF here, or{' '}
              <span className="text-[var(--accent-indigo)] hover:text-[var(--accent-indigo-hover)] underline underline-offset-2 font-semibold">
                browse files
              </span>
            </>
          )}
        </p>
        <p className="text-xs text-[var(--text-muted)] font-mono">
          PDF format only • Up to 50MB
        </p>
      </div>
    </div>
  );
}

export default DragAndDrop;
