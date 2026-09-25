import {
  useEffect,
  useState,
} from "react";

import {
  ADAPTIVE_DATA_EVENT,
  generateRecommendation,
  getAllTopicInsights,
  getOverallMastery,
  getWeakTopics,
  recordFocusSession,
  type LearningRecommendation,
} from "../../lib/adaptiveLearning";

type AdaptiveLearningProps = {
  onStartRecommendation?: (
    topic: string,
    subject: string,
    action: LearningRecommendation["action"]
  ) => void;
};

function statusLabel(
  status: LearningRecommendation["status"]
): string {
  switch (status) {
    case "strong":
      return "Strong";

    case "good":
      return "Good";

    case "needs-review":
      return "Needs Review";

    case "weak":
      return "Weak";

    case "new":
      return "New";
  }
}

function actionLabel(
  action: LearningRecommendation["action"]
): string {
  switch (action) {
    case "learn":
      return "Learn";

    case "practice":
      return "Practice";

    case "review":
      return "Review";

    case "rest":
      return "Rest";
  }
}

export default function AdaptiveLearning({
  onStartRecommendation,
}: AdaptiveLearningProps) {
  const [
    recommendation,
    setRecommendation,
  ] = useState<LearningRecommendation>(
    () => generateRecommendation()
  );

  const [
    insights,
    setInsights,
  ] = useState(() =>
    getAllTopicInsights()
  );

  const [
    weakTopics,
    setWeakTopics,
  ] = useState(() =>
    getWeakTopics(3)
  );

  const [
    overallMastery,
    setOverallMastery,
  ] = useState(() =>
    getOverallMastery()
  );

  const [completed, setCompleted] =
    useState(false);

  function refreshLearningData(): void {
    setInsights(
      getAllTopicInsights()
    );

    setWeakTopics(
      getWeakTopics(3)
    );

    setOverallMastery(
      getOverallMastery()
    );

    setRecommendation(
      generateRecommendation()
    );

    setCompleted(false);
  }

  useEffect(() => {
    const handleLearningDataUpdate =
      (): void => {
        refreshLearningData();
      };

    const handleStorageUpdate =
      (event: StorageEvent): void => {
        if (
          event.key ===
          "studyforge_learning_data"
        ) {
          refreshLearningData();
        }
      };

    window.addEventListener(
      ADAPTIVE_DATA_EVENT,
      handleLearningDataUpdate
    );

    window.addEventListener(
      "storage",
      handleStorageUpdate
    );

    return () => {
      window.removeEventListener(
        ADAPTIVE_DATA_EVENT,
        handleLearningDataUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorageUpdate
      );
    };
  }, []);

  function recalculate(): void {
    refreshLearningData();
  }

  function startSession(): void {
    if (
      recommendation.topic ===
      "Choose a topic"
    ) {
      return;
    }

    recordFocusSession(
      recommendation.topic,
      recommendation.recommendedMinutes,
      recommendation.subject
    );

    setCompleted(true);

    onStartRecommendation?.(
      recommendation.topic,
      recommendation.subject,
      recommendation.action
    );
  }

  return (
    <section
      className="mt-20 rounded-3xl border p-6 sm:p-8"
      style={{
        background:
          "var(--sf-surface)",
        borderColor:
          "var(--sf-surface-soft)",
        boxShadow:
          "var(--sf-shadow)",
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p
            className="text-sm font-black uppercase tracking-widest"
            style={{
              color:
                "var(--sf-secondary)",
            }}
          >
            Adaptive Learning Engine
          </p>

          <h2 className="mt-2 text-3xl font-black">
            What should I study now?
          </h2>

          <p
            className="mt-2 max-w-2xl"
            style={{
              color:
                "var(--sf-text-muted)",
            }}
          >
            StudyForge analyzes your
            learning data and recommends
            your next study activity.
          </p>
        </div>

        <button
          type="button"
          onClick={recalculate}
          className="min-h-11 rounded-xl px-5 py-3 font-black transition-transform hover:scale-105 active:scale-95"
          style={{
            background:
              "var(--sf-surface-soft)",
            color:
              "var(--sf-text)",
          }}
        >
          🔄 Recalculate
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div
          className="rounded-2xl p-5"
          style={{
            background:
              "var(--sf-surface-soft)",
          }}
        >
          <p
            className="text-sm font-bold"
            style={{
              color:
                "var(--sf-text-muted)",
            }}
          >
            Overall mastery
          </p>

          <p className="mt-2 text-3xl font-black">
            {overallMastery}%
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background:
              "var(--sf-surface-soft)",
          }}
        >
          <p
            className="text-sm font-bold"
            style={{
              color:
                "var(--sf-text-muted)",
            }}
          >
            Topics tracked
          </p>

          <p className="mt-2 text-3xl font-black">
            {insights.length}
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background:
              "var(--sf-surface-soft)",
          }}
        >
          <p
            className="text-sm font-bold"
            style={{
              color:
                "var(--sf-text-muted)",
            }}
          >
            Needs attention
          </p>

          <p className="mt-2 text-3xl font-black">
            {weakTopics.length}
          </p>
        </div>
      </div>

      <div
        className="mt-8 rounded-3xl border p-6"
        style={{
          background:
            "var(--sf-surface-soft)",
          borderColor:
            "var(--sf-surface-soft)",
        }}
      >
        <p
          className="text-xs font-black uppercase tracking-widest"
          style={{
            color:
              "var(--sf-secondary)",
          }}
        >
          Recommended next
        </p>

        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p
              className="text-sm font-bold"
              style={{
                color:
                  "var(--sf-text-muted)",
              }}
            >
              {recommendation.subject}
            </p>

            <h3 className="mt-1 text-2xl font-black">
              {recommendation.topic}
            </h3>

            <p
              className="mt-2 max-w-2xl text-sm leading-6"
              style={{
                color:
                  "var(--sf-text-muted)",
              }}
            >
              {recommendation.reason}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-64">
            <div
              className="rounded-2xl p-4"
              style={{
                background:
                  "var(--sf-bg)",
              }}
            >
              <p
                className="text-xs font-bold"
                style={{
                  color:
                    "var(--sf-text-muted)",
                }}
              >
                Mastery
              </p>

              <p className="mt-1 text-xl font-black">
                {recommendation.mastery}%
              </p>
            </div>

            <div
              className="rounded-2xl p-4"
              style={{
                background:
                  "var(--sf-bg)",
              }}
            >
              <p
                className="text-xs font-bold"
                style={{
                  color:
                    "var(--sf-text-muted)",
                }}
              >
                Status
              </p>

              <p className="mt-1 text-xl font-black">
                {statusLabel(
                  recommendation.status
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span
            className="text-sm font-black"
            style={{
              color:
                "var(--sf-primary)",
            }}
          >
            Action:{" "}
            {actionLabel(
              recommendation.action
            )}
          </span>

          <button
            type="button"
            onClick={startSession}
            disabled={
              recommendation.topic ===
              "Choose a topic"
            }
            className="min-h-11 rounded-xl px-6 py-3 font-black transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background:
                "var(--sf-primary)",
              color:
                "var(--sf-bg)",
            }}
          >
            {completed
              ? "✅ Session recorded — Open recommendation again"
              : `▶ Start ${recommendation.recommendedMinutes}-min session`}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <p
          className="text-xs font-black uppercase tracking-widest"
          style={{
            color:
              "var(--sf-secondary)",
          }}
        >
          Weakness Detection
        </p>

        <h3 className="mt-2 text-2xl font-black">
          Topics that need attention
        </h3>

        {weakTopics.length === 0 ? (
          <div
            className="mt-4 rounded-2xl p-5"
            style={{
              background:
                "var(--sf-surface-soft)",
            }}
          >
            <p
              className="font-semibold"
              style={{
                color:
                  "var(--sf-text-muted)",
              }}
            >
              No weak topics detected yet.
              Complete a practice quiz to
              let StudyForge measure your
              understanding.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {weakTopics.map(
              (topic) => (
                <div
                  key={`${topic.subject}-${topic.topic}`}
                  className="flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
                  style={{
                    background:
                      "var(--sf-surface-soft)",
                  }}
                >
                  <div>
                    <p className="font-black">
                      {topic.topic}
                    </p>

                    <p
                      className="text-sm"
                      style={{
                        color:
                          "var(--sf-text-muted)",
                      }}
                    >
                      {topic.subject}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-black">
                      {topic.mastery}%
                    </p>

                    <p
                      className="text-xs font-bold"
                      style={{
                        color:
                          "var(--sf-text-muted)",
                      }}
                    >
                      {statusLabel(
                        topic.status
                      )}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <p
        className="mt-8 text-center text-sm font-bold"
        style={{
          color:
            "var(--sf-text-muted)",
        }}
      >
        Learn → Practice → Measure →
        Detect Weakness → Adapt → Improve
      </p>
    </section>
  );
}