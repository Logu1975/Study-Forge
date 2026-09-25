
import { useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const starterMessage: Message = {
  id: 1,
  role: "assistant",
  text: "Hey! 👋 I'm your StudyForge Study Assistant. Tell me a subject, topic, exam goal, or study problem and I'll help you build a plan.",
};

const programmingTopics = [
  "Variables",
  "Loops",
  "Functions",
  "Lists",
  "Conditions",
];

const studyQuestions = [
  "What subject are you studying?",
  "How much time do you have?",
  "What topic do you find difficult?",
];

export default function AIStudyAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    starterMessage,
  ]);

  const [input, setInput] = useState<string>("");

  function generateReply(question: string): string {
    const text = question.toLowerCase();

    if (
      text.includes("study plan") ||
      text.includes("schedule") ||
      text.includes("plan")
    ) {
      return [
        "📚 Here's a simple StudyForge plan:",
        "",
        "1️⃣ Learn — 25 minutes",
        "2️⃣ Practice — 20 minutes",
        "3️⃣ Review — 10 minutes",
        "4️⃣ Take a short break",
        "5️⃣ Repeat with your next topic",
        "",
        "🎯 Start with your weakest topic first.",
      ].join("\n");
    }

    if (
      text.includes("exam") ||
      text.includes("revision") ||
      text.includes("revise")
    ) {
      return [
        "🧠 Exam revision strategy:",
        "",
        "1️⃣ Understand the topic.",
        "2️⃣ Close your notes and recall what you learned.",
        "3️⃣ Solve practice questions.",
        "4️⃣ Check your mistakes.",
        "5️⃣ Review only the weak areas.",
        "",
        "💡 Don't spend all your time rereading. Active recall and practice are useful for revision.",
      ].join("\n");
    }

    if (
      text.includes("python") ||
      text.includes("programming") ||
      text.includes("coding")
    ) {
      return [
        "💻 Let's approach programming like a real developer.",
        "",
        "Start with:",
        ...programmingTopics.map(
          (topic, index) => `${index + 1}️⃣ ${topic}`
        ),
        "",
        "Then build a small project using what you learned.",
        "🔥 Don't just read code — write it, run it, find bugs, and fix them.",
      ].join("\n");
    }

    if (
      text.includes("math") ||
      text.includes("mathematics")
    ) {
      return [
        "📐 Mathematics strategy:",
        "",
        "1️⃣ Understand the formula.",
        "2️⃣ See one solved example.",
        "3️⃣ Solve an easy problem yourself.",
        "4️⃣ Increase the difficulty.",
        "5️⃣ Write down your mistakes.",
        "",
        "🎯 If you're stuck, show me the exact problem and we can break it down step by step.",
      ].join("\n");
    }

    if (text.includes("physics")) {
      return [
        "⚡ Physics strategy:",
        "",
        "1️⃣ Understand the concept.",
        "2️⃣ Write the known values.",
        "3️⃣ Choose the correct formula.",
        "4️⃣ Substitute the values.",
        "5️⃣ Check the units and final answer.",
        "",
        "💡 Understanding why the formula works makes numerical problems much easier.",
      ].join("\n");
    }

    if (
      text.includes("focus") ||
      text.includes("concentrate") ||
      text.includes("distraction")
    ) {
      return [
        "🎯 Try this focus method:",
        "",
        "⏱️ 25 minutes — one task only",
        "📵 Remove unnecessary distractions",
        "📝 Keep one clear goal",
        "☕ Take a short break",
        "🔁 Start another session if needed",
        "",
        "Your StudyForge Focus Timer is perfect for this.",
      ].join("\n");
    }

    if (
      text.includes("question") ||
      text.includes("quiz") ||
      text.includes("practice")
    ) {
      return [
        "🧠 Practice mode:",
        "",
        "Try answering these:",
        "",
        "1. What is the most important idea in the topic?",
        "2. Can you explain it without looking at your notes?",
        "3. Can you solve one example?",
        "4. What mistake are you most likely to make?",
        "",
        "🎯 Tell me the subject and topic for a more specific practice set.",
      ].join("\n");
    }

    if (
      text.includes("2 hour") ||
      text.includes("2 hours")
    ) {
      return [
        "⏱️ You have 2 hours. Try this:",
        "",
        "25 min — Learn",
        "5 min — Break",
        "25 min — Practice",
        "5 min — Break",
        "25 min — Practice again",
        "5 min — Break",
        "20 min — Review",
        "10 min — Final recall",
        "",
        "🔥 Keep the final 10 minutes for recalling everything without your notes.",
      ].join("\n");
    }

    if (
      text.includes("hello") ||
      text.includes("hi") ||
      text.includes("hey")
    ) {
      return [
        "👋 Hey! Ready to study?",
        "",
        "You can ask me things like:",
        "📚 Make me a study plan",
        "🧠 Help me revise",
        "💻 Help me with Python",
        "📐 Help me with Mathematics",
        "⚡ Help me with Physics",
        "🎯 Help me focus",
      ].join("\n");
    }

    return [
      "💡 I can help you with your study workflow.",
      "",
      ...studyQuestions.map(
        (item, index) => `${index + 1}️⃣ ${item}`
      ),
      "",
      "Tell me your subject or topic and I'll suggest a study approach.",
    ].join("\n");
  }

  function sendMessage(): void {
    const question = input.trim();

    if (question === "") {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: question,
    };

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      text: generateReply(question),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
  }
   function handleKeyDown(
  event: ReactKeyboardEvent<HTMLInputElement>
): void {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
}

  function clearChat(): void {
    setMessages([starterMessage]);
    setInput("");
  }

  return (
    <section
      className="mt-8 rounded-3xl border p-6"
      style={{
        background: "var(--sf-surface)",
        borderColor: "var(--sf-surface-soft)",
        boxShadow: "var(--sf-shadow)",
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p
            className="text-sm font-bold uppercase tracking-widest"
            style={{
              color: "var(--sf-secondary)",
            }}
          >
            AI STUDY ASSISTANT
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Your personal study companion 🤖
          </h2>

          <p
            className="mt-2 text-sm"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            Plan, practice, revise, and stay focused.
          </p>
        </div>

        <button
          type="button"
          onClick={clearChat}
          className="min-h-11 rounded-xl border px-4 py-2 text-sm font-bold"
          style={{
            borderColor: "var(--sf-surface-soft)",
            color: "var(--sf-text)",
          }}
        >
          Clear Chat
        </button>
      </div>

      <div
        className="mt-6 max-h-96 space-y-3 overflow-y-auto rounded-2xl p-4"
        style={{
          background: "var(--sf-bg)",
        }}
        aria-live="polite"
        aria-label="Study assistant conversation"
      >
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className="max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6"
                style={{
                  background: isUser
                    ? "var(--sf-primary)"
                    : "var(--sf-surface-soft)",
                  color: isUser
                    ? "var(--sf-bg)"
                    : "var(--sf-text)",
                }}
              >
                {message.text}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your studies..."
          aria-label="Ask the StudyForge assistant"
          className="min-h-12 flex-1 rounded-xl border px-4 outline-none"
          style={{
            background: "var(--sf-surface-soft)",
            borderColor: "var(--sf-surface-soft)",
            color: "var(--sf-text)",
          }}
        />

        <button
          type="button"
          onClick={sendMessage}
          disabled={input.trim() === ""}
          className="min-h-12 rounded-xl px-6 py-3 font-black disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: "var(--sf-primary)",
            color: "var(--sf-bg)",
          }}
        >
          Send ➤
        </button>
      </div>

      <p
        className="mt-3 text-xs"
        style={{
          color: "var(--sf-text-muted)",
        }}
      >
        StudyForge AI Assistant • Local MVP mode
      </p>
    </section>
  );
}
