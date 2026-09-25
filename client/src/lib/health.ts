/**
 * lib/health.ts - types and wording for the server's health report.
 *
 * The HealthReport shape mirrors server/src/lib/health.ts. If you change one,
 * change the other. (See decision D5 in docs/architecture.md.)
 */

export type CheckStatus = "ok" | "error" | "not_configured";

export interface HealthReport {
  status: "ok" | "degraded";
  app: string;
  version: string;
  time: string;
  uptimeSeconds: number;
  checks: {
    api: CheckStatus;
    database: CheckStatus;
  };
}

const CHECK_LABELS: Record<CheckStatus, string> = {
  ok: "Working",
  error: "Problem",
  not_configured: "Not set up yet",
};

/** Plain-language label for a single check. */
export function checkLabel(status: CheckStatus): string {
  return CHECK_LABELS[status];
}

/** Plain-language headline for the whole report. */
export function overallHeadline(status: HealthReport["status"]): string {
  return status === "ok" ? "Everything is working" : "Something needs attention";
}
