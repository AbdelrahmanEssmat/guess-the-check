interface QuickSplitInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function QuickSplitInput({ value, onChange }: QuickSplitInputProps) {
  return (
    <div className="relative mt-3">
      <input
        type="number"
        inputMode="decimal"
        placeholder="Total amount"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-[14px] px-4 py-3.5 pr-16 text-base font-nunito font-medium text-text-primary bg-bg-card placeholder:text-text-muted outline-none focus:border-primary"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-semibold text-sm pointer-events-none">
        EGP
      </span>
    </div>
  );
}
