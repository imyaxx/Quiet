import React from 'react';
import { motion } from 'framer-motion';
import { SessionStatus } from '../../types';
import { BUTTON_LABELS, CTA_HOVER, CTA_TAP, INSTRUCTION_OPACITY } from '../../constants';
import type { ModeTheme } from '../../constants';
import styles from './TimerControls.module.css';

interface TimerControlsProps {
  status: SessionStatus;
  ctaLabel: string;
  theme: ModeTheme;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  status,
  ctaLabel,
  theme,
  onToggle,
  onReset,
  onSkip,
}) => {
  const isIdle = status === SessionStatus.IDLE;

  return (
    <>
      <div className={styles.container}>
        <motion.button
          whileHover={CTA_HOVER}
          whileTap={CTA_TAP}
          onClick={onToggle}
          className={`${styles.ctaButton} type-small ${theme.button}`}
        >
          {ctaLabel}
        </motion.button>

        <div className={styles.desktopActions}>
          <button
            onClick={onReset}
            disabled={isIdle}
            className={`type-small ${styles.secondaryButton}`}
          >
            {BUTTON_LABELS.reset}
          </button>
          <button
            onClick={onSkip}
            className={`type-small ${styles.secondaryButton}`}
          >
            {BUTTON_LABELS.skip}
          </button>
        </div>

        <div className={styles.mobileActions}>
          <button
            onClick={onReset}
            disabled={isIdle}
            className={`type-small ${styles.mobileButton}`}
          >
            {BUTTON_LABELS.reset}
          </button>
          <button
            onClick={onSkip}
            className={`type-small ${styles.mobileButton}`}
          >
            {BUTTON_LABELS.skip}
          </button>
        </div>
      </div>

      <motion.div animate={{ opacity: INSTRUCTION_OPACITY }} className={styles.instruction}>
        <p className={`type-body ${styles.instructionText}`}>
          {theme.instruction}
        </p>
      </motion.div>
    </>
  );
};
