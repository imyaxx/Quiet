import React, { useState } from 'react';
import { SessionStatus } from './types';
import { DEFAULT_CONFIG, STORAGE_KEYS, MODE_THEMES, BUTTON_LABELS, CYCLES_BEFORE_DEEP_REST } from './constants';
import type { HistoryEntry } from './types';
import { usePersistedState } from './hooks/usePersistedState';
import { useTimer } from './hooks/useTimer';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header/Header';
import { ModeNav } from './components/ModeNav/ModeNav';
import { CycleIndicator } from './components/CycleIndicator/CycleIndicator';
import { TimerDisplay } from './components/TimerDisplay/TimerDisplay';
import { TimerControls } from './components/TimerControls/TimerControls';
import { SettingsModal } from './components/SettingsModal/SettingsModal';
import { Footer } from './components/Footer/Footer';

const App: React.FC = () => {
  const [config, setConfig] = usePersistedState(STORAGE_KEYS.config, DEFAULT_CONFIG);
  const [history, setHistory] = usePersistedState<HistoryEntry[]>(STORAGE_KEYS.history, []);
  const { state, setMode, toggleTimer, resetTimer, completeSession } = useTimer(config, setHistory);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useTheme(state.mode);

  const theme = MODE_THEMES[state.mode];
  const ctaLabel =
    state.status === SessionStatus.RUNNING
      ? BUTTON_LABELS.pause
      : state.status === SessionStatus.PAUSED
        ? BUTTON_LABELS.resume
        : theme.cta;

  return (
    <div
      style={theme.vars as React.CSSProperties}
      className="min-h-screen state-transition flex flex-col items-center bg-[color:var(--app-bg)] text-[color:var(--app-fg)]"
    >
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onConfigChange={setConfig}
      />

      <Header status={state.status} onSettingsOpen={() => setIsSettingsOpen(true)}>
        <ModeNav activeMode={state.mode} onModeChange={setMode} />
      </Header>

      <main className="flex-1 w-full max-w-2xl px-8 flex flex-col items-center text-center pt-12 pb-8 md:pt-0 md:pb-0 justify-between md:justify-center">
        <div className="w-full flex flex-col items-center">
          <CycleIndicator currentCycle={state.cycleCount} totalCycles={CYCLES_BEFORE_DEEP_REST} />
          <TimerDisplay
            timeLeft={state.timeLeft}
            mode={state.mode}
            totalDuration={state.totalDuration}
            status={state.status}
          />
        </div>

        <TimerControls
          status={state.status}
          ctaLabel={ctaLabel}
          theme={theme}
          onToggle={toggleTimer}
          onReset={resetTimer}
          onSkip={completeSession}
        />
      </main>

      <Footer config={config} history={history} status={state.status} />
    </div>
  );
};

export default App;
