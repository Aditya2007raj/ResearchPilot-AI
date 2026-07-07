import React from 'react';
import { Award } from 'lucide-react';

export function TrustBadge({ confidence }) {
  return (
    <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--accent-cyan)] font-semibold shrink-0 select-none">
      <Award className="w-3 h-3" />
      <span>{confidence}% Grounded</span>
    </div>
  );
}

export default TrustBadge;
