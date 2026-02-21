import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TimerMode, SessionStatus, TimerState, UserConfig, HistoryEntry } from '../types';
import { CYCLES_BEFORE_DEEP_REST, MAX_HISTORY_ENTRIES, TICK_INTERVAL_MS } from '../constants';
import { audioService } from '../services/audioService';
import { generateId } from '../utils/time';

interface UseTimerReturn {
  state: TimerState;
  setMode: (mode: TimerMode, explicitReset?: boolean) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  completeSession: () => void;
}

function getDurationForMode(config: UserConfig, mode: TimerMode): number {
  switch (mode) {
    case TimerMode.FOCUS:
      return config.focusDuration;
    case TimerMode.BREAK:
      return config.breakDuration;
    case TimerMode.DEEP_REST:
      return config.deepRestDuration;
  }
}

export function useTimer(
  config: UserConfig,
  setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>,
): UseTimerReturn {
  const [state, setState] = useState<TimerState>({
    mode: TimerMode.FOCUS,
    status: SessionStatus.IDLE,
    timeLeft: config.focusDuration,
    totalDuration: config.focusDuration,
    cycleCount: 1,
  });

  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const setMode = useCallback(
    (mode: TimerMode, explicitReset = false) => {
      const duration = getDurationForMode(config, mode);

      setState((prev) => ({
        ...prev,
        mode,
        status: SessionStatus.IDLE,
        timeLeft: duration,
        totalDuration: duration,
        cycleCount: explicitReset ? 1 : prev.cycleCount,
      }));

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      lastTickRef.current = null;
    },
    [config],
  );

  useEffect(() => {
    if (state.status !== SessionStatus.RUNNING) {
      const currentModeDuration = getDurationForMode(config, state.mode);

      setState((prev) => ({
        ...prev,
        timeLeft: currentModeDuration,
        totalDuration: currentModeDuration,
      }));
    }
  }, [
    config.focusDuration,
    config.breakDuration,
    config.deepRestDuration,
    state.mode,
    state.status === SessionStatus.IDLE,
  ]);

  const completeSession = useCallback(() => {
    const currentMode = state.mode;
    const currentCycle = state.cycleCount;

    const entry: HistoryEntry = {
      id: generateId(),
      mode: currentMode,
      startTime: Date.now() - state.totalDuration * 1000,
      durationMinutes: Math.floor(state.totalDuration / 60),
      completed: true,
    };
    setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY_ENTRIES));

    if (config.soundEnabled) audioService.playCompletion();

    if (currentMode === TimerMode.FOCUS) {
      if (currentCycle >= CYCLES_BEFORE_DEEP_REST) {
        setMode(TimerMode.DEEP_REST);
      } else {
        setMode(TimerMode.BREAK);
      }
    } else {
      const nextCycle = currentMode === TimerMode.BREAK ? currentCycle + 1 : 1;
      setState((prev) => ({
        ...prev,
        mode: TimerMode.FOCUS,
        status: SessionStatus.IDLE,
        timeLeft: config.focusDuration,
        totalDuration: config.focusDuration,
        cycleCount: nextCycle,
      }));
    }
  }, [state, config, setMode, setHistory]);

  const tick = useCallback(() => {
    const now = Date.now();
    if (lastTickRef.current) {
      const delta = Math.round((now - lastTickRef.current) / 1000);
      if (delta >= 1) {
        setState((prev) => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - delta),
        }));
        lastTickRef.current = now;
      }
    } else {
      lastTickRef.current = now;
    }
  }, []);

  useEffect(() => {
    if (state.status === SessionStatus.RUNNING && state.timeLeft > 0) {
      timerRef.current = window.setInterval(tick, TICK_INTERVAL_MS);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (state.timeLeft === 0 && state.status === SessionStatus.RUNNING) {
        completeSession();
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status, state.timeLeft, completeSession, tick]);

  const toggleTimer = useCallback(() => {
    if (state.status === SessionStatus.RUNNING) {
      setState((prev) => ({ ...prev, status: SessionStatus.PAUSED }));
      lastTickRef.current = null;
    } else {
      if (config.soundEnabled && state.status === SessionStatus.IDLE) {
        audioService.playStart();
      }
      setState((prev) => ({ ...prev, status: SessionStatus.RUNNING }));
      lastTickRef.current = Date.now();
    }
  }, [state.status, config.soundEnabled]);

  const resetTimer = useCallback(
    () => setMode(state.mode, false),
    [state.mode, setMode],
  );

  return { state, setMode, toggleTimer, resetTimer, completeSession };
}
