# Quiet — Focus, Break, Deep Rest Timer

Calm, premium Pomodoro-style timer for deep work and recovery.

**Live:** `quiet-one.vercel.app`

## Highlights

- Three modes: Focus, Break, Deep Rest
- Local persistence for settings and session history
- Minimal UI with smooth motion (Framer Motion)
- Audio cues generated via Web Audio API (no external assets)

## Stack

- Vite + React + TypeScript
- Framer Motion

## Quick start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
.
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── favicon.svg
├── src/
│   ├── App.tsx
│   ├── index.tsx
│   ├── vite-env.d.ts
│   ├── types.ts
│   ├── components/
│   │   ├── CycleIndicator/
│   │   ├── DurationControl/
│   │   ├── Footer/
│   │   ├── Header/
│   │   ├── ModeNav/
│   │   ├── SettingsModal/
│   │   ├── TimerControls/
│   │   ├── TimerDisplay/
│   │   ├── ToggleSwitch/
│   │   └── icons/
│   ├── constants/
│   │   ├── animation.ts
│   │   ├── audio.ts
│   │   ├── colors.ts
│   │   ├── config.ts
│   │   ├── index.ts
│   │   ├── labels.ts
│   │   ├── storage.ts
│   │   └── themes.ts
│   ├── hooks/
│   │   ├── usePersistedState.ts
│   │   ├── useTheme.ts
│   │   └── useTimer.ts
│   ├── services/
│   │   └── audioService.ts
│   ├── styles/
│   │   └── global.css
│   └── utils/
│       └── time.ts
└── dist/                 # by `npm run build`
```
