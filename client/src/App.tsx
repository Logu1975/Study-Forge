import { useEffect, useState } from "react";

import AdaptiveLearning from "./features/adaptive/AdaptiveLearning";
import AuthPage from "./features/auth/AuthPage";
import BugFinder from "./features/diagnostics/BugFinder";
import ErrorBoundary from "./features/diagnostics/ErrorBoundary";
import { SystemStatus } from "./features/diagnostics/SystemStatus";
import LearnMode from "./features/learning/LearnMode";
import Quiz from "./features/dashboard/Quiz";
import TopicForge from "./features/topicforge/TopicForge";
import type { LearningRecommendation } from "./lib/adaptiveLearning";

const themes = [
  { id: "neon", name: "Neon Night", icon: "✦" },
  { id: "sakura", name: "Sakura Dawn", icon: "✿" },
  { id: "blaze", name: "Blaze Academy", icon: "◆" },
  { id: "moon", name: "Moonlit Shrine", icon: "☾" },
  { id: "meadow", name: "Meadow Studio", icon: "❋" },
  { id: "contrast", name: "High Contrast", icon: "◐" },
];

const studyLoop = [
  {
    number: "01",
    title: "Learn",
    description: "Build your understanding with focused study.",
  },
  {
    number: "02",
    title: "Practice",
    description: "Turn knowledge into active recall and practice.",
  },
  {
    number: "03",
    title: "Review",
    description: "Revisit important ideas before they fade.",
  },
  {
    number: "04",
    title: "Track",
    description: "See your progress and keep your goals moving.",
  },
];

const features = [
  {
    icon: "⏱",
    title: "Focus",
    description:
      "Time-box your study sessions and protect your attention.",
  },
  {
    icon: "🧠",
    title: "Practice",
    description:
      "Prepare for active recall and quiz-based learning.",
  },
  {
    icon: "📈",
    title: "Progress",
    description:
      "Build a clear picture of your goals and study habits.",
  },
];

export default function App() {
  const [theme, setTheme] = useState("neon");
  const [showAuth, setShowAuth] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const [learningTopic, setLearningTopic] = useState("");
  const [learningSubject, setLearningSubject] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function startLearningFromForge(
    concept: string,
    subject: string
  ): void {
    setLearningTopic(concept);
    setLearningSubject(subject);
    setShowQuiz(false);

    window.setTimeout(() => {
      document
        .getElementById("learn-mode")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  function startPractice(): void {
    setShowQuiz(true);

    window.setTimeout(() => {
      document
        .getElementById("learn-mode")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  function backToLearnMode(): void {
    setShowQuiz(false);

    window.setTimeout(() => {
      document
        .getElementById("learn-mode")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  function startAdaptiveRecommendation(
    topic: string,
    subject: string,
    action: LearningRecommendation["action"]
  ): void {
    setLearningTopic(topic);
    setLearningSubject(subject);

    if (action === "practice") {
      setShowQuiz(true);
    } else {
      setShowQuiz(false);
    }

    window.setTimeout(() => {
      document
        .getElementById("learn-mode")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  if (showAuth) {
    return (
      <ErrorBoundary>
        <AuthPage />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen"
        style={{
          background: "var(--sf-bg)",
          color: "var(--sf-text)",
        }}
      >
        <nav
          className="border-b"
          style={{
            borderColor: "var(--sf-surface-soft)",
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <div className="text-xl font-black tracking-tight">
                StudyForge
              </div>

              <div
                className="text-xs"
                style={{
                  color: "var(--sf-text-muted)",
                }}
              >
                Forge your study loop.
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              {themes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id)}
                  className="min-h-11 rounded-xl px-3 py-2 text-sm font-semibold transition-transform hover:scale-105 active:scale-95"
                  style={{
                    background:
                      theme === item.id
                        ? "var(--sf-primary)"
                        : "var(--sf-surface)",
                    color:
                      theme === item.id
                        ? "var(--sf-bg)"
                        : "var(--sf-text)",
                  }}
                  aria-label={`Use ${item.name} theme`}
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
          <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div
                className="mb-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold"
                style={{
                  background: "var(--sf-surface)",
                  color: "var(--sf-secondary)",
                }}
              >
                ✦ Your personal study forge
              </div>

              <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                Turn scattered study time into a{" "}
                <span
                  style={{
                    color: "var(--sf-primary)",
                  }}
                >
                  powerful loop.
                </span>
              </h1>

              <p
                className="mt-6 max-w-2xl text-lg leading-8"
                style={{
                  color: "var(--sf-text-muted)",
                }}
              >
                StudyForge brings focused study, active practice,
                review, goals, and progress into one student-first
                workspace.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowAuth(true)}
                  className="min-h-11 rounded-2xl px-6 py-3 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                  style={{
                    background: "var(--sf-primary)",
                    color: "var(--sf-bg)",
                    boxShadow: "var(--sf-shadow)",
                  }}
                >
                  Start your study loop →
                </button>

                <button
                  type="button"
                  onClick={() => setShowAuth(true)}
                  className="min-h-11 rounded-2xl border px-6 py-3 font-semibold transition-transform hover:scale-105 active:scale-95"
                  style={{
                    background: "var(--sf-surface)",
                    borderColor: "var(--sf-surface-soft)",
                    color: "var(--sf-text)",
                  }}
                >
                  Explore StudyForge
                </button>
              </div>
            </div>

            <div
              className="rounded-3xl border p-6"
              style={{
                background: "var(--sf-surface)",
                borderColor: "var(--sf-surface-soft)",
                boxShadow: "var(--sf-shadow)",
              }}
            >
              <div
                className="mb-6 text-sm font-semibold"
                style={{
                  color: "var(--sf-secondary)",
                }}
              >
                TODAY'S STUDY LOOP
              </div>

              <div className="space-y-3">
                {studyLoop.map((item, index) => (
                  <div
                    key={item.number}
                    className="flex items-center gap-4 rounded-2xl p-4"
                    style={{
                      background: "var(--sf-surface-soft)",
                    }}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black"
                      style={{
                        background: "var(--sf-primary)",
                        color: "var(--sf-bg)",
                      }}
                    >
                      {item.number}
                    </div>

                    <div>
                      <div className="font-bold">
                        {item.title}
                      </div>

                      <div
                        className="text-sm"
                        style={{
                          color: "var(--sf-text-muted)",
                        }}
                      >
                        {item.description}
                      </div>
                    </div>

                    {index === 0 && (
                      <span
                        className="ml-auto h-2 w-2 rounded-full"
                        style={{
                          background: "var(--sf-success)",
                        }}
                        aria-label="Current study step"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-20">
            <div className="mb-8">
              <p
                className="text-sm font-bold uppercase tracking-widest"
                style={{
                  color: "var(--sf-secondary)",
                }}
              >
                Built for students
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Everything starts with one focused loop.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-3xl border p-6"
                  style={{
                    background: "var(--sf-surface)",
                    borderColor: "var(--sf-surface-soft)",
                  }}
                >
                  <div
                    className="text-3xl"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    {feature.title}
                  </h3>

                  <p
                    className="mt-2 leading-7"
                    style={{
                      color: "var(--sf-text-muted)",
                    }}
                  >
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            className="mt-20"
            id="topic-forge"
          >
            <TopicForge
              onStartLearning={startLearningFromForge}
            />
          </section>

          <section
            className="mt-20"
            id="learn-mode"
          >
            <div className="mb-8">
              <p
                className="text-sm font-bold uppercase tracking-widest"
                style={{
                  color: "var(--sf-secondary)",
                }}
              >
                Step 01 · Learn
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Understand before you practice.
              </h2>

              <p
                className="mt-3 max-w-2xl leading-7"
                style={{
                  color: "var(--sf-text-muted)",
                }}
              >
                Learn Mode turns a concept into simple
                explanations, examples, and quick checks before
                sending you into practice.
              </p>
            </div>

            {!showQuiz ? (
              <LearnMode
                initialTopic={learningTopic}
                initialSubject={learningSubject}
                onStartPractice={startPractice}
              />
            ) : (
              <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p
                      className="text-sm font-bold uppercase tracking-widest"
                      style={{
                        color: "var(--sf-secondary)",
                      }}
                    >
                      Step 02 · Practice
                    </p>

                    <h3 className="mt-1 text-2xl font-black">
                      Test what you learned.
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={backToLearnMode}
                    className="min-h-11 rounded-xl border px-4 py-2 text-sm font-semibold transition-transform hover:scale-105 active:scale-95"
                    style={{
                      background: "var(--sf-surface)",
                      borderColor:
                        "var(--sf-surface-soft)",
                      color: "var(--sf-text)",
                    }}
                  >
                    ← Back to Learn Mode
                  </button>
                </div>

                <Quiz
                  topic={learningTopic}
                  subject={learningSubject}
                />
              </div>
            )}
          </section>

          <section className="mt-20">
            <AdaptiveLearning
              onStartRecommendation={
                startAdaptiveRecommendation
              }
            />
          </section>

          <section className="mt-20">
            <div className="mb-5">
              <p
                className="text-sm font-bold uppercase tracking-widest"
                style={{
                  color: "var(--sf-secondary)",
                }}
              >
                System
              </p>

              <h2 className="mt-2 text-2xl font-black">
                StudyForge health check
              </h2>
            </div>

            <SystemStatus />
          </section>

          <section className="mt-8">
            <BugFinder />
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
}