import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import ProgressBar from '../components/ProgressBar';
import ItemRow from '../components/ItemRow';
import AddItemModal from '../components/AddItemModal';
import { getPersonSubtotal } from '../utils/calculations';
import { formatEGP } from '../utils/formatting';

export default function Orders() {
  const navigate = useNavigate();
  const { session, addItem, removeItem } = useSessionStore();
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (session.people.length < 2) {
      navigate('/split/people', { replace: true });
    }
  }, [session.people.length, navigate]);

  const selectedPerson = session.people.find((p) => p.id === selectedPersonId);
  const subtotal = selectedPerson ? getPersonSubtotal(selectedPerson) : 0;

  const handleAddItem = (name: string, price: number, splitBetween: string[]) => {
    addItem({ name, price, splitBetween });
    setShowAddModal(false);
  };

  if (session.people.length < 2) return null;

  return (
    <div className="min-h-dvh bg-bg flex flex-col font-nunito">
      <div className="px-6 pt-6">
        <ProgressBar currentStep={2} totalSteps={4} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <h1 className="text-2xl font-black text-text-primary text-center mt-6 mb-4">
          Add Orders
        </h1>

        <p className="text-text-muted text-sm text-center mb-4">
          Select a person, then tap + to add their items
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {session.people.map((person) => (
            <button
              key={person.id}
              onClick={() => setSelectedPersonId(person.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                selectedPersonId === person.id
                  ? 'bg-[#4A90D9] text-white'
                  : 'bg-bg-card text-text-secondary shadow-sm'
              }`}
            >
              {person.name}
            </button>
          ))}
        </div>

        {!selectedPersonId ? (
          <p className="text-text-muted text-sm text-center py-10">
            Select a person above to view or add their items.
          </p>
        ) : selectedPerson && selectedPerson.items.length > 0 ? (
          <div className="flex flex-col">
            {selectedPerson.items.map((item) => {
              const perPersonPrice = item.splitBetween.length > 0
                ? item.price / item.splitBetween.length
                : item.price;
              return (
                <ItemRow
                  key={item.id}
                  name={item.name}
                  price={perPersonPrice}
                  fullPrice={item.splitBetween.length > 1 ? item.price : undefined}
                  splitCount={item.splitBetween.length}
                  onRemove={() => removeItem(selectedPersonId, item.id)}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-text-muted text-sm text-center py-10">
            No items yet. Tap + to add.
          </p>
        )}
      </div>

      <div className="border-t border-border px-6 py-3 flex justify-between items-center">
        <span className="text-text-secondary font-semibold">Subtotal:</span>
        <span className="text-text-primary font-bold text-lg">
          {formatEGP(subtotal)}
        </span>
      </div>

      <div className="px-6 pb-6 pt-3">
        <button
          onClick={() => navigate('/split/taxes')}
          className="w-full bg-primary text-white font-bold rounded-[18px] py-4 text-lg text-center"
        >
          Next
        </button>
      </div>

      {selectedPersonId && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-44 right-6 w-14 h-14 rounded-full bg-primary text-white text-3xl font-bold shadow-lg flex items-center justify-center z-40"
        >
          +
        </button>
      )}

      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
        people={session.people}
        currentPersonId={selectedPersonId}
      />
    </div>
  );
}
