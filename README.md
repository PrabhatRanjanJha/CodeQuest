# CodeQuest

CodeQuest is an interactive coding RPG where users learn DSA topics chapter-by-chapter and solve coding battles directly inside the app.

## Live Project

- GitHub Repository: https://github.com/PrabhatRanjanJha/CodeQuest
- Frontend (Vercel): Add your production URL here
- Backend Runner (Render): Add your Render URL here

## Features

- Topic dashboard with chapter progression and completion state
- Node-based map traversal with smooth movement between learn and battle nodes
- Learn scenes with concise concept notes and examples
- Battle scenes with multi-question coding challenges
- In-browser code editor (Java/Python)
- User authentication and cloud progress persistence (Firebase)
- Backend code execution service with language normalization and timeout handling

## Tech Stack

### Frontend

- React + Vite
- Tailwind CSS
- Framer Motion
- Monaco Editor (`@monaco-editor/react`)

### Backend

- Node.js
- Express
- CORS
- Child process execution for Java/Python/JS runtimes

### Data + Auth

- Firebase Authentication
- Firebase Firestore

## Project Structure

```text
CodeQuest/
├── backend/
│   ├── package.json
│   └── server.js
├── public/
├── src/
│   ├── context/       # global game/auth/progress state
│   ├── core/          # scene engine
│   ├── data/          # topics, curriculum, map graph
│   ├── pages/         # auth + game entry pages
│   ├── scenes/        # dashboard, map, dialogue, battle, boss
│   ├── services/      # code runner service
│   └── ui/            # reusable UI components
├── package.json
└── vite.config.js
```

## Local Setup

### 1) Clone and install frontend

```bash
git clone https://github.com/PrabhatRanjanJha/CodeQuest.git
cd CodeQuest
npm install
```

### 2) Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 3) Configure environment

Create a root `.env` file:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_RUNNER_URL=http://localhost:5000/run
```

### 4) Run both services

Terminal 1 (frontend):

```bash
npm run dev
```

Terminal 2 (backend):

```bash
cd backend
node server.js
```

## Available Scripts

From project root:

- `npm run dev` — start frontend dev server
- `npm run build` — create production build
- `npm run preview` — preview built frontend
- `npm run lint` — run ESLint checks

From `backend` folder:

- `npm start` — run backend service
- `npm run build` — no-op build script (for Render compatibility)

## Deployment

### Frontend (Vercel)

- Framework preset: `Vite`
- Root directory: `./`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

Set these Vercel environment variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_RUNNER_URL` (example: `https://your-backend.onrender.com/run`)

### Backend (Render)

- Environment: `Node`
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

The backend automatically uses `process.env.PORT` in production.

## Troubleshooting

- **Code execution fails with localhost errors in production**
  - Set `VITE_RUNNER_URL` in Vercel to your Render backend `/run` endpoint.

- **Firebase auth works locally but fails on deployed URL**
  - Add your Vercel domain in Firebase Auth → Authorized domains.

- **Render deploy fails**
  - Confirm Render Root Directory is `backend`.
  - Confirm Start Command is `npm start`.

## Security Notes

- Never commit `.env` files.
- Keep API keys and service URLs in deployment environment variables.

## Author

Prabhat Ranjan Jha
