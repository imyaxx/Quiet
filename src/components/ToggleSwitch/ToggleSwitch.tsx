import React from 'react';
import { motion } from 'framer-motion';
import { SPRING_TOGGLE, THUMB_TRAVEL } from '../../constants';
import styles from './ToggleSwitch.module.css';

interface ToggleSwitchProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, description, enabled, onToggle }) => (
  <div className={styles.container}>
    <div className={styles.textContent}>
      <div className={`type-small ${styles.label}`}>{label}</div>
      <div className={`type-body ${styles.description}`}>{description}</div>
    </div>
    <button
      onClick={onToggle}
      className={`${styles.toggle} ${enabled ? styles.toggleOn : styles.toggleOff}`}
      style={{ boxShadow: 'var(--shadow-toggle)' }}
    >
      <motion.div
        animate={{ x: enabled ? THUMB_TRAVEL : 0 }}
        transition={SPRING_TOGGLE}
        className={styles.thumb}
      />
    </button>
  </div>
);
