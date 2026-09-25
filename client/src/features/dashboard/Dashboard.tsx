
import { useEffect, useState } from "react";
import AvatarSelector from "./AvatarSelector";
import FocusTimer from "./FocusTimer";
import Quiz from "./Quiz";
import Notes from "./Notes";
import Statistics from "./Statistics";
import {
  addXP,
  getStudyStats,
  setGoalsCompleted,
} from "./studyforgeStats";
import AIStudyAssistant from "./AIStudyAssistant";

type Subject = {
  name: string;
  icon: string;
  progress: number;
};

type StudyTool = {
  icon: string;
  title: string;
  description: string;
};

const subjects: Subject[] = [
  {
    name: "Mathematics",
    icon: "📐",
    progress: 72,
  },
  {
    name: "Physics",
    icon: "⚡",
    progress: 58,
  },
  {
    name: "Computer Science",
    icon: "💻",
    progress: 84,
  },
  {
    name: "English",
    icon: "📖",
    progress: 46,
  },
];

const goals: string[] = [
  "Complete Mathematics revision",
  "Practice 20 programming questions",
  "Review Physics formulas",
];

const studyTools: StudyTool[] = [
  {
    icon: "⏱️",
    title: "Focus Timer",
    description: "Start a focused study session.",
  },
  {
    icon: "🧠",
    title: "Quick Quiz",
    description: "Test what you already know.",
  },
  {
    icon: "📝",
    title: "My Notes",
    description: "Create and organize your notes.",
  },
  {
    icon: "🤖",
    title: "AI Study Assistant",
    description: "Get help with your learning.",
  },
];

const studySteps: [string, string][] = [
  ["01", "Learn"],
  ["02", "Practice"],
  ["03", "Review"],
  ["04", "Track"],
];

const GOALS_STATE_KEY = "studyforge_goal_state";
const STATS_EVENT = "studyforge:stats-updated";

function getSavedGoals(): boolean[] {
  try {
    const saved = localStorage.getItem(
      GOALS_STATE_KEY
    );

    if (saved === null) {
      return goals.map(() => false);
    }

    const parsed: unknown = JSON.parse(saved);

    if (
      Array.isArray(parsed) &&
      parsed.length === goals.length &&
      parsed.every(
        (value): value is boolean =>
          typeof value === "boolean"
      )
    ) {
      return parsed;
    }
  } catch {
    // Use default goal state if storage is unavailable.
  }

  return goals.map(() => false);
}

function saveGoals(goalState: boolean[]): void {
  try {
    localStorage.setItem(
      GOALS_STATE_KEY,
      JSON.stringify(goalState)
    );
  } catch {
    // Goal state still works for the current session.
  }
}

function formatStudyTime(minutes: number): string {
  if (minutes <= 0) {
    return "0 min";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export default function Dashboard() {
  const [completedGoals, setCompletedGoalsState] =
    useState<boolean[]>(getSavedGoals);

  const [studyTimeMinutes, setStudyTimeMinutes] =
    useState<number>(
      () => getStudyStats().studyTimeMinutes
    );

  useEffect(() => {
    function refreshStats(): void {
      const stats = getStudyStats();

      setStudyTimeMinutes(
        stats.studyTimeMinutes
      );
    }

    /*
     * Synchronize the saved statistics with the
     * goals that are actually checked.
     *
     * This also fixes old data such as:
     * goalsCompleted = 6
     * when only 2 of 3 goals are currently complete.
     */
    const savedGoals = getSavedGoals();

    const savedCompletedCount =
      savedGoals.filter(
        (completed) => completed
      ).length;

    setGoalsCompleted(
      savedCompletedCount
    );

    window.addEventListener(
      STATS_EVENT,
      refreshStats
    );

    window.addEventListener(
      "storage",
      refreshStats
    );

    return () => {
      window.removeEventListener(
        STATS_EVENT,
        refreshStats
      );

      window.removeEventListener(
        "storage",
        refreshStats
      );
    };
  }, []);

  function toggleGoal(index: number): void {
    const wasCompleted =
      completedGoals[index] ?? false;

    const updatedGoals =
      completedGoals.map(
        (completed, goalIndex) =>
          goalIndex === index
            ? !completed
            : completed
      );

    setCompletedGoalsState(
      updatedGoals
    );

    saveGoals(updatedGoals);

    /*
     * XP is awarded only when a goal changes
     * from incomplete → complete.
     *
     * Unchecking a goal does not remove XP.
     */
    if (!wasCompleted) {
      addXP(20);
    }

    const completedGoalCount =
      updatedGoals.filter(
        (completed) => completed
      ).length;

    /*
     * Store the CURRENT number of completed
     * goals, not a lifetime completion counter.
     */
    setGoalsCompleted(
      completedGoalCount
    );
  }

  const completedCount =
    completedGoals.filter(
      (completed) => completed
    ).length;

  return (
    <main
      className="min-h-screen px-4 py-8 sm:px-6 lg:px-8"
      style={{
        background: "var(--sf-bg)",
        color: "var(--sf-text)",
      }}
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="mb-8">
          <p
            className="text-sm font-bold uppercase tracking-widest"
            style={{
              color: "var(--sf-secondary)",
            }}
          >
            YOUR STUDY SPACE
          </p>

          <h1 className="mt-2 text-4xl font-black sm:text-5xl">
            Welcome back! 👋
          </h1>

          <p
            className="mt-2"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            Ready to forge another great study session?
          </p>
        </header>

        {/* STATISTICS */}
        <section
          className="grid gap-4 sm:grid-cols-3"
          aria-label="Study statistics"
        >

          {/* STREAK */}
          <div
            className="rounded-3xl border p-6"
            style={{
              background: "var(--sf-surface)",
              borderColor: "var(--sf-surface-soft)",
              boxShadow: "var(--sf-shadow)",
            }}
          >
            <div
              className="text-3xl"
              aria-hidden="true"
            >
              🔥
            </div>

            <p
              className="mt-4 text-sm"
              style={{
                color: "var(--sf-text-muted)",
              }}
            >
              Study streak
            </p>

            <p className="mt-1 text-3xl font-black">
              7 days
            </p>
          </div>

          {/* STUDY TIME */}
          <div
            className="rounded-3xl border p-6"
            style={{
              background: "var(--sf-surface)",
              borderColor: "var(--sf-surface-soft)",
              boxShadow: "var(--sf-shadow)",
            }}
          >
            <div
              className="text-3xl"
              aria-hidden="true"
            >
              ⏱️
            </div>

            <p
              className="mt-4 text-sm"
              style={{
                color: "var(--sf-text-muted)",
              }}
            >
              Study time
            </p>

            <p className="mt-1 text-3xl font-black">
              {formatStudyTime(
                studyTimeMinutes
              )}
            </p>
          </div>

          {/* GOALS */}
          <div
            className="rounded-3xl border p-6"
            style={{
              background: "var(--sf-surface)",
              borderColor: "var(--sf-surface-soft)",
              boxShadow: "var(--sf-shadow)",
            }}
          >
            <div
              className="text-3xl"
              aria-hidden="true"
            >
              🎯
            </div>

            <p
              className="mt-4 text-sm"
              style={{
                color: "var(--sf-text-muted)",
              }}
            >
              Goals completed
            </p>

            <p className="mt-1 text-3xl font-black">
              {completedCount}/{goals.length}
            </p>

            <p
              className="mt-1 text-xs"
              style={{
                color: "var(--sf-text-muted)",
              }}
            >
              Current study goals
            </p>
          </div>
        </section>

        {/* AVATAR + XP */}
        <AvatarSelector />

        {/* FOCUS TIMER */}
        <FocusTimer />

        {/* QUICK QUIZ */}
        <Quiz />

        {/* MY NOTES */}
        <Notes />

        {/* STATISTICS */}
        <Statistics />
         {/* MY NOTES */}
<Notes />

{/* AI STUDY ASSISTANT */}
<AIStudyAssistant />

{/* STATISTICS */}
<Statistics />
        {/* SUBJECTS + GOALS */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

          {/* SUBJECTS */}
          <section
            className="rounded-3xl border p-6"
            style={{
              background: "var(--sf-surface)",
              borderColor: "var(--sf-surface-soft)",
              boxShadow: "var(--sf-shadow)",
            }}
          >
            <div className="mb-6">
              <p
                className="text-sm font-bold uppercase tracking-widest"
                style={{
                  color: "var(--sf-secondary)",
                }}
              >
                LEARNING
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Your subjects
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {subjects.map((subject) => (
                <article
                  key={subject.name}
                  className="rounded-2xl p-5"
                  style={{
                    background:
                      "var(--sf-surface-soft)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="text-3xl"
                      aria-hidden="true"
                    >
                      {subject.icon}
                    </div>

                    <div>
                      <h3 className="font-bold">
                        {subject.name}
                      </h3>

                      <p
                        className="text-sm"
                        style={{
                          color:
                            "var(--sf-text-muted)",
                        }}
                      >
                        {subject.progress}% complete
                      </p>
                    </div>
                  </div>

                  <div
                    className="mt-4 h-2 overflow-hidden rounded-full"
                    style={{
                      background: "var(--sf-bg)",
                    }}
                    role="progressbar"
                    aria-valuenow={subject.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${subject.name} progress`}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${subject.progress}%`,
                        background:
                          "var(--sf-primary)",
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* GOALS */}
          <section
            className="rounded-3xl border p-6"
            style={{
              background: "var(--sf-surface)",
              borderColor: "var(--sf-surface-soft)",
              boxShadow: "var(--sf-shadow)",
            }}
          >
            <p
              className="text-sm font-bold uppercase tracking-widest"
              style={{
                color: "var(--sf-secondary)",
              }}
            >
              TODAY
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Study goals
            </h2>

            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--sf-text-muted)",
              }}
            >
              Complete a goal to earn +20 XP.
            </p>

            <div className="mt-6 space-y-3">
              {goals.map((goal, index) => {
                const completed =
                  completedGoals[index] ?? false;

                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() =>
                      toggleGoal(index)
                    }
                    className="flex min-h-14 w-full items-center gap-3 rounded-2xl p-4 text-left transition-transform hover:scale-[1.01]"
                    style={{
                      background:
                        "var(--sf-surface-soft)",
                    }}
                    aria-pressed={completed}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-bold"
                      style={{
                        borderColor:
                          "var(--sf-primary)",
                        background: completed
                          ? "var(--sf-primary)"
                          : "transparent",
                        color: completed
                          ? "var(--sf-bg)"
                          : "var(--sf-text)",
                      }}
                      aria-hidden="true"
                    >
                      {completed ? "✓" : ""}
                    </span>

                    <span
                      className={
                        completed
                          ? "text-sm line-through opacity-60"
                          : "text-sm"
                      }
                    >
                      {goal}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </section>

        {/* STUDY TOOLS */}
        <section className="mt-8">
          <div className="mb-5">
            <p
              className="text-sm font-bold uppercase tracking-widest"
              style={{
                color: "var(--sf-secondary)",
              }}
            >
              STUDY TOOLS
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Choose your next move
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {studyTools.map((tool) => (
              <button
                key={tool.title}
                type="button"
                className="min-h-32 rounded-3xl border p-5 text-left transition-transform hover:scale-[1.02]"
                style={{
                  background:
                    "var(--sf-surface)",
                  borderColor:
                    "var(--sf-surface-soft)",
                  boxShadow: "var(--sf-shadow)",
                }}
              >
                <div
                  className="text-3xl"
                  aria-hidden="true"
                >
                  {tool.icon}
                </div>

                <div className="mt-3 font-bold">
                  {tool.title}
                </div>

                <div
                  className="mt-1 text-sm"
                  style={{
                    color:
                      "var(--sf-text-muted)",
                  }}
                >
                  {tool.description}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* STUDYFORGE LOOP */}
        <section className="mt-8">
          <div
            className="rounded-3xl border p-6"
            style={{
              background:
                "var(--sf-surface)",
              borderColor:
                "var(--sf-surface-soft)",
              boxShadow:
                "var(--sf-shadow)",
            }}
          >
            <p
              className="text-sm font-bold uppercase tracking-widest"
              style={{
                color: "var(--sf-secondary)",
              }}
            >
              STUDYFORGE METHOD
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Learn → Practice → Review → Track
            </h2>

            <p
              className="mt-3 max-w-3xl leading-7"
              style={{
                color:
                  "var(--sf-text-muted)",
              }}
            >
              StudyForge turns studying into a
              simple, repeatable learning loop.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {studySteps.map(
                ([number, title]) => (
                  <div
                    key={number}
                    className="rounded-2xl p-4"
                    style={{
                      background:
                        "var(--sf-surface-soft)",
                    }}
                  >
                    <div
                      className="text-sm font-black"
                      style={{
                        color:
                          "var(--sf-primary)",
                      }}
                    >
                      {number}
                    </div>

                    <div className="mt-2 font-bold">
                      {title}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-10 text-center">
          <p
            className="text-sm"
            style={{
              color:
                "var(--sf-text-muted)",
            }}
          >
            StudyForge • Forge your study loop. ⚒️
          </p>
        </footer>

      </div>
    </main>
  );
}