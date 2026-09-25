
import { useMemo, useState } from "react";
import {
  addXP,
  recordQuizCompletion,
} from "./studyforgeStats";
import { recordQuizResult } from "../../lib/adaptiveLearning";

type QuizProps = {
  topic?: string;
  subject?: string;
};

type Question = {
  question: string;
  options: string[];
  answer: number;
};

const defaultQuestions: Question[] = [
  {
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Program Utility",
      "Control Processing User",
    ],
    answer: 0,
  },
  {
    question: "Which language is primarily used with React?",
    options: [
      "Python",
      "JavaScript",
      "C++",
      "Java",
    ],
    answer: 1,
  },
  {
    question: "What is 12 × 8?",
    options: [
      "86",
      "96",
      "108",
      "112",
    ],
    answer: 1,
  },
  {
    question:
      "Which symbol is commonly used for a comment in JavaScript?",
    options: [
      "#",
      "//",
      "<!--",
      "**",
    ],
    answer: 1,
  },
  {
    question: "What does HTML mainly define?",
    options: [
      "The structure of a webpage",
      "Database queries",
      "Computer hardware",
      "Internet speed",
    ],
    answer: 0,
  },
];

function createTopicQuestions(
  topic: string,
  subject: string
): Question[] {
  const normalizedTopic =
    topic.trim().toLowerCase();

  if (
    normalizedTopic.includes("determinant") ||
    normalizedTopic.includes("determinants")
  ) {
    return [
      {
        question:
          "What is the determinant of a 2 × 2 matrix [[a, b], [c, d]]?",
        options: [
          "ad − bc",
          "ac − bd",
          "ab − cd",
          "ad + bc",
        ],
        answer: 0,
      },
      {
        question:
          "A determinant is normally calculated for which type of matrix?",
        options: [
          "Square matrix",
          "Only row matrices",
          "Only column matrices",
          "Any matrix",
        ],
        answer: 0,
      },
      {
        question:
          "What does a determinant of zero indicate about a square matrix?",
        options: [
          "It always has an inverse",
          "It has no ordinary inverse",
          "It must be an identity matrix",
          "It has exactly one row",
        ],
        answer: 1,
      },
      {
        question:
          "For [[2, 3], [1, 4]], what is the determinant?",
        options: [
          "5",
          "8",
          "11",
          "−5",
        ],
        answer: 0,
      },
      {
        question:
          "If two rows of a determinant are identical, what is its value?",
        options: [
          "1",
          "−1",
          "0",
          "It cannot be calculated",
        ],
        answer: 2,
      },
    ];
  }

  if (
    normalizedTopic.includes("matrix") ||
    normalizedTopic.includes("matrices")
  ) {
    return [
      {
        question:
          "What does the order of a matrix describe?",
        options: [
          "Rows × columns",
          "Columns × rows only",
          "Number of diagonal elements",
          "Number of formulas",
        ],
        answer: 0,
      },
      {
        question:
          "How many elements are in a 2 × 3 matrix?",
        options: [
          "5",
          "6",
          "8",
          "9",
        ],
        answer: 1,
      },
      {
        question:
          "Which of these is a square matrix?",
        options: [
          "2 × 3",
          "3 × 2",
          "3 × 3",
          "1 × 4",
        ],
        answer: 2,
      },
      {
        question:
          "What is the identity matrix used for?",
        options: [
          "It acts like 1 in matrix multiplication",
          "It always has determinant 0",
          "It contains only zeros",
          "It cannot be multiplied",
        ],
        answer: 0,
      },
      {
        question:
          "Which operation requires compatible matrix dimensions?",
        options: [
          "Matrix multiplication",
          "Writing a matrix",
          "Counting rows",
          "Naming a matrix",
        ],
        answer: 0,
      },
    ];
  }

  if (
    normalizedTopic.includes("python")
  ) {
    return [
      {
        question:
          "Which keyword is used to define a function in Python?",
        options: [
          "function",
          "def",
          "func",
          "define",
        ],
        answer: 1,
      },
      {
        question:
          "Which symbol starts a comment in Python?",
        options: [
          "//",
          "/*",
          "#",
          "<!--",
        ],
        answer: 2,
      },
      {
        question:
          "Which data type stores an ordered collection that can be changed?",
        options: [
          "list",
          "tuple",
          "integer",
          "boolean",
        ],
        answer: 0,
      },
      {
        question:
          "Which keyword is commonly used to repeat through items in Python?",
        options: [
          "loop",
          "for",
          "repeat",
          "each",
        ],
        answer: 1,
      },
      {
        question:
          "What does len() commonly return?",
        options: [
          "The length or number of items",
          "The largest number",
          "The data type",
          "The memory address",
        ],
        answer: 0,
      },
    ];
  }

  if (
    normalizedTopic.includes("differentiation") ||
    normalizedTopic.includes("derivative") ||
    normalizedTopic.includes("derivatives")
  ) {
    return [
      {
        question:
          "What does differentiation generally help us find?",
        options: [
          "Rate of change",
          "Only area",
          "Only volume",
          "Only integer values",
        ],
        answer: 0,
      },
      {
        question:
          "What is the derivative of x²?",
        options: [
          "x",
          "2x",
          "x³",
          "2",
        ],
        answer: 1,
      },
      {
        question:
          "What is the derivative of a constant?",
        options: [
          "1",
          "The constant itself",
          "0",
          "Undefined in every case",
        ],
        answer: 2,
      },
      {
        question:
          "Which rule is commonly used when differentiating a product of two functions?",
        options: [
          "Product rule",
          "Square rule",
          "Matrix rule",
          "Division rule only",
        ],
        answer: 0,
      },
      {
        question:
          "What does the derivative represent geometrically at a point on a curve?",
        options: [
          "The slope of the tangent",
          "The area under the curve",
          "The x-intercept",
          "The y-intercept only",
        ],
        answer: 0,
      },
    ];
  }

  if (
    normalizedTopic.includes("inheritance") ||
    normalizedTopic.includes("oop") ||
    normalizedTopic.includes("object oriented")
  ) {
    return [
      {
        question:
          "What is inheritance in object-oriented programming?",
        options: [
          "A class acquiring features from another class",
          "Deleting a class",
          "Running code without an object",
          "Changing a variable type",
        ],
        answer: 0,
      },
      {
        question:
          "What is the class being inherited from commonly called?",
        options: [
          "Derived class",
          "Base class",
          "Child object",
          "Method class",
        ],
        answer: 1,
      },
      {
        question:
          "What is the class that receives inherited features commonly called?",
        options: [
          "Base class",
          "Parent method",
          "Derived class",
          "Static class",
        ],
        answer: 2,
      },
      {
        question:
          "What is method overriding?",
        options: [
          "A derived class providing its own version of an inherited method",
          "Deleting a method",
          "Creating two variables",
          "Renaming a class",
        ],
        answer: 0,
      },
      {
        question:
          "Which concept allows related classes to share common behavior?",
        options: [
          "Inheritance",
          "Compilation",
          "Comments",
          "Input",
        ],
        answer: 0,
      },
    ];
  }

  if (
    normalizedTopic.includes("physics") ||
    normalizedTopic.includes("mechanics")
  ) {
    return [
      {
        question:
          "What is the SI unit of force?",
        options: [
          "Joule",
          "Newton",
          "Watt",
          "Pascal",
        ],
        answer: 1,
      },
      {
        question:
          "Which quantity describes how fast velocity changes?",
        options: [
          "Acceleration",
          "Distance",
          "Mass",
          "Energy",
        ],
        answer: 0,
      },
      {
        question:
          "What is the SI unit of energy?",
        options: [
          "Newton",
          "Watt",
          "Joule",
          "Meter",
        ],
        answer: 2,
      },
      {
        question:
          "Which law is commonly written as F = ma?",
        options: [
          "Newton's First Law",
          "Newton's Second Law",
          "Newton's Third Law",
          "Law of Conservation of Energy",
        ],
        answer: 1,
      },
      {
        question:
          "What does velocity describe?",
        options: [
          "Speed with direction",
          "Mass only",
          "Force only",
          "Temperature",
        ],
        answer: 0,
      },
    ];
  }

  return [
    {
      question:
        `Which approach is most useful when beginning to learn ${topic}?`,
      options: [
        "Understand the core concept first",
        "Memorize everything immediately",
        "Skip examples",
        "Avoid practice",
      ],
      answer: 0,
    },
    {
      question:
        `What should you do after learning an important idea in ${topic}?`,
      options: [
        "Test your understanding",
        "Forget it",
        "Skip all examples",
        "Avoid questions",
      ],
      answer: 0,
    },
    {
      question:
        `Which activity helps strengthen your understanding of ${topic}?`,
      options: [
        "Active practice",
        "Random guessing",
        "Skipping difficult parts",
        "Reading without thinking",
      ],
      answer: 0,
    },
    {
      question:
        `What is a useful way to study ${topic}?`,
      options: [
        "Break it into smaller concepts",
        "Study everything at once",
        "Avoid reviewing",
        "Only memorize headings",
      ],
      answer: 0,
    },
    {
      question:
        `What should StudyForge do after measuring your performance in ${topic}?`,
      options: [
        "Adapt what you study next",
        "Ignore the result",
        "Delete your progress",
        "Stop learning",
      ],
      answer: 0,
    },
  ].map((question) => ({
    ...question,
    question:
      subject.trim().length > 0
        ? question.question
        : question.question,
  }));
}

const XP_REWARD = 40;

export default function Quiz({
  topic,
  subject,
}: QuizProps) {
  const questions = useMemo(() => {
    if (topic?.trim()) {
      return createTopicQuestions(
        topic,
        subject || "General Study"
      );
    }

    return defaultQuestions;
  }, [topic, subject]);

  const isTopicPractice =
    Boolean(topic?.trim());

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  const [rewardGiven, setRewardGiven] =
    useState(false);

  function selectAnswer(index: number): void {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);

    if (
      index ===
      questions[currentQuestion].answer
    ) {
      setScore(
        (currentScore) =>
          currentScore + 1
      );
    }
  }

  function completeQuiz(
    finalScore: number
  ): void {
    if (rewardGiven) {
      return;
    }

    const safeScore = Math.min(
      Math.max(finalScore, 0),
      questions.length
    );

    addXP(XP_REWARD);
    recordQuizCompletion();

    recordQuizResult(
      topic?.trim() || "Quick Quiz",
      subject?.trim() || "General",
      safeScore,
      questions.length
    );

    setRewardGiven(true);
    setFinished(true);
  }

  function nextQuestion(): void {
    if (
      selectedAnswer === null
    ) {
      return;
    }

    if (
      currentQuestion ===
      questions.length - 1
    ) {
      /*
       * The selected answer has already been
       * included in `score` by selectAnswer().
       *
       * Do NOT add another point here.
       */
      completeQuiz(score);
      return;
    }

    setCurrentQuestion(
      (current) => current + 1
    );

    setSelectedAnswer(null);
  }

  function restartQuiz(): void {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
    setRewardGiven(false);
  }

  if (finished) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    return (
      <section
        className="mt-8 rounded-3xl border p-6"
        style={{
          background:
            "var(--sf-surface)",
          borderColor:
            "var(--sf-surface-soft)",
          boxShadow:
            "var(--sf-shadow)",
        }}
      >
        <div className="text-center">
          <div
            className="text-5xl"
            aria-hidden="true"
          >
            🎉
          </div>

          <p
            className="mt-5 text-sm font-bold uppercase tracking-widest"
            style={{
              color:
                "var(--sf-secondary)",
            }}
          >
            {isTopicPractice
              ? "TOPIC PRACTICE COMPLETE"
              : "QUICK QUIZ COMPLETE"}
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {isTopicPractice
              ? topic
              : "Quiz Complete!"}
          </h2>

          <p
            className="mt-2"
            style={{
              color:
                "var(--sf-text-muted)",
            }}
          >
            You scored {score} out of{" "}
            {questions.length}.
          </p>

          <div
            className="mx-auto mt-6 max-w-sm rounded-2xl p-5"
            style={{
              background:
                "var(--sf-surface-soft)",
            }}
          >
            <p className="text-4xl font-black">
              {percentage}%
            </p>

            <p
              className="mt-2 text-sm"
              style={{
                color:
                  "var(--sf-text-muted)",
              }}
            >
              +{XP_REWARD} XP earned ⚡
            </p>
          </div>

          {isTopicPractice && (
            <div
              className="mx-auto mt-4 max-w-sm rounded-2xl p-4 text-sm font-semibold"
              style={{
                background:
                  "var(--sf-surface-soft)",
                color:
                  "var(--sf-secondary)",
              }}
            >
              🧠 Your result has been
              recorded for {topic}.
            </div>
          )}

          <button
            type="button"
            onClick={restartQuiz}
            className="mt-6 min-h-11 rounded-xl px-6 py-3 font-black transition-transform hover:scale-105 active:scale-95"
            style={{
              background:
                "var(--sf-primary)",
              color: "var(--sf-bg)",
            }}
          >
            🔄 Try Again
          </button>
        </div>
      </section>
    );
  }

  const question =
    questions[currentQuestion];

  return (
    <section
      className="mt-8 rounded-3xl border p-6"
      style={{
        background:
          "var(--sf-surface)",
        borderColor:
          "var(--sf-surface-soft)",
        boxShadow:
          "var(--sf-shadow)",
      }}
    >
      <div className="mb-6">
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{
            color:
              "var(--sf-secondary)",
          }}
        >
          {isTopicPractice
            ? "TOPIC PRACTICE"
            : "QUICK QUIZ"}
        </p>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">
              {isTopicPractice
                ? topic
                : "Test your knowledge"}
            </h2>

            {isTopicPractice && (
              <p
                className="mt-1 text-sm font-semibold"
                style={{
                  color:
                    "var(--sf-text-muted)",
                }}
              >
                {subject ||
                  "General Study"}{" "}
                · Practice what you just
                learned
              </p>
            )}
          </div>

          <span
            className="shrink-0 text-sm font-bold"
            style={{
              color:
                "var(--sf-text-muted)",
            }}
          >
            {currentQuestion + 1}/
            {questions.length}
          </span>
        </div>
      </div>

      <div
        className="mb-6 h-2 overflow-hidden rounded-full"
        style={{
          background:
            "var(--sf-bg)",
        }}
        role="progressbar"
        aria-valuenow={
          currentQuestion + 1
        }
        aria-valuemin={1}
        aria-valuemax={
          questions.length
        }
        aria-label="Quiz progress"
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${
              ((currentQuestion + 1) /
                questions.length) *
              100
            }%`,
            background:
              "var(--sf-primary)",
          }}
        />
      </div>

      <h3 className="text-xl font-bold leading-8">
        {question.question}
      </h3>

      <div className="mt-6 grid gap-3">
        {question.options.map(
          (option, index) => {
            const isSelected =
              selectedAnswer ===
              index;

            const isCorrect =
              index ===
              question.answer;

            let background =
              "var(--sf-surface-soft)";

            if (
              selectedAnswer !==
                null &&
              isCorrect
            ) {
              background =
                "var(--sf-success)";
            } else if (isSelected) {
              background =
                "var(--sf-danger)";
            }

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  selectAnswer(index)
                }
                disabled={
                  selectedAnswer !==
                  null
                }
                className="min-h-14 rounded-2xl border p-4 text-left font-semibold transition-transform hover:scale-[1.01] disabled:cursor-default"
                style={{
                  background,
                  borderColor:
                    "var(--sf-surface-soft)",
                  color:
                    selectedAnswer !==
                      null &&
                    (isCorrect ||
                      isSelected)
                      ? "var(--sf-bg)"
                      : "var(--sf-text)",
                }}
              >
                {option}
              </button>
            );
          }
        )}
      </div>

      {selectedAnswer !== null && (
        <div className="mt-6">
          <p
            className="text-sm font-semibold"
            role="status"
          >
            {selectedAnswer ===
            question.answer
              ? "✅ Correct! Great job."
              : `❌ Not quite. The correct answer is "${question.options[question.answer]}".`}
          </p>

          <button
            type="button"
            onClick={nextQuestion}
            className="mt-4 min-h-11 rounded-xl px-6 py-3 font-black transition-transform hover:scale-105 active:scale-95"
            style={{
              background:
                "var(--sf-primary)",
              color:
                "var(--sf-bg)",
            }}
          >
            {currentQuestion ===
            questions.length - 1
              ? "See Results →"
              : "Next Question →"}
          </button>
        </div>
      )}
    </section>
  );
}

