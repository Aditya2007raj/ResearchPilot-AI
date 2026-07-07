import React from 'react';

export function PhaseCard({ title, subtitle, order, children }) {
  return (
    <div className="border border-[var(--border-subtle)] rounded bg-[var(--bg-surface)] overflow-hidden">
      {/* Header section */}
      <div className="bg-[var(--bg-base)]/50 px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-mono text-[var(--accent-indigo)] uppercase tracking-wider font-semibold">
            Phase {order}
          </span>
          <h4 className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">
            {title}
          </h4>
        </div>
        <span className="text-[10px] text-[var(--text-muted)] font-mono">
          {subtitle}
        </span>
      </div>

      {/* Children list region */}
      <div className="p-4 space-y-3">
        {children}
      </div>
    </div>
  );
}

export default PhaseCard;
