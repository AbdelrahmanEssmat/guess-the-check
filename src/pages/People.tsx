import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import ProgressBar from '../components/ProgressBar';
import PersonChip from '../components/PersonChip';

export default function People() {
  const navigate = useNavigate();
  const {
    session,
    setRestaurantName,
    addPerson,
    removePerson,
  } = useSessionStore();

  const [personName, setPersonName] = useState('');

  const handleAddPerson = () => {
    const trimmed = personName.trim();
    if (!trimmed) return;

    const duplicate = session.people.some(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) return;

    addPerson(trimmed);
    setPersonName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPerson();
    }
  };

  const canContinue = session.people.length >= 2;

  return (
    <div className="min-h-dvh bg-bg flex flex-col font-nunito">
      <div className="px-6 pt-6">
        <ProgressBar currentStep={1} totalSteps={4} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <h1 className="text-2xl font-black text-text-primary text-center mt-6 mb-6">
          Who's at the table?
        </h1>

        {/* Restaurant name */}
        <input
          type="text"
          placeholder="Restaurant name (optional)"
          value={session.restaurantName ?? ''}
          onChange={(e) => setRestaurantName(e.target.value)}
          className="w-full border border-border rounded-[14px] px-4 py-3.5 text-base font-nunito font-medium text-text-primary bg-bg-card placeholder:text-text-muted outline-none focus:border-primary mb-4"
        />

        {/* Add person */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Person name"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-border rounded-[14px] px-4 py-3.5 text-base font-nunito font-medium text-text-primary bg-bg-card placeholder:text-text-muted outline-none focus:border-primary"
          />
          <button
            onClick={handleAddPerson}
            disabled={!personName.trim()}
            className="bg-secondary text-white font-bold rounded-[14px] px-5 py-3.5 text-base disabled:opacity-40 transition-opacity"
          >
            Add
          </button>
        </div>

        {/* Person chips */}
        {session.people.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {session.people.map((person) => (
              <PersonChip
                key={person.id}
                name={person.name}
                color={person.color}
                onRemove={() => removePerson(person.id)}
              />
            ))}
          </div>
        )}

        {/* Hint */}
        {session.people.length === 1 && (
          <p className="text-text-muted text-sm text-center mt-4">
            Add at least 2 people to continue
          </p>
        )}
      </div>

      {/* Bottom bar */}
      <div className="px-6 pb-6 pt-3">
        <button
          onClick={() => navigate('/split/orders')}
          disabled={!canContinue}
          className={`w-full bg-primary text-white font-bold rounded-[18px] py-4 text-lg text-center transition-opacity ${
            !canContinue ? 'opacity-40' : ''
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
