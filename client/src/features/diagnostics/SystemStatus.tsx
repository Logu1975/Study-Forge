/**
 * SystemStatus.tsx - a small card that asks the server "are you OK?".
 *
 * It is the first example of the three states every data-loading component in
 * StudyForge must handle: loading, error, and ready (data arrived).
 * This folder grows into the Bug Finder "Diagnostics" page in Stage 8.
 */
import { useEffect, useState } from "react";
import { fetchHealth } from "../../lib/api";
import {
  checkLabel,
  overallHeadline,
  type CheckStatus,
  type HealthReport,
} from "../../lib/health";

type State =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; report: HealthReport };

const STATUS_ICONS: Record<CheckStatus, string> = { ok: "✓", error: "✕", not_configured: "○" };

const STATUS_STYLES: Record<CheckStatus, string> = {
  ok: "bg-emerald-950 text-emerald-200",
  error: "bg-rose-950 text-rose-200",
  not_configured: "bg-slate-800 text-slate-200",
};

// One shared look for buttons in this file. Stage 1 replaces it with a reusable Button component.
const BUTTON_CLASSES =
  "mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 " +
  "font-semibold text-white transition hover:bg-indigo-500 active:scale-95";

export function SystemStatus() {
  const [state, setState] = useState<State>({ kind: "loading" });
  // Changing this number re-runs the effect below, which is how "Try again" works.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ kind: "loading" });

    fetchHealth(controller.signal)
      .then((report) => setState({ kind: "ready", report }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return; // the component went away; ignore
        setState({
          kind: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      });

    // Cleanup: cancel the request if the component is removed mid-flight.
    return () => controller.abort();
  }, [attempt]);

  const retry = () => setAttempt((n) => n + 1);

  return (
    <section
      aria-labelledby="system-status-heading"
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
    >
      <h2 id="system-status-heading" className="text-lg font-semibold">
        System status
      </h2>

      <div className="mt-4">
        {state.kind === "loading" && (
          <div role="status" aria-live="polite">
            <span className="sr-only">Checking the server…</span>
            <div aria-hidden="true" className="space-y-3">
              <div className="h-6 w-2/3 animate-pulse rounded bg-slate-800 motion-reduce:animate-none" />
              <div className="h-12 animate-pulse rounded-xl bg-slate-800 motion-reduce:animate-none" />
              <div className="h-12 animate-pulse rounded-xl bg-slate-800 motion-reduce:animate-none" />
            </div>
          </div>
        )}

        {state.kind === "error" && (
          <div role="alert">
            <p className="font-semibold text-rose-300">We couldn't reach the server.</p>
            <p className="mt-2 text-slate-300">
              Make sure it is running (run <code className="rounded bg-slate-800 px-1.5 py-0.5">npm run dev</code>{" "}
              in the project folder), then try again.
            </p>
            <p className="mt-2 text-sm text-slate-400">Technical detail: {state.message}</p>
            <button type="button" onClick={retry} className={BUTTON_CLASSES}>
              Try again
            </button>
          </div>
        )}

        {state.kind === "ready" && (
          <div>
            <p
              className={`text-xl font-semibold ${
                state.report.status === "ok" ? "text-emerald-300" : "text-amber-300"
              }`}
            >
              {overallHeadline(state.report.status)}
            </p>

            <dl className="mt-4 divide-y divide-slate-800 rounded-xl border border-slate-800">
              <CheckRow name="API server" status={state.report.checks.api} />
              <CheckRow name="Database" status={state.report.checks.database} />
            </dl>

            <p className="mt-3 text-sm text-slate-400">
              Server version {state.report.version}, running for {state.report.uptimeSeconds} seconds.
            </p>

            <button type="button" onClick={retry} className={BUTTON_CLASSES}>
              Check again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/** One line in the list: a name on the left, a status badge on the right. */
function CheckRow({ name, status }: { name: string; status: CheckStatus }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="font-medium">{name}</dt>
      {/* The icon is decoration; the text label carries the meaning, so color is never the only signal. */}
      <dd className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[status]}`}>
        <span aria-hidden="true">{STATUS_ICONS[status]}</span>
        {checkLabel(status)}
      </dd>
    </div>
  );
}
