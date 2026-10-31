import type { BmiResult } from '../utils/bmi';

const segments = [
  { label: 'Low', start: 10, end: 18.5, color: 'var(--scale-low)' },
  { label: 'Healthy', start: 18.5, end: 25, color: 'var(--scale-healthy)' },
  { label: 'High', start: 25, end: 30, color: 'var(--scale-high)' },
  { label: 'Very high', start: 30, end: 40, color: 'var(--scale-very-high)' },
];

export default function BmiScale({ bmi, category }: Pick<BmiResult, 'bmi' | 'category'>) {
  const clamped = Math.max(10, Math.min(40, bmi));
  const marker = ((clamped - 10) / 30) * 100;

  return (
    <div className="bmi-scale-wrap" aria-label={`BMI ${bmi.toFixed(1)}, ${category}`}>
      <div className="scale-track">
        {segments.map((segment) => (
          <div
            className="scale-segment"
            key={segment.label}
            style={{ flexGrow: segment.end - segment.start, background: segment.color }}
          />
        ))}
        <div className="scale-marker" style={{ left: `${marker}%` }}><span>{bmi.toFixed(1)}</span></div>
      </div>
      <div className="scale-labels">
        <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obesity</span>
      </div>
    </div>
  );
}