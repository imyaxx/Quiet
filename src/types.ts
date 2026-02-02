
export enum TimerMode {
  FOCUS = 'FOCUS',
  BREAK = 'BREAK',
  DEEP_REST = 'DEEP_REST'
}

export enum SessionStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export interface HistoryEntry {
  id: string;
  mode: TimerMode;
  startTime: number;
  durationMinutes: number;
  completed: boolean;
}

export interface TimerState {
  mode: TimerMode;
  status: SessionStatus;
  timeLeft: number; // in seconds
  totalDuration: number; // in seconds
  cycleCount: number; // 1-4
}

export interface UserConfig {
  focusDuration: number;
  breakDuration: number;
  deepRestDuration: number;
  soundEnabled: boolean;
  autoStartNext: boolean;
}
