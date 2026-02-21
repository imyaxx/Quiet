import React from 'react';
import { motion } from 'framer-motion';
import { TimerMode } from '../../types';
import { MODE_THEMES, SPRING_NAV_PILL } from '../../constants';
import styles from './ModeNav.module.css';

interface ModeNavProps {
  activeMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

const ALL_MODES = Object.values(TimerMode) as TimerMode[];

export const ModeNav: React.FC<ModeNavProps> = ({ activeMode, onModeChange }) => (
  <nav className={styles.nav}>
    {ALL_MODES.map((mode) => (
      <motion.button
        key={mode}
        onClick={() => onModeChange(mode)}
        className={`${styles.modeButton} type-small ${
          activeMode === mode ? styles.modeButtonActive : styles.modeButtonInactive
        }`}
        whileHover={{ opacity: 1 }}
      >
        {activeMode === mode && (
          <motion.div
            layoutId="active-pill"
            className={styles.activePill}
            transition={SPRING_NAV_PILL}
          />
        )}
        <motion.div className={styles.hoverOverlay} />
        <span className={styles.label}>
          {MODE_THEMES[mode].label}
        </span>
      </motion.button>
    ))}
  </nav>
);
