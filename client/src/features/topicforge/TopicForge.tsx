import { useMemo, useState } from "react";

type LearningPath = {
  subject: string;
  topic: string;
  concepts: string[];
};

type TopicTemplate = {
  keywords: string[];
  subject: string;
  concepts: string[];
};

type TopicForgeProps = {
  onStartLearning?: (concept: string, subject: string) => void;
};

const topicTemplates: TopicTemplate[] = [
  {
    keywords: ["matrix", "matrices"],
    subject: "Mathematics",
    concepts: [
      "Matrix Basics",
      "Matrix Operations",
      "Determinants",
      "Matrix Inverse",
      "Eigenvalues and Eigenvectors",
    ],
  },
  {
    keywords: ["calculus", "differentiation", "derivative", "derivatives"],
    subject: "Mathematics",
    concepts: [
      "Limits and Continuity",
      "Basic Derivatives",
      "Rules of Differentiation",
      "Chain Rule",
      "Applications of Derivatives",
    ],
  },
  {
    keywords: ["integration", "integrals"],
    subject: "Mathematics",
    concepts: [
      "Introduction to Integration",
      "Basic Integration Rules",
      "Substitution",
      "Integration by Parts",
      "Applications of Integration",
    ],
  },
  {
    keywords: ["python"],
    subject: "Programming",
    concepts: [
      "Python Basics",
      "Variables and Data Types",
      "Conditions and Loops",
      "Functions",
      "Lists and Data Structures",
    ],
  },
  {
    keywords: ["javascript", "js", "react"],
    subject: "Programming",
    concepts: [
      "JavaScript Fundamentals",
      "Variables and Functions",
      "Arrays and Objects",
      "DOM and Events",
      "React Components",
    ],
  },
  {
    keywords: ["inheritance", "oops", "object oriented", "oop"],
    subject: "Programming",
    concepts: [
      "Classes and Objects",
      "Inheritance Basics",
      "Types of Inheritance",
      "Method Overriding",
      "Polymorphism",
    ],
  },
  {
    keywords: ["physics", "mechanics"],
    subject: "Physics",
    concepts: [
      "Fundamental Concepts",
      "Motion and Forces",
      "Work and Energy",
      "Momentum",
      "Problem Solving",
    ],
  },
  {
    keywords: ["chemistry"],
    subject: "Chemistry",
    concepts: [
      "Basic Chemical Concepts",
      "Atomic Structure",
      "Chemical Bonding",
      "Chemical Reactions",
      "Problem Solving",
    ],
  },
];

const fallbackConcepts = [
  "Core Concepts",
  "Key Definitions",
  "Important Principles",
  "Worked Examples",
  "Practice and Review",
];

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function createLearningPath(input: string): LearningPath {
  const normalized = normalizeText(input);

  const matchedTemplate = topicTemplates.find((template) =>
    template.keywords.some((keyword) =>
      normalized.includes(keyword)
    )
  );

  if (matchedTemplate) {
    return {
      subject: matchedTemplate.subject,
      topic: input.trim(),
      concepts: matchedTemplate.concepts,
    };
  }

  return {
    subject: "General Study",
    topic: input.trim(),
    concepts: fallbackConcepts,
  };
}

export default function TopicForge({
  onStartLearning,
}: TopicForgeProps) {
  const [topicInput, setTopicInput] = useState("");
  const [learningPath, setLearningPath] =
    useState<LearningPath | null>(null);
  const [selectedConcept, setSelectedConcept] = useState(0);
  const [error, setError] = useState("");

  const progress = useMemo(() => {
    if (!learningPath) {
      return 0;
    }

    return Math.round(
      ((selectedConcept + 1) / learningPath.concepts.length) * 100
    );
  }, [learningPath, selectedConcept]);

  function generatePath(): void {
    const cleanedTopic = topicInput.trim();

    if (!cleanedTopic) {
      setError(
        "Enter a subject or topic to build your learning path."
      );
      setLearningPath(null);
      return;
    }

    if (cleanedTopic.length < 2) {
      setError(
        "Please enter a little more detail about what you want to learn."
      );
      setLearningPath(null);
      return;
    }

    setError("");

    const newPath = createLearningPath(cleanedTopic);

    setLearningPath(newPath);
    setSelectedConcept(0);
  }

  function selectConcept(index: number): void {
    setSelectedConcept(index);
  }

  function resetForge(): void {
    setTopicInput("");
    setLearningPath(null);
    setSelectedConcept(0);
    setError("");
  }

  function startLearning(): void {
    if (!learningPath) {
      return;
    }

    const concept =
      learningPath.concepts[selectedConcept];

    onStartLearning?.(
      concept,
      learningPath.subject
    );
  }

  return (
    <section
      className="rounded-3xl border p-6"
      style={{
        background: "var(--sf-surface)",
        borderColor: "var(--sf-surface-soft)",
        boxShadow: "var(--sf-shadow)",
      }}
    >
      {/* Header */}
      <div>
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{
            color: "var(--sf-secondary)",
          }}
        >
          Study Material → Learning Path
        </p>

        <h2 className="mt-2 text-3xl font-black sm:text-4xl">
          ⚒️ Topic Forge
        </h2>

        <p
          className="mt-3 max-w-2xl leading-7"
          style={{
            color: "var(--sf-text-muted)",
          }}
        >
          Tell StudyForge what you need to learn. It breaks the
          topic into a focused sequence of concepts you can learn
          and practice one at a time.
        </p>
      </div>

      {/* Input */}
      <div className="mt-8">
        <label
          htmlFor="studyforge-topic"
          className="mb-2 block text-sm font-bold"
        >
          What do you want to learn?
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="studyforge-topic"
            type="text"
            value={topicInput}
            onChange={(event) => {
              setTopicInput(event.target.value);

              if (error) {
                setError("");
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                generatePath();
              }
            }}
            placeholder='Example: "I need to learn matrices"'
            className="min-h-12 flex-1 rounded-2xl border px-4 py-3 outline-none transition focus:ring-2"
            style={{
              background: "var(--sf-bg)",
              borderColor: "var(--sf-surface-soft)",
              color: "var(--sf-text)",
            }}
          />

          <button
            type="button"
            onClick={generatePath}
            className="min-h-12 rounded-2xl px-6 py-3 font-black transition-transform hover:scale-105 active:scale-95"
            style={{
              background: "var(--sf-primary)",
              color: "var(--sf-bg)",
              boxShadow: "var(--sf-shadow)",
            }}
          >
            ⚒️ Forge Path
          </button>
        </div>

        {error && (
          <p
            className="mt-3 rounded-xl px-4 py-3 text-sm font-semibold"
            style={{
              background: "var(--sf-surface-soft)",
              color: "var(--sf-text)",
            }}
          >
            ⚠️ {error}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Matrices",
            "Differentiation",
            "Python",
            "Physics",
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setTopicInput(suggestion);
                setError("");
              }}
              className="min-h-10 rounded-xl border px-3 py-2 text-sm font-semibold transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "var(--sf-surface-soft)",
                borderColor: "var(--sf-surface-soft)",
                color: "var(--sf-text)",
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      {learningPath && (
        <div className="mt-8">
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--sf-surface-soft)",
            }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className="text-sm font-bold uppercase tracking-widest"
                  style={{
                    color: "var(--sf-secondary)",
                  }}
                >
                  Learning Path Created
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  {learningPath.topic}
                </h3>

                <p
                  className="mt-1 text-sm font-semibold"
                  style={{
                    color: "var(--sf-text-muted)",
                  }}
                >
                  {learningPath.subject} ·{" "}
                  {learningPath.concepts.length} concepts
                </p>
              </div>

              <button
                type="button"
                onClick={resetForge}
                className="min-h-10 rounded-xl border px-4 py-2 text-sm font-bold transition-transform hover:scale-105 active:scale-95"
                style={{
                  background: "var(--sf-surface)",
                  borderColor: "var(--sf-surface-soft)",
                  color: "var(--sf-text)",
                }}
              >
                New Topic
              </button>
            </div>

            {/* Progress */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>Path progress</span>
                <span>{progress}%</span>
              </div>

              <div
                className="h-3 overflow-hidden rounded-full"
                style={{
                  background: "var(--sf-surface)",
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: "var(--sf-primary)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Concepts */}
          <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-3">
              {learningPath.concepts.map(
                (concept, index) => {
                  const isSelected =
                    selectedConcept === index;
                  const isCompleted =
                    index < selectedConcept;

                  return (
                    <button
                      key={concept}
                      type="button"
                      onClick={() => selectConcept(index)}
                      className="w-full rounded-2xl border p-4 text-left transition-transform hover:scale-[1.01] active:scale-[0.99]"
                      style={{
                        background: isSelected
                          ? "var(--sf-primary)"
                          : "var(--sf-surface-soft)",
                        borderColor: isSelected
                          ? "var(--sf-primary)"
                          : "var(--sf-surface-soft)",
                        color: isSelected
                          ? "var(--sf-bg)"
                          : "var(--sf-text)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black"
                          style={{
                            background: isSelected
                              ? "var(--sf-bg)"
                              : "var(--sf-surface)",
                            color: isSelected
                              ? "var(--sf-primary)"
                              : "var(--sf-text)",
                          }}
                        >
                          {isCompleted
                            ? "✓"
                            : index + 1}
                        </div>

                        <div className="min-w-0">
                          <p
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{
                              color: isSelected
                                ? "var(--sf-bg)"
                                : "var(--sf-text-muted)",
                              opacity: isSelected
                                ? 0.8
                                : 1,
                            }}
                          >
                            Concept {index + 1}
                          </p>

                          <p className="mt-1 font-bold">
                            {concept}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* Selected concept */}
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "var(--sf-surface-soft)",
                borderColor: "var(--sf-surface-soft)",
              }}
            >
              <p
                className="text-sm font-bold uppercase tracking-widest"
                style={{
                  color: "var(--sf-secondary)",
                }}
              >
                Ready to learn
              </p>

              <h3 className="mt-3 text-3xl font-black">
                {learningPath.concepts[selectedConcept]}
              </h3>

              <p
                className="mt-3 leading-7"
                style={{
                  color: "var(--sf-text-muted)",
                }}
              >
                This concept is positioned in your learning
                path so you can build understanding step by
                step instead of jumping randomly between
                topics.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--sf-surface)",
                  }}
                >
                  <div className="text-xl">📚</div>

                  <p className="mt-2 text-sm font-bold">
                    Learn
                  </p>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: "var(--sf-text-muted)",
                    }}
                  >
                    Understand the concept.
                  </p>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--sf-surface)",
                  }}
                >
                  <div className="text-xl">🎯</div>

                  <p className="mt-2 text-sm font-bold">
                    Practice
                  </p>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: "var(--sf-text-muted)",
                    }}
                  >
                    Test your understanding.
                  </p>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--sf-surface)",
                  }}
                >
                  <div className="text-xl">🧠</div>

                  <p className="mt-2 text-sm font-bold">
                    Adapt
                  </p>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: "var(--sf-text-muted)",
                    }}
                  >
                    Let StudyForge adjust what comes
                    next.
                  </p>
                </div>
              </div>

              {/* Learning action */}
              <button
                type="button"
                onClick={startLearning}
                className="mt-6 min-h-12 w-full rounded-2xl px-5 py-3 font-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "var(--sf-primary)",
                  color: "var(--sf-bg)",
                  boxShadow: "var(--sf-shadow)",
                }}
              >
                📚 Learn this concept →
              </button>

              {/* Navigation */}
              <div className="mt-4 flex flex-wrap gap-3">
                {selectedConcept > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedConcept(
                        (current) => current - 1
                      )
                    }
                    className="min-h-11 rounded-xl border px-4 py-2 font-bold transition-transform hover:scale-105 active:scale-95"
                    style={{
                      background: "var(--sf-surface)",
                      borderColor:
                        "var(--sf-surface-soft)",
                      color: "var(--sf-text)",
                    }}
                  >
                    ← Previous
                  </button>
                )}

                {selectedConcept <
                  learningPath.concepts.length - 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedConcept(
                        (current) => current + 1
                      )
                    }
                    className="min-h-11 rounded-xl px-5 py-2 font-black transition-transform hover:scale-105 active:scale-95"
                    style={{
                      background:
                        "var(--sf-surface)",
                      color: "var(--sf-text)",
                    }}
                  >
                    Next concept →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!learningPath && (
        <div
          className="mt-8 rounded-2xl border border-dashed p-8 text-center"
          style={{
            background: "var(--sf-surface-soft)",
            borderColor: "var(--sf-surface)",
          }}
        >
          <div className="text-4xl">⚒️</div>

          <h3 className="mt-3 text-xl font-black">
            Forge your first learning path
          </h3>

          <p
            className="mx-auto mt-2 max-w-xl text-sm leading-6"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            Start with a topic such as matrices,
            differentiation, Python, or physics. StudyForge
            will organize it into smaller learning concepts.
          </p>
        </div>
      )}
    </section>
  );
}