import { useMemo, useState } from "react";

type LearnModeProps = {
  initialTopic?: string;
  initialSubject?: string;
  onStartPractice?: () => void;
};

type Concept = {
  title: string;
  explanation: string;
  example: string;
  formula?: string;
  mistakes: string[];
  quickCheck: string;
};

type Topic = {
  subject: string;
  title: string;
  concepts: Concept[];
};

const defaultTopics: Topic[] = [
  {
    subject: "Mathematics",
    title: "Matrix Inverse",
    concepts: [
      {
        title: "What is a Matrix?",
        explanation:
          "A matrix is a rectangular arrangement of numbers written in rows and columns. Matrices are useful for organizing and solving mathematical problems.",
        example:
          "For example, [[1, 2], [3, 4]] is a 2 × 2 matrix because it has 2 rows and 2 columns.",
        formula: "Order of matrix = rows × columns",
        mistakes: [
          "Confusing rows with columns.",
          "Forgetting that matrix order is written as rows × columns.",
        ],
        quickCheck:
          "How many elements are present in a 2 × 3 matrix?",
      },
      {
        title: "Determinant",
        explanation:
          "The determinant is a special value calculated from a square matrix. It helps us determine important properties such as whether a matrix has an inverse.",
        example:
          "For a 2 × 2 matrix [[a, b], [c, d]], multiply the main diagonal and subtract the product of the other diagonal.",
        formula: "det(A) = ad − bc",
        mistakes: [
          "Adding instead of subtracting the diagonal products.",
          "Trying to find a determinant for a non-square matrix.",
        ],
        quickCheck:
          "For [[2, 3], [1, 4]], what operation gives its determinant?",
      },
      {
        title: "Matrix Inverse",
        explanation:
          "The inverse of a square matrix is another matrix that produces the identity matrix when multiplied by the original matrix.",
        example:
          "If A × A⁻¹ = I, then A⁻¹ is the inverse of A. A matrix has an inverse only when its determinant is not zero.",
        formula:
          "For [[a, b], [c, d]], A⁻¹ = 1/(ad − bc) × [[d, −b], [−c, a]]",
        mistakes: [
          "Forgetting to calculate the determinant first.",
          "Changing the signs incorrectly.",
          "Trying to invert a matrix whose determinant is zero.",
        ],
        quickCheck:
          "Can a matrix with determinant 0 have an ordinary inverse?",
      },
    ],
  },
  {
    subject: "Mathematics",
    title: "Determinants",
    concepts: [
      {
        title: "Determinant Basics",
        explanation:
          "A determinant is a single number associated with a square matrix. It provides useful information about the matrix.",
        example:
          "For a 2 × 2 matrix [[a, b], [c, d]], the determinant is found using ad − bc.",
        formula: "det(A) = ad − bc",
        mistakes: [
          "Using the wrong multiplication order.",
          "Forgetting the subtraction.",
        ],
        quickCheck:
          "What type of matrix can have a determinant?",
      },
      {
        title: "Properties of Determinants",
        explanation:
          "Determinants follow several useful rules. Interchanging two rows changes the sign of the determinant, while multiplying a row by a number also affects the determinant.",
        example:
          "If two rows of a determinant are identical, the determinant is zero.",
        mistakes: [
          "Assuming row operations never affect the determinant.",
          "Ignoring the effect of swapping rows.",
        ],
        quickCheck:
          "What happens to the determinant when two rows are identical?",
      },
      {
        title: "Applications",
        explanation:
          "Determinants are used to study matrix invertibility and to solve systems of linear equations.",
        example:
          "If det(A) ≠ 0, the square matrix A is invertible.",
        formula: "det(A) ≠ 0 → A has an inverse",
        mistakes: [
          "Thinking every square matrix is invertible.",
          "Forgetting the determinant-zero condition.",
        ],
        quickCheck:
          "What does det(A) = 0 tell us about an inverse?",
      },
    ],
  },
  {
    subject: "Programming",
    title: "C++ Inheritance",
    concepts: [
      {
        title: "Classes and Objects",
        explanation:
          "A class is a blueprint for creating objects. It defines data and functions that describe the behavior of those objects.",
        example:
          "A Student class could contain a student's name, age, and a function that displays student information.",
        mistakes: [
          "Confusing a class with an object.",
          "Trying to use instance data without creating an object.",
        ],
        quickCheck:
          "What is a class used for in C++?",
      },
      {
        title: "Inheritance Basics",
        explanation:
          "Inheritance allows one class to acquire properties and behaviors from another class. The existing class is commonly called the base class, while the new class is the derived class.",
        example:
          "A Dog class can inherit common features from an Animal class and then add its own behavior.",
        formula: "Base class → Derived class",
        mistakes: [
          "Thinking inheritance copies only variables.",
          "Confusing the base class with the derived class.",
        ],
        quickCheck:
          "Which class receives features during inheritance?",
      },
      {
        title: "Method Overriding",
        explanation:
          "Method overriding happens when a derived class provides its own implementation of a function inherited from the base class.",
        example:
          "An Animal class might have a sound() function, while Dog provides its own version of sound().",
        mistakes: [
          "Confusing overriding with overloading.",
          "Changing the function signature unintentionally.",
        ],
        quickCheck:
          "What does a derived class do when it provides its own version of an inherited method?",
      },
    ],
  },
];

function createTopicFromForge(
  topic: string,
  subject: string
): Topic {
  const cleanTopic = topic.trim();

  return {
    subject: subject || "General Study",
    title: cleanTopic || "Focused Learning",
    concepts: [
      {
        title: cleanTopic || "Core Concepts",
        explanation:
          `This is your focused learning session for ${cleanTopic || "this topic"}. Start by understanding the main idea, then connect it to examples and practice.`,
        example:
          `StudyForge will use this concept as the starting point for learning ${cleanTopic || "your topic"} step by step.`,
        mistakes: [
          "Trying to memorize everything before understanding the main idea.",
          "Skipping examples and moving directly to difficult questions.",
        ],
        quickCheck:
          `In one sentence, what is the main idea behind ${cleanTopic || "this topic"}?`,
      },
      {
        title: "Key Ideas",
        explanation:
          `Break ${cleanTopic || "the topic"} into smaller ideas. Understanding each part makes the complete topic easier to remember and apply.`,
        example:
          "Take one important definition or rule and connect it to a simple example.",
        mistakes: [
          "Studying isolated facts without connecting them.",
          "Moving ahead before the previous idea is clear.",
        ],
        quickCheck:
          "Can you explain the key idea without looking at your notes?",
      },
      {
        title: "Worked Example",
        explanation:
          "Worked examples show how knowledge is used in a real problem. Follow each step and understand why that step is necessary.",
        example:
          "Read a simple example, identify the rule being used, and explain each step in your own words.",
        mistakes: [
          "Copying the steps without understanding them.",
          "Ignoring why a particular formula or rule was selected.",
        ],
        quickCheck:
          "Can you explain why the first step of the example is necessary?",
      },
    ],
  };
}

export default function LearnMode({
  initialTopic,
  initialSubject,
  onStartPractice,
}: LearnModeProps) {
  const [selectedConcept, setSelectedConcept] = useState(0);

  const activeTopic = useMemo(() => {
    if (initialTopic?.trim()) {
      return createTopicFromForge(
        initialTopic,
        initialSubject || "General Study"
      );
    }

    return defaultTopics[0];
  }, [initialTopic, initialSubject]);

  const concept = activeTopic.concepts[selectedConcept];

  const progress = Math.round(
    ((selectedConcept + 1) / activeTopic.concepts.length) * 100
  );

  function nextConcept(): void {
    if (selectedConcept < activeTopic.concepts.length - 1) {
      setSelectedConcept((current) => current + 1);
    }
  }

  function previousConcept(): void {
    if (selectedConcept > 0) {
      setSelectedConcept((current) => current - 1);
    }
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className="text-sm font-bold uppercase tracking-widest"
            style={{
              color: "var(--sf-secondary)",
            }}
          >
            📚 Focused learning
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            {activeTopic.title}
          </h2>

          <p
            className="mt-2 text-sm font-semibold"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            {activeTopic.subject} · Learn one concept at a time
          </p>
        </div>

        <div
          className="rounded-2xl px-4 py-3 text-sm font-bold"
          style={{
            background: "var(--sf-surface-soft)",
            color: "var(--sf-secondary)",
          }}
        >
          Concept {selectedConcept + 1} of {activeTopic.concepts.length}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm font-bold">
          <span>Learning progress</span>
          <span>{progress}%</span>
        </div>

        <div
          className="h-3 overflow-hidden rounded-full"
          style={{
            background: "var(--sf-surface-soft)",
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

      {/* Concept navigation */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {activeTopic.concepts.map((item, index) => {
          const isSelected = index === selectedConcept;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => setSelectedConcept(index)}
              className="rounded-2xl border p-4 text-left transition-transform hover:scale-[1.02] active:scale-[0.98]"
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
              <p
                className="text-xs font-bold uppercase tracking-wider"
                style={{
                  color: isSelected
                    ? "var(--sf-bg)"
                    : "var(--sf-text-muted)",
                  opacity: isSelected ? 0.8 : 1,
                }}
              >
                Concept {index + 1}
              </p>

              <p className="mt-1 font-bold">
                {item.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main learning card */}
      <div
        className="mt-6 rounded-3xl border p-6 sm:p-8"
        style={{
          background: "var(--sf-surface-soft)",
          borderColor: "var(--sf-surface-soft)",
        }}
      >
        <div
          className="inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
          style={{
            background: "var(--sf-surface)",
            color: "var(--sf-secondary)",
          }}
        >
          Concept {selectedConcept + 1}
        </div>

        <h3 className="mt-4 text-3xl font-black">
          {concept.title}
        </h3>

        {/* Explanation */}
        <div className="mt-7">
          <h4 className="text-lg font-black">
            💡 Understand it
          </h4>

          <p
            className="mt-2 max-w-3xl leading-7"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            {concept.explanation}
          </p>
        </div>

        {/* Example */}
        <div className="mt-6 rounded-2xl p-5" style={{ background: "var(--sf-surface)" }}>
          <h4 className="font-black">
            🧩 Example
          </h4>

          <p
            className="mt-2 leading-7"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            {concept.example}
          </p>
        </div>

        {/* Formula */}
        {concept.formula && (
          <div className="mt-6 rounded-2xl p-5" style={{ background: "var(--sf-surface)" }}>
            <h4 className="font-black">
              📐 Important formula
            </h4>

            <p
              className="mt-2 rounded-xl px-4 py-3 font-mono text-sm"
              style={{
                background: "var(--sf-surface-soft)",
                color: "var(--sf-secondary)",
              }}
            >
              {concept.formula}
            </p>
          </div>
        )}

        {/* Common mistakes */}
        <div className="mt-6">
          <h4 className="font-black">
            ⚠️ Common mistakes
          </h4>

          <div className="mt-3 space-y-2">
            {concept.mistakes.map((mistake) => (
              <div
                key={mistake}
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "var(--sf-surface)",
                  color: "var(--sf-text-muted)",
                }}
              >
                • {mistake}
              </div>
            ))}
          </div>
        </div>

        {/* Quick check */}
        <div
          className="mt-6 rounded-2xl border p-5"
          style={{
            background: "var(--sf-surface)",
            borderColor: "var(--sf-primary)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{
              color: "var(--sf-secondary)",
            }}
          >
            ⚡ Quick check
          </p>

          <p className="mt-2 font-bold">
            {concept.quickCheck}
          </p>
        </div>

        {/* Controls */}
        <div className="mt-7 flex flex-wrap gap-3">
          {selectedConcept > 0 && (
            <button
              type="button"
              onClick={previousConcept}
              className="min-h-11 rounded-xl border px-5 py-2 font-bold transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "var(--sf-surface)",
                borderColor: "var(--sf-surface-soft)",
                color: "var(--sf-text)",
              }}
            >
              ← Previous
            </button>
          )}

          {selectedConcept <
            activeTopic.concepts.length - 1 && (
            <button
              type="button"
              onClick={nextConcept}
              className="min-h-11 rounded-xl px-5 py-2 font-black transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "var(--sf-primary)",
                color: "var(--sf-bg)",
              }}
            >
              Next concept →
            </button>
          )}

          {selectedConcept ===
            activeTopic.concepts.length - 1 && (
            <button
              type="button"
              onClick={onStartPractice}
              className="min-h-11 rounded-xl px-5 py-2 font-black transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "var(--sf-primary)",
                color: "var(--sf-bg)",
                boxShadow: "var(--sf-shadow)",
              }}
            >
              🎯 Start Practice →
            </button>
          )}
        </div>
      </div>
    </section>
  );
}