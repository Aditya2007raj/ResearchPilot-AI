import React from 'react';
import { User, Calendar, Tag } from 'lucide-react';

export function MetadataBlock({ authors, year, tags }) {
  return (
    <div className="p-5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] select-none">
      <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2 mb-3">
        Document Metadata
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Authors */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-[var(--bg-base)] flex items-center justify-center text-[var(--text-secondary)] shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Authors</div>
            <div className="text-xs font-semibold text-[var(--text-primary)] truncate mt-0.5">
              {authors}
            </div>
          </div>
        </div>

        {/* Year */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-[var(--bg-base)] flex items-center justify-center text-[var(--text-secondary)] shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Published</div>
            <div className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">
              {year}
            </div>
          </div>
        </div>

        {/* Primary tags */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-[var(--bg-base)] flex items-center justify-center text-[var(--text-secondary)] shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Domain</div>
            <div className="text-xs font-semibold text-[var(--text-primary)] truncate mt-0.5">
              {tags?.[0] || 'Academic Research'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetadataBlock;
