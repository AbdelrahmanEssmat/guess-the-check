import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const STEPS = [
  { label: 'People', icon: '👥' },
  { label: 'Orders', icon: '🍽️' },
  { label: 'Taxes', icon: '🧾' },
  { label: 'Summary', icon: '✅' },
];

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const steps = STEPS.slice(0, totalSteps);

  return (
    <div className="w-full px-2 pt-4 pb-2">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const isFuture = stepNum > currentStep;

          return (
            <div key={step.label} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-nunito font-bold transition-colors ${
                    isCompleted
                      ? 'bg-[#4A90D9] text-white shadow-sm'
                      : isActive
                        ? 'bg-[#4A90D9] text-white shadow-md'
                        : 'bg-white dark:bg-bg-card text-text-muted border-2 border-[#E8E8E8] dark:border-border'
                  }`}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {isCompleted ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span className="text-base leading-none">{step.icon}</span>
                  )}
                </motion.div>
                <span
                  className={`text-[11px] font-nunito font-semibold whitespace-nowrap ${
                    isActive
                      ? 'text-[#4A90D9]'
                      : isCompleted
                        ? 'text-text-secondary'
                        : 'text-text-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-[3px] mx-1.5 rounded-full bg-[#E8E8E8] dark:bg-[rgba(255,255,255,0.1)] overflow-hidden self-start mt-5">
                  <motion.div
                    className="h-full bg-[#4A90D9] rounded-full"
                    initial={{ width: '0%' }}
                    animate={{
                      width: isCompleted ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
