import React from 'react';
import { BookOpen } from 'lucide-react';

export function TLDRBlock({ tldr }) {
  return (
    <div className="p-5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[var(--accent-indigo)] font-semibold">
        <BookOpen className="w-3.5 h-3.5" />
        <span>TL;DR Executive Summary</span>
      </div>
      <p className="text-xs font-serif leading-relaxed text-[var(--text-primary)] italic">
        "{tldr}"
      </p>
    </div>
  );
}

export default TLDRBlock;
