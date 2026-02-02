import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TimerMode,
  SessionStatus,
  TimerState,
  HistoryEntry,
  UserConfig,
} from "./types";
import {
  DEFAULT_CONFIG,
  MODE_THEMES,
  CYCLES_BEFORE_DEEP_REST,
} from "./constants";
import { audioService } from "./services/audioService";

const App: React.FC = () => {
  const [config, setConfig] = useState<UserConfig>(() => {
    const saved = localStorage.getItem("quiet_config");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  const [state, setState] = useState<TimerState>({
    mode: TimerMode.FOCUS,
    status: SessionStatus.IDLE,
    timeLeft: config.focusDuration,
    totalDuration: config.focusDuration,
    cycleCount: 1,
  });

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem("quiet_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem("quiet_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("quiet_config", JSON.stringify(config));
  }, [config]);

  const setMode = useCallback(
    (mode: TimerMode, explicitReset = false) => {
      let duration = config.focusDuration;
      if (mode === TimerMode.BREAK) duration = config.breakDuration;
      if (mode === TimerMode.DEEP_REST) duration = config.deepRestDuration;

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

  // СИНХРОНИЗАЦИЯ НАСТРОЕК С ТАЙМЕРОМ
  // Обновляем timeLeft и totalDuration сразу, как только меняются настройки,
  // но только если сессия не находится в активном беге (RUNNING).
  useEffect(() => {
    if (state.status !== SessionStatus.RUNNING) {
      let currentModeDuration = config.focusDuration;
      if (state.mode === TimerMode.BREAK)
        currentModeDuration = config.breakDuration;
      if (state.mode === TimerMode.DEEP_REST)
        currentModeDuration = config.deepRestDuration;

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
      id: crypto.randomUUID(),
      mode: currentMode,
      startTime: Date.now() - state.totalDuration * 1000,
      durationMinutes: Math.floor(state.totalDuration / 60),
      completed: true,
    };
    setHistory((prev) => [entry, ...prev].slice(0, 50));

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
  }, [state, config, setMode]);

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
      timerRef.current = window.setInterval(tick, 1000);
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
      if (config.soundEnabled && state.status === SessionStatus.IDLE)
        audioService.playStart();
      setState((prev) => ({ ...prev, status: SessionStatus.RUNNING }));
      lastTickRef.current = Date.now();
    }
  }, [state.status, config.soundEnabled]);

  const resetTimer = useCallback(
    () => setMode(state.mode, false),
    [state.mode, setMode],
  );

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const theme = MODE_THEMES[state.mode];
  const ctaLabel =
    state.status === SessionStatus.RUNNING
      ? "Pause"
      : state.status === SessionStatus.PAUSED
        ? "Resume"
        : theme.cta;
  const getMinutes = (seconds: number) => Math.round(seconds / 60);
  const adjustDuration = (
    key: keyof UserConfig,
    deltaMinutes: number,
    minMinutes: number,
    maxMinutes: number,
  ) => {
    setConfig((prev) => {
      const current = getMinutes(prev[key] as number);
      const next = Math.min(
        maxMinutes,
        Math.max(minMinutes, current + deltaMinutes),
      );
      return { ...prev, [key]: next * 60 };
    });
  };
  const durationControls = [
    { key: "focusDuration", label: "Focus length", step: 5, min: 15, max: 90 },
    { key: "breakDuration", label: "Short break", step: 5, min: 5, max: 30 },
    { key: "deepRestDuration", label: "Deep rest", step: 5, min: 10, max: 60 },
  ];

  useEffect(() => {
    const root = document.documentElement;
    (Object.entries(theme.vars) as [string, string][]).forEach(
      ([key, value]) => {
        root.style.setProperty(key, value);
      },
    );
  }, [theme]);

  return (
    <div
      style={theme.vars as React.CSSProperties}
      className="min-h-screen state-transition flex flex-col items-center bg-[color:var(--app-bg)] text-[color:var(--app-fg)]"
    >
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-6 bg-[color:var(--overlay)] backdrop-blur-md"
            style={{
              paddingTop: "calc(env(safe-area-inset-top) + 16px)",
              paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full md:max-w-md rounded-t-[32px] rounded-b-none md:rounded-[32px] bg-[color:var(--surface-1)] backdrop-blur-2xl shadow-[var(--shadow-elev)] overflow-hidden transform max-h-[calc(100dvh-32px)] md:max-h-none flex flex-col"
            >
              <div className="px-6 py-8 md:px-10 md:py-12 flex-1 min-h-0 overflow-y-auto">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="type-small text-current/70 tracking-[0.3em]">
                    Settings
                  </h2>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="hidden md:inline-flex p-2 -mr-2 text-current/40 hover:text-current/60 transition-colors"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 1L13 13M1 13L13 1" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="rounded-3xl bg-[color:var(--surface-2)] px-6 py-6 space-y-8">
                    {durationControls.map(({ key, label, step, min, max }) => {
                      const minutes = getMinutes(
                        config[key as keyof UserConfig] as number,
                      );
                      const canDecrease = minutes > min;
                      const canIncrease = minutes < max;
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <div className="text-left">
                            <div className="type-small text-current/60">
                              {label}
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <button
                              type="button"
                              onClick={() =>
                                adjustDuration(
                                  key as keyof UserConfig,
                                  -step,
                                  min,
                                  max,
                                )
                              }
                              disabled={!canDecrease}
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-[color:var(--surface-3)] text-current/50 hover:text-current/70 hover:bg-[color:var(--surface-2)] transition-colors disabled:opacity-30 disabled:cursor-default"
                              aria-label={`Decrease ${label}`}
                            >
                              –
                            </button>
                            <div className="w-16 h-10 rounded-full bg-[color:var(--surface-muted)] text-current/80 text-lg font-medium flex items-center justify-center">
                              {minutes}m
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                adjustDuration(
                                  key as keyof UserConfig,
                                  step,
                                  min,
                                  max,
                                )
                              }
                              disabled={!canIncrease}
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-[color:var(--surface-3)] text-current/50 hover:text-current/70 hover:bg-[color:var(--surface-2)] transition-colors disabled:opacity-30 disabled:cursor-default"
                              aria-label={`Increase ${label}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-[1fr_auto] items-center gap-8 rounded-3xl bg-[color:var(--surface-3)] px-6 py-6">
                    <div className="flex flex-col justify-center gap-2 text-left">
                      <div className="type-small text-current/70">
                        Audio tones
                      </div>
                      <div className="type-body text-current/60">
                        Soft cues for start and finish
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          soundEnabled: !prev.soundEnabled,
                        }))
                      }
                      className={`self-center w-10 h-6 p-1 rounded-full relative flex items-center border shadow-[var(--shadow-toggle)] transition-colors duration-500 ${config.soundEnabled ? "bg-[color:var(--toggle-on)] border-[color:var(--toggle-border-on)]" : "bg-[color:var(--toggle-off)] border-[color:var(--toggle-border-off)]"}`}
                    >
                      <motion.div
                        animate={{ x: config.soundEnabled ? 16 : 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                        className="h-4 w-4 rounded-full bg-[color:var(--thumb)] shadow-[var(--shadow-thumb)]"
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex justify-center md:justify-end">
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="w-full max-w-sm md:w-auto px-6 py-4 rounded-full type-small tracking-[0.2em] text-current/70 bg-[color:var(--surface-muted)] hover:bg-[color:var(--surface-hover)] transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className="w-full max-w-5xl px-6 md:px-8 pt-6 pb-6 lg:py-10 sticky top-0 z-40"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 24px)" }}
      >
        <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] items-center gap-4 lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4 group cursor-default col-start-1 row-start-1 justify-self-start">
            <motion.div
              animate={{
                scale: state.status === SessionStatus.RUNNING ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-[color:var(--app-fg)] opacity-70"
            />
            <span className="type-small text-current/70 tracking-[0.2em]">
              QUIET
            </span>
          </div>

          <div className="contents lg:flex lg:items-center lg:gap-4 lg:justify-end">
            <nav className="flex items-center w-full justify-center p-2 rounded-full backdrop-blur-sm bg-[color:var(--surface-muted)] border border-[color:var(--border-faint)] shadow-[var(--shadow-seg)] col-span-3 row-start-2 justify-self-center lg:inline-flex lg:w-fit lg:justify-center lg:p-2">
              {(Object.values(TimerMode) as TimerMode[]).map((m) => (
                <motion.button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`relative flex-1 min-w-0 px-2 sm:px-3 md:px-6 py-2 rounded-full text-xs md:text-sm tracking-[0.12em] md:tracking-[0.2em] type-small transition-colors lg:flex-none lg:flex-shrink-0 lg:whitespace-nowrap ${state.mode === m ? "text-current" : "text-current/60"}`}
                  whileHover={{ opacity: 1 }}
                >
                  {state.mode === m && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full bg-[color:var(--surface-strong)] border border-[color:var(--border-soft)] shadow-[var(--shadow-pill)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 bg-[color:var(--surface-muted)] transition-opacity"
                    style={{ zIndex: -2 }}
                  />
                  <span className="relative z-10 whitespace-nowrap lg:whitespace-nowrap">
                    {MODE_THEMES[m].label}
                  </span>
              </motion.button>
            ))}
            </nav>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="col-start-3 row-start-1 justify-self-end p-4 text-current/60 hover:text-current transition-colors hover:bg-[color:var(--surface-muted)] rounded-full"
              aria-label="Settings"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl px-8 flex flex-col items-center text-center pt-28 pb-12 md:pt-0 md:pb-0 justify-between md:justify-center">
        <div className="w-full flex flex-col items-center">
          <div className="mb-10 md:mb-14 flex items-center space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  scale: i <= state.cycleCount ? 1.2 : 1,
                  opacity: i <= state.cycleCount ? 0.8 : 0.25,
                }}
                className="w-2 h-2 rounded-full bg-[color:var(--app-fg)] transition-colors duration-700"
              />
            ))}
            <span className="ml-4 type-small text-current/70 tracking-[0.2em]">
              Cycle {state.cycleCount} of {CYCLES_BEFORE_DEEP_REST}
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5, y: 0 }}
            className="mb-6 type-small text-current/70 tracking-[0.3em]"
          >
            {theme.label}
          </motion.p>

          <div
            className="relative mb-16 md:mb-20 select-none cursor-default group"
            aria-live="polite"
          >
            <motion.h1
              key={`${state.mode}-${state.totalDuration}`}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1 }}
              className="type-h1 text-current"
            >
              {formatTime(state.timeLeft)}
            </motion.h1>
            <AnimatePresence>
              {state.status === SessionStatus.PAUSED && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 type-small text-current/60 tracking-[0.2em]"
                >
                  Paused
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-8 w-full relative z-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleTimer}
            className={`w-full max-w-sm md:max-w-none md:w-auto px-8 md:px-16 py-4 rounded-full type-small tracking-[0.2em] transition-all duration-500 ${theme.button} shadow-[var(--shadow-cta)] hover:shadow-[var(--shadow-cta-hover)] touch-manipulation`}
          >
            {ctaLabel}
          </motion.button>

          <div className="hidden md:flex space-x-12">
            {[
              ["Reset", resetTimer, state.status === SessionStatus.IDLE],
              ["Skip", completeSession, false],
            ].map(([lbl, act, dis]) => (
              <button
                key={lbl as string}
                onClick={act as any}
                disabled={dis as boolean}
                className="type-small text-current/60 hover:text-current transition-colors disabled:text-current/30 disabled:cursor-not-allowed"
              >
                {lbl as string}
              </button>
            ))}
          </div>

          <div className="flex md:hidden w-full gap-4 pointer-events-auto">
            <button
              onClick={resetTimer}
              disabled={state.status === SessionStatus.IDLE}
              className="flex-1 py-4 rounded-full type-small text-current/70 bg-[color:var(--surface-muted)] hover:bg-[color:var(--surface-hover)] transition-colors disabled:text-current/40 disabled:cursor-not-allowed touch-manipulation"
            >
              Reset
            </button>
            <button
              onClick={completeSession}
              className="flex-1 py-4 rounded-full type-small text-current/70 bg-[color:var(--surface-muted)] hover:bg-[color:var(--surface-hover)] transition-colors touch-manipulation"
            >
              Skip
            </button>
          </div>
        </div>

        <motion.div
          animate={{ opacity: 0.55 }}
          className="mt-8 md:mt-24 transition-opacity duration-500 relative z-10"
        >
          <p className="type-body text-current/70 max-w-sm mx-auto">
            {theme.instruction}
          </p>
        </motion.div>
      </main>

      <footer className="w-full max-w-5xl px-6 md:px-8 py-16">
        <div className="border-t border-[color:var(--divider)] mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start md:items-end">
          <div className="space-y-4">
            <div className="type-small text-current/60 tracking-[0.2em] md:tracking-[0.3em]">
              Configuration
            </div>
            <div
              className={`type-body transition-opacity duration-500 ${state.status === SessionStatus.RUNNING ? "opacity-50" : "opacity-80"}`}
            >
              {Math.floor(config.focusDuration / 60)}m Focus{" "}
              <span className="mx-2 text-current/40">/</span>
              {Math.floor(config.breakDuration / 60)}m Break{" "}
              <span className="mx-2 text-current/40">/</span>
              {Math.floor(config.deepRestDuration / 60)}m Deep Rest
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end space-y-4">
            <div className="type-small text-current/60 tracking-[0.2em] md:tracking-[0.3em]">
              Recent Flow
            </div>
            <div className="flex flex-wrap justify-start md:justify-end gap-4">
              <AnimatePresence mode="popLayout">
                {history.length === 0 ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-current/60 italic"
                  >
                    No cycles tracked yet
                  </motion.span>
                ) : (
                  history.slice(0, 3).map((entry) => (
                    <motion.div
                      layout
                      key={entry.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-1 h-1 rounded-full bg-[color:var(--app-fg)] opacity-60" />
                      <span className="text-sm text-current/70">
                        {MODE_THEMES[entry.mode].label} •{" "}
                        {entry.durationMinutes}m
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
