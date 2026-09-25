const XP_KEY = "studyforge_xp";
const GOALS_KEY = "studyforge_goals_completed";
const QUIZ_KEY = "studyforge_quizzes_completed";
const FOCUS_KEY = "studyforge_focus_sessions";
const STUDY_TIME_KEY = "studyforge_study_time_minutes";

const STATS_EVENT = "studyforge:stats-updated";

export type StudyStats = {
  xp: number;
  goalsCompleted: number;
  quizzesCompleted: number;
  focusSessions: number;
  studyTimeMinutes: number;
};

function getNumber(key: string): number {
  try {
    const saved = localStorage.getItem(key);

    if (saved === null) {
      return 0;
    }

    const value = Number(saved);

    if (Number.isFinite(value) && value >= 0) {
      return value;
    }
  } catch {
    // Use zero if storage is unavailable.
  }

  return 0;
}

function setNumber(
  key: string,
  value: number
): void {
  try {
    localStorage.setItem(
      key,
      String(Math.max(0, value))
    );

    window.dispatchEvent(
      new Event(STATS_EVENT)
    );
  } catch {
    // Storage is unavailable.
  }
}

export function getStudyStats(): StudyStats {
  return {
    xp: getNumber(XP_KEY),
    goalsCompleted: getNumber(GOALS_KEY),
    quizzesCompleted: getNumber(QUIZ_KEY),
    focusSessions: getNumber(FOCUS_KEY),
    studyTimeMinutes: getNumber(STUDY_TIME_KEY),
  };
}

export function addXP(amount: number): void {
  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return;
  }

  const currentXP = getNumber(XP_KEY);

  setNumber(
    XP_KEY,
    currentXP + amount
  );
}

/*
 * Set the number of currently completed goals.
 *
 * The Dashboard has 3 goals, so this value
 * represents the current completed-goal count,
 * not a lifetime completion counter.
 */
export function setGoalsCompleted(
  count: number
): void {
  if (
    !Number.isFinite(count) ||
    count < 0
  ) {
    return;
  }

  setNumber(
    GOALS_KEY,
    Math.floor(count)
  );
}

export function recordQuizCompletion(): void {
  const currentQuizzes =
    getNumber(QUIZ_KEY);

  setNumber(
    QUIZ_KEY,
    currentQuizzes + 1
  );
}

export function recordFocusSession(
  minutes: number
): void {
  if (
    !Number.isFinite(minutes) ||
    minutes <= 0
  ) {
    return;
  }

  const currentSessions =
    getNumber(FOCUS_KEY);

  const currentMinutes =
    getNumber(STUDY_TIME_KEY);

  setNumber(
    FOCUS_KEY,
    currentSessions + 1
  );

  setNumber(
    STUDY_TIME_KEY,
    currentMinutes + minutes
  );
}