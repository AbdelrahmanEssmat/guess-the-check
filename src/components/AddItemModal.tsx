import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Person } from '../types';
import { getInitials } from '../utils/formatting';

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, price: number, splitBetween: string[]) => void;
  people: Person[];
  currentPersonId: string;
}

export default function AddItemModal({
  visible,
  onClose,
  onAdd,
  people,
  currentPersonId,
}: AddItemModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  // selectedPeople here means "other people to split with" (currentPerson is always included)
  const [splitWith, setSplitWith] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  const otherPeople = people.filter((p) => p.id !== currentPersonId);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setName('');
      setPrice('');
      setSplitWith([]);
      setErrors({});
    }
  }, [visible]);

  const toggleSplitPerson = (personId: string) => {
    setSplitWith((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    );
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Item name is required';
    }

    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      newErrors.price = 'Enter a valid price';
    } else if (parsedPrice > 999999) {
      newErrors.price = 'Price is too high';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;

    const parsedPrice = parseFloat(price);
    // Always include the current person + whoever they split with
    onAdd(name.trim(), parsedPrice, [currentPersonId, ...splitWith]);
    setName('');
    setPrice('');
    setSplitWith([]);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setName('');
    setPrice('');
    setSplitWith([]);
    setErrors({});
    onClose();
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
          onClick={handleClose}
        >
          <motion.div
            className="bg-bg-card rounded-t-[28px] p-6 pb-10 w-full max-w-[480px]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-nunito font-bold text-text-primary mb-5">Add Item</h2>

            {/* Item name */}
            <div className="mb-4">
              <label className="text-sm font-nunito font-semibold text-text-secondary mb-1.5 block">
                Item Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
                placeholder="e.g. Pasta, Coffee"
                maxLength={50}
                className={`w-full border rounded-[14px] px-4 py-3 text-base font-nunito font-medium text-text-primary bg-bg placeholder:text-text-muted outline-none focus:border-primary ${
                  errors.name ? 'border-error' : 'border-border'
                }`}
              />
              {errors.name && (
                <p className="text-error text-xs font-nunito mt-1">{errors.name}</p>
              )}
            </div>

            {/* Price */}
            <div className="mb-5">
              <label className="text-sm font-nunito font-semibold text-text-secondary mb-1.5 block">
                Price <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={price}
                  onChange={(e) => { setPrice(e.target.value); setErrors((prev) => ({ ...prev, price: undefined })); }}
                  placeholder="0.00"
                  className={`w-full border rounded-[14px] px-4 py-3 text-base font-nunito font-medium text-text-primary bg-bg placeholder:text-text-muted outline-none focus:border-primary pr-14 ${
                    errors.price ? 'border-error' : 'border-border'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-nunito font-medium text-text-muted pointer-events-none">
                  EGP
                </span>
              </div>
              {errors.price && (
                <p className="text-error text-xs font-nunito mt-1">{errors.price}</p>
              )}
            </div>

            {/* Split with (optional — only other people) */}
            {otherPeople.length > 0 && (
              <div className="mb-6">
                <label className="text-sm font-nunito font-semibold text-text-secondary mb-2 block">
                  Split with?
                </label>
                <div className="flex flex-wrap gap-2">
                  {otherPeople.map((person) => {
                    const isSelected = splitWith.includes(person.id);
                    return (
                      <button
                        key={person.id}
                        onClick={() => toggleSplitPerson(person.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full pl-1.5 pr-3 py-1.5 text-sm font-nunito font-semibold transition-colors ${
                          isSelected
                            ? 'bg-[#4A90D9] text-white'
                            : 'bg-bg-card-elevated text-text-secondary'
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
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleAdd}
                className="bg-primary text-white font-bold rounded-[18px] py-4 text-center font-nunito text-base hover:opacity-90 transition-opacity"
              >
                Add Item
              </button>
              <button
                onClick={handleClose}
                className="text-text-secondary font-nunito font-semibold text-base py-2 text-center hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
