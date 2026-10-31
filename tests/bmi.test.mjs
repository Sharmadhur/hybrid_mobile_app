import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBmi, classifyBmi, heightToMeters, validateMeasurements, weightToKg } from '../src/utils/bmi.ts';

const metricInput = (overrides = {}) => ({
  age: 30,
  gender: 'Prefer not to say',
  height: 170,
  heightUnit: 'cm',
  weight: 70,
  weightUnit: 'kg',
  ...overrides,
});

test('calculates BMI and adult healthy range from metric measurements', () => {
  const result = calculateBmi(metricInput());
  assert.equal(result.bmi, 70 / (1.7 * 1.7));
  assert.equal(result.category, 'Normal weight');
  assert.equal(result.healthyMinKg, 18.5 * 1.7 ** 2);
  assert.ok(Math.abs(result.healthyMaxKg - 24.9 * 1.7 ** 2) < 1e-10);
});

test('metric and imperial measurements resolve to the same BMI', () => {
  const metric = calculateBmi(metricInput({ height: 170.18, weight: 70.0002 }));
  const imperial = calculateBmi(metricInput({
    height: 5, heightInches: 7, heightUnit: 'ft', weight: 154.324, weightUnit: 'lb',
  }));
  assert.ok(Math.abs(imperial.bmi - (154.324 * 703) / (67 ** 2)) < 1e-12);
  assert.ok(Math.abs(metric.bmi - imperial.bmi) < 0.01);
  assert.ok(Math.abs(metric.healthyMinKg - imperial.healthyMinKg) < 0.01);
});

test('converts meter, centimeter, feet/inches, kilograms, and pounds', () => {
  assert.equal(heightToMeters(170, 'cm'), 1.7);
  assert.equal(heightToMeters(1.7, 'm'), 1.7);
  assert.equal(heightToMeters(5, 'ft', 7), 1.7018);
  assert.ok(Math.abs(weightToKg(154.3236, 'lb') - 70) < 0.0001);
});

test('classifies adult BMI at each boundary', () => {
  assert.equal(classifyBmi(18.49), 'Underweight');
  assert.equal(classifyBmi(18.5), 'Normal weight');
  assert.equal(classifyBmi(24.99), 'Normal weight');
  assert.equal(classifyBmi(25), 'Overweight');
  assert.equal(classifyBmi(29.99), 'Overweight');
  assert.equal(classifyBmi(30), 'Obesity');
});

test('rejects missing, invalid, and unrealistic measurements', () => {
  assert.match(validateMeasurements(metricInput({ age: 1 })), /age/i);
  assert.match(validateMeasurements(metricInput({ height: 0 })), /height/i);
  assert.match(validateMeasurements(metricInput({ height: 300 })), /height/i);
  assert.match(validateMeasurements(metricInput({ weight: -1 })), /weight/i);
  assert.match(validateMeasurements(metricInput({ weight: 600 })), /weight/i);
  assert.match(validateMeasurements(metricInput({ heightUnit: 'ft', height: 5, heightInches: 12 })), /inches/i);
  assert.equal(validateMeasurements(metricInput()), null);
});