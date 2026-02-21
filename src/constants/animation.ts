// --- Spring presets ---

export const SPRING_MODAL = {
  type: 'spring' as const,
  damping: 25,
  stiffness: 300,
};

export const SPRING_TOGGLE = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
};

export const SPRING_NAV_PILL = {
  type: 'spring' as const,
  bounce: 0.2,
  duration: 0.6,
};

// --- Entrance / exit animations ---

export const FADE_BLUR_IN = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  transition: { duration: 1 },
};

export const FADE_SLIDE_UP = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 5 },
};

export const OVERLAY_FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const PANEL_SLIDE_UP = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 40 },
};

// --- Interactive feedback ---

export const CTA_HOVER = { scale: 1.02 };
export const CTA_TAP = { scale: 0.98 };

// --- Breathing dot (Header) ---

export const BREATHING_ANIMATION = {
  scale: [1, 1.2, 1],
};

export const BREATHING_TRANSITION = {
  duration: 2,
  repeat: Infinity,
  ease: 'easeInOut' as const,
};

// --- Cycle indicator ---

export const CYCLE_DOT_ACTIVE = { scale: 1.2, opacity: 0.8 };
export const CYCLE_DOT_INACTIVE = { scale: 1, opacity: 0.25 };

// --- Mode label entrance (TimerDisplay) ---

export const MODE_LABEL_ENTER = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 0.5, y: 0 },
};

// --- Instruction text (TimerControls) ---

export const INSTRUCTION_OPACITY = 0.55;

// --- Toggle switch ---

export const THUMB_TRAVEL = 16;

// --- History entry slide-in (Footer) ---

export const HISTORY_SLIDE_IN = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
};
