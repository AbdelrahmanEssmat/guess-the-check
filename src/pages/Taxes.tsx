import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import ProgressBar from '../components/ProgressBar';
import TaxServiceInput from '../components/TaxServiceInput';
import { getGroupSubtotal, getChargeAmount } from '../utils/calculations';
import { formatEGP } from '../utils/formatting';

export default function Taxes() {
  const navigate = useNavigate();
  const { session, setTax, setService, setTip } = useSessionStore();
  const tip = session.tip ?? { type: 'percentage' as const, value: 0 };

  // Guard: redirect if < 2 people
  useEffect(() => {
    if (session.people.length < 2) {
      navigate('/split/people', { replace: true });
    }
  }, [session.people.length, navigate]);

  if (session.people.length < 2) return null;

  const groupSubtotal = getGroupSubtotal(session.people);
  const taxAmount = getChargeAmount(session.tax, groupSubtotal);
  const serviceAmount = getChargeAmount(session.service, groupSubtotal);
  const tipAmount = getChargeAmount(tip, groupSubtotal);
  const estimatedTotal = groupSubtotal + taxAmount + serviceAmount + tipAmount;

  const tipPresets = [5, 10, 15, 20];

  return (
    <div className="min-h-dvh bg-bg flex flex-col font-nunito">
      <div className="px-6 pt-6">
        <ProgressBar currentStep={3} totalSteps={4} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <h1 className="text-2xl font-black text-text-primary text-center mt-6 mb-6">
          Taxes &amp; Service
        </h1>

        {/* Tax input */}
        <TaxServiceInput
          label="Tax"
          config={session.tax}
          onChange={setTax}
        />

        {/* Service charge input */}
        <div className="mt-4">
          <TaxServiceInput
            label="Service Charge"
            config={session.service}
            onChange={setService}
          />
        </div>

        {/* Tip input */}
        <div className="mt-4">
          <div className="flex gap-2 mb-2">
            {tipPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => setTip({ type: 'percentage', value: preset })}
                className={`flex-1 py-1.5 rounded-full text-sm font-nunito font-semibold transition-colors ${
                  tip.type === 'percentage' && tip.value === preset
                    ? 'bg-primary text-white'
                    : 'bg-bg-card text-text-secondary border border-border'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
          <TaxServiceInput
            label="Tip"
            config={tip}
            onChange={setTip}
          />
        </div>

        {/* Live Preview */}
        <div className="bg-bg-card rounded-2xl p-5 shadow-sm mt-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-text-secondary text-sm">Group Subtotal</span>
            <span className="text-text-primary font-semibold">
              {formatEGP(groupSubtotal)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-text-secondary text-sm">Tax</span>
            <span className="text-text-primary font-semibold">
              {formatEGP(taxAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-text-secondary text-sm">Service</span>
            <span className="text-text-primary font-semibold">
              {formatEGP(serviceAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-text-secondary text-sm">Tip</span>
            <span className="text-text-primary font-semibold">
              {formatEGP(tipAmount)}
            </span>
          </div>
          <div className="border-t border-separator my-3" />
          <div className="flex justify-between items-center">
            <span className="text-text-primary font-bold">Estimated Total</span>
            <span className="text-primary font-bold text-lg">
              {formatEGP(estimatedTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 pb-6 pt-3">
        <button
          onClick={() => navigate('/split/summary')}
          className="w-full bg-primary text-white font-bold rounded-[18px] py-4 text-lg text-center"
        >
          Next
        </button>
      </div>
    </div>
  );
}
