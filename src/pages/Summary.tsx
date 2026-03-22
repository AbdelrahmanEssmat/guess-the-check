import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import { useHistoryStore } from '../store/historyStore';
import ProgressBar from '../components/ProgressBar';
import PersonCard from '../components/PersonCard';
import ValidationBanner from '../components/ValidationBanner';
import ReconcileModal from '../components/ReconcileModal';
import {
  calculatePersonSummaries,
  getGrandTotal,
  validateAgainstReceipt,
} from '../utils/calculations';
import { formatEGP } from '../utils/formatting';

export default function Summary() {
  const navigate = useNavigate();
  const { session, setReceiptTotal } = useSessionStore();
  const { saveSession } = useHistoryStore();

  const [receiptInput, setReceiptInput] = useState('');
  const [showReconcile, setShowReconcile] = useState(false);

  // Guard: redirect if < 2 people
  useEffect(() => {
    if (session.people.length < 2) {
      navigate('/split/people', { replace: true });
    }
  }, [session.people.length, navigate]);

  if (session.people.length < 2) return null;

  const summaries = calculatePersonSummaries(
    session.people,
    session.tax,
    session.service,
    session.tip ?? { type: 'percentage', value: 0 }
  );
  const grandTotal = getGrandTotal(summaries);

  const receiptTotal = receiptInput ? parseFloat(receiptInput) : 0;
  const validation =
    receiptTotal > 0 ? validateAgainstReceipt(summaries, receiptTotal) : null;

  // Sync receipt total to store so ReconcileModal can read it
  useEffect(() => {
    if (receiptTotal > 0) {
      setReceiptTotal(receiptTotal);
    }
  }, [receiptTotal, setReceiptTotal]);

  const handleSave = () => {
    if (receiptTotal > 0) {
      setReceiptTotal(receiptTotal);
    }
    saveSession({
      ...session,
      receiptTotal: receiptTotal > 0 ? receiptTotal : undefined,
    });
    navigate('/');
  };

  return (
    <div className="min-h-dvh bg-bg flex flex-col font-nunito">
      <div className="px-6 pt-6">
        <ProgressBar currentStep={4} totalSteps={4} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <h1 className="text-2xl font-black text-text-primary text-center mt-6 mb-6">
          Summary
        </h1>

        {/* Person cards */}
        <div className="flex flex-col gap-4">
          {summaries.map((summary) => (
            <PersonCard key={summary.person.id} summary={summary} />
          ))}
        </div>

        {/* Grand total */}
        <div className="bg-primary rounded-2xl p-5 mt-5 flex justify-between items-center">
          <span className="text-white font-bold text-lg">Grand Total</span>
          <span className="text-white font-bold text-lg">
            {formatEGP(grandTotal)}
          </span>
        </div>

        {/* Verify with receipt */}
        <div className="bg-bg-card rounded-2xl p-5 shadow-sm mt-5">
          <h2 className="text-text-primary font-bold text-base mb-1">
            Verify with Receipt
          </h2>
          <p className="text-text-muted text-sm mb-4">
            Enter your receipt total to check for missing items
          </p>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Receipt total"
            value={receiptInput}
            onChange={(e) => setReceiptInput(e.target.value)}
            className="w-full border border-border rounded-[14px] px-4 py-3.5 text-base font-nunito font-medium text-text-primary bg-bg-card placeholder:text-text-muted outline-none focus:border-primary"
          />

          {validation && receiptTotal > 0 && (
            <div className="mt-4">
              <ValidationBanner
                isValid={validation.isValid}
                difference={validation.difference}
                onAddMissingItems={() => setShowReconcile(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 pb-6 pt-3">
        <button
          onClick={handleSave}
          className="w-full bg-primary text-white font-bold rounded-[18px] py-4 text-lg text-center"
        >
          Save &amp; Done
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full text-text-secondary font-semibold text-base text-center mt-3 py-2"
        >
          Back
        </button>
      </div>

      {/* Reconcile Modal */}
      <ReconcileModal
        visible={showReconcile}
        onClose={() => setShowReconcile(false)}
      />
    </div>
  );
}
