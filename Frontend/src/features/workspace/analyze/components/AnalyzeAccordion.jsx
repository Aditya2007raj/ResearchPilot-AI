import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function AnalyzeAccordion({ sections }) {
  const [openSectionKey, setOpenSectionKey] = useState(null);

  const toggleSection = (key) => {
    setOpenSectionKey(prev => prev === key ? null : key);
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isOpen = openSectionKey === section.key;
        return (
          <div 
            key={section.key}
            className={`border rounded overflow-hidden transition-all duration-200 ${
              isOpen 
                ? 'border-[var(--border-focus)] bg-[var(--bg-surface)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 hover:border-[var(--text-muted)]'
            }`}
          >
            {/* Header / Toggle Button */}
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer select-none"
              aria-expanded={isOpen}
            >
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                {section.title}
              </span>
              <span className="text-[var(--text-secondary)]">
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {/* Expandable Content Area */}
            {isOpen && (
              <div className="px-5 pb-5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] pt-4">
                <div className="text-xs font-serif leading-relaxed text-[var(--text-secondary)] font-normal space-y-3">
                  {section.content}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AnalyzeAccordion;
