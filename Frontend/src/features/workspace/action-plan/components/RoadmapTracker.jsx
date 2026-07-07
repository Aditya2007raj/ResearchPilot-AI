import React from 'react';

export function RoadmapTracker({ completionPercentage, totalTasks, completedTasks }) {
  return (
    <div className="p-5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-indigo)]">
            Execution Roadmap
          </span>
          <h3 className="text-sm font-bold font-sans tracking-tight text-[var(--text-primary)] mt-1">
            Replication Progress Tracker
          </h3>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Tasks completed: {completedTasks} / {totalTasks}
          </p>
        </div>

        {/* Circular or horizontal progress stats */}
        <div className="flex items-center gap-4">
          <div className="w-32 bg-[var(--bg-base)] h-2 rounded-full border border-[var(--border-subtle)] overflow-hidden shrink-0">
            <div 
              className="h-full bg-gradient-to-r from-[var(--accent-indigo)] to-[var(--accent-cyan)] transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-lg font-black font-mono text-[var(--accent-cyan)] leading-none">
            {completionPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default RoadmapTracker;
