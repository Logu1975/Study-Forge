import { useEffect, useMemo, useState } from "react";

export type ThemeId =
  | "neon"
  | "sakura"
  | "blaze"
  | "moon"
  | "meadow"
  | "contrast";

type ThemeDefinition = {
  id: ThemeId;
  name: string;
  subtitle: string;
  icon: string;
  badge: string;
  vars: Record<string, string>;
};

export const themes: ThemeDefinition[] = [
  {
    id: "neon",
    name: "Neon Night",
    subtitle: "Cyber academy energy",
    icon: "✦",
    badge: "CORE",
    vars: {
      "--sf-bg": "#070b18",
      "--sf-surface": "#10172d",
      "--sf-surface-soft": "#182447",
      "--sf-text": "#f6f8ff",
      "--sf-text-muted": "#aeb9d8",
      "--sf-primary": "#63f3ff",
      "--sf-secondary": "#a88cff",
      "--sf-success": "#35e6a1",
      "--sf-danger": "#ff6f91",
      "--sf-shadow": "0 24px 70px rgba(0,0,0,0.38)",
    },
  },

  {
    id: "sakura",
    name: "Sakura Dawn",
    subtitle: "Calm Japanese-inspired study",
    icon: "✿",
    badge: "CALM",
    vars: {
      "--sf-bg": "#160c18",
      "--sf-surface": "#241329",
      "--sf-surface-soft": "#382039",
      "--sf-text": "#fff5fb",
      "--sf-text-muted": "#d7b8ca",
      "--sf-primary": "#ff8fc8",
      "--sf-secondary": "#ffc36b",
      "--sf-success": "#7ee0b2",
      "--sf-danger": "#ff718b",
      "--sf-shadow": "0 24px 70px rgba(8,0,10,0.42)",
    },
  },

  {
    id: "blaze",
    name: "Blaze Academy",
    subtitle: "High-energy training mode",
    icon: "◆",
    badge: "ENERGY",
    vars: {
      "--sf-bg": "#160b08",
      "--sf-surface": "#26120d",
      "--sf-surface-soft": "#3d1c12",
      "--sf-text": "#fff8f2",
      "--sf-text-muted": "#ddc1ae",
      "--sf-primary": "#ff8a3d",
      "--sf-secondary": "#ffd15c",
      "--sf-success": "#5ee4a7",
      "--sf-danger": "#ff5e67",
      "--sf-shadow": "0 24px 70px rgba(18,5,0,0.46)",
    },
  },

  {
    id: "moon",
    name: "Moonlit Shrine",
    subtitle: "Dark fantasy atmosphere",
    icon: "☾",
    badge: "SHADOW",
    vars: {
      "--sf-bg": "#090914",
      "--sf-surface": "#15152a",
      "--sf-surface-soft": "#242444",
      "--sf-text": "#f3f2ff",
      "--sf-text-muted": "#aaa9c9",
      "--sf-primary": "#b59cff",
      "--sf-secondary": "#73b7ff",
      "--sf-success": "#69ddb1",
      "--sf-danger": "#f47b9e",
      "--sf-shadow": "0 24px 70px rgba(3,3,15,0.48)",
    },
  },

  {
    id: "meadow",
    name: "Meadow Studio",
    subtitle: "Fresh and focused learning",
    icon: "❋",
    badge: "FOCUS",
    vars: {
      "--sf-bg": "#08130f",
      "--sf-surface": "#102119",
      "--sf-surface-soft": "#183429",
      "--sf-text": "#f1fff8",
      "--sf-text-muted": "#aac8ba",
      "--sf-primary": "#61e7ae",
      "--sf-secondary": "#7fd8ff",
      "--sf-success": "#56e4a8",
      "--sf-danger": "#ff7187",
      "--sf-shadow": "0 24px 70px rgba(0,12,7,0.44)",
    },
  },

  {
    id: "contrast",
    name: "High Contrast",
    subtitle: "Maximum readability",
    icon: "◐",
    badge: "ACCESS",
    vars: {
      "--sf-bg": "#000000",
      "--sf-surface": "#0d0d0d",
      "--sf-surface-soft": "#1b1b1b",
      "--sf-text": "#ffffff",
      "--sf-text-muted": "#d5d5d5",
      "--sf-primary": "#fff200",
      "--sf-secondary": "#00e5ff",
      "--sf-success": "#66ff66",
      "--sf-danger": "#ff5a5a",
      "--sf-shadow": "0 24px 70px rgba(0,0,0,0.55)",
    },
  },
];

const STORAGE_KEY = "studyforge_theme";
const PERFORMANCE_KEY = "studyforge_performance_mode";

function applyTheme(theme: ThemeDefinition) {
  const root = document.documentElement;

  root.dataset.theme = theme.id;

  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function getSavedTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (
      saved === "neon" ||
      saved === "sakura" ||
      saved === "blaze" ||
      saved === "moon" ||
      saved === "meadow" ||
      saved === "contrast"
    ) {
      return saved;
    }
  } catch {
    // Ignore localStorage errors.
  }

  return "neon";
}

export default function ThemeStudio() {
  const [activeTheme, setActiveTheme] =
    useState<ThemeId>(getSavedTheme);

  const [performanceMode, setPerformanceMode] =
    useState<boolean>(() => {
      try {
        return localStorage.getItem(PERFORMANCE_KEY) === "true";
      } catch {
        return false;
      }
    });

  const selectedTheme = useMemo(
    () =>
      themes.find((theme) => theme.id === activeTheme) ??
      themes[0],
    [activeTheme]
  );

  useEffect(() => {
    applyTheme(selectedTheme);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        selectedTheme.id
      );
    } catch {
      // Ignore localStorage errors.
    }
  }, [selectedTheme]);

  useEffect(() => {
    document.documentElement.dataset.performance =
      performanceMode ? "reduced" : "full";

    try {
      localStorage.setItem(
        PERFORMANCE_KEY,
        performanceMode ? "true" : "false"
      );
    } catch {
      // Ignore localStorage errors.
    }
  }, [performanceMode]);

  const chooseTheme = (theme: ThemeDefinition) => {
    setActiveTheme(theme.id);
    applyTheme(theme);
  };

  return (
    <>
      <style>
        {`
          [data-performance="reduced"] *,
          [data-performance="reduced"] *::before,
          [data-performance="reduced"] *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }

          .sf-theme-card {
            transition:
              transform 180ms ease,
              border-color 180ms ease,
              box-shadow 180ms ease,
              background 180ms ease;
          }

          .sf-theme-card:hover {
            transform: translateY(-4px);
          }

          .sf-theme-card:active {
            transform: scale(0.98);
          }

          .sf-preview-glow {
            animation: sfPulse 3s ease-in-out infinite;
          }

          @keyframes sfPulse {
            0%,
            100% {
              opacity: 0.55;
              transform: scale(1);
            }

            50% {
              opacity: 1;
              transform: scale(1.04);
            }
          }

          @media (max-width: 640px) {
            .sf-theme-card:hover {
              transform: none;
            }
          }
        `}
      </style>

      <section
        id="theme-studio"
        className="mt-20"
      >
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              className="text-sm font-black uppercase tracking-[0.25em]"
              style={{
                color: "var(--sf-secondary)",
              }}
            >
              Personalize your forge
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              🎨 Theme Studio
            </h2>

            <p
              className="mt-3 max-w-2xl leading-7"
              style={{
                color: "var(--sf-text-muted)",
              }}
            >
              Change the atmosphere of StudyForge without changing
              the way you study.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setPerformanceMode((value) => !value)
            }
            aria-pressed={performanceMode}
            className="min-h-12 rounded-2xl border px-5 py-3 text-left font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "var(--sf-surface)",
              borderColor: performanceMode
                ? "var(--sf-success)"
                : "var(--sf-surface-soft)",
              color: "var(--sf-text)",
            }}
          >
            <span className="mr-2">
              {performanceMode ? "⚡" : "🌀"}
            </span>

            Performance Mode:{" "}
            {performanceMode ? "ON" : "OFF"}
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div
            className="rounded-3xl border p-5 sm:p-6"
            style={{
              background: "var(--sf-surface)",
              borderColor: "var(--sf-surface-soft)",
              boxShadow: "var(--sf-shadow)",
            }}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-black">
                  Available themes
                </div>

                <div
                  className="text-sm"
                  style={{
                    color: "var(--sf-text-muted)",
                  }}
                >
                  Tap a theme to apply it instantly.
                </div>
              </div>

              <div
                className="rounded-full px-3 py-1 text-xs font-black"
                style={{
                  background: "var(--sf-surface-soft)",
                  color: "var(--sf-secondary)",
                }}
              >
                {themes.length} modes
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {themes.map((theme) => {
                const selected = theme.id === activeTheme;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => chooseTheme(theme)}
                    aria-pressed={selected}
                    className="sf-theme-card rounded-2xl border p-4 text-left"
                    style={{
                      background: selected
                        ? "var(--sf-surface-soft)"
                        : "var(--sf-bg)",

                      borderColor: selected
                        ? "var(--sf-primary)"
                        : "var(--sf-surface-soft)",

                      boxShadow: selected
                        ? "0 0 0 1px var(--sf-primary)"
                        : "none",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                        style={{
                          background:
                            theme.vars["--sf-surface-soft"],
                          color:
                            theme.vars["--sf-primary"],
                        }}
                      >
                        {theme.icon}
                      </div>

                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-black tracking-widest"
                        style={{
                          background: selected
                            ? theme.vars["--sf-primary"]
                            : theme.vars["--sf-surface-soft"],

                          color: selected
                            ? theme.vars["--sf-bg"]
                            : theme.vars["--sf-text-muted"],
                        }}
                      >
                        {selected ? "ACTIVE" : theme.badge}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="font-black">
                        {theme.name}
                      </div>

                      <div
                        className="mt-1 text-sm"
                        style={{
                          color: "var(--sf-text-muted)",
                        }}
                      >
                        {theme.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-3xl border p-5 sm:p-6"
            style={{
              background: "var(--sf-surface)",
              borderColor: "var(--sf-surface-soft)",
              boxShadow: "var(--sf-shadow)",
            }}
          >
            <div
              className="sf-preview-glow absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
              style={{
                background: "var(--sf-primary)",
              }}
              aria-hidden="true"
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-xs font-black uppercase tracking-[0.22em]"
                    style={{
                      color: "var(--sf-secondary)",
                    }}
                  >
                    Live preview
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    {selectedTheme.name}
                  </h3>
                </div>

                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                  style={{
                    background: "var(--sf-surface-soft)",
                    color: "var(--sf-primary)",
                  }}
                >
                  {selectedTheme.icon}
                </div>
              </div>

              <div
                className="mt-6 rounded-2xl border p-4"
                style={{
                  background: "var(--sf-bg)",
                  borderColor: "var(--sf-surface-soft)",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-black">
                      Today's Study Loop
                    </div>

                    <div
                      className="mt-1 text-xs"
                      style={{
                        color: "var(--sf-text-muted)",
                      }}
                    >
                      Adaptive focus session
                    </div>
                  </div>

                  <div
                    className="rounded-full px-3 py-1 text-xs font-black"
                    style={{
                      background: "var(--sf-surface-soft)",
                      color: "var(--sf-success)",
                    }}
                  >
                    78%
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    ["01", "Learn", "Core concepts"],
                    ["02", "Practice", "5 active-recall questions"],
                    ["03", "Review", "Weak topics"],
                  ].map(
                    ([number, title, description], index) => (
                      <div
                        key={number}
                        className="flex items-center gap-3 rounded-xl p-3"
                        style={{
                          background: "var(--sf-surface)",
                        }}
                      >
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black"
                          style={{
                            background:
                              index === 0
                                ? "var(--sf-primary)"
                                : "var(--sf-surface-soft)",

                            color:
                              index === 0
                                ? "var(--sf-bg)"
                                : "var(--sf-text)",
                          }}
                        >
                          {number}
                        </div>

                        <div className="min-w-0">
                          <div className="font-bold">
                            {title}
                          </div>

                          <div
                            className="truncate text-xs"
                            style={{
                              color: "var(--sf-text-muted)",
                            }}
                          >
                            {description}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="min-h-11 rounded-xl px-4 py-3 text-sm font-black"
                    style={{
                      background: "var(--sf-primary)",
                      color: "var(--sf-bg)",
                    }}
                  >
                    Start Session
                  </button>

                  <button
                    type="button"
                    className="min-h-11 rounded-xl border px-4 py-3 text-sm font-black"
                    style={{
                      background: "var(--sf-surface)",
                      borderColor: "var(--sf-surface-soft)",
                      color: "var(--sf-text)",
                    }}
                  >
                    Quiz Me
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: "var(--sf-surface-soft)",
                  }}
                >
                  <div
                    className="text-xs"
                    style={{
                      color: "var(--sf-text-muted)",
                    }}
                  >
                    Focus
                  </div>

                  <div className="mt-1 font-black">
                    24m
                  </div>
                </div>

                <div
                  className="rounded-xl p-3"
                  style={{
                    background: "var(--sf-surface-soft)",
                  }}
                >
                  <div
                    className="text-xs"
                    style={{
                      color: "var(--sf-text-muted)",
                    }}
                  >
                    Streak
                  </div>

                  <div className="mt-1 font-black">
                    7d
                  </div>
                </div>

                <div
                  className="rounded-xl p-3"
                  style={{
                    background: "var(--sf-surface-soft)",
                  }}
                >
                  <div
                    className="text-xs"
                    style={{
                      color: "var(--sf-text-muted)",
                    }}
                  >
                    Mastery
                  </div>

                  <div className="mt-1 font-black">
                    +12%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}