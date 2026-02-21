/**
 * Color palette for each timer mode.
 * All raw color values live here — themes.ts generates CSS vars from these.
 */

export type RGB = [number, number, number];

export interface ThemeColorPalette {
  /** Page background (hex) */
  background: string;
  /** Primary text / foreground (hex) */
  foreground: string;
  /** Foreground as RGB — used for surfaces, borders, shadows with opacity */
  foregroundRgb: RGB;
  /** Surface base as RGB — used for glass/overlay surfaces */
  surfaceRgb: RGB;
  /** Surface secondary as RGB — subtle variation for layered surfaces */
  surfaceAltRgb: RGB;
  /** Button hover background (hex) */
  buttonHover: string;
  /** Thumb / accent foreground (hex) */
  thumb: string;
  /** Button text color (hex) */
  buttonText: string;
}

/** Focus mode — neutral dark on light gray */
export const FOCUS_PALETTE: ThemeColorPalette = {
  background: '#F9FAFB',
  foreground: '#0F172A',
  foregroundRgb: [15, 23, 42],
  surfaceRgb: [255, 255, 255],
  surfaceAltRgb: [255, 255, 255],
  buttonHover: '#1E293B',
  thumb: '#FFFFFF',
  buttonText: '#FFFFFF',
};

/** Break mode — dark green on soft green */
export const BREAK_PALETTE: ThemeColorPalette = {
  background: '#F0FDF4',
  foreground: '#064E3B',
  foregroundRgb: [6, 78, 59],
  surfaceRgb: [240, 253, 244],
  surfaceAltRgb: [236, 253, 243],
  buttonHover: '#065F46',
  thumb: '#FFFFFF',
  buttonText: '#FFFFFF',
};

/** Deep rest mode — dark amber on warm yellow */
export const DEEP_REST_PALETTE: ThemeColorPalette = {
  background: '#FEFCE8',
  foreground: '#78350F',
  foregroundRgb: [120, 53, 15],
  surfaceRgb: [254, 252, 232],
  surfaceAltRgb: [255, 251, 235],
  buttonHover: '#92400E',
  thumb: '#FFFFFF',
  buttonText: '#FFFFFF',
};

/**
 * Opacity tokens — semantic names for all opacity levels used across themes.
 * Changing a value here affects all three themes uniformly.
 */
export const OPACITY = {
  surface1: 0.82,
  surface2: 0.68,
  surface3: 0.52,
  surfaceStrong: 0.92,
  surfaceMuted: 0.06,
  surfaceHover: 0.12,
  surfaceChip: 0.08,
  borderSoft: 0.12,
  borderFaint: 0.08,
  divider: 0.2,
  overlay: 0.04,
  progressTrack: 0.12,
  progressFill: 0.4,
  toggleOn: 0.36,
  toggleOff: 0.22,
  toggleBorderOn: 0.36,
  toggleBorderOff: 0.28,
  shadowElev: 0.45,
  shadowSeg: 0.28,
  shadowSegInset: 0.7,
  shadowPill: 0.32,
  shadowPillInset: 0.7,
  shadowToggle: 0.08,
  shadowThumb: 0.22,
  shadowCta: 0.4,
  shadowCtaHover: 0.45,
} as const;
