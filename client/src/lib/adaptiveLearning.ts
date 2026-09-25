export type LearningStatus =
  | "strong"
  | "good"
  | "needs-review"
  | "weak"
  | "new";

export type TopicPerformance = {
  topic: string;
  subject: string;
  attempts: number;
  correct: number;
  quizAccuracy: number;
  focusMinutes: number;
  lastStudied: string | null;
};

export type LearningRecommendation = {
  topic: string;
  subject: string;
  status: LearningStatus;
  mastery: number;
  reason: string;
  action: "learn" | "practice" | "review" | "rest";
  recommendedMinutes: number;
};

export const ADAPTIVE_DATA_EVENT =
  "studyforge-learning-data-updated";

const STORAGE_KEY =
  "studyforge_learning_data";

function isTopicPerformance(
  value: unknown
): value is TopicPerformance {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const item =
    value as Record<string, unknown>;

  return (
    typeof item.topic === "string" &&
    typeof item.subject === "string" &&
    typeof item.attempts === "number" &&
    typeof item.correct === "number" &&
    typeof item.quizAccuracy === "number" &&
    typeof item.focusMinutes === "number" &&
    (typeof item.lastStudied === "string" ||
      item.lastStudied === null)
  );
}

function cleanStoredData(
  data: unknown
): TopicPerformance[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(
    isTopicPerformance
  );
}

function notifyLearningDataUpdated(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new Event(ADAPTIVE_DATA_EVENT)
  );
}

export function loadLearningData(): TopicPerformance[] {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown =
      JSON.parse(raw);

    return cleanStoredData(parsed);
  } catch {
    return [];
  }
}

function saveLearningData(
  data: TopicPerformance[]
): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch {
    // Ignore storage failures.
  }
}

export function calculateMastery(
  performance: TopicPerformance
): number {
  const accuracyScore =
    performance.quizAccuracy * 0.75;

  const experienceBonus = Math.min(
    performance.attempts * 3,
    15
  );

  const focusBonus = Math.min(
    performance.focusMinutes / 10,
    10
  );

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        accuracyScore +
          experienceBonus +
          focusBonus
      )
    )
  );
}

export function getLearningStatus(
  mastery: number
): LearningStatus {
  if (mastery >= 80) {
    return "strong";
  }

  if (mastery >= 65) {
    return "good";
  }

  if (mastery >= 45) {
    return "needs-review";
  }

  if (mastery > 0) {
    return "weak";
  }

  return "new";
}

function daysSinceLastStudy(
  lastStudied: string | null
): number {
  if (!lastStudied) {
    return Infinity;
  }

  const last =
    new Date(lastStudied).getTime();

  if (Number.isNaN(last)) {
    return Infinity;
  }

  return Math.max(
    0,
    (Date.now() - last) /
      (1000 * 60 * 60 * 24)
  );
}

export function generateRecommendation(): LearningRecommendation {
  const topics =
    loadLearningData();

  if (topics.length === 0) {
    return {
      topic: "Choose a topic",
      subject: "Study",
      status: "new",
      mastery: 0,
      reason:
        "Start with Topic Forge to create your first learning path.",
      action: "learn",
      recommendedMinutes: 15,
    };
  }

  const scoredTopics =
    topics.map((topic) => {
      const mastery =
        calculateMastery(topic);

      const days =
        daysSinceLastStudy(
          topic.lastStudied
        );

      let priority =
        100 - mastery;

      if (days >= 7) {
        priority += 25;
      } else if (days >= 3) {
        priority += 15;
      } else if (days >= 1) {
        priority += 5;
      }

      if (topic.attempts === 0) {
        priority += 20;
      }

      if (
        topic.quizAccuracy < 60 &&
        topic.attempts > 0
      ) {
        priority += 15;
      }

      return {
        topic,
        mastery,
        priority,
      };
    });

  scoredTopics.sort(
    (a, b) =>
      b.priority - a.priority
  );

  const selected =
    scoredTopics[0];

  const status =
    getLearningStatus(
      selected.mastery
    );

  let action:
    LearningRecommendation["action"];

  let reason: string;

  if (selected.mastery < 45) {
    action = "learn";
    reason =
      "Your mastery is low. Revisit the concept before taking another quiz.";
  } else if (
    selected.mastery < 65
  ) {
    action = "practice";
    reason =
      "This topic needs more practice to strengthen your understanding.";
  } else if (
    selected.mastery < 80
  ) {
    action = "practice";
    reason =
      "A short practice session can help move this topic toward mastery.";
  } else {
    action = "practice";
    reason =
      "Your mastery is healthy. Use a short practice session to reinforce it.";
  }

  const recommendedMinutes =
    selected.mastery < 45
      ? 20
      : selected.mastery < 65
        ? 15
        : 10;

  return {
    topic: selected.topic.topic,
    subject: selected.topic.subject,
    status,
    mastery: selected.mastery,
    reason,
    action,
    recommendedMinutes,
  };
}

export function recordQuizResult(
  topic: string,
  subject: string,
  correct: number,
  total: number
): TopicPerformance {
  const data =
    loadLearningData();

  const normalizedTopic =
    topic.trim() || "Untitled Topic";

  const normalizedSubject =
    subject.trim() || "General";

  const safeTotal =
    Math.max(0, total);

  const safeCorrect = Math.min(
    Math.max(0, correct),
    safeTotal
  );

  const accuracy =
    safeTotal > 0
      ? Math.round(
          (safeCorrect / safeTotal) *
            100
        )
      : 0;

  const existingIndex =
    data.findIndex(
      (item) =>
        item.topic.toLowerCase() ===
          normalizedTopic.toLowerCase() &&
        item.subject.toLowerCase() ===
          normalizedSubject.toLowerCase()
    );

  if (existingIndex >= 0) {
    const existing =
      data[existingIndex];

    const newAttempts =
      existing.attempts + 1;

    const newCorrect =
      existing.correct +
      safeCorrect;

    const newAccuracy =
      newAttempts > 0 &&
      safeTotal > 0
        ? Math.round(
            (newCorrect /
              (newAttempts *
                safeTotal)) *
              100
          )
        : accuracy;

    const updated: TopicPerformance =
      {
        ...existing,
        attempts: newAttempts,
        correct: newCorrect,
        quizAccuracy:
          Math.min(
            100,
            Math.max(
              0,
              newAccuracy
            )
          ),
        lastStudied:
          new Date().toISOString(),
      };

    data[existingIndex] =
      updated;

    saveLearningData(data);
    notifyLearningDataUpdated();

    return updated;
  }

  const created: TopicPerformance =
    {
      topic: normalizedTopic,
      subject: normalizedSubject,
      attempts: 1,
      correct: safeCorrect,
      quizAccuracy: accuracy,
      focusMinutes: 0,
      lastStudied:
        new Date().toISOString(),
    };

  data.push(created);

  saveLearningData(data);
  notifyLearningDataUpdated();

  return created;
}

export function recordFocusSession(
  topic: string,
  minutes: number,
  subject = "General"
): TopicPerformance {
  const data =
    loadLearningData();

  const normalizedTopic =
    topic.trim() || "Untitled Topic";

  const normalizedSubject =
    subject.trim() || "General";

  const safeMinutes =
    Math.max(0, minutes);

  const existingIndex =
    data.findIndex(
      (item) =>
        item.topic.toLowerCase() ===
          normalizedTopic.toLowerCase() &&
        item.subject.toLowerCase() ===
          normalizedSubject.toLowerCase()
    );

  if (existingIndex >= 0) {
    const updated: TopicPerformance =
      {
        ...data[existingIndex],
        focusMinutes:
          data[existingIndex]
            .focusMinutes +
          safeMinutes,
        lastStudied:
          new Date().toISOString(),
      };

    data[existingIndex] =
      updated;

    saveLearningData(data);
    notifyLearningDataUpdated();

    return updated;
  }

  const created: TopicPerformance =
    {
      topic: normalizedTopic,
      subject: normalizedSubject,
      attempts: 0,
      correct: 0,
      quizAccuracy: 0,
      focusMinutes:
        safeMinutes,
      lastStudied:
        new Date().toISOString(),
    };

  data.push(created);

  saveLearningData(data);
  notifyLearningDataUpdated();

  return created;
}

export function getAllTopicInsights(): Array<
  TopicPerformance & {
    mastery: number;
    status: LearningStatus;
  }
> {
  return loadLearningData().map(
    (topic) => {
      const mastery =
        calculateMastery(topic);

      return {
        ...topic,
        mastery,
        status:
          getLearningStatus(
            mastery
          ),
      };
    }
  );
}

export function getTopicInsight(
  topic: string
):
  | (TopicPerformance & {
      mastery: number;
      status: LearningStatus;
    })
  | null {
  const normalized =
    topic.trim().toLowerCase();

  const found =
    getAllTopicInsights().find(
      (item) =>
        item.topic
          .trim()
          .toLowerCase() ===
        normalized
    );

  return found ?? null;
}

export function getOverallMastery(): number {
  const topics =
    getAllTopicInsights();

  if (topics.length === 0) {
    return 0;
  }

  const total =
    topics.reduce(
      (sum, topic) =>
        sum + topic.mastery,
      0
    );

  return Math.round(
    total / topics.length
  );
}

export function getWeakTopics(
  limit = 3
): Array<
  TopicPerformance & {
    mastery: number;
    status: LearningStatus;
  }
> {
  return getAllTopicInsights()
    .filter(
      (topic) =>
        topic.mastery < 65
    )
    .sort(
      (a, b) =>
        a.mastery - b.mastery
    )
    .slice(0, limit);
}

export function getStrongTopics(
  limit = 3
): Array<
  TopicPerformance & {
    mastery: number;
    status: LearningStatus;
  }
> {
  return getAllTopicInsights()
    .filter(
      (topic) =>
        topic.mastery >= 80
    )
    .sort(
      (a, b) =>
        b.mastery - a.mastery
    )
    .slice(0, limit);
}

export function resetLearningData(): void {
  try {
    localStorage.removeItem(
      STORAGE_KEY
    );

    notifyLearningDataUpdated();
  } catch {
    // Ignore storage failures.
  }
}