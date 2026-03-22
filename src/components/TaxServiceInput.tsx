import { ChargeConfig } from '../types';

interface TaxServiceInputProps {
  label: string;
  config: ChargeConfig;
  onChange: (config: ChargeConfig) => void;
}

export default function TaxServiceInput({ label, config, onChange }: TaxServiceInputProps) {
  const isPercentage = config.type === 'percentage';

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-sm font-nunito font-semibold text-text-primary">{label}</span>

      <div className="flex gap-2">
        {/* Toggle buttons */}
        <div className="flex rounded-xl overflow-hidden border border-border">
          <button
            onClick={() => onChange({ type: 'percentage', value: config.value })}
            className={`px-4 py-2 text-sm font-nunito font-semibold transition-colors ${
              isPercentage
                ? 'bg-primary text-white'
                : 'bg-bg text-text-secondary hover:bg-bg-card-elevated'
            }`}
          >
            %
          </button>
          <button
            onClick={() => onChange({ type: 'fixed', value: config.value })}
            className={`px-4 py-2 text-sm font-nunito font-semibold transition-colors ${
              !isPercentage
                ? 'bg-primary text-white'
                : 'bg-bg text-text-secondary hover:bg-bg-card-elevated'
            }`}
          >
            EGP
          </button>
        </div>

        {/* Numeric input */}
        <div className="flex-1 relative">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={config.value || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChange({ type: config.type, value: isNaN(val) ? 0 : val });
            }}
            placeholder="0"
            className="w-full border border-border rounded-[14px] px-4 py-3 text-base font-nunito font-medium text-text-primary bg-bg placeholder:text-text-muted outline-none focus:border-primary pr-12"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-nunito font-medium text-text-muted pointer-events-none">
            {isPercentage ? '%' : 'EGP'}
          </span>
        </div>
      </div>
    </div>
  );
}
