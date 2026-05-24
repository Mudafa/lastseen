# LastSeen

LastSeen helps you find misplaced things by combining camera snapshots with natural-language search.

## What it does

- **Camera scan:** capture room frames and send them to the backend for event tracking.
- **Ask mode:** ask questions like “Where are my keys?” and get a location-based answer.
- **Fast handoff:** the home screen keeps the main flow to two actions: Camera and Ask.
- **Judge-friendly UX:** the frontend is tuned for readability, contrast, and clear hierarchy.

## Tech stack

- Expo Router
- React Native
- expo-camera
- expo-haptics
- TypeScript

## Run locally

```bash
npm install
npx expo start
```

## Notes

- The frontend uses shared theme tokens for consistent colors.
- The camera and ask screens expect the backend API to be running.
- Team name shown in the app: `untitled.jpg`.
