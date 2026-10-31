export type HeightUnit = 'cm' | 'm' | 'ft';
export type WeightUnit = 'kg' | 'lb';

export interface Measurements {
  age: number;
  gender: string;
  height: number;
  heightInches?: number;
  heightUnit: HeightUnit;
  weight: number;
  weightUnit: WeightUnit;
}

export interface BmiResult {
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obesity';
  heightMeters: number;
  weightKg: number;
  healthyMinKg: number;
  healthyMaxKg: number;
}

export function heightToMeters(height: number, unit: HeightUnit, inches = 0): number {
  if (unit === 'cm') return height / 100;
  if (unit === 'm') return height;
  return (height * 12 + inches) * 0.0254;
}

export function weightToKg(weight: number, unit: WeightUnit): number {
  return unit === 'lb' ? weight * 0.45359237 : weight;
}

export function kgToWeight(weight: number, unit: WeightUnit): number {
  return unit === 'lb' ? weight / 0.45359237 : weight;
}

export function classifyBmi(bmi: number): BmiResult['category'] {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obesity';
}

export function calculateBmi(measurements: Measurements): BmiResult {
  const heightMeters = heightToMeters(
    measurements.height,
    measurements.heightUnit,
    measurements.heightInches,
  );
  const weightKg = weightToKg(measurements.weight, measurements.weightUnit);
  const bmi = measurements.weightUnit === 'lb'
    ? (measurements.weight * 703) / ((heightMeters / 0.0254) ** 2)
    : weightKg / (heightMeters * heightMeters);

  return {
    bmi,
    category: classifyBmi(bmi),
    heightMeters,
    weightKg,
    healthyMinKg: 18.5 * heightMeters * heightMeters,
    healthyMaxKg: 24.9 * heightMeters * heightMeters,
  };
}

export function validateMeasurements(measurements: Measurements): string | null {
  if (!Number.isFinite(measurements.age) || measurements.age < 2 || measurements.age > 120) {
    return 'Enter an age between 2 and 120 years.';
  }
  if (!Number.isFinite(measurements.height) || measurements.height <= 0) {
    return 'Enter a height greater than zero.';
  }
  if (measurements.heightUnit === 'ft' && (!Number.isFinite(measurements.heightInches ?? 0) || (measurements.heightInches ?? 0) < 0 || (measurements.heightInches ?? 0) >= 12)) {
    return 'Enter inches from 0 to 11.';
  }
  if (!Number.isFinite(measurements.weight) || measurements.weight <= 0) {
    return 'Enter a weight greater than zero.';
  }

  const heightMeters = heightToMeters(measurements.height, measurements.heightUnit, measurements.heightInches);
  const weightKg = weightToKg(measurements.weight, measurements.weightUnit);
  if (heightMeters < 0.3 || heightMeters > 2.5) return 'Enter a height between 30 cm and 250 cm.';
  if (weightKg < 2 || weightKg > 500) return 'Enter a weight between 2 kg and 500 kg.';
  return null;
}

export function formatWeight(kg: number, unit: WeightUnit): string {
  const value = kgToWeight(kg, unit);
  return `${value.toFixed(1)} ${unit}`;
}