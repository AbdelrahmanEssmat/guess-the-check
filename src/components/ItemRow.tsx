import { motion } from 'framer-motion';
import { formatEGP } from '../utils/formatting';

interface ItemRowProps {
  name: string;
  price: number;
  fullPrice?: number;
  splitCount?: number;
  onRemove?: () => void;
}

export default function ItemRow({ name, price, fullPrice, splitCount, onRemove }: ItemRowProps) {
  return (
    <motion.div
      className="flex items-center justify-between py-2.5"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-[15px] font-nunito font-medium text-text-primary truncate">
          {name}
        </span>
        {splitCount && splitCount > 1 && fullPrice !== undefined && (
          <span className="inline-flex items-center gap-1 text-xs font-nunito font-semibold text-purple bg-purple-dim rounded-full px-2 py-0.5 w-fit">
            Split &times;{splitCount} ({formatEGP(fullPrice)} total)
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        <span className="text-[15px] font-nunito font-bold text-text-primary">
          {formatEGP(price)}
        </span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-error transition-colors"
            aria-label={`Remove ${name}`}
          >
            <span className="text-sm">&#10006;</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
