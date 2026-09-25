import { useEffect, useState } from "react";
import {
  addXP,
  getStudyStats,
  type StudyStats,
} from "./studyforgeStats";

type Avatar = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

const avatars: Avatar[] = [
  {
    id: "storm-ronin",
    name: "Storm Ronin",
    icon: "⚔️",
    description: "Forge your focus like a warrior.",
  },
  {
    id: "flame-scholar",
    name: "Flame Scholar",
    icon: "🔥",
    description: "Turn motivation into momentum.",
  },
  {
    id: "moon-shinobi",
    name: "Moon Shinobi",
    icon: "🌙",
    description: "Master quiet and focused study.",
  },
  {
    id: "arcane-scholar",
    name: "Arcane Scholar",
    icon: "⚡",
    description: "Unlock your learning potential.",
  },
  {
    id: "sakura-mage",
    name: "Sakura Mage",
    icon: "🌸",
    description: "Grow your knowledge every day.",
  },
  {
    id: "dragon-prodigy",
    name: "Dragon Prodigy",
    icon: "🐉",
    description: "Build legendary study habits.",
  },
  {
    id: "frost-strategist",
    name: "Frost Strategist",
    icon: "❄️",
    description: "Stay calm and think clearly.",
  },
  {
    id: "forest-guardian",
    name: "Forest Guardian",
    icon: "🌿",
    description: "Grow stronger one session at a time.",
  },
];

const AVATAR_KEY = "studyforge_selected_avatar";
const STATS_EVENT = "studyforge:stats-updated";

function getSavedAvatar(): string {
  try {
    const savedAvatar = localStorage.getItem(AVATAR_KEY);

    if (
      savedAvatar !== null &&
      avatars.some((avatar) => avatar.id === savedAvatar)
    ) {
      return savedAvatar;
    }
  } catch {
    // Use the default avatar if storage is unavailable.
  }

  return avatars[0].id;
}

export default function AvatarSelector() {
  const [selectedAvatar, setSelectedAvatar] =
    useState<string>(getSavedAvatar);

  const [stats, setStats] = useState<StudyStats>(() =>
    getStudyStats()
  );

  useEffect(() => {
    function refreshStats(): void {
      setStats(getStudyStats());
    }

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

  function selectAvatar(id: string): void {
    setSelectedAvatar(id);

    try {
      localStorage.setItem(
        AVATAR_KEY,
        id
      );
    } catch {
      // Selection still works for the current session.
    }
  }

  function testAddXP(amount: number): void {
    addXP(amount);
    setStats(getStudyStats());
  }

  const selected =
    avatars.find(
      (avatar) => avatar.id === selectedAvatar
    ) ?? avatars[0];

  /*
   * One consistent leveling system:
   *
   * Level 1 = 0–99 XP
   * Level 2 = 100–199 XP
   * Level 3 = 200–299 XP
   *
   * Example:
   * 3200 XP = Level 33
   * Current level XP = 0
   */

  const level =
    Math.floor(stats.xp / 100) + 1;

  const currentLevelXP =
    stats.xp % 100;

  const xpToNextLevel =
    100 - currentLevelXP;

  const progress =
    currentLevelXP;

  return (
    <section
      className="mt-8 rounded-3xl border p-6"
      style={{
        background: "var(--sf-surface)",
        borderColor: "var(--sf-surface-soft)",
        boxShadow: "var(--sf-shadow)",
      }}
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p
            className="text-sm font-bold uppercase tracking-widest"
            style={{
              color: "var(--sf-secondary)",
            }}
          >
            YOUR STUDY AVATAR
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Forge your identity
          </h2>

          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            Choose an avatar and build your XP.
          </p>
        </div>

        <div
          className="rounded-2xl px-5 py-3 text-center"
          style={{
            background: "var(--sf-surface-soft)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            Current level
          </p>

          <p className="mt-1 text-3xl font-black">
            {level}
          </p>
        </div>
      </div>

      {/* SELECTED AVATAR */}
      <div
        className="mt-6 rounded-3xl p-6"
        style={{
          background: "var(--sf-surface-soft)",
        }}
      >
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
          <div
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl text-6xl"
            style={{
              background: "var(--sf-bg)",
            }}
            aria-label={`${selected.name} avatar`}
          >
            {selected.icon}
          </div>

          <div className="mt-5 sm:ml-6 sm:mt-0">
            <p
              className="text-sm font-bold uppercase tracking-widest"
              style={{
                color: "var(--sf-secondary)",
              }}
            >
              SELECTED AVATAR
            </p>

            <h3 className="mt-1 text-3xl font-black">
              {selected.name}
            </h3>

            <p
              className="mt-2"
              style={{
                color: "var(--sf-text-muted)",
              }}
            >
              {selected.description}
            </p>
          </div>
        </div>

        {/* XP */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-black">
                Level {level}
              </p>

              <p
                className="mt-1 text-sm"
                style={{
                  color: "var(--sf-text-muted)",
                }}
              >
                {currentLevelXP}/100 XP
              </p>
            </div>

            <p
              className="text-sm font-bold"
              style={{
                color: "var(--sf-primary)",
              }}
            >
              {xpToNextLevel} XP to next level
            </p>
          </div>

          <div
            className="mt-3 h-4 overflow-hidden rounded-full"
            style={{
              background: "var(--sf-bg)",
            }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Current level XP progress"
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: "var(--sf-primary)",
              }}
            />
          </div>

          <p
            className="mt-2 text-sm"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            Total XP: {stats.xp}
          </p>
        </div>
      </div>

      {/* AVATAR OPTIONS */}
      <div className="mt-6">
        <h3 className="text-lg font-black">
          Choose your avatar
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {avatars.map((avatar) => {
            const isSelected =
              avatar.id === selectedAvatar;

            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() =>
                  selectAvatar(avatar.id)
                }
                className="min-h-24 rounded-2xl border p-4 text-left transition-transform hover:scale-[1.02]"
                style={{
                  background: isSelected
                    ? "var(--sf-primary)"
                    : "var(--sf-surface-soft)",
                  borderColor:
                    isSelected
                      ? "var(--sf-primary)"
                      : "var(--sf-surface-soft)",
                  color: isSelected
                    ? "var(--sf-bg)"
                    : "var(--sf-text)",
                }}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-3xl"
                    aria-hidden="true"
                  >
                    {avatar.icon}
                  </span>

                  <div>
                    <p className="font-black">
                      {avatar.name}
                    </p>

                    {isSelected && (
                      <p className="mt-1 text-xs font-bold">
                        ✓ Selected
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TEMPORARY XP TESTING */}
      <div
        className="mt-6 rounded-2xl border p-4"
        style={{
          borderColor: "var(--sf-surface-soft)",
        }}
      >
        <p className="font-bold">
          XP Testing
        </p>

        <p
          className="mt-1 text-sm"
          style={{
            color: "var(--sf-text-muted)",
          }}
        >
          Temporary buttons for testing the XP system.
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => testAddXP(20)}
            className="min-h-11 rounded-xl px-4 py-2 font-bold"
            style={{
              background: "var(--sf-primary)",
              color: "var(--sf-bg)",
            }}
          >
            +20 XP
          </button>

          <button
            type="button"
            onClick={() => testAddXP(30)}
            className="min-h-11 rounded-xl px-4 py-2 font-bold"
            style={{
              background: "var(--sf-secondary)",
              color: "var(--sf-bg)",
            }}
          >
            +30 XP
          </button>

          <button
            type="button"
            onClick={() => testAddXP(40)}
            className="min-h-11 rounded-xl px-4 py-2 font-bold"
            style={{
              background: "var(--sf-accent)",
              color: "var(--sf-bg)",
            }}
          >
            +40 XP
          </button>
        </div>
      </div>
    </section>
  );
}