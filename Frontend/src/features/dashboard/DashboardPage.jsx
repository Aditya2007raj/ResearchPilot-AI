import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePapersList, useDashboardStats } from '../../lib/hooks';
import { FavoriteButton } from '../../components/common/FavoriteButton';
import { ROUTES } from '../../lib/routes';
import { 
  Play, 
  Upload, 
  BookOpen, 
  Star, 
  Compass, 
  ChevronRight, 
  Activity
} from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();

  // Load live papers and stats from SQLite metadata store
  const { data: papersResult, isLoading: papersLoading } = usePapersList();
  const { data: statsResult, isLoading: statsLoading } = useDashboardStats();

  const papers = papersResult?.data || [];
  const statsPayload = statsResult?.data || {
    total_papers: 0,
    analyses_generated: 0,
    active_workspaces: 0,
    favorites: 0
  };

  const dashboardStats = [
    { label: 'Total Papers', value: statsPayload.total_papers },
    { label: 'Analyses Generated', value: statsPayload.analyses_generated },
    { label: 'Active Workspaces', value: statsPayload.active_workspaces },
    { label: 'Favorites', value: statsPayload.favorites },
  ];

  const getHealthBadgeStyles = (status) => {
    switch (status) {
      case 'Fully Analyzed':
        return 'text-[var(--accent-cyan)] border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5';
      case 'Summary Only':
        return 'text-[var(--accent-indigo)] border-[var(--accent-indigo)]/20 bg-[var(--accent-indigo)]/5';
      case 'Not Reviewed':
      default:
        return 'text-[var(--text-muted)] border-[var(--border-subtle)] bg-[var(--bg-surface)]';
    }
  };

  const handleResumeResearch = () => {
    if (papers.length > 0) {
      const workspacePath = ROUTES.WORKSPACE_ANALYZE.replace(':paperId', papers[0].id);
      navigate(workspacePath);
    } else {
      navigate(ROUTES.UPLOAD);
    }
  };

  const formatModifiedTime = (timestampStr) => {
    if (!timestampStr) return 'N/A';
    try {
      const date = new Date(timestampStr);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return timestampStr;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 space-y-8 select-none font-sans">
      
      {/* 1. Research Continuity Hero */}
      <section className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 font-mono">
          <span className="text-[10px] uppercase tracking-wider text-[var(--accent-indigo)] font-bold">
            Continue Your Research
          </span>
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)] font-sans">
            {papers.length > 0 ? papers[0].title : 'No active workspace initialized'}
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            {papers.length > 0 ? `Uploaded ${formatModifiedTime(papers[0].upload_time)}` : 'Upload a paper to begin research'}
          </p>
        </div>
        <button 
          onClick={handleResumeResearch}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white text-xs font-mono font-bold transition-all cursor-pointer w-full md:w-auto shadow-sm"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{papers.length > 0 ? 'Resume Research' : 'Start Workspace'}</span>
        </button>
      </section>

      {/* Main Grid: Left Primary and Right Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-8">
        
        {/* Left Column (70% weight / 7 cols) */}
        <div className="xl:col-span-7 space-y-8">
          
          {/* 2. Quick Actions */}
          <section className="space-y-4 font-mono">
            <h3 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button 
                onClick={() => navigate(ROUTES.UPLOAD)}
                className="flex flex-col items-start p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-indigo)] transition-all cursor-pointer group text-left shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-base)] flex items-center justify-center mb-3 group-hover:text-[var(--accent-indigo)] transition-colors">
                  <Upload className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">Upload Paper</span>
                <span className="text-[10px] text-[var(--text-muted)] mt-1">Initialize Workspace</span>
              </button>

              <button 
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="flex flex-col items-start p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-indigo)] transition-all cursor-pointer group text-left shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-base)] flex items-center justify-center mb-3 group-hover:text-[var(--accent-indigo)] transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">Browse Papers</span>
                <span className="text-[10px] text-[var(--text-muted)] mt-1">View local library</span>
              </button>

              <button 
                onClick={() => navigate(ROUTES.FAVORITES)}
                className="flex flex-col items-start p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-indigo)] transition-all cursor-pointer group text-left shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-base)] flex items-center justify-center mb-3 group-hover:text-[var(--accent-indigo)] transition-colors">
                  <Star className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">Favorites</span>
                <span className="text-[10px] text-[var(--text-muted)] mt-1">Starred research</span>
              </button>

              <button 
                onClick={handleResumeResearch}
                className="flex flex-col items-start p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-indigo)] transition-all cursor-pointer group text-left shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-base)] flex items-center justify-center mb-3 group-hover:text-[var(--accent-indigo)] transition-colors">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">Recent Workspace</span>
                <span className="text-[10px] text-[var(--text-muted)] mt-1">Jump to active file</span>
              </button>
            </div>
          </section>

          {/* 3. Recent Papers List */}
          <section className="space-y-4 font-mono">
            <h3 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Recent Papers</h3>
            
            {papersLoading ? (
              <div className="border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] p-8 text-center text-xs text-[var(--text-muted)] animate-pulse">
                Loading research database...
              </div>
            ) : papers.length === 0 ? (
              <div className="border border-[var(--border-subtle)] border-dashed rounded-xl bg-[var(--bg-surface)]/40 p-12 text-center space-y-3">
                <p className="text-xs text-[var(--text-secondary)]">No papers uploaded to library catalog yet</p>
                <button
                  onClick={() => navigate(ROUTES.UPLOAD)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] rounded-lg transition-colors cursor-pointer"
                >
                  Upload First Paper
                </button>
              </div>
            ) : (
              <div className="border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/50">
                        <th className="p-4 text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Title & Authors</th>
                        <th className="p-4 text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Year</th>
                        <th className="p-4 text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Uploaded</th>
                        <th className="p-4 text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Research Health</th>
                        <th className="p-4 text-right text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {papers.map((paper) => (
                        <tr 
                          key={paper.id} 
                          className="hover:bg-[var(--bg-base)]/40 transition-colors group cursor-pointer"
                          onClick={() => navigate(ROUTES.WORKSPACE_ANALYZE.replace(':paperId', paper.id))}
                        >
                          <td className="p-4 max-w-[280px]">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-indigo)] transition-colors truncate font-sans">
                                {paper.title}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] truncate">
                                {paper.authors}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-xs text-[var(--text-secondary)]">
                            {paper.year || '2026'}
                          </td>
                          <td className="p-4 text-xs text-[var(--text-secondary)]">
                            {formatModifiedTime(paper.upload_time)}
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] px-2 py-1 rounded border font-semibold ${getHealthBadgeStyles(paper.research_health)}`}>
                              {paper.research_health}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <FavoriteButton paperId={paper.id} isFavorite={paper.favorite === 1} size="md" />
                              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

        </div>

        {/* Right Column / Sidebar (30% weight / 3 cols) */}
        <div className="xl:col-span-3 space-y-8 font-mono">
          
          {/* 4. Statistics */}
          <section className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              {dashboardStats.map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm">
                  {statsLoading ? (
                    <div className="h-8 w-12 bg-[var(--bg-base)] animate-pulse rounded" />
                  ) : (
                    <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">{stat.value}</div>
                  )}
                  <div className="text-[10px] text-[var(--text-muted)] mt-1 leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Activity Feed */}
          <section className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Activity Feed</h3>
            <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm">
              <div className="flow-root">
                {papers.length === 0 ? (
                  <div className="text-xs font-mono text-[var(--text-muted)] text-center py-4">No recent activity.</div>
                ) : (
                  <ul className="-mb-8">
                    {papers.slice(0, 4).map((paper, idx) => (
                      <li key={paper.id}>
                        <div className="relative pb-8">
                          {idx !== Math.min(papers.length, 4) - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-[var(--border-subtle)]" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-[var(--bg-base)] flex items-center justify-center ring-4 ring-[var(--bg-surface)]">
                                <Activity className="h-3.5 w-3.5 text-[var(--accent-indigo)]" aria-hidden="true" />
                              </span>
                            </div>
                            <div className="flex-1 min-w-0 pt-1.5">
                              <p className="text-xs text-[var(--text-primary)] leading-relaxed font-sans">
                                Ingested paper: "{paper.title}"
                              </p>
                              <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-1">
                                {formatModifiedTime(paper.upload_time)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}

export default DashboardPage;
