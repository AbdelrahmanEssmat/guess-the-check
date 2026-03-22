import { create } from 'zustand';
import { Person } from '../types';

const STORAGE_KEY = 'guess-the-check-favorites';
const MAX_FAVORITES = 20;

export interface Favorite {
  name: string;
  color: string;
  count: number;
}

interface FavoritesState {
  favorites: Favorite[];
  isLoaded: boolean;
  loadFavorites: () => void;
  addFromSession: (people: Person[]) => void;
  removeFavorite: (name: string) => void;
}

function persist(favorites: Favorite[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // Storage write failed
  }
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoaded: false,

  loadFavorites: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        set({ favorites: [], isLoaded: true });
        return;
      }
      const parsed = JSON.parse(data);
      const favorites: Favorite[] = Array.isArray(parsed)
        ? parsed.filter(
            (f: unknown) =>
              f &&
              typeof f === 'object' &&
              typeof (f as Favorite).name === 'string' &&
              typeof (f as Favorite).color === 'string' &&
              typeof (f as Favorite).count === 'number'
          )
        : [];
      set({ favorites, isLoaded: true });
    } catch {
      set({ favorites: [], isLoaded: true });
    }
  },

  addFromSession: (people) => {
    const current = get().favorites;
    const updated = [...current];

    for (const person of people) {
      const existingIndex = updated.findIndex(
        (f) => f.name.toLowerCase() === person.name.toLowerCase()
      );
      if (existingIndex !== -1) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          count: updated[existingIndex].count + 1,
          color: person.color,
        };
      } else {
        updated.push({ name: person.name, color: person.color, count: 1 });
      }
    }

    // Sort by count descending, then trim to max
    updated.sort((a, b) => b.count - a.count);
    const trimmed = updated.slice(0, MAX_FAVORITES);

    persist(trimmed);
    set({ favorites: trimmed });
  },

  removeFavorite: (name) => {
    const updated = get().favorites.filter(
      (f) => f.name.toLowerCase() !== name.toLowerCase()
    );
    persist(updated);
    set({ favorites: updated });
  },
}));
