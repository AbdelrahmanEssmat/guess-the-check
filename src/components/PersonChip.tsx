import { motion } from 'framer-motion';
import { getInitials } from '../utils/formatting';

interface PersonChipProps {
  name: string;
  color: string;
  onRemove?: () => void;
}

export default function PersonChip({ name, color, onRemove }: PersonChipProps) {
  return (
    <motion.div
      className="inline-flex items-center gap-2 bg-bg-card-elevated rounded-full pl-1.5 pr-3 py-1.5 shadow-sm"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      layout
    >
      {/* Avatar circle with initials */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: color }}
      >
        <span className="text-white text-[11px] font-nunito font-bold leading-none">
          {getInitials(name)}
        </span>
      </div>

      <span className="text-sm font-nunito font-semibold text-text-primary whitespace-nowrap">
        {name}
      </span>

      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 w-5 h-5 rounded-full flex items-center justify-center text-text-muted hover:text-error hover:bg-error-dim transition-colors"
          aria-label={`Remove ${name}`}
        >
          <span className="text-sm leading-none">&times;</span>
        </button>
      )}
    </motion.div>
  );
}
