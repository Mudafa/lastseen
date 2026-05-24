# frontend — LastSeen

This is the Expo React Native frontend for the LastSeen project. It targets mobile (via Expo) and web (via Expo for web).

**What this app is**
- A mobile-first UI implemented with React Native and Expo Router.
- Primary code is in [frontend/app](frontend/app); shared UI components live in [frontend/components](frontend/components).

**Tech stack**
- Expo (React Native)
- Expo Router (file-based routing)
- TypeScript

## Run locally

1. From the repository root, change to the frontend folder and install dependencies:

```bash
cd frontend
npm install
```

2. Start the development server for web:

```bash
npm run web
```

3. Open `http://localhost:8081` in your browser to view the web build. The Expo terminal also shows a QR code to open the app in Expo Go on a device.

To run for native targets (simulator/device):

```bash
npm start
# then press `a` for Android or `i` for iOS in the Expo terminal
```

## Hot reload

- The dev server provides Fast Refresh / HMR. Save changes under `frontend` and the running app should update automatically.
- If changes do not appear, restart with cache cleared:

```bash
npx expo start -c
```

## Useful commands
- Install dependencies: `npm install`
- Start web: `npm run web`
- Start dev (all targets): `npm start`
- Android: `npm run android`
- iOS: `npm run ios`
- Lint: `npm run lint`

## Where to work
- Routes and screens: [frontend/app](frontend/app)
- Reusable components: [frontend/components](frontend/components)
- Configuration: [frontend/app.json](frontend/app.json) and [frontend/package.json](frontend/package.json)

## Troubleshooting
- Clear caches: `npx expo start -c`.
- If you change native modules or `package.json`, stop the server and restart to ensure Metro picks up changes.

## Contributing
- Keep changes small and focused; open a PR against `main` and request reviews.
- Add unit tests for components and a simple e2e smoke test before merging larger features.

If you'd like, I can now map routes/components or scaffold CI for automated builds and linting.
