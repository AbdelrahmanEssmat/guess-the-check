import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'guess-the-check-theme';

interface ThemeState {
  mode: ThemeMode;
  toggleMode: () => void;
}

function getStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return 'light';
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: getStoredMode(),

  toggleMode: () =>
    set((state) => {
      const next: ThemeMode = state.mode === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage unavailable
      }
      return { mode: next };
    }),
}));
