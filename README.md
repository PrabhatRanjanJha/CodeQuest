# CodeQuest

CodeQuest is an interactive coding RPG where users learn DSA topics chapter-by-chapter and solve coding battles directly inside the app.

## Live Project

- GitHub Repository: https://github.com/PrabhatRanjanJha/CodeQuest
- Frontend (Vercel): https://code-quest-two-mu.vercel.app/

## Features

- Topic dashboard with chapter progression and completion state
- Node-based map traversal with smooth movement between learn and battle nodes
- Learn scenes with concise concept notes and examples
- Battle scenes with multi-question coding challenges
- In-browser code editor (Java/Python)
- User authentication and cloud progress persistence (Firebase)
- Frontend-only demo runner for code battle progression

## Tech Stack

### Frontend

- React + Vite
- Tailwind CSS
- Framer Motion
- Monaco Editor (`@monaco-editor/react`)

### Data + Auth

- Firebase Authentication
- Firebase Firestore

## Project Structure

```text
CodeQuest/
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

### 2) Configure environment

Create a root `.env` file:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3) Run locally

```bash
npm run dev
```

## Demo Runner Behavior

This project currently uses a frontend-only demo runner for battle execution.

- Submissions are accepted in demo mode.
- Battle progression and HP reduction work end-to-end.
- No external compiler backend is required.

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

## Troubleshooting

- **Firebase auth works locally but fails on deployed URL**
  - Add your Vercel domain in Firebase Auth → Authorized domains.

## Security Notes

- Never commit `.env` files.
- Keep API keys and service URLs in deployment environment variables.

## Author

Prabhat Ranjan Jha
