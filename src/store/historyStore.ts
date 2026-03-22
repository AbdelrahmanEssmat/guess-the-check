import { create } from 'zustand';
import { Session } from '../types';

const STORAGE_KEY = 'guess-the-check-history';
const MAX_HISTORY = 100;

function isValidSession(obj: unknown): obj is Session {
  if (!obj || typeof obj !== 'object') return false;
  const s = obj as Record<string, unknown>;
  return (
    typeof s.id === 'string' &&
    typeof s.date === 'string' &&
    Array.isArray(s.people) &&
    s.tax !== undefined &&
    s.service !== undefined
  );
}

interface HistoryState {
  sessions: Session[];
  isLoaded: boolean;
  loadHistory: () => void;
  saveSession: (session: Session) => void;
  deleteSession: (sessionId: string) => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  sessions: [],
  isLoaded: false,

  loadHistory: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        set({ sessions: [], isLoaded: true });
        return;
      }
      const parsed = JSON.parse(data);
      const sessions: Session[] = Array.isArray(parsed)
        ? parsed.filter(isValidSession)
        : [];
      set({ sessions, isLoaded: true });
    } catch {
      set({ sessions: [], isLoaded: true });
    }
  },

  saveSession: (session) => {
    const updated = [session, ...get().sessions].slice(0, MAX_HISTORY);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ sessions: updated });
    } catch {
      // Storage write failed
    }
  },

  deleteSession: (sessionId) => {
    const updated = get().sessions.filter((s) => s.id !== sessionId);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ sessions: updated });
    } catch {
      // Storage write failed
    }
  },
}));
