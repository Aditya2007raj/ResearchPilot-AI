import React from 'react';
import { ReferenceCard } from './ReferenceCard';
import { BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';

export function ReferencesPanel({ 
  references, 
  highlightedReferenceId, 
  onReferenceClick,
  isOpen,
  setIsOpen
}) {
  return (
    <div 
      className={`border-l border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col h-full transition-all duration-300 ease-in-out overflow-hidden relative shrink-0 ${
        isOpen ? 'w-80' : 'w-12'
      }`}
    >
      {/* Toggle button overlay */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-3 w-6 h-6 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] cursor-pointer z-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-indigo)]"
        aria-label={isOpen ? 'Collapse references' : 'Expand references'}
      >
        {isOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* COLLAPSED VIEW (Narrow vertical label bar) */}
      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
          className="flex-1 flex flex-col items-center pt-16 gap-3 cursor-pointer select-none text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors outline-none focus-visible:bg-[var(--bg-base)]"
          aria-label="Expand references panel"
        >
          <BookOpen className="w-4 h-4" />
          <span 
            className="text-[10px] font-mono font-semibold uppercase tracking-widest whitespace-nowrap mt-4"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Source References
          </span>
          {highlightedReferenceId && (
            <span className="w-2 h-2 rounded-full bg-[var(--accent-indigo)] mt-4 animate-ping" />
          )}
        </div>
      )}

      {/* EXPANDED VIEW */}
      {isOpen && (
        <div className="flex flex-col h-full overflow-hidden select-none">
          <div className="h-16 flex items-center pl-12 pr-4 border-b border-[var(--border-subtle)] justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Source References
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
              {references.length} found
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {references.map((ref) => (
              <ReferenceCard
                key={ref.id}
                reference={ref}
                isHighlighted={highlightedReferenceId === ref.id}
                onClick={() => onReferenceClick(ref.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReferencesPanel;
