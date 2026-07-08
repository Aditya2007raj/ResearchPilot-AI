import React from 'react';
import { Search, User } from 'lucide-react';
import { MOCK_USER } from '../../lib/constants';
import { useTheme } from '../../theme/ThemeProvider';

export function Topbar() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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

        {/* Theme Switcher Toggle with Tooltip & Animation */}
        <div className="relative group">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)] text-lg transition-transform duration-300 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
            aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            <span className={`transition-transform duration-500 inline-block ${theme === 'light' ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`}>
              {theme === 'light' ? '☀️' : '🌙'}
            </span>
          </button>
          {/* Tooltip */}
          <div className="absolute right-0 top-12 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-[10px] font-mono font-medium rounded py-1 px-2.5 whitespace-nowrap shadow-sm">
            {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Warm Light Mode'}
          </div>
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
