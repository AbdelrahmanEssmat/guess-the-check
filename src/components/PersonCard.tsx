import { PersonSummary } from '../types';
import { formatEGP, getInitials } from '../utils/formatting';

interface PersonCardProps {
  summary: PersonSummary;
}

export default function PersonCard({ summary }: PersonCardProps) {
  const { person, subtotal, taxAmount, serviceAmount, total, items } = summary;

  return (
    <div className="bg-bg-card rounded-2xl p-5 shadow-sm">
      {/* Header: Avatar + Name */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: person.color }}
        >
          <span className="text-white text-sm font-nunito font-bold leading-none">
            {getInitials(person.name)}
          </span>
        </div>
        <span className="text-lg font-nunito font-bold text-text-primary">
          {person.name}
        </span>
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
