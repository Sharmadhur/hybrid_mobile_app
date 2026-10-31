import type { HeightUnit, WeightUnit } from './utils/bmi';

export interface SavedCalculation {
  id: string;
  createdAt: string;
  age: number;
  gender: string;
  heightMeters: number;
  weightKg: number;
  bmi: number;
  category: string;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  heightUnit: HeightUnit;
  weightUnit: WeightUnit;
}

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  age: 30,
  gender: 'Prefer not to say',
  heightUnit: 'cm',
  weightUnit: 'kg',
};