import { motion, AnimatePresence } from 'framer-motion';

interface ValidationBannerProps {
  isValid: boolean;
  difference: number;
  onAddMissingItems?: () => void;
}

export default function ValidationBanner({
  isValid,
  difference,
  onAddMissingItems,
}: ValidationBannerProps) {
  const hasMissingItems = difference < 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isValid ? 'valid' : 'invalid'}
        className={`rounded-2xl px-4 py-3 flex flex-col gap-2 ${
          isValid ? 'bg-success-dim' : 'bg-error-dim'
        }`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex items-center gap-2.5">
          {isValid ? (
            <span className="text-success text-lg">&#10003;</span>
          ) : (
            <span className="text-error text-lg">&#9888;</span>
          )}
          <span
            className={`text-sm font-nunito font-semibold ${
              isValid ? 'text-success' : 'text-error'
            }`}
          >
            {isValid
              ? 'Everything adds up!'
              : `${Math.abs(difference).toFixed(2)} EGP off — recheck your items`}
          </span>
        </div>

        {!isValid && hasMissingItems && onAddMissingItems && (
          <button
            onClick={onAddMissingItems}
            className="bg-error text-white text-sm font-nunito font-bold rounded-xl py-2.5 px-4 text-center hover:opacity-90 transition-opacity"
          >
            Add Missing Items
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
