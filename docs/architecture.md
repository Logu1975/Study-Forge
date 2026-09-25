# StudyForge architecture

## Stack (confirmed)

| Layer | Choice |
| --- | --- |
| Frontend | React + Vite + TypeScript + React Router |
| Styling | Tailwind CSS + CSS variables for themes |
| Backend | Node + Express |
| Database | SQLite via Prisma |
| Auth | Email + password, bcrypt, httpOnly cookie session |
| Validation | Zod |
| Server data on the client | React Query |
| Tests | Vitest + React Testing Library |
| AI | `AiProvider` interface with a local MockProvider |

## Decisions log

- **D1. npm workspaces.** One `npm install` at the root installs client and
  server. One `npm run dev` starts both.
- **D2. Vite dev proxy for `/api`.** The browser only talks to one origin, so
  there are no CORS problems and cookie login stays simple.
- **D3. Install a dependency in the stage that first uses it.** React Router,
  React Query, Prisma, bcrypt and the testing library are added later. This
  keeps Stage 0 small and easy to debug.
- **D4. Server uses CommonJS output.** Plain relative imports work without
  `.js` extensions, which is easier for beginners.
- **D5. Shared types are duplicated for now.** `HealthReport` exists in both
  `../client/src/lib/health.ts` and `server/src/lib/health.ts`. If the number of
  shared types grows, we add a small `shared/` workspace.

## Stages

- [x] Stage 0: Project setup, health check, README
- [ ] Stage 1: Design system, theme engine, landing page, Bug Shield foundations
- [ ] Stage 2: Auth and app shell (Prisma + SQLite arrive here)
- [ ] Stage 3: Subjects, topics, notes
- [ ] Stage 4: Study timer and goals
- [ ] Stage 5: Quiz system
- [ ] Stage 6: Dashboard and progress
- [ ] Stage 7: AI Study Assistant (MockProvider)
- [ ] Stage 8: Bug Finder, Diagnostics page, hardening
- [ ] Stage 9: Polish and demo readiness
