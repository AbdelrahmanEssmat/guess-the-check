import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessionStore } from '../store/sessionStore';
import { calculatePersonSummaries, getGrandTotal } from '../utils/calculations';
import { formatEGP, getInitials } from '../utils/formatting';

interface ReconcileModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ReconcileModal({ visible, onClose }: ReconcileModalProps) {
  const { session, addItem } = useSessionStore();
  const { people, tax, service, receiptTotal } = session;

  const summaries = calculatePersonSummaries(people, tax, service);
  const grandTotal = getGrandTotal(summaries);
  const difference = receiptTotal !== undefined ? receiptTotal - grandTotal : 0;
  const isResolved = Math.abs(difference) <= 0.99;

  const [showAddForm, setShowAddForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  const togglePerson = (personId: string) => {
    setSelectedPeople((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    );
  };

  const handleAddItem = () => {
    const trimmedName = itemName.trim();
    const parsedPrice = parseFloat(itemPrice);
    if (!trimmedName) return;
    if (!itemPrice || isNaN(parsedPrice) || parsedPrice <= 0 || !isFinite(parsedPrice)) return;
    if (parsedPrice > 999999) return;
    if (selectedPeople.length === 0) return;
    addItem({ name: trimmedName, price: parsedPrice, splitBetween: selectedPeople });
    setItemName('');
    setItemPrice('');
    setSelectedPeople([]);
    setShowAddForm(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 bg-black/35 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-bg-card rounded-t-[28px] p-6 pb-10 w-full max-w-[480px] max-h-[85vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-nunito font-bold text-text-primary mb-4">
              Reconcile
            </h2>

            {/* Difference card */}
            <div
              className={`rounded-2xl px-4 py-3 mb-5 ${
                isResolved ? 'bg-success-dim' : 'bg-error-dim'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isResolved ? (
                  <span className="text-success text-lg">&#10003;</span>
                ) : (
                  <span className="text-error text-lg">&#9888;</span>
                )}
                <span
                  className={`text-sm font-nunito font-semibold ${
                    isResolved ? 'text-success' : 'text-error'
                  }`}
                >
                  {isResolved
                    ? 'Everything adds up!'
                    : `Still missing ${formatEGP(Math.abs(difference))}`}
                </span>
              </div>
            </div>

            {/* Current orders per person */}
            <div className="flex flex-col gap-4 mb-5">
              {summaries.map((summary) => (
                <div key={summary.person.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: summary.person.color }}
                    >
                      <span className="text-white text-[10px] font-nunito font-bold leading-none">
                        {getInitials(summary.person.name)}
                      </span>
                    </div>
                    <span className="text-sm font-nunito font-bold text-text-primary">
                      {summary.person.name}
                    </span>
                  </div>
                  {summary.items.length > 0 ? (
                    <div className="pl-9 flex flex-col gap-1">
                      {summary.items.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-sm font-nunito font-medium text-text-secondary truncate flex-1 mr-2">
                            {item.name}
                          </span>
                          <span className="text-sm font-nunito font-semibold text-text-primary shrink-0">
                            {formatEGP(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="pl-9 text-sm font-nunito text-text-muted">No items yet</span>
                  )}
                </div>
              ))}
            </div>

            {/* Add missing item */}
            {!isResolved && (
              <>
                {!showAddForm ? (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full border-2 border-dashed border-border rounded-2xl py-3 text-sm font-nunito font-semibold text-text-secondary hover:border-primary hover:text-primary transition-colors mb-4"
                  >
                    + Add Missing Item
                  </button>
                ) : (
                  <motion.div
                    className="bg-bg-card-elevated rounded-2xl p-4 mb-4 flex flex-col gap-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="Item name"
                      className="w-full border border-border rounded-[14px] px-4 py-3 text-base font-nunito font-medium text-text-primary bg-bg placeholder:text-text-muted outline-none focus:border-primary"
                    />
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        value={itemPrice}
                        onChange={(e) => setItemPrice(e.target.value)}
                        placeholder="Price"
                        className="w-full border border-border rounded-[14px] px-4 py-3 text-base font-nunito font-medium text-text-primary bg-bg placeholder:text-text-muted outline-none focus:border-primary pr-14"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-nunito font-medium text-text-muted pointer-events-none">
                        EGP
                      </span>
                    </div>

                    {/* Person selection chips */}
                    <div className="flex flex-wrap gap-2">
                      {people.map((person) => {
                        const isSelected = selectedPeople.includes(person.id);
                        return (
                          <button
                            key={person.id}
                            onClick={() => togglePerson(person.id)}
                            className={`inline-flex items-center gap-1.5 rounded-full pl-1.5 pr-3 py-1.5 text-sm font-nunito font-semibold transition-colors ${
                              isSelected
                                ? 'bg-[#4A90D9] text-white'
                                : 'bg-bg text-text-secondary'
                            }`}
                          >
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : person.color,
                              }}
                            >
                              <span className="text-[10px] font-nunito font-bold leading-none text-white">
                                {getInitials(person.name)}
                              </span>
                            </div>
                            {person.name}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleAddItem}
                        disabled={!itemName.trim() || !itemPrice || selectedPeople.length === 0}
                        className="flex-1 bg-primary text-white font-bold rounded-[14px] py-2.5 text-sm text-center font-nunito hover:opacity-90 transition-opacity disabled:opacity-40"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setItemName('');
                          setItemPrice('');
                        }}
                        className="flex-1 text-text-secondary font-nunito font-semibold text-sm py-2.5 text-center hover:text-text-primary transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-full bg-primary text-white font-bold rounded-[18px] py-4 text-center font-nunito text-base hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
