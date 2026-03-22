import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { PersonSummary } from '../types';
import { formatEGP, getInitials } from '../utils/formatting';

interface PersonCardProps {
  summary: PersonSummary;
  restaurantName?: string;
}

export default function PersonCard({ summary, restaurantName }: PersonCardProps) {
  const { person, subtotal, taxAmount, serviceAmount, tipAmount, total, items } = summary;
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!cardRef.current || sharing) return;
    setSharing(true);

    try {
      // Capture the card as an image
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        useCORS: true,
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (!blob) return;

      const file = new File([blob], `${person.name}-receipt.png`, { type: 'image/png' });

      // Try Web Share API with file
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${person.name}'s share${restaurantName ? ` — ${restaurantName}` : ''}`,
        });
      } else {
        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${person.name}-receipt.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch {
      // User cancelled share or error — do nothing
    } finally {
      setSharing(false);
    }
  };

  return (
    <div ref={cardRef} className="bg-bg-card rounded-2xl p-5 shadow-sm">
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
          onClick={handleShare}
          disabled={sharing}
          className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-bg-card-elevated transition-colors disabled:opacity-50"
          aria-label={`Share ${person.name}'s receipt`}
        >
          {sharing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin text-text-muted">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          )}
        </button>
      </div>

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
