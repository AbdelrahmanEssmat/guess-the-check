import { useState } from 'react';
import { PersonSummary } from '../types';
import { formatEGP, formatPersonShareText, getInitials } from '../utils/formatting';
import ShareModal from './ShareModal';

interface PersonCardProps {
  summary: PersonSummary;
  restaurantName?: string;
}

export default function PersonCard({ summary, restaurantName }: PersonCardProps) {
  const { person, subtotal, taxAmount, serviceAmount, tipAmount, total, items } = summary;
  const [showShare, setShowShare] = useState(false);

  const shareText = formatPersonShareText(summary, restaurantName);

  return (
    <div className="bg-bg-card rounded-2xl p-5 shadow-sm">
      {/* Header: Avatar + Name + Share */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: person.color }}
        >
          <span className="text-white text-sm font-nunito font-bold leading-none">
            {getInitials(person.name)}
          </span>
        </div>
        <span className="text-lg font-nunito font-bold text-text-primary flex-1">
          {person.name}
        </span>
        <button
          onClick={() => setShowShare(true)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-bg-card-elevated transition-colors"
          aria-label={`Share ${person.name}'s receipt`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>
      </div>

      <ShareModal visible={showShare} onClose={() => setShowShare(false)} shareText={shareText} />

      {/* Items list */}
      <div className="flex flex-col">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-1.5">
            <span className="text-sm font-nunito font-medium text-text-secondary truncate flex-1 mr-3">
              {item.name}
            </span>
            <span className="text-sm font-nunito font-semibold text-text-primary shrink-0">
              {formatEGP(item.amount)}
            </span>
          </div>
        ))}
      </div>

      {/* Separator */}
      <div className="h-px bg-separator my-3" />

      {/* Subtotal, Tax, Service */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <span className="text-sm font-nunito font-medium text-text-muted">Subtotal</span>
          <span className="text-sm font-nunito font-semibold text-text-primary">
            {formatEGP(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-nunito font-medium text-text-muted">Tax</span>
          <span className="text-sm font-nunito font-semibold text-text-primary">
            {formatEGP(taxAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-nunito font-medium text-text-muted">Service</span>
          <span className="text-sm font-nunito font-semibold text-text-primary">
            {formatEGP(serviceAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-nunito font-medium text-text-muted">Tip</span>
          <span className="text-sm font-nunito font-semibold text-text-primary">
            {formatEGP(tipAmount)}
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-separator my-3" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-base font-nunito font-bold text-text-primary">Total</span>
        <span className="text-lg font-nunito font-bold text-primary">
          {formatEGP(total)}
        </span>
      </div>
    </div>
  );
}
