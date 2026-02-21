import React from 'react';
import { DURATION_ARIA_LABELS, DURATION_SUFFIX, DURATION_SYMBOLS } from '../../constants';
import styles from './DurationControl.module.css';

interface DurationControlProps {
  label: string;
  minutes: number;
  min: number;
  max: number;
  step: number;
  onAdjust: (deltaMinutes: number) => void;
}

export const DurationControl: React.FC<DurationControlProps> = ({
  label,
  minutes,
  min,
  max,
  step,
  onAdjust,
}) => {
  const canDecrease = minutes > min;
  const canIncrease = minutes < max;

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        <div className="type-small">{label}</div>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => onAdjust(-step)}
          disabled={!canDecrease}
          className={styles.stepButton}
          aria-label={DURATION_ARIA_LABELS.decrease(label)}
        >
          {DURATION_SYMBOLS.decrease}
        </button>
        <div className={styles.valueDisplay}>
          {minutes}{DURATION_SUFFIX}
        </div>
        <button
          type="button"
          onClick={() => onAdjust(step)}
          disabled={!canIncrease}
          className={styles.stepButton}
          aria-label={DURATION_ARIA_LABELS.increase(label)}
        >
          {DURATION_SYMBOLS.increase}
        </button>
      </div>
    </div>
  );
};
