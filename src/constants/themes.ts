import { TimerMode } from '../types';
import {
  FOCUS_PALETTE,
  BREAK_PALETTE,
  DEEP_REST_PALETTE,
  OPACITY,
  type ThemeColorPalette,
  type RGB,
} from './colors';
import { MODE_LABELS, MODE_CTA, MODE_INSTRUCTIONS } from './labels';

export interface ModeTheme {
  vars: Record<string, string>;
  button: string;
  label: string;
  cta: string;
  instruction: string;
}

const rgba = (rgb: RGB, alpha: number): string =>
  `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;

const BUTTON_CLASS = 'bg-[color:var(--button-bg)] text-[color:var(--button-fg)] hover:bg-[color:var(--button-bg-hover)]';

/**
 * Generates all CSS custom properties from a color palette + shared opacity tokens.
 * No raw color values outside of colors.ts.
 */
function buildThemeVars(palette: ThemeColorPalette): Record<string, string> {
  const { foreground, background, foregroundRgb: fg, surfaceRgb: sf, surfaceAltRgb: sfAlt, buttonHover, thumb, buttonText } = palette;

  return {
    '--app-bg': background,
    '--app-fg': foreground,

    // Surfaces — glass layers using surface base RGB
    '--surface-1': rgba(sf, OPACITY.surface1),
    '--surface-2': rgba(sfAlt, OPACITY.surface2),
    '--surface-3': rgba(sf, OPACITY.surface3),
    '--surface-strong': rgba(sf, OPACITY.surfaceStrong),

    // Surfaces — muted/hover using foreground RGB
    '--surface-muted': rgba(fg, OPACITY.surfaceMuted),
    '--surface-hover': rgba(fg, OPACITY.surfaceHover),
    '--surface-chip': rgba(fg, OPACITY.surfaceChip),

    // Borders
    '--border-soft': rgba(fg, OPACITY.borderSoft),
    '--border-faint': rgba(fg, OPACITY.borderFaint),
    '--divider': rgba(fg, OPACITY.divider),

    // Overlay
    '--overlay': rgba(fg, OPACITY.overlay),

    // Progress
    '--progress-track': rgba(fg, OPACITY.progressTrack),
    '--progress-fill': rgba(fg, OPACITY.progressFill),

    // Buttons
    '--button-bg': foreground,
    '--button-bg-hover': buttonHover,
    '--button-fg': buttonText,

    // Shadows
    '--shadow-elev': `0 24px 80px -60px ${rgba(fg, OPACITY.shadowElev)}`,
    '--shadow-seg': `0 6px 16px -12px ${rgba(fg, OPACITY.shadowSeg)}, inset 0 1px 0 ${rgba(sf, OPACITY.shadowSegInset)}`,
    '--shadow-pill': `0 6px 14px -10px ${rgba(fg, OPACITY.shadowPill)}, inset 0 1px 0 ${rgba(sf, OPACITY.shadowPillInset)}`,
    '--shadow-toggle': `0 1px 2px ${rgba(fg, OPACITY.shadowToggle)}`,
    '--shadow-thumb': `0 3px 10px ${rgba(fg, OPACITY.shadowThumb)}`,
    '--shadow-cta': `0 12px 24px -16px ${rgba(fg, OPACITY.shadowCta)}`,
    '--shadow-cta-hover': `0 18px 32px -18px ${rgba(fg, OPACITY.shadowCtaHover)}`,

    // Toggle
    '--thumb': thumb,
    '--toggle-on': rgba(fg, OPACITY.toggleOn),
    '--toggle-off': rgba(fg, OPACITY.toggleOff),
    '--toggle-border-on': rgba(fg, OPACITY.toggleBorderOn),
    '--toggle-border-off': rgba(fg, OPACITY.toggleBorderOff),
  };
}

export const MODE_THEMES: Record<TimerMode, ModeTheme> = {
  [TimerMode.FOCUS]: {
    vars: buildThemeVars(FOCUS_PALETTE),
    button: BUTTON_CLASS,
    label: MODE_LABELS.FOCUS,
    cta: MODE_CTA.FOCUS,
    instruction: MODE_INSTRUCTIONS.FOCUS,
  },
  [TimerMode.BREAK]: {
    vars: buildThemeVars(BREAK_PALETTE),
    button: BUTTON_CLASS,
    label: MODE_LABELS.BREAK,
    cta: MODE_CTA.BREAK,
    instruction: MODE_INSTRUCTIONS.BREAK,
  },
  [TimerMode.DEEP_REST]: {
    vars: buildThemeVars(DEEP_REST_PALETTE),
    button: BUTTON_CLASS,
    label: MODE_LABELS.DEEP_REST,
    cta: MODE_CTA.DEEP_REST,
    instruction: MODE_INSTRUCTIONS.DEEP_REST,
  },
};
