import React from 'react';
import { Award } from 'lucide-react';

export function ReferenceCard({ reference, isHighlighted, onClick }) {
  const { id, title, authors, source, page, confidence, snippet } = reference;

  return (
    <div
      id={`reference-card-${id}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`p-4 rounded border text-left cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-indigo)] ${
        isHighlighted
          ? 'border-[var(--accent-indigo)] bg-[var(--accent-indigo)]/5 shadow-[0_0_12px_rgba(99,102,241,0.15)] scale-[1.01]'
          : 'border-[var(--border-subtle)] bg-[var(--bg-base)]/45 hover:border-[var(--text-muted)] focus-visible:border-[var(--border-focus)]'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--accent-cyan)] font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>{confidence}% Confidence</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]">
          Page {page}
        </span>
      </div>

      <h4 className="text-xs font-semibold text-[var(--text-primary)] leading-snug mb-1">
        {title}
      </h4>
      <p className="text-[10px] text-[var(--text-secondary)] mb-3">
        {authors} ({source})
      </p>

      {snippet && (
        <blockquote className="text-[11px] font-serif border-l-2 border-[var(--accent-indigo)]/50 pl-2.5 py-0.5 text-[var(--text-muted)] italic leading-relaxed">
          "{snippet}"
        </blockquote>
      )}
    </div>
  );
}

export default ReferenceCard;
