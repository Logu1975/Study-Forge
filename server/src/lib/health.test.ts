import { describe, expect, it } from "vitest";
import { buildHealthReport, summarizeStatus } from "./health";

describe("summarizeStatus", () => {
  it("is ok when nothing has failed (not_configured is not a failure)", () => {
    expect(summarizeStatus({ api: "ok", database: "not_configured" })).toBe("ok");
  });

  it("is degraded when any check has an error", () => {
    expect(summarizeStatus({ api: "ok", database: "error" })).toBe("degraded");
  });
});

describe("buildHealthReport", () => {
  it("includes version, ISO time and whole-second uptime", () => {
    const report = buildHealthReport({
      version: "1.2.3",
      now: new Date("2026-01-01T00:00:00.000Z"),
      uptimeSeconds: 12.7,
    });

    expect(report.version).toBe("1.2.3");
    expect(report.time).toBe("2026-01-01T00:00:00.000Z");
    expect(report.uptimeSeconds).toBe(12);
    expect(report.status).toBe("ok");
  });
});
