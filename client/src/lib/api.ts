/**
 * lib/api.ts - functions that talk to our server.
 *
 * Paths start with /api. In development, Vite forwards them to the Express
 * server (see vite.config.ts). Later stages add more functions here.
 */
import type { HealthReport } from "./health";

export async function fetchHealth(signal?: AbortSignal): Promise<HealthReport> {
  const response = await fetch("/api/health", { signal });

  if (!response.ok) {
    throw new Error(`The server answered with status ${response.status}`);
  }

  return (await response.json()) as HealthReport;
}
