# StudyForge

**StudyForge is a student-focused learning and productivity web app built around one goal: helping students understand what to study, practice it, discover weaknesses, and improve.**

> **Current status:** Working MVP / hackathon build.

## The Core Learning Loop

StudyForge is designed around:

**Learn → Practice → Measure → Detect Weakness → Adapt → Improve**

Instead of treating studying as only reading or taking quizzes, StudyForge connects learning, practice, performance tracking, and adaptive recommendations into one workflow.

## What StudyForge Includes

### 📚 Learn Mode

* Beginner-friendly topic explanations
* Examples and step-by-step reasoning
* Formulas and important concepts
* Common mistakes
* Quick checks for understanding

### 🧠 Topic Forge

Enter a topic and StudyForge turns it into a focused learning experience.

Example flow:

**Topic → Learn Mode → Practice → Results → Adaptive Learning**

### ✍️ Adaptive Practice

StudyForge can generate topic-focused practice and record the result.

After a practice session, the system updates the learner's progress and uses the result to guide future recommendations.

### 📈 Adaptive Learning

StudyForge tracks learning performance and provides information such as:

* Overall mastery
* Topic mastery
* Strong topics
* Topics that may need attention
* Recommended next study actions

The goal is to answer a simple question:

> **"What should I study next?"**

### 🎯 Student Productivity

The dashboard also includes:

* Study goals
* Notes
* Focus timer
* Progress tracking
* Statistics
* AI Study Assistant
* Avatar selection

### 🎨 Theme Studio

StudyForge includes multiple original visual themes, including:

* Neon
* Sakura
* Blaze
* Moon
* Meadow
* Contrast

The themes are designed to make studying feel more personal and engaging.

### 🛡️ Reliability System

StudyForge includes a built-in reliability layer:

* Bug Finder
* System diagnostics
* Health monitoring
* Bug history
* Error Boundary
* Bug Shield recovery

The goal is to make failures recoverable instead of simply showing a broken screen.

---

## Tech Stack

* **React**
* **TypeScript**
* **Vite**
* **Node.js**
* **Express**
* **CSS / theme variables**
* **Vitest**
* **Git + GitHub**

The project uses a client/server structure so the frontend and backend can evolve independently.

---

## Project Structure

```text
studyforge/
├── client/
│   ├── src/
│   │   ├── features/
│   │   │   ├── adaptive/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── diagnostics/
│   │   │   ├── learning/
│   │   │   ├── theme/
│   │   │   └── topicforge/
│   │   ├── lib/
│   │   ├── themes/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vite.config.ts
│
├── server/
│   └── src/
│       ├── lib/
│       ├── routes/
│       ├── app.ts
│       └── index.ts
│
├── docs/
│   ├── architecture.md
│   └── product-principles.md
│
├── package.json
├── package-lock.json
├── .nvmrc
└── .gitignore
```

---

## Getting Started

### Requirements

* Node.js 20.19+ or 22.12+
* npm

Check your versions:

```bash
node -v
npm -v
```

### Install

Clone the repository and open a terminal in the project folder:

```bash
npm install
```

### Start StudyForge

```bash
npm run dev
```

The development environment starts the frontend and backend together.

Open:

```text
http://localhost:5173
```

The backend runs on:

```text
http://localhost:4000
```

### Health Check

The backend health endpoint is:

```text
http://localhost:4000/api/health
```

---

## Useful Commands

| Command                 | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `npm install`           | Install project dependencies             |
| `npm run dev`           | Start client and server                  |
| `npm test`              | Run automated tests                      |
| `npm run typecheck`     | Check TypeScript without running the app |
| `npm run build`         | Create the production build              |
| `npm run dev -w server` | Start only the server                    |
| `npm run dev -w client` | Start only the client                    |

Before the hackathon release, the project was verified with TypeScript checks and a successful production build.

---

## Architecture

```text
                 ┌──────────────────────┐
                 │      StudyForge      │
                 └──────────┬───────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Topic Forge │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Learn Mode  │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Practice   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Results    │
                    └───────┬───────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Adaptive Learning   │
                 └──────────┬───────────┘
                            │
                            ▼
                    Next Study Action
```

The frontend communicates with the Express backend through the development proxy.

---

## Reliability

StudyForge includes diagnostic and recovery tools designed to make the application easier to test and maintain.

The Bug Finder can perform system checks and maintain diagnostic history.

The Error Boundary and Bug Shield provide a recovery path when a frontend error occurs.

---

## Privacy and Local Development

The current hackathon build is designed to run locally during development.

Do not commit private environment files or API keys.

Create environment files only when required:

```text
server/.env
```

The repository's `.gitignore` prevents `.env` files from being committed.

---

## Demo

🎥 **StudyForge Demo Video**

*Add the final demo video link here before submitting the project.*

---

## Hackathon

**Built for RevenueCat Shipaton 2026 — Next Gen Award.**

StudyForge focuses on making studying more adaptive, measurable, and actionable for students.

---

## License

StudyForge is released under the **MIT License**.

See [`LICENSE`](LICENSE) for details.
