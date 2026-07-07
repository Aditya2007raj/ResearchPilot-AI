import React from 'react';
import { Sparkles } from 'lucide-react';

export function SuggestedPrompts({ prompts, onPromptClick }) {
  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center gap-1.5 text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
        <Sparkles className="w-3 h-3 text-[var(--accent-indigo)]" />
        <span>Suggested Inquiries</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onPromptClick(prompt)}
            className="p-2.5 text-left rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-indigo)]/50 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer truncate"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SuggestedPrompts;
