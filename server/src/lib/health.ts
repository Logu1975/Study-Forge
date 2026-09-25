/**
 * health.ts - builds the "is the app working?" report.
 *
 * This file is deliberately plain functions with no Express code, so it is
 * easy to read and easy to test. The Diagnostics page (Bug Finder, Stage 8)
 * will grow from this: each new check just adds one more entry to `checks`.
 */

export type CheckStatus = "ok" | "error" | "not_configured";

export interface HealthChecks {
  api: CheckStatus;
  database: CheckStatus;
}

export interface HealthReport {
  status: "ok" | "degraded";
  app: string;
  version: string;
  time: string;
  uptimeSeconds: number;
  checks: HealthChecks;
}

/** "degraded" if any check reports an error. "not_configured" is not an error. */
export function summarizeStatus(checks: HealthChecks): HealthReport["status"] {
  return Object.values(checks).includes("error") ? "degraded" : "ok";
}

interface BuildOptions {
  version: string;
  now?: Date;
  uptimeSeconds?: number;
}

export function buildHealthReport({
  version,
  now = new Date(),
  uptimeSeconds = process.uptime(),
}: BuildOptions): HealthReport {
  // The database is added in Stage 2, so for now it is "not_configured".
  const checks: HealthChecks = { api: "ok", database: "not_configured" };

  return {
    status: summarizeStatus(checks),
    app: "StudyForge API",
    version,
    time: now.toISOString(),
    uptimeSeconds: Math.floor(uptimeSeconds),
    checks,
  };
}
