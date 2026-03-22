import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Session } from '../types';
import { formatEGP, formatDate } from '../utils/formatting';
import { calculatePersonSummaries, getGrandTotal } from '../utils/calculations';

interface SwipeableHistoryCardProps {
  session: Session;
  onPress: () => void;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = -80;

export default function SwipeableHistoryCard({
  session,
  onPress,
  onDelete,
}: SwipeableHistoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-120, -60, 0], [1, 0.8, 0]);
  const deleteScale = useTransform(x, [-120, -60, 0], [1, 0.9, 0.8]);

  const summaries = calculatePersonSummaries(session.people, session.tax, session.service, session.tip ?? { type: 'percentage', value: 0 });
  const total = getGrandTotal(summaries);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < SWIPE_THRESHOLD) {
      setIsDeleting(true);
      onDelete();
    }
  };

  if (isDeleting) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Delete background */}
      <motion.div
        className="absolute inset-0 bg-error flex items-center justify-end pr-6 rounded-2xl"
        style={{ opacity: deleteOpacity }}
      >
        <motion.span
          className="text-white font-nunito font-bold text-sm"
          style={{ scale: deleteScale }}
        >
          Delete
        </motion.span>
      </motion.div>

      {/* Card content */}
      <motion.div
        className="bg-bg-card rounded-2xl p-5 shadow-sm relative cursor-pointer"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -140, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onClick={() => {
          if (Math.abs(x.get()) < 5) onPress();
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="text-base font-nunito font-bold text-text-primary truncate">
              {session.restaurantName || 'Untitled Session'}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-nunito font-medium text-text-muted">
                {formatDate(session.date)}
              </span>
              <span className="text-sm font-nunito font-medium text-text-muted">
                {session.people.length} {session.people.length === 1 ? 'person' : 'people'}
              </span>
            </div>
          </div>
          <span className="text-lg font-nunito font-bold text-primary shrink-0 ml-3">
            {formatEGP(total)}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
