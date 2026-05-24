# LastSeen

LastSeen is a room-memory app that helps you find misplaced things by combining camera scans with natural-language search. You scan a room, save visual events, and later ask questions like “Where are my keys?” to get a likely last-seen answer.

## What It Does

- Captures room images from the camera.
- Sends frame changes to a backend for processing.
- Stores useful visual events so the app can remember what was seen.
- Lets you ask questions in plain English and returns a location-style answer.
- Uses a polished mobile UI with animated backgrounds, smooth transitions, and judge-friendly readability.

## Tech Stack

### Frontend

- TypeScript
- Expo / React Native
- Expo Router
- Expo Camera
- Expo Haptics

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic / Pydantic Settings
- Pillow
- Supabase client
- HTTPX

### AI / Storage

- OpenAI or Gemini for vision-backed scene understanding
- Supabase for storage and event data

## How It’s Made

The app is split into two parts:

1. **Frontend app** in `frontend/`
	 - Home screen with two main actions: Camera and Ask.
	 - Camera screen captures frames on an interval and uploads them.
	 - Ask screen sends natural-language questions and renders the response.
	 - Shared background, theme tokens, and navigation animations keep the UI consistent.

2. **Backend API** in `backend/`
	 - Receives uploaded frames.
	 - Compares/filters frame changes.
	 - Stores relevant events.
	 - Answers questions using event memory and AI-assisted synthesis.

The frontend talks to the backend over HTTP.

## Repository Structure

```text
backend/
	app/
	main.py
	requirements.txt

frontend/
	app/
	components/
	constants/
	hooks/
	lib/
	package.json
```

## Environment Variables

### Backend (`backend/.env`)

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` or `GEMINI_API_KEY`
- `AI_PROVIDER` (`openai`, `gemini`, or `auto`)
- Optional:
	- `OPENAI_VISION_MODEL`
	- `GEMINI_VISION_MODEL`
	- `CORS_ORIGINS`

### Frontend

- `EXPO_PUBLIC_API_URL` should point to your backend.
- Example:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.42:8000
```

## How To Run Locally

### 1) Start the backend

From the repo root:

```bash
cd backend
python -m venv .venv
```

On Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

On macOS/Linux or Git Bash:

```bash
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

The backend runs on `http://0.0.0.0:8000` by default.

### 2) Start the frontend

In a second terminal:

```bash
cd frontend
npm install
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000 npx expo start
```

If you are using a physical phone, replace `127.0.0.1` with your computer’s LAN IP, for example:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.42:8000 npx expo start --tunnel
```

## Demo Flow

1. Open the home screen.
2. Tap **Camera** and capture a room scan.
3. Move an object or show how the room changes.
4. Tap **Ask** and ask where something is.
5. Show the result, including the last-seen metadata.

## Design Notes

- The UI uses a dark purple night theme.
- Background stars, glow, and vignette give it a dreamy look.
- Route transitions are tuned to feel smooth and swipe-like.
- Buttons and message bubbles are optimized for judge readability.

## Troubleshooting

- If Ask shows `Network request failed`, check `EXPO_PUBLIC_API_URL`.
- If the camera does not open, make sure camera permissions are granted.
- If backend AI requests fail, confirm the API key and provider settings in `backend/.env`.


## License

No license has been set for this project yet.

