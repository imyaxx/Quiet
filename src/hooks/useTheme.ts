import { useEffect } from 'react';
import { TimerMode } from '../types';
import { MODE_THEMES } from '../constants';

export function useTheme(mode: TimerMode): void {
  useEffect(() => {
    const root = document.documentElement;
    const vars = MODE_THEMES[mode].vars;

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [mode]);
}
