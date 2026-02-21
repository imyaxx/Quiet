import React from 'react';
import { motion } from 'framer-motion';
import { SessionStatus } from '../../types';
import { APP_NAME, BREATHING_ANIMATION, BREATHING_TRANSITION, SETTINGS_BUTTON_LABEL } from '../../constants';
import { SettingsIcon } from '../icons/Icons';
import styles from './Header.module.css';

interface HeaderProps {
  status: SessionStatus;
  onSettingsOpen: () => void;
  children: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ status, onSettingsOpen, children }) => {
  const isRunning = status === SessionStatus.RUNNING;

  return (
    <header className={styles.header}>
      <div className={styles.headerGrid}>
        <div className={styles.logo}>
          <motion.div
            animate={isRunning ? BREATHING_ANIMATION : { scale: 1 }}
            transition={BREATHING_TRANSITION}
            className={styles.logoDot}
          />
          <span className={`type-small ${styles.logoText}`}>
            {APP_NAME}
          </span>
        </div>

        <div className={styles.rightSection}>
          {children}

          <button
            onClick={onSettingsOpen}
            className={styles.settingsButton}
            aria-label={SETTINGS_BUTTON_LABEL}
          >
            <SettingsIcon />
          </button>
        </div>
      </div>
    </header>
  );
};
