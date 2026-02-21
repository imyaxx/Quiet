import { UserConfig } from '../types';

export const DEFAULT_CONFIG: UserConfig = {
  focusDuration: 25 * 60,
  breakDuration: 5 * 60,
  deepRestDuration: 20 * 60,
  soundEnabled: true,
};

export const CYCLES_BEFORE_DEEP_REST = 4;

export const MAX_HISTORY_ENTRIES = 50;
export const VISIBLE_HISTORY_COUNT = 3;

export interface DurationConstraint {
  key: keyof Pick<UserConfig, 'focusDuration' | 'breakDuration' | 'deepRestDuration'>;
  label: string;
  step: number;
  min: number;
  max: number;
}

export const DURATION_CONSTRAINTS: DurationConstraint[] = [
  { key: 'focusDuration', label: 'Focus length', step: 5, min: 15, max: 90 },
  { key: 'breakDuration', label: 'Short break', step: 5, min: 5, max: 30 },
  { key: 'deepRestDuration', label: 'Deep rest', step: 5, min: 10, max: 60 },
];

export const TICK_INTERVAL_MS = 1000;
