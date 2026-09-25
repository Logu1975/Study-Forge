import { useEffect, useRef, useState } from "react";
import { addXP, recordFocusSession } from "./studyforgeStats";

const INITIAL_SECONDS = 25 * 60;
const XP_REWARD = 30;

export default function FocusTimer() {
  const [secondsLeft, setSecondsLeft] = useState<number>(INITIAL_SECONDS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);

  const xpAwardedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((currentSeconds) => {
        if (currentSeconds <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          setSessionFinished(true);

          if (!xpAwardedRef.current) {
            addXP(XP_REWARD);
            recordFocusSession(25);
            xpAwardedRef.current = true;
          }

          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isRunning]);

  function startTimer(): void {
    if (secondsLeft > 0) {
      setSessionFinished(false);
      setIsRunning(true);
    }
  }

  function pauseTimer(): void {
    setIsRunning(false);
  }

  function resetTimer(): void {
    setIsRunning(false);
    setSecondsLeft(INITIAL_SECONDS);
    setSessionFinished(false);
    xpAwardedRef.current = false;
  }

  function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  const progress =
    ((INITIAL_SECONDS - secondsLeft) / INITIAL_SECONDS) * 100;

  return (
    <section
      className="mt-8 rounded-3xl border p-6"
      style={{
        background: "var(--sf-surface)",
        borderColor: "var(--sf-surface-soft)",
        boxShadow: "var(--sf-shadow)",
      }}
    >
      <div className="text-center">
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: "var(--sf-secondary)" }}
        >
          FOCUS TIMER
        </p>

        <h2 className="mt-2 text-2xl font-black">
          25-Minute Focus Session
        </h2>

        <div
          className="mx-auto mt-6 text-6xl font-black tabular-nums"
          aria-live="polite"
          aria-label={`Time remaining ${formatTime(secondsLeft)}`}
        >
          {formatTime(secondsLeft)}
        </div>

        <div
          className="mx-auto mt-6 h-3 max-w-xl overflow-hidden rounded-full"
          style={{ background: "var(--sf-bg)" }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Focus session progress"
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              background: "var(--sf-primary)",
            }}
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {!isRunning ? (
            <button
              type="button"
              onClick={startTimer}
              disabled={secondsLeft === 0}
              className="min-h-11 rounded-xl px-6 py-3 font-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: "var(--sf-primary)",
                color: "var(--sf-bg)",
              }}
            >
              ▶ Start
            </button>
          ) : (
            <button
              type="button"
              onClick={pauseTimer}
              className="min-h-11 rounded-xl px-6 py-3 font-black transition-transform hover:scale-[1.02]"
              style={{
                background: "var(--sf-warning)",
                color: "var(--sf-bg)",
              }}
            >
              ⏸ Pause
            </button>
          )}

          <button
            type="button"
            onClick={resetTimer}
            className="min-h-11 rounded-xl border px-6 py-3 font-black transition-transform hover:scale-[1.02]"
            style={{
              borderColor: "var(--sf-surface-soft)",
              color: "var(--sf-text)",
            }}
          >
            ↻ Reset
          </button>
        </div>

        {sessionFinished && (
          <div
            className="mt-6 rounded-2xl p-4"
            style={{ background: "var(--sf-surface-soft)" }}
            role="status"
          >
            <p className="font-black">
              🎉 Focus session complete!
            </p>

            <p
              className="mt-1 text-sm"
              style={{ color: "var(--sf-text-muted)" }}
            >
              +{XP_REWARD} XP • +1 Focus Session • +25 minutes study time
            </p>
          </div>
        )}

        {!sessionFinished && (
          <p
            className="mt-5 text-sm"
            style={{ color: "var(--sf-text-muted)" }}
          >
            Complete the session to earn ⚡ {XP_REWARD} XP.
          </p>
        )}
      </div>
    </section>
  );
}