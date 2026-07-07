import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Link2 } from 'lucide-react';

export function TaskCard({ 
  task, 
  onToggleComplete, 
  onSaveNotes, 
  onCitationClick 
}) {
  const { id, title, instruction, refId, refLabel, notes: initialNotes, isCompleted } = task;
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(initialNotes || '');

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleBlur = () => {
    onSaveNotes(id, notes);
  };

  return (
    <div 
      className={`border rounded overflow-hidden transition-all duration-200 ${
        isCompleted
          ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)]/30 opacity-75'
          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--text-muted)]'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 select-none">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleComplete(id)}
            className="w-4 h-4 rounded border-[var(--border-subtle)] text-[var(--accent-indigo)] bg-[var(--bg-base)] focus:ring-2 focus:ring-[var(--border-focus)] shrink-0 cursor-pointer transition-all duration-150 active:scale-95"
          />
          <span className={`text-xs font-semibold text-[var(--text-primary)] truncate transition-all duration-150 ${
            isCompleted ? 'line-through text-[var(--text-muted)]' : ''
          }`}>
            {title}
          </span>
        </label>

        <div className="flex items-center gap-2">
          {refId && (
            <button
              onClick={() => onCitationClick(refId)}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-indigo)] transition-colors cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-indigo)]"
              title={`View citation: ${refLabel}`}
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-indigo)]"
            aria-expanded={isOpen}
            aria-label="Toggle task notes and instructions"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-[var(--border-subtle)] pt-3 bg-[var(--bg-surface)] space-y-3">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Instructions</span>
            <p className="text-xs font-serif leading-relaxed text-[var(--text-secondary)]">
              {instruction}
            </p>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase block">
              Notes / Logs
            </label>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              onBlur={handleBlur}
              placeholder="Add implementation notes, error logs, parameters..."
              className="w-full text-xs font-sans p-2 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-indigo)] focus:border-transparent min-h-[60px] resize-y transition-all duration-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
