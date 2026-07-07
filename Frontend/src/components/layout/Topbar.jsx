import React from 'react';
import { Search, User } from 'lucide-react';
import { MOCK_USER } from '../../lib/constants';

export function Topbar() {
  return (
    <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between px-8 select-none">
      {/* Context breadcrumb header */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">Workspace</span>
        <span className="text-xs text-[var(--text-muted)] font-mono">/</span>
        <span className="text-xs text-[var(--text-primary)] font-medium font-mono">Dashboard</span>
      </div>

      {/* Global Actions Area */}
      <div className="flex items-center gap-6">
        {/* Mock Search Trigger bar */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)] w-64 text-[var(--text-muted)] cursor-pointer hover:border-[var(--text-muted)] transition-colors">
          <Search className="w-4 h-4" />
          <span className="text-xs flex-1">Search research...</span>
          <kbd className="text-[10px] font-mono bg-[var(--bg-surface)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">⌘K</kbd>
        </div>

        {/* Profile indicator placeholder */}
        <div className="flex items-center gap-3 pl-6 border-l border-[var(--border-subtle)]">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-[var(--text-primary)]">{MOCK_USER.name}</span>
            <span className="text-[10px] text-[var(--text-muted)]">{MOCK_USER.role}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)]">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
export default Topbar;
