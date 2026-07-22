import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useToggleFavorite } from '../../lib/hooks';

export function FavoriteButton({ paperId, isFavorite = false, className = '', size = 'md' }) {
  const [favoriteState, setFavoriteState] = useState(!!isFavorite);
  const toggleMutation = useToggleFavorite();

  // Sync state if prop changes
  React.useEffect(() => {
    setFavoriteState(!!isFavorite);
  }, [isFavorite]);

  const handleToggle = (e) => {
    e.stopPropagation();
    const nextState = !favoriteState;
    setFavoriteState(nextState);

    toggleMutation.mutate(
      { paperId, isFavorite: favoriteState },
      {
        onError: () => {
          // Revert state if mutation fails
          setFavoriteState(favoriteState);
        },
      }
    );
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={toggleMutation.isPending}
      className={`p-1.5 rounded-full hover:bg-[var(--bg-base)] transition-all cursor-pointer group flex items-center justify-center ${className}`}
      title={favoriteState ? 'Remove from Favorites' : 'Add to Favorites'}
      aria-label={favoriteState ? 'Remove from Favorites' : 'Add to Favorites'}
    >
      <Heart
        className={`${iconSizes[size] || iconSizes.md} transition-all duration-200 ${
          favoriteState
            ? 'text-rose-500 fill-rose-500 scale-110'
            : 'text-[var(--text-muted)] group-hover:text-rose-400 group-hover:scale-105'
        }`}
      />
    </button>
  );
}

export default FavoriteButton;
