import { useParams, useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../store/historyStore';
import PersonCard from '../components/PersonCard';
import ValidationBanner from '../components/ValidationBanner';
import {
  calculatePersonSummaries,
  getGrandTotal,
  validateAgainstReceipt,
} from '../utils/calculations';
import { formatEGP, formatDate } from '../utils/formatting';

export default function HistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sessions = useHistoryStore((s) => s.sessions);

  const session = sessions.find((s) => s.id === id);

  if (!session) {
    return (
      <div className="min-h-dvh bg-bg flex flex-col font-nunito items-center justify-center px-6">
        <p className="text-text-secondary text-lg mb-4">Session not found</p>
        <button
          onClick={() => navigate('/')}
          className="text-[#00B894] font-bold"
        >
          Go Home
        </button>
      </div>
    );
  }

  const summaries = calculatePersonSummaries(
    session.people,
    session.tax,
    session.service,
    session.tip ?? { type: 'percentage', value: 0 }
  );
  const grandTotal = getGrandTotal(summaries);

  const hasReceiptTotal =
    session.receiptTotal !== undefined && session.receiptTotal !== null;
  const validation = hasReceiptTotal
    ? validateAgainstReceipt(summaries, session.receiptTotal!)
    : null;
  const showBanner = validation !== null && !validation.isValid;

  return (
    <div className="min-h-dvh bg-bg flex flex-col font-nunito">
      <div className="px-6 pt-6 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-[#00B894] font-bold text-sm mb-4"
        >
          &larr; Back
        </button>

        <h1 className="text-center font-black text-2xl">
          {session.restaurantName || 'Check Split'}
        </h1>
        <p className="text-center text-text-secondary text-sm mt-1">
          {formatDate(session.date)}
        </p>
      </div>

      <div className="px-6 flex-1 pb-8 flex flex-col gap-4">
        {summaries.map((summary) => (
          <PersonCard key={summary.person.id} summary={summary} />
        ))}

        <div className="bg-primary text-white rounded-2xl p-5 flex flex-row items-center justify-between shadow-sm">
          <span className="font-bold text-lg">Grand Total</span>
          <span className="font-black text-xl">{formatEGP(grandTotal)}</span>
        </div>

        {showBanner && (
          <ValidationBanner
            isValid={validation!.isValid}
            difference={validation!.difference}
          />
        )}
      </div>
    </div>
  );
}
