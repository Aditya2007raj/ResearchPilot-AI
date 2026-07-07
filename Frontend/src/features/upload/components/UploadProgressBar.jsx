import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export function UploadProgressBar({ progress, pipelineSteps }) {
  const steps = [
    { key: 'extracted', label: 'Text Extracted' },
    { key: 'chunked', label: 'Document Chunked' },
    { key: 'embeddings', label: 'Embeddings Generated' },
    { key: 'vectorDb', label: 'Vector Database Populated' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Progress Bar Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[var(--text-secondary)]">Initializing Workspace...</span>
          <span className="text-[var(--accent-indigo)] font-bold">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent-indigo)] to-[var(--accent-cyan)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>

      {/* Transparent Pipeline Steps */}
      <div className="border border-[var(--border-subtle)] rounded bg-[var(--bg-surface)] p-4 space-y-3">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2 mb-2">
          System Processing Steps
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {steps.map((step) => {
            const isCompleted = pipelineSteps[step.key];
            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 px-3 py-2.5 rounded border transition-colors ${
                  isCompleted
                    ? 'border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5 text-[var(--text-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-base)]/50 text-[var(--text-muted)]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-cyan)] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[var(--text-muted)] shrink-0 animate-pulse" />
                )}
                <span className="text-xs font-medium font-sans">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UploadProgressBar;
