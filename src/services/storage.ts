import { Preferences } from '@capacitor/preferences';

const KEYS = {
  history: 'bmi-history',
  profile: 'bmi-profile',
  theme: 'bmi-theme',
} as const;

export async function readValue<T>(key: keyof typeof KEYS, fallback: T): Promise<T> {
  try {
    const { value } = await Preferences.get({ key: KEYS[key] });
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function writeValue<T>(key: keyof typeof KEYS, value: T): Promise<void> {
  await Preferences.set({ key: KEYS[key], value: JSON.stringify(value) });
}