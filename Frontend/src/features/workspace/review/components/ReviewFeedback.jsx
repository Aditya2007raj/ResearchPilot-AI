import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

export function ReviewFeedback({ critique, feedback }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`border rounded overflow-hidden transition-all duration-200 ${
        isOpen 
          ? 'border-[var(--border-focus)] bg-[var(--bg-surface)]'
          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 hover:border-[var(--text-muted)]'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-primary)]">
          <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-indigo)]" />
          <span>Detailed Critique & Feedback</span>
        </div>
        <span className="text-[var(--text-secondary)]">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 border-t border-[var(--border-subtle)] pt-4 space-y-4 text-xs font-serif leading-relaxed text-[var(--text-secondary)]">
          <div className="space-y-2">
            <h5 className="font-sans font-bold text-[var(--text-primary)] uppercase text-[10px] tracking-wider text-[var(--accent-cyan)]">Methodology Critique</h5>
            <p>{critique}</p>
          </div>
          <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
            <h5 className="font-sans font-bold text-[var(--text-primary)] uppercase text-[10px] tracking-wider text-[var(--accent-cyan)]">Actionable Recommendations</h5>
            <ul className="list-disc pl-4 space-y-1">
              {feedback.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewFeedback;
