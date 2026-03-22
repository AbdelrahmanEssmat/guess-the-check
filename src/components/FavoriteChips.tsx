import { motion } from 'framer-motion';
import { getInitials } from '../utils/formatting';
import { Favorite } from '../store/favoritesStore';

interface FavoriteChipsProps {
  favorites: Favorite[];
  onTap: (favorite: Favorite) => void;
  onRemove: (name: string) => void;
}

export default function FavoriteChips({ favorites, onTap, onRemove }: FavoriteChipsProps) {
  if (favorites.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
        Quick add
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {favorites.map((fav) => (
          <motion.button
            key={fav.name}
            type="button"
            onClick={() => onTap(fav)}
            className="inline-flex items-center gap-1.5 bg-bg-card-elevated rounded-full pl-1.5 pr-2 py-1.5 shadow-sm shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: fav.color }}
            >
              <span className="text-white text-[11px] font-nunito font-bold leading-none">
                {getInitials(fav.name)}
              </span>
            </div>
            <span className="text-sm font-nunito font-semibold text-text-primary whitespace-nowrap">
              {fav.name}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(fav.name);
              }}
              className="ml-0.5 w-5 h-5 rounded-full flex items-center justify-center text-text-muted hover:text-error hover:bg-error-dim transition-colors"
              aria-label={`Remove ${fav.name} from favorites`}
            >
              <span className="text-sm leading-none">&times;</span>
            </button>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
