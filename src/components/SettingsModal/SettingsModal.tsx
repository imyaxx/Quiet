import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserConfig } from '../../types';
import {
  SETTINGS_TITLE,
  CLOSE_SETTINGS_BUTTON_LABEL,
  BUTTON_LABELS,
  AUDIO_LABEL,
  AUDIO_DESCRIPTION,
  DURATION_CONSTRAINTS,
  OVERLAY_FADE,
  PANEL_SLIDE_UP,
  SPRING_MODAL,
} from '../../constants';
import { getMinutes } from '../../utils/time';
import { CloseIcon } from '../icons/Icons';
import { DurationControl } from '../DurationControl/DurationControl';
import { ToggleSwitch } from '../ToggleSwitch/ToggleSwitch';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UserConfig;
  onConfigChange: React.Dispatch<React.SetStateAction<UserConfig>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onConfigChange }) => {
  const adjustDuration = (
    key: keyof Pick<UserConfig, 'focusDuration' | 'breakDuration' | 'deepRestDuration'>,
    deltaMinutes: number,
    minMinutes: number,
    maxMinutes: number,
  ) => {
    onConfigChange((prev) => {
      const current = getMinutes(prev[key]);
      const next = Math.min(maxMinutes, Math.max(minMinutes, current + deltaMinutes));
      return { ...prev, [key]: next * 60 };
    });
  };

  const toggleSound = () => {
    onConfigChange((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div {...OVERLAY_FADE} className={styles.overlay}>
          <motion.div
            {...PANEL_SLIDE_UP}
            transition={SPRING_MODAL}
            className={styles.panel}
          >
            <div className={styles.content}>
              <div className={styles.header}>
                <h2 className={`type-small ${styles.title}`}>{SETTINGS_TITLE}</h2>
                <button onClick={onClose} className={styles.closeButton} aria-label={CLOSE_SETTINGS_BUTTON_LABEL}>
                  <CloseIcon />
                </button>
              </div>

              <div className={styles.sections}>
                <div className={styles.durationsSection}>
                  {DURATION_CONSTRAINTS.map(({ key, label, step, min, max }) => (
                    <DurationControl
                      key={key}
                      label={label}
                      minutes={getMinutes(config[key])}
                      min={min}
                      max={max}
                      step={step}
                      onAdjust={(delta) => adjustDuration(key, delta, min, max)}
                    />
                  ))}
                </div>

                <ToggleSwitch
                  label={AUDIO_LABEL}
                  description={AUDIO_DESCRIPTION}
                  enabled={config.soundEnabled}
                  onToggle={toggleSound}
                />
              </div>

              <div className={styles.footer}>
                <button onClick={onClose} className={`type-small ${styles.doneButton}`}>
                  {BUTTON_LABELS.done}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
