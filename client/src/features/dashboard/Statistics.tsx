import { useEffect, useState } from "react";
import {
  getStudyStats,
  type StudyStats,
} from "./studyforgeStats";

const STATS_EVENT = "studyforge:stats-updated";

export default function Statistics() {
  const [stats, setStats] = useState<StudyStats>(() => getStudyStats());

  useEffect(() => {
    function refreshStats(): void {
      setStats(getStudyStats());
    }

    window.addEventListener(STATS_EVENT, refreshStats);
    window.addEventListener("storage", refreshStats);

    return () => {
      window.removeEventListener(STATS_EVENT, refreshStats);
      window.removeEventListener("storage", refreshStats);
    };
  }, []);

  const level = Math.floor(stats.xp / 100) + 1;
  const levelXP = stats.xp % 100;

  const totalActivities =
    stats.goalsCompleted +
    stats.quizzesCompleted +
    stats.focusSessions;

  return (
    <section
      className="mt-8 rounded-3xl border p-6"
      style={{
        background: "var(--sf-surface)",
        borderColor: "var(--sf-surface-soft)",
        boxShadow: "var(--sf-shadow)",
      }}
    >
      <p
        className="text-sm font-bold uppercase tracking-widest"
        style={{ color: "var(--sf-secondary)" }}
      >
        YOUR PROGRESS
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Study Statistics
      </h2>

      <p
        className="mt-2 text-sm"
        style={{ color: "var(--sf-text-muted)" }}
      >
        Track your learning journey and keep building momentum.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon="⚡" label="Total XP" value={String(stats.xp)} />
        <StatCard icon="🏆" label="Level" value={String(level)} />
        <StatCard
          icon="🎯"
          label="Goals"
          value={String(stats.goalsCompleted)}
        />
        <StatCard
          icon="🧠"
          label="Quizzes"
          value={String(stats.quizzesCompleted)}
        />
        <StatCard
          icon="⏱️"
          label="Focus Sessions"
          value={String(stats.focusSessions)}
        />
      </div>

      <div
        className="mt-6 rounded-2xl p-5"
        style={{ background: "var(--sf-surface-soft)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-black">Level {level}</p>

            <p
              className="mt-1 text-sm"
              style={{ color: "var(--sf-text-muted)" }}
            >
              {levelXP}/100 XP to the next level
            </p>
          </div>

          <span className="text-2xl" aria-hidden="true">
            ⚡
          </span>
        </div>

        <div
          className="mt-4 h-3 overflow-hidden rounded-full"
          style={{ background: "var(--sf-bg)" }}
          role="progressbar"
          aria-valuenow={levelXP}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Level progress"
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${levelXP}%`,
              background: "var(--sf-primary)",
            }}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--sf-surface-soft)" }}
        >
          <p className="text-sm font-bold">⏱️ Study Time</p>

          <p className="mt-2 text-2xl font-black">
            {formatStudyTime(stats.studyTimeMinutes)}
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--sf-surface-soft)" }}
        >
          <p className="text-sm font-bold">📚 Learning Activity</p>

          <p className="mt-2 text-2xl font-black">
            {totalActivities}
          </p>

          <p
            className="mt-1 text-sm"
            style={{ color: "var(--sf-text-muted)" }}
          >
            completed activities
          </p>
        </div>
      </div>
    </section>
  );
}

type StatCardProps = {
  icon: string;
  label: string;
  value: string;
};

function StatCard({
  icon,
  label,
  value,
}: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--sf-surface-soft)" }}
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true">{icon}</span>

        <p
          className="text-sm font-bold"
          style={{ color: "var(--sf-text-muted)" }}
        >
          {label}
        </p>
      </div>

      <p className="mt-3 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}

function formatStudyTime(minutes: number): string {
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