# Neuron Sparks

Futuristic notes application built with React Native and Expo.

## Quick Start

1. Install Node.js v20.19.4 or newer.
   - `node --version`
   - If the version is older, install the latest LTS from https://nodejs.org/en/download
2. npm install
3. npm run start
4. Open Expo on your device/emulator or use the web preview with `npm run web`

## Launch Methodology

NeuronSparks follows a clean Expo workflow with local CLI invocation and explicit runtime requirements. Local `expo` is launched through `npx expo` so the project uses the dependency installed inside `node_modules`, avoiding global CLI mismatch issues.

## Features

- Create, edit, delete notes
- Tag management
- Search across title, content, and tags
- Pin important notes
- Offline persistence with AsyncStorage
- Sci-fi inspired UI theme

## Project Structure

- `App.js` — root application entry
- `src/` — app source code
- `assets/` — fonts, icons, images
- `tests/` — test plan and future coverage
- `docs/` — project documentation

## Scripts

- `npm run start` — launch Expo
- `npm run android` — launch Android emulator
- `npm run ios` — launch iOS simulator
- `npm run web` — launch web preview
- `npm test` — run Jest tests
- `npm run lint` — lint source code
- `npm run format` — format source files

## Development Notes

This project targets a mobile-first experience with Expo SDK 55, React Native 0.85.3, and React 19.2.6.

## Methodology

- Keep startup scripts simple and local: `npm run start`, `npm run web`, `npm run android`, `npm run ios`.
- Preserve consistent runtime environments with `engines.node` and `preinstall` validation.
- Document startup and troubleshooting steps clearly for a fast handoff.
- Prefer local CLI usage (`npx expo`) over relying on a global Expo installation.

## Phase 9 & 10

- Verification: functional flows, persistence, search, and UI states
- Documentation: README, architecture, testing, deployment, troubleshooting
- Production readiness: performance, device testing, release checklist
