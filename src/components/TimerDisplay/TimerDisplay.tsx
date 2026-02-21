import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimerMode, SessionStatus } from '../../types';
import { MODE_THEMES, PAUSED_LABEL, FADE_BLUR_IN, FADE_SLIDE_UP, MODE_LABEL_ENTER } from '../../constants';
import { formatTime } from '../../utils/time';
import styles from './TimerDisplay.module.css';

interface TimerDisplayProps {
  timeLeft: number;
  mode: TimerMode;
  totalDuration: number;
  status: SessionStatus;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, mode, totalDuration, status }) => {
  const theme = MODE_THEMES[mode];
  const isPaused = status === SessionStatus.PAUSED;

  return (
    <>
      <motion.p
        {...MODE_LABEL_ENTER}
        className={`type-small ${styles.modeLabel}`}
      >
        {theme.label}
      </motion.p>

      <div className={styles.container} aria-live="polite">
        <motion.h1
          key={`${mode}-${totalDuration}`}
          {...FADE_BLUR_IN}
          className="type-h1 text-current"
        >
          {formatTime(timeLeft)}
        </motion.h1>
        <AnimatePresence>
          {isPaused && (
            <motion.div {...FADE_SLIDE_UP} className={`type-small ${styles.pausedIndicator}`}>
              {PAUSED_LABEL}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
