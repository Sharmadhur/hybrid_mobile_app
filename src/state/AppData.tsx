import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { DEFAULT_PROFILE, type SavedCalculation, type UserProfile } from '../types';
import { readValue, writeValue } from '../services/storage';

interface AppDataValue {
  history: SavedCalculation[];
  profile: UserProfile;
  darkMode: boolean;
  ready: boolean;
  saveCalculation: (calculation: SavedCalculation) => Promise<void>;
  deleteCalculation: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<void>;
  setDarkMode: (darkMode: boolean) => Promise<void>;
}

const AppDataContext = createContext<AppDataValue | null>(null);

export function AppDataProvider({ children }: PropsWithChildren) {
  const [history, setHistory] = useState<SavedCalculation[]>([]);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [darkMode, setDarkModeState] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void Promise.all([
      readValue<SavedCalculation[]>('history', []),
      readValue<UserProfile>('profile', DEFAULT_PROFILE),
      readValue<boolean>('theme', false),
    ]).then(([savedHistory, savedProfile, savedTheme]) => {
      setHistory(savedHistory);
      setProfile({ ...DEFAULT_PROFILE, ...savedProfile });
      setDarkModeState(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme);
      setReady(true);
    });
  }, []);

  const value = useMemo<AppDataValue>(() => ({
    history,
    profile,
    darkMode,
    ready,
    saveCalculation: async (calculation) => {
      const next = [calculation, ...history];
      setHistory(next);
      await writeValue('history', next);
    },
    deleteCalculation: async (id) => {
      const next = history.filter((item) => item.id !== id);
      setHistory(next);
      await writeValue('history', next);
    },
    clearHistory: async () => {
      setHistory([]);
      await writeValue('history', []);
    },
    saveProfile: async (nextProfile) => {
      setProfile(nextProfile);
      await writeValue('profile', nextProfile);
    },
    setDarkMode: async (nextTheme) => {
      setDarkModeState(nextTheme);
      document.documentElement.classList.toggle('dark', nextTheme);
      await writeValue('theme', nextTheme);
    },
  }), [history, profile, darkMode, ready]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataValue {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used inside AppDataProvider');
  return context;
}