# StudyForge

A student learning and productivity web app: subjects, notes, a study timer,
goals, quizzes, progress tracking, a local AI study assistant, and a set of
original anime-inspired themes.

> **Current status: Stage 0 (project setup).**
> The app only shows a placeholder page with a live "System status" card.
> This proves that the frontend and the backend are wired together.
> Real features arrive stage by stage (see `docs/architecture.md`).

Everything here is free and runs on your own computer. No accounts, no API
keys, nothing paid.

## What you need

- **Node.js 20.19+ or 22.12+** (LTS). Check with `node -v`. Download: https://nodejs.org
- **npm** (installed together with Node)

## First run

Open a terminal in the project folder (the one containing this README), then:

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser. You should see the StudyForge
placeholder page with a "System status" card that says everything is working.

To stop the app, press `Ctrl + C` in the terminal.

## Commands (run from the project root)

| Command | What it does |
| --- | --- |
| `npm install` | Downloads everything both the client and server need |
| `npm run dev` | Starts the server (port 4000) and the client (port 5173) together |
| `npm test` | Runs the automated tests for server and client |
| `npm run typecheck` | Checks the TypeScript code for mistakes without running it |
| `npm run build` | Builds both parts for production (also a good "does it compile?" check) |
| `npm run dev -w server` | Starts only the server |
| `npm run dev -w client` | Starts only the client |

## How the pieces connect

```
Browser  ->  http://localhost:5173  (client: React + Vite)
                 |
                 |  any request starting with /api is forwarded
                 v
             http://localhost:4000  (server: Express)
```

The client never talks to port 4000 directly. Vite forwards `/api/...`
requests for us (configured in `client/vite.config.ts`). This avoids cross-origin
(CORS) problems and will make login cookies simple in Stage 2.

Try the server directly: http://localhost:4000/api/health

## Project layout

```
studyforge/
├── package.json        Root scripts. Runs client + server together.
├── docs/               Product principles and architecture decisions.
├── client/             The website students see (React + Vite + Tailwind).
│   └── src/
│       ├── main.tsx    Entry point: mounts React into index.html.
│       ├── App.tsx     The page (a placeholder in Stage 0).
│       ├── index.css   Tailwind import + accessibility base styles.
│       ├── lib/        Small helpers (API calls, shared types).
│       └── features/   One folder per feature. Stage 0 has "diagnostics".
└── server/             The API (Node + Express).
    └── src/
        ├── .ts    Starts the server.
        ├── app.ts      Builds the Express app (kept separate so it is testable).
        ├── lib/        Config loading and the health-report logic.
        └── routes/     One file per group of URLs. Stage 0 has "health".
```

## Optional: settings (.env)

Stage 0 works with **no** `.env` file. When you need one (Stage 2 adds login),
create `server/.env` by copying `server/.env.example`. To generate your own
private session secret later:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Never commit `.env` or share its contents. `.gitignore` already protects it.

## Troubleshooting

- **`npm install` warns about the Node version:** update Node to 20.19+ or 22.12+.
- **"Port already in use":** another program is using 4000 or 5173. Close it, or
  set `PORT` in `server/.env` and update the proxy target in `client/vite.config.ts`.
- **Page says "We couldn't reach the server":** the server is not running. Start
  everything with `npm run dev` from the project root.
- **Windows PowerShell says "running scripts is disabled":** use Command Prompt
  instead, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once.
- **Anything else:** copy the full terminal output when asking for help.
