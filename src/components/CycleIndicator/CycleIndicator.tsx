import React from 'react';
import { motion } from 'framer-motion';
import { CYCLE_DOT_ACTIVE, CYCLE_DOT_INACTIVE, CYCLE_LABEL } from '../../constants';
import styles from './CycleIndicator.module.css';

interface CycleIndicatorProps {
  currentCycle: number;
  totalCycles: number;
}

export const CycleIndicator: React.FC<CycleIndicatorProps> = ({ currentCycle, totalCycles }) => {
  const cycleIndices = Array.from({ length: totalCycles }, (_, i) => i + 1);

  return (
    <div className={styles.container}>
      {cycleIndices.map((i) => (
        <motion.div
          key={i}
          initial={false}
          animate={i <= currentCycle ? CYCLE_DOT_ACTIVE : CYCLE_DOT_INACTIVE}
          className={styles.dot}
        />
      ))}
      <span className={`type-small ${styles.label}`}>
        {CYCLE_LABEL(currentCycle, totalCycles)}
      </span>
    </div>
  );
};
