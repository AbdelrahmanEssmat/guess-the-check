import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ChargeConfig, Item, Person, Session } from '../types';
import { getAvatarColor } from '../utils/formatting';

const MAX_PEOPLE = 50;
const MAX_ITEMS_PER_PERSON = 200;

interface SessionState {
  session: Session;
  resetSession: () => void;
  setRestaurantName: (name: string) => void;
  addPerson: (name: string) => void;
  removePerson: (personId: string) => void;
  addItem: (item: Omit<Item, 'id'>) => void;
  removeItem: (personId: string, itemId: string) => void;
  setTax: (config: ChargeConfig) => void;
  setService: (config: ChargeConfig) => void;
  setTip: (config: ChargeConfig) => void;
  setReceiptTotal: (total: number) => void;
}

function createEmptySession(): Session {
  return {
    id: uuidv4(),
    date: new Date().toISOString(),
    people: [],
    tax: { type: 'percentage', value: 0 },
    service: { type: 'percentage', value: 0 },
    tip: { type: 'percentage', value: 0 },
  };
}

export const useSessionStore = create<SessionState>((set) => ({
  session: createEmptySession(),

  resetSession: () => set({ session: createEmptySession() }),

  setRestaurantName: (name) =>
    set((state) => ({
      session: { ...state.session, restaurantName: name },
    })),

  addPerson: (name) =>
    set((state) => {
      if (state.session.people.length >= MAX_PEOPLE) return state;
      const newPerson: Person = {
        id: uuidv4(),
        name,
        color: getAvatarColor(state.session.people.length),
        items: [],
      };
      return {
        session: {
          ...state.session,
          people: [...state.session.people, newPerson],
        },
      };
    }),

  removePerson: (personId) =>
    set((state) => {
      const updatedPeople = state.session.people
        .filter((p) => p.id !== personId)
        .map((person) => ({
          ...person,
          items: person.items
            .map((item) => ({
              ...item,
              splitBetween: item.splitBetween.filter((id) => id !== personId),
            }))
            .filter((item) => item.splitBetween.length > 0),
        }));
      return {
        session: { ...state.session, people: updatedPeople },
      };
    }),

  addItem: (itemData) =>
    set((state) => {
      const newItem: Item = { ...itemData, id: uuidv4() };
      const updatedPeople = state.session.people.map((person) => {
        if (newItem.splitBetween.includes(person.id)) {
          if (person.items.length >= MAX_ITEMS_PER_PERSON) return person;
          return { ...person, items: [...person.items, newItem] };
        }
        return person;
      });
      return {
        session: { ...state.session, people: updatedPeople },
      };
    }),

  removeItem: (_personId, itemId) =>
    set((state) => {
      const updatedPeople = state.session.people.map((person) => ({
        ...person,
        items: person.items.filter((item) => item.id !== itemId),
      }));
      return {
        session: { ...state.session, people: updatedPeople },
      };
    }),

  setTax: (config) =>
    set((state) => ({
      session: { ...state.session, tax: config },
    })),

  setService: (config) =>
    set((state) => ({
      session: { ...state.session, service: config },
    })),

  setTip: (config) =>
    set((state) => ({
      session: { ...state.session, tip: config },
    })),

  setReceiptTotal: (total) =>
    set((state) => ({
      session: { ...state.session, receiptTotal: total },
    })),
}));
