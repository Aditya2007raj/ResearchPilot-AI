import React from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';
import { UserDropdown } from './UserDropdown';

export function Topbar() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between px-8 select-none z-30 relative">
      {/* Context breadcrumb header */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">Workspace</span>
        <span className="text-xs text-[var(--text-muted)] font-mono">/</span>
        <span className="text-xs text-[var(--text-primary)] font-medium font-mono">Dashboard</span>
      </div>

      {/* Global Actions Area */}
      <div className="flex items-center gap-5">
        {/* Search Trigger bar */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] w-56 md:w-64 text-[var(--text-muted)] cursor-pointer hover:border-[var(--text-muted)] transition-colors">
          <Search className="w-4 h-4" />
          <span className="text-xs flex-1 truncate">Search research...</span>
          <kbd className="text-[10px] font-mono bg-[var(--bg-surface)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)] hidden sm:inline-block">⌘K</kbd>
        </div>

        {/* Theme Switcher Toggle */}
        <div className="relative group">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)] text-base transition-transform duration-300 active:scale-95 cursor-pointer"
            aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            <span className={`transition-transform duration-500 inline-block ${theme === 'light' ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`}>
              {theme === 'light' ? '☀️' : '🌙'}
            </span>
          </button>
          <div className="absolute right-0 top-12 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-[10px] font-mono font-medium rounded py-1 px-2.5 whitespace-nowrap shadow-sm">
            {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Warm Light Mode'}
          </div>
        </div>

        {/* Synchronized User Profile Dropdown */}
        <div className="pl-4 border-l border-[var(--border-subtle)]">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
export default Topbar;
