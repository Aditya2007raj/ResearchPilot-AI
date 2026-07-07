import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MOCK_STATISTICS, 
  MOCK_RECENT_PAPERS, 
  MOCK_ACTIVITY_FEED, 
  MOCK_LAST_ACTIVE_PAPER 
} from '../../lib/constants';
import { ROUTES } from '../../lib/routes';
import { 
  Play, 
  Upload, 
  BookOpen, 
  Star, 
  Compass, 
  ChevronRight, 
  Activity,
  Heart
} from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();

  // Color mappings for research health column values
  const getHealthBadgeStyles = (status) => {
    switch (status) {
      case 'Fully Analyzed':
        return 'text-[var(--accent-cyan)] border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5';
      case 'Summary Only':
        return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
      case 'Not Reviewed':
      default:
        return 'text-[var(--text-muted)] border-[var(--border-subtle)] bg-[var(--bg-surface)]';
    }
  };

  const handleResumeResearch = () => {
    // Generate route dynamic link based on last active document
    const workspacePath = ROUTES.WORKSPACE_ANALYZE.replace(':paperId', MOCK_LAST_ACTIVE_PAPER.id);
    navigate(workspacePath);
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 space-y-8 select-none">
      
      {/* 1. Research Continuity Hero */}
      <section className="p-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-indigo)]">
            Continue Your Research
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            {MOCK_LAST_ACTIVE_PAPER.title}
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Last active {MOCK_LAST_ACTIVE_PAPER.lastActivityTime}
          </p>
        </div>
        <button 
          onClick={handleResumeResearch}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white text-sm font-medium transition-colors cursor-pointer w-full md:w-auto shadow-sm"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Resume Research</span>
        </button>
      </section>

      {/* Main Grid: Left Primary and Right Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-8">
        
        {/* Left Column (70% weight / 7 cols) */}
        <div className="xl:col-span-7 space-y-8">
          
          {/* 2. Quick Actions */}
          <section className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button 
                onClick={() => navigate(ROUTES.UPLOAD)}
                className="flex flex-col items-start p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-indigo)] transition-all cursor-pointer group text-left"
              >
                <div className="w-8 h-8 rounded bg-[var(--bg-base)] flex items-center justify-center mb-3 group-hover:text-[var(--accent-indigo)] transition-colors">
                  <Upload className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">Upload Paper</span>
                <span className="text-[10px] text-[var(--text-muted)] mt-1">Initialize Workspace</span>
              </button>

              <button 
                onClick={() => navigate(ROUTES.DASHBOARD)} // Temporary fallback action
                className="flex flex-col items-start p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-indigo)] transition-all cursor-pointer group text-left"
              >
                <div className="w-8 h-8 rounded bg-[var(--bg-base)] flex items-center justify-center mb-3 group-hover:text-[var(--accent-indigo)] transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">Browse Papers</span>
                <span className="text-[10px] text-[var(--text-muted)] mt-1">View local library</span>
              </button>

              <button 
                onClick={() => navigate(ROUTES.FAVORITES)}
                className="flex flex-col items-start p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-indigo)] transition-all cursor-pointer group text-left"
              >
                <div className="w-8 h-8 rounded bg-[var(--bg-base)] flex items-center justify-center mb-3 group-hover:text-[var(--accent-indigo)] transition-colors">
                  <Star className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">Favorites</span>
                <span className="text-[10px] text-[var(--text-muted)] mt-1">Starred research</span>
              </button>

              <button 
                onClick={handleResumeResearch}
                className="flex flex-col items-start p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-indigo)] transition-all cursor-pointer group text-left"
              >
                <div className="w-8 h-8 rounded bg-[var(--bg-base)] flex items-center justify-center mb-3 group-hover:text-[var(--accent-indigo)] transition-colors">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">Recent Workspace</span>
                <span className="text-[10px] text-[var(--text-muted)] mt-1">Jump to active file</span>
              </button>
            </div>
          </section>

          {/* 3. Recent Papers List */}
          <section className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">Recent Papers</h3>
            <div className="border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/50">
                      <th className="p-4 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">Title & Authors</th>
                      <th className="p-4 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">Tags</th>
                      <th className="p-4 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">Last Modified</th>
                      <th className="p-4 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">Research Health</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {MOCK_RECENT_PAPERS.map((paper) => (
                      <tr 
                        key={paper.id} 
                        className="hover:bg-[var(--bg-base)]/40 transition-colors group cursor-pointer"
                        onClick={() => navigate(ROUTES.WORKSPACE_ANALYZE.replace(':paperId', paper.id))}
                      >
                        <td className="p-4 max-w-[280px]">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-indigo)] transition-colors truncate">
                              {paper.title}
                            </span>
                            <span className="text-xs text-[var(--text-muted)]">
                              {paper.authors}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1.5">
                            {paper.tags.map((tag) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] bg-[var(--bg-base)] font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-xs text-[var(--text-secondary)]">
                          {paper.lastModified}
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] px-2 py-1 rounded border font-semibold ${getHealthBadgeStyles(paper.researchHealth)}`}>
                            {paper.researchHealth}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {paper.favorite && (
                              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                            )}
                            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column / Sidebar (30% weight / 3 cols) */}
        <div className="xl:col-span-3 space-y-8">
          
          {/* 4. Statistics */}
          <section className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              {MOCK_STATISTICS.map((stat) => (
                <div key={stat.label} className="p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">{stat.value}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1 leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Activity Feed */}
          <section className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">Activity Feed</h3>
            <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div className="flow-root">
                <ul className="-mb-8">
                  {MOCK_ACTIVITY_FEED.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== MOCK_ACTIVITY_FEED.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-[var(--border-subtle)]" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-[var(--bg-base)] flex items-center justify-center ring-4 ring-[var(--bg-surface)]">
                              <Activity className="h-3.5 w-3.5 text-[var(--accent-indigo)]" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5">
                            <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                              {activity.description}
                            </p>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-1">
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
export default DashboardPage;
