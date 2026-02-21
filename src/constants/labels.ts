export const APP_NAME = 'QUIET';

export const SETTINGS_TITLE = 'Settings';
export const SETTINGS_BUTTON_LABEL = 'Open settings';
export const CLOSE_SETTINGS_BUTTON_LABEL = 'Close settings';

export const BUTTON_LABELS = {
  done: 'Done',
  reset: 'Reset',
  skip: 'Skip',
  pause: 'Pause',
  resume: 'Resume',
} as const;

export const AUDIO_LABEL = 'Audio tones';
export const AUDIO_DESCRIPTION = 'Soft cues for start and finish';

export const EMPTY_HISTORY_MESSAGE = 'No cycles tracked yet';

export const SECTION_LABELS = {
  configuration: 'Configuration',
  recentFlow: 'Recent Flow',
} as const;

export const PAUSED_LABEL = 'Paused';

export const MODE_LABELS = {
  FOCUS: 'Focus',
  BREAK: 'Break',
  DEEP_REST: 'Deep Rest',
} as const;

export const MODE_CTA = {
  FOCUS: 'Start Focus',
  BREAK: 'Start Break',
  DEEP_REST: 'Start Rest',
} as const;

export const MODE_INSTRUCTIONS = {
  FOCUS: 'Clear the desk. Go deep. Let the timer hold the edge.',
  BREAK: 'Rest your eyes. Breathe. Let your mind soften.',
  DEEP_REST: 'Fully disconnect. Stretch, walk, or simply be still.',
} as const;

export const CYCLE_LABEL = (current: number, total: number) =>
  `Cycle ${current} of ${total}`;

export const DURATION_SUFFIX = 'm';

export const DURATION_SYMBOLS = {
  decrease: '\u2013',
  increase: '+',
} as const;

export const DURATION_ARIA_LABELS = {
  decrease: (label: string) => `Decrease ${label}`,
  increase: (label: string) => `Increase ${label}`,
} as const;

export const MOUNT_ERROR = 'Could not find root element to mount to';
