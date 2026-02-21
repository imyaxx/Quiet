import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SessionStatus, UserConfig, HistoryEntry } from '../../types';
import {
  MODE_THEMES,
  MODE_LABELS,
  SECTION_LABELS,
  EMPTY_HISTORY_MESSAGE,
  VISIBLE_HISTORY_COUNT,
  DURATION_SUFFIX,
  HISTORY_SLIDE_IN,
} from '../../constants';
import { getMinutes } from '../../utils/time';
import styles from './Footer.module.css';

interface FooterProps {
  config: UserConfig;
  history: HistoryEntry[];
  status: SessionStatus;
}

export const Footer: React.FC<FooterProps> = ({ config, history, status }) => {
  const isRunning = status === SessionStatus.RUNNING;
  const visibleHistory = history.slice(0, VISIBLE_HISTORY_COUNT);

  return (
    <footer className={styles.footer}>
      <div className={styles.divider} />
      <div className={styles.grid}>
        <div className={styles.section}>
          <div className={`type-small ${styles.sectionLabel}`}>
            {SECTION_LABELS.configuration}
          </div>
          <div className={`type-body ${isRunning ? styles.configValueDimmed : styles.configValueNormal}`}>
            {getMinutes(config.focusDuration)}{DURATION_SUFFIX} {MODE_LABELS.FOCUS}
            <span className={styles.separator}>/</span>
            {getMinutes(config.breakDuration)}{DURATION_SUFFIX} {MODE_LABELS.BREAK}
            <span className={styles.separator}>/</span>
            {getMinutes(config.deepRestDuration)}{DURATION_SUFFIX} {MODE_LABELS.DEEP_REST}
          </div>
        </div>

        <div className={styles.sectionRight}>
          <div className={`type-small ${styles.sectionLabel}`}>
            {SECTION_LABELS.recentFlow}
          </div>
          <div className={styles.historyList}>
            <AnimatePresence mode="popLayout">
              {visibleHistory.length === 0 ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.emptyHistory}
                >
                  {EMPTY_HISTORY_MESSAGE}
                </motion.span>
              ) : (
                visibleHistory.map((entry) => (
                  <motion.div
                    layout
                    key={entry.id}
                    {...HISTORY_SLIDE_IN}
                    className={styles.historyEntry}
                  >
                    <div className={styles.historyDot} />
                    <span className={styles.historyText}>
                      {MODE_THEMES[entry.mode].label} • {entry.durationMinutes}{DURATION_SUFFIX}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </footer>
  );
};
