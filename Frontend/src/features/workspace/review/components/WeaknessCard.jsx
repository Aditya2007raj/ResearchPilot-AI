import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function WeaknessCard({ title, description }) {
  return (
    <div className="p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-indigo)]/30 transition-colors space-y-2">
      <div className="flex items-center gap-2 text-amber-400">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <h4 className="text-xs font-semibold font-sans tracking-tight text-[var(--text-primary)]">
          {title}
        </h4>
      </div>
      <p className="text-xs font-serif leading-relaxed text-[var(--text-secondary)] pl-6">
        {description}
      </p>
    </div>
  );
}

export default WeaknessCard;
