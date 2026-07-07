import React from 'react';
import { User, ShieldAlert } from 'lucide-react';
import { TrustBadge } from './TrustBadge';

export function ChatMessage({ message, onCitationClick }) {
  const { sender, text, confidence, citations } = message;
  const isAi = sender === 'ai';

  return (
    <div className={`flex gap-4 p-4 rounded border ${
      isAi 
        ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
        : 'border-[var(--accent-indigo)]/10 bg-[var(--accent-indigo)]/5'
    }`}>
      {/* Icon bubble */}
      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border select-none ${
        isAi 
          ? 'bg-[var(--bg-base)] text-[var(--accent-indigo)] border-[var(--border-subtle)]'
          : 'bg-[var(--accent-indigo)] text-white border-[var(--accent-indigo)]'
      }`}>
        {isAi ? <ShieldAlert className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Text area */}
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            {isAi ? 'ResearchPilot AI' : 'You'}
          </span>
          {isAi && confidence && <TrustBadge confidence={confidence} />}
        </div>
        
        <p className="text-xs font-serif leading-relaxed text-[var(--text-primary)]">
          {text}
        </p>

        {/* Citation Chip badges row */}
        {isAi && citations && citations.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase select-none mr-1">Evidence Sources:</span>
            {citations.map((cit, idx) => (
              <button
                key={idx}
                onClick={() => onCitationClick(cit.refId)}
                className="px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-[var(--accent-indigo)]/10 border border-[var(--accent-indigo)]/25 text-[var(--accent-indigo)] hover:bg-[var(--accent-indigo)]/25 transition-colors cursor-pointer"
              >
                {cit.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
