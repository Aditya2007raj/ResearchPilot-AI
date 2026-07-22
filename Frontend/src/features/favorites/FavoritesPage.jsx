import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoritesList } from '../../lib/hooks';
import { FavoriteButton } from '../../components/common/FavoriteButton';
import { ROUTES } from '../../lib/routes';
import { Star, Play, Calendar, Upload, BookOpen, ChevronRight, Activity } from 'lucide-react';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { data: favoritesResult, isLoading } = useFavoritesList();

  const favorites = favoritesResult?.data || [];

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

  const formatDate = (timestampStr) => {
    if (!timestampStr) return 'N/A';
    try {
      const date = new Date(timestampStr);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return timestampStr;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 space-y-8 select-none font-sans">
      
      {/* Page Header */}
      <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--accent-cyan)] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5 flex items-center gap-1">
              <Star className="w-3 h-3 text-[var(--accent-cyan)] fill-[var(--accent-cyan)]" /> Saved Research Matrix
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Favorites & Starred Papers
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Quickly access your most important research papers and active workspaces.
          </p>
        </div>

        <div className="font-mono text-xs text-[var(--text-secondary)] bg-[var(--bg-base)] px-4 py-3 rounded-lg border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Starred Count</span>
            <span className="font-bold text-sm text-[var(--accent-indigo)]">{favorites.length} Papers</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      {isLoading ? (
        <div className="p-12 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] text-center text-xs font-mono text-[var(--text-muted)] animate-pulse">
          Loading favorited research papers...
        </div>
      ) : favorites.length === 0 ? (
        /* Premium Empty State */
        <div className="border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] p-16 text-center flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 flex items-center justify-center text-[var(--accent-cyan)] shadow-lg shadow-cyan-500/10">
            <Star className="w-8 h-8 fill-[var(--accent-cyan)] animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">No favorite papers yet</h2>
            <p className="text-xs font-mono text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
              Save your most important research papers for instant access. Click the heart icon on any paper card to add it to your private favorites list.
            </p>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="px-5 py-2.5 rounded-lg bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white text-xs font-mono font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Library</span>
            </button>
            <button
              onClick={() => navigate(ROUTES.UPLOAD)}
              className="px-5 py-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] hover:border-[var(--accent-indigo)] text-[var(--text-primary)] text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Paper</span>
            </button>
          </div>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((paper) => (
            <div
              key={paper.id}
              className="border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] p-6 flex flex-col justify-between space-y-6 hover:border-[var(--accent-indigo)] transition-all group shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-mono font-semibold ${getHealthBadgeStyles(paper.research_health)}`}>
                    {paper.research_health}
                  </span>
                  <FavoriteButton paperId={paper.id} isFavorite={true} size="md" />
                </div>

                <h3 
                  onClick={() => navigate(ROUTES.WORKSPACE_ANALYZE.replace(':paperId', paper.id))}
                  className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-indigo)] transition-colors cursor-pointer line-clamp-2"
                >
                  {paper.title}
                </h3>

                <p className="text-xs text-[var(--text-muted)] line-clamp-1 font-mono">
                  {paper.authors}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)] font-mono text-[10px]">
                <div className="flex items-center justify-between text-[var(--text-muted)]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-[var(--accent-indigo)]" />
                    <span>Favorited: {formatDate(paper.favorite_since || paper.upload_time)}</span>
                  </div>
                  <span>Year: {paper.year || '2026'}</span>
                </div>

                <button
                  onClick={() => navigate(ROUTES.WORKSPACE_ANALYZE.replace(':paperId', paper.id))}
                  className="w-full py-2.5 px-4 rounded-lg bg-[var(--bg-base)] group-hover:bg-[var(--accent-indigo)] text-[var(--text-primary)] group-hover:text-white border border-[var(--border-subtle)] group-hover:border-transparent text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Open Workspace</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default FavoritesPage;
