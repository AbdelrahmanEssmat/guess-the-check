import { create } from 'zustand';

type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'guess-the-check-theme';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
}

function getStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return 'system';
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: getStoredMode(),

  setMode: (mode) => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // localStorage unavailable
    }
    set({ mode });
  },

  cycleMode: () =>
    set((state) => {
      const next: ThemeMode =
        state.mode === 'system'
          ? 'light'
          : state.mode === 'light'
            ? 'dark'
            : 'system';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage unavailable
      }
      return { mode: next };
    }),
}));
