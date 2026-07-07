import React from 'react';

export function QualityBadge({ label, value, type }) {
  const getBadgeColors = () => {
    switch (type) {
      case 'success':
        return 'text-[var(--accent-cyan)] border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5';
      case 'indigo':
        return 'text-[var(--accent-indigo)] border-[var(--accent-indigo)]/20 bg-[var(--accent-indigo)]/5';
      case 'warning':
        return 'text-[var(--accent-indigo)] border-[var(--accent-indigo)]/20 bg-[var(--accent-indigo)]/5';
      default:
        return 'text-[var(--text-secondary)] border-[var(--border-subtle)] bg-[var(--bg-surface)]';
    }
  };

  return (
    <div className={`flex flex-col p-3 rounded border font-sans select-none ${getBadgeColors()}`}>
      <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </span>
      <span className="text-sm font-bold mt-1 text-[var(--text-primary)]">
        {value}
      </span>
    </div>
  );
}

export default QualityBadge;
