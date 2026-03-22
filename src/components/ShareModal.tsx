import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  shareText: string;
}

export default function ShareModal({ visible, onClose, shareText }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ text: shareText });
    } catch {
      // User cancelled or share failed — do nothing
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 bg-black/35 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-bg-card rounded-t-[28px] p-6 pb-10 w-full max-w-[480px]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-text-primary font-bold text-lg mb-5 text-center">
              Share
            </h2>

            <div className="flex flex-col gap-2">
              {/* Copy to Clipboard */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl bg-bg hover:bg-bg/80 active:scale-[0.98] transition-transform"
              >
                {copied ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary shrink-0">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
                <span className={`font-semibold text-base ${copied ? 'text-green-500' : 'text-text-primary'}`}>
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </span>
              </button>

              {/* Share via Web Share API */}
              {canShare && (
                <button
                  onClick={handleShare}
                  className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl bg-bg hover:bg-bg/80 active:scale-[0.98] transition-transform"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary shrink-0">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  <span className="font-semibold text-base text-text-primary">
                    Share...
                  </span>
                </button>
              )}
            </div>

            {/* Cancel */}
            <button
              onClick={onClose}
              className="w-full text-text-secondary font-semibold text-base text-center mt-5 py-2"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
