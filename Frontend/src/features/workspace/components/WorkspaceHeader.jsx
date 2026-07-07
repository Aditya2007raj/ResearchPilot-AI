import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../lib/routes';

export function WorkspaceHeader({ title, tags, health }) {
  const navigate = useNavigate();

  const getHealthBadgeStyles = (status) => {
    switch (status) {
      case 'Fully Analyzed':
        return 'text-[var(--accent-cyan)] border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5';
      case 'Summary Only':
        return 'text-[var(--accent-indigo)] border-amber-400/20 bg-amber-400/5';
      case 'Not Reviewed':
      default:
        return 'text-[var(--text-muted)] border-[var(--border-subtle)] bg-[var(--bg-surface)]';
    }
  };

  return (
    <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between px-6 select-none">
      {/* Title block with back navigate trigger */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="p-2 -ml-2 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-colors cursor-pointer"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-[280px] sm:max-w-[400px]">
            {title}
          </h1>
          <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
            {tags?.map((tag) => (
              <span 
                key={tag} 
                className="text-[9px] px-2 py-0.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] bg-[var(--bg-base)] font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Health status badge */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase hidden md:inline">Research Health:</span>
        <span className={`text-[10px] px-2.5 py-1 rounded border font-semibold ${getHealthBadgeStyles(health)}`}>
          {health}
        </span>
      </div>
    </header>
  );
}

export default WorkspaceHeader;
