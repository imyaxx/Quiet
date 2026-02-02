# Quiet — Focus, Break, Deep Rest Timer

Calm, premium Pomodoro-style timer for deep work and recovery.

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

## Structure
```
.
├── index.html
├── package.json
├── package-lock.json
├── public
│   └── favicon.svg
├── tsconfig.json
├── vite.config.ts
└── src
    ├── App.tsx
    ├── constants.ts
    ├── index.tsx
    ├── types.ts
    └── services
        └── audioService.ts
```
