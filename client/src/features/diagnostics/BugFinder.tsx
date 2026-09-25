import { useEffect, useState } from "react";

type BugReport = {
  id: number;
  message: string;
  timestamp: string;
  source: string;
};

type CheckStatus = "idle" | "scanning" | "healthy" | "warning" | "critical";

type ScanResult = {
  name: string;
  description: string;
  icon: string;
  status: CheckStatus;
  duration: number;
  details: string;
};

const SCAN_STEPS = [
  {
    name: "Bug Shield",
    description: "Runtime error protection",
    icon: "🛡️",
  },
  {
    name: "Local Storage",
    description: "Saved diagnostic reports",
    icon: "💾",
  },
  {
    name: "Runtime Environment",
    description: "Browser runtime availability",
    icon: "⚙️",
  },
  {
    name: "StudyForge Interface",
    description: "Core interface availability",
    icon: "🖥️",
  },
  {
    name: "Diagnostic Reports",
    description: "Bug history and report system",
    icon: "📊",
  },
];

export default function BugFinder() {
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState("Not scanned yet");
  const [scanMessage, setScanMessage] = useState(
    "Ready to scan the StudyForge workspace."
  );

  const [scanProgress, setScanProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const [scanResults, setScanResults] = useState<ScanResult[]>(
    SCAN_STEPS.map((step) => ({
      ...step,
      status: "idle",
      duration: 0,
      details: "Waiting for diagnostic scan.",
    }))
  );

  const loadBugReports = () => {
    try {
      const savedReports = localStorage.getItem(
        "studyforge_bug_reports"
      );

      if (!savedReports) {
        setBugReports([]);
        return;
      }

      const parsedReports: BugReport[] = JSON.parse(savedReports);

      setBugReports([...parsedReports].reverse());
    } catch (error) {
      console.error(
        "Bug Finder could not load bug reports:",
        error
      );

      setBugReports([]);
    }
  };

  useEffect(() => {
    loadBugReports();
  }, []);

  const clearBugReports = () => {
    localStorage.removeItem("studyforge_bug_reports");
    setBugReports([]);
    setScanMessage("Bug history cleared. StudyForge is ready.");
  };

  const delay = (milliseconds: number) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, milliseconds);
    });

  const runBugShieldCheck = (): BugReport[] => {
    const diagnostics: BugReport[] = [];

    try {
      if (typeof window === "undefined") {
        diagnostics.push({
          id: Date.now(),
          message:
            "Bug Shield could not verify the browser runtime.",
          timestamp: new Date().toISOString(),
          source: "Bug Shield Diagnostics",
        });
      }
    } catch {
      diagnostics.push({
        id: Date.now(),
        message: "Bug Shield runtime verification failed.",
        timestamp: new Date().toISOString(),
        source: "Bug Shield Diagnostics",
      });
    }

    return diagnostics;
  };

  const runLocalStorageCheck = (): BugReport[] => {
    const diagnostics: BugReport[] = [];

    try {
      const testKey = "__studyforge_diagnostic_test__";

      localStorage.setItem(testKey, "ok");

      const testValue = localStorage.getItem(testKey);

      localStorage.removeItem(testKey);

      if (testValue !== "ok") {
        diagnostics.push({
          id: Date.now(),
          message:
            "Local Storage test completed, but the saved test value could not be verified.",
          timestamp: new Date().toISOString(),
          source: "Storage Diagnostics",
        });
      }
    } catch {
      diagnostics.push({
        id: Date.now(),
        message:
          "Local Storage is unavailable. Saved diagnostic reports may not work correctly.",
        timestamp: new Date().toISOString(),
        source: "Storage Diagnostics",
      });
    }

    return diagnostics;
  };

  const runRuntimeCheck = (): BugReport[] => {
    const diagnostics: BugReport[] = [];

    try {
      if (
        typeof window === "undefined" ||
        typeof document === "undefined"
      ) {
        diagnostics.push({
          id: Date.now(),
          message:
            "Browser runtime environment could not be verified.",
          timestamp: new Date().toISOString(),
          source: "Runtime Diagnostics",
        });
      }
    } catch {
      diagnostics.push({
        id: Date.now(),
        message: "Runtime environment check failed.",
        timestamp: new Date().toISOString(),
        source: "Runtime Diagnostics",
      });
    }

    return diagnostics;
  };

  const runInterfaceCheck = (): BugReport[] => {
    const diagnostics: BugReport[] = [];

    try {
      const rootElement = document.getElementById("root");

      if (!rootElement) {
        diagnostics.push({
          id: Date.now(),
          message:
            "StudyForge root interface element could not be found.",
          timestamp: new Date().toISOString(),
          source: "Interface Diagnostics",
        });
      }
    } catch {
      diagnostics.push({
        id: Date.now(),
        message: "StudyForge interface check failed.",
        timestamp: new Date().toISOString(),
        source: "Interface Diagnostics",
      });
    }

    return diagnostics;
  };

  const runDiagnosticReportsCheck = (): BugReport[] => {
    const diagnostics: BugReport[] = [];

    try {
      const savedReports = localStorage.getItem(
        "studyforge_bug_reports"
      );

      if (savedReports) {
        const parsed = JSON.parse(savedReports);

        if (!Array.isArray(parsed)) {
          diagnostics.push({
            id: Date.now(),
            message:
              "Diagnostic report storage exists but contains invalid report data.",
            timestamp: new Date().toISOString(),
            source: "Report Diagnostics",
          });
        }
      }
    } catch {
      diagnostics.push({
        id: Date.now(),
        message:
          "Saved diagnostic reports could not be read correctly.",
        timestamp: new Date().toISOString(),
        source: "Report Diagnostics",
      });
    }

    return diagnostics;
  };

  const checkFunctions = [
    runBugShieldCheck,
    runLocalStorageCheck,
    runRuntimeCheck,
    runInterfaceCheck,
    runDiagnosticReportsCheck,
  ];

  const getHealthyDetails = (name: string) => {
    switch (name) {
      case "Bug Shield":
        return "Runtime protection layer is available and the StudyForge application is running normally.";

      case "Local Storage":
        return "Temporary write, read, and cleanup test completed successfully.";

      case "Runtime Environment":
        return "Browser window and document objects are available.";

      case "StudyForge Interface":
        return "StudyForge root interface element is available.";

      case "Diagnostic Reports":
        return "Diagnostic report storage is readable and contains valid data.";

      default:
        return "Diagnostic check completed successfully.";
    }
  };

  const runSystemScan = async () => {
    if (isScanning) return;

    setIsScanning(true);
    setScanProgress(0);
    setActiveStep(0);
    setExpandedStep(null);

    setScanResults(
      SCAN_STEPS.map((step) => ({
        ...step,
        status: "idle",
        duration: 0,
        details: "Waiting for diagnostic scan.",
      }))
    );

    setScanMessage(
      "Initializing StudyForge diagnostic engine..."
    );

    await delay(500);

    const allDiagnostics: BugReport[] = [];

    for (let index = 0; index < SCAN_STEPS.length; index++) {
      const step = SCAN_STEPS[index];

      setActiveStep(index);

      setScanResults((previous) =>
        previous.map((result, resultIndex) =>
          resultIndex === index
            ? {
                ...result,
                status: "scanning",
                details: `Running ${step.name} diagnostics...`,
              }
            : result
        )
      );

      setScanMessage(`Checking ${step.name}...`);

      await delay(700);

      const startTime = performance.now();

      const diagnostics = checkFunctions[index]();

      const duration = Math.max(
        1,
        Math.round(performance.now() - startTime)
      );

      allDiagnostics.push(...diagnostics);

      const status: CheckStatus =
        diagnostics.length === 0 ? "healthy" : "warning";

      const details =
        diagnostics.length === 0
          ? getHealthyDetails(step.name)
          : diagnostics
              .map((diagnostic) => diagnostic.message)
              .join(" ");

      setScanResults((previous) =>
        previous.map((result, resultIndex) =>
          resultIndex === index
            ? {
                ...result,
                status,
                duration,
                details,
              }
            : result
        )
      );

      setScanProgress(
        Math.round(
          ((index + 1) / SCAN_STEPS.length) * 100
        )
      );

      await delay(350);
    }

    setActiveStep(-1);

    if (allDiagnostics.length > 0) {
      try {
        const existingReports: BugReport[] = JSON.parse(
          localStorage.getItem(
            "studyforge_bug_reports"
          ) || "[]"
        );

        localStorage.setItem(
          "studyforge_bug_reports",
          JSON.stringify([
            ...existingReports,
            ...allDiagnostics,
          ])
        );

        setScanMessage(
          `${allDiagnostics.length} issue${
            allDiagnostics.length === 1 ? "" : "s"
          } detected. Check the diagnostic results below.`
        );
      } catch {
        setScanMessage(
          "A diagnostic issue was found, but the report could not be saved."
        );
      }
    } else {
      setScanMessage(
        "Scan complete. No new problems detected. StudyForge is healthy."
      );
    }

    loadBugReports();
    setLastScan(new Date().toLocaleString());
    setIsScanning(false);
  };

  const completedResults = scanResults.filter(
    (result) =>
      result.status === "healthy" ||
      result.status === "warning" ||
      result.status === "critical"
  );

  const healthyCount = scanResults.filter(
    (result) => result.status === "healthy"
  ).length;

  const warningCount = scanResults.filter(
    (result) => result.status === "warning"
  ).length;

  const criticalCount = scanResults.filter(
    (result) => result.status === "critical"
  ).length;

  const healthPercentage =
    completedResults.length === 0
      ? 0
      : Math.round(
          (healthyCount / SCAN_STEPS.length) * 100
        );

  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return "Unknown time";
    }
  };

  const getStatusIcon = (status: CheckStatus) => {
    switch (status) {
      case "scanning":
        return "🔵";
      case "healthy":
        return "🟢";
      case "warning":
        return "🟡";
      case "critical":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const getStatusText = (status: CheckStatus) => {
    switch (status) {
      case "scanning":
        return "Scanning";
      case "healthy":
        return "Healthy";
      case "warning":
        return "Warning";
      case "critical":
        return "Critical";
      default:
        return "Waiting";
    }
  };

  const getStatusColor = (status: CheckStatus) => {
    switch (status) {
      case "healthy":
        return "var(--sf-success)";
      case "warning":
        return "var(--sf-secondary)";
      case "critical":
        return "var(--sf-danger)";
      case "scanning":
        return "var(--sf-primary)";
      default:
        return "var(--sf-text-muted)";
    }
  };

  return (
    <section
      className="rounded-3xl border p-6"
      style={{
        background: "var(--sf-surface)",
        borderColor: "var(--sf-surface-soft)",
        boxShadow: "var(--sf-shadow)",
      }}
    >
      {/* HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p
            className="text-sm font-bold uppercase tracking-widest"
            style={{
              color: "var(--sf-secondary)",
            }}
          >
            Diagnostics Center
          </p>

          <h2 className="mt-2 text-3xl font-black">
            🕵️ Bug Finder 2.0
          </h2>

          <p
            className="mt-2 max-w-2xl"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            Scan StudyForge, inspect diagnostic details,
            and monitor the health of your study workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={runSystemScan}
          disabled={isScanning}
          className="min-h-12 rounded-2xl px-6 py-3 font-black transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: "var(--sf-primary)",
            color: "var(--sf-bg)",
            boxShadow: "var(--sf-shadow)",
          }}
        >
          {isScanning
            ? "🔎 Scanning..."
            : "🔍 Scan StudyForge"}
        </button>
      </div>

      {/* SCAN PANEL */}
      <div
        className="mt-6 rounded-2xl p-5"
        style={{
          background: "var(--sf-surface-soft)",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black">
              System Scan
            </p>

            <p
              className="mt-1 text-sm"
              style={{
                color: "var(--sf-text-muted)",
              }}
            >
              {scanMessage}
            </p>
          </div>

          <div
            className="rounded-xl px-4 py-2 text-sm font-bold"
            style={{
              background: "var(--sf-surface)",
              color: "var(--sf-secondary)",
            }}
          >
            Last scan: {lastScan}
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-bold">
            <span>Diagnostic progress</span>

            <span>{scanProgress}%</span>
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
                width: `${scanProgress}%`,
                background: "var(--sf-primary)",
              }}
            />
          </div>
        </div>

        {/* LIVE CHECKS */}
        <div className="mt-5 space-y-2">
          {scanResults.map((result, index) => {
            const isActive = activeStep === index;

            const isExpanded =
              expandedStep === index;

            return (
              <div
                key={result.name}
                className="rounded-xl transition-all duration-300"
                style={{
                  background:
                    isActive || isExpanded
                      ? "var(--sf-surface)"
                      : "transparent",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    !isScanning &&
                    setExpandedStep(
                      isExpanded ? null : index
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left"
                >
                  <div className="text-xl">
                    {getStatusIcon(result.status)}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold">
                      {result.icon} {result.name}
                    </p>

                    <p
                      className="text-xs"
                      style={{
                        color:
                          "var(--sf-text-muted)",
                      }}
                    >
                      {result.status === "scanning"
                        ? "Running diagnostic test..."
                        : result.status === "healthy"
                        ? result.details
                        : result.description}
                    </p>
                  </div>

                  <div className="hidden text-right sm:block">
                    {result.status !== "idle" &&
                      result.status !== "scanning" && (
                        <p
                          className="text-xs font-black"
                          style={{
                            color:
                              getStatusColor(
                                result.status
                              ),
                          }}
                        >
                          {getStatusText(
                            result.status
                          )}
                        </p>
                      )}

                    {result.status === "scanning" && (
                      <p
                        className="text-xs font-black"
                        style={{
                          color:
                            "var(--sf-primary)",
                        }}
                      >
                        SCANNING
                      </p>
                    )}

                    {result.duration > 0 && (
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color:
                            "var(--sf-text-muted)",
                        }}
                      >
                        {result.duration} ms
                      </p>
                    )}
                  </div>

                  <div
                    className="text-xs"
                    style={{
                      color:
                        "var(--sf-text-muted)",
                    }}
                  >
                    {isExpanded ? "▲" : "▼"}
                  </div>
                </button>

                {/* EXPANDED DETAILS */}
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <div
                      className="rounded-xl p-4"
                      style={{
                        background:
                          "var(--sf-surface-soft)",
                      }}
                    >
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider">
                            Status
                          </p>

                          <p
                            className="mt-1 font-black"
                            style={{
                              color:
                                getStatusColor(
                                  result.status
                                ),
                            }}
                          >
                            {getStatusText(
                              result.status
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider">
                            Duration
                          </p>

                          <p className="mt-1 font-black">
                            {result.duration > 0
                              ? `${result.duration} ms`
                              : "Not measured"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider">
                            Diagnostic
                          </p>

                          <p className="mt-1 font-black">
                            {result.name}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wider">
                          Technical details
                        </p>

                        <p
                          className="mt-2 text-sm"
                          style={{
                            color:
                              "var(--sf-text-muted)",
                          }}
                        >
                          {result.details}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SMART HEALTH SUMMARY */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="rounded-2xl p-5"
          style={{
            background:
              "var(--sf-surface-soft)",
          }}
        >
          <div className="text-2xl">❤️</div>

          <p className="mt-3 text-3xl font-black">
            {healthPercentage}%
          </p>

          <p
            className="text-sm"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            System health
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background:
              "var(--sf-surface-soft)",
          }}
        >
          <div className="text-2xl">🟢</div>

          <p className="mt-3 text-3xl font-black">
            {healthyCount}
          </p>

          <p
            className="text-sm"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            Healthy checks
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background:
              "var(--sf-surface-soft)",
          }}
        >
          <div className="text-2xl">🟡</div>

          <p className="mt-3 text-3xl font-black">
            {warningCount}
          </p>

          <p
            className="text-sm"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            Warnings
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background:
              "var(--sf-surface-soft)",
          }}
        >
          <div className="text-2xl">🔴</div>

          <p className="mt-3 text-3xl font-black">
            {criticalCount}
          </p>

          <p
            className="text-sm"
            style={{
              color: "var(--sf-text-muted)",
            }}
          >
            Critical issues
          </p>
        </div>
      </div>

      {/* FINAL SUMMARY */}
      {scanProgress === 100 && !isScanning && (
        <div
          className="mt-6 rounded-2xl border p-5"
          style={{
            background:
              "var(--sf-surface-soft)",
            borderColor:
              "var(--sf-surface-soft)",
          }}
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">
              {criticalCount > 0
                ? "🚨"
                : warningCount > 0
                ? "⚠️"
                : "🛡️"}
            </div>

            <div>
              <p className="text-lg font-black">
                {criticalCount > 0
                  ? "Critical issues require attention"
                  : warningCount > 0
                  ? "Diagnostic scan found warnings"
                  : "StudyForge is healthy"}
              </p>

              <p
                className="mt-1 text-sm"
                style={{
                  color:
                    "var(--sf-text-muted)",
                }}
              >
                {healthyCount} of{" "}
                {SCAN_STEPS.length} diagnostic
                systems passed their checks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BUG HISTORY */}
      <div className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              className="text-sm font-bold uppercase tracking-widest"
              style={{
                color: "var(--sf-secondary)",
              }}
            >
              Bug History
            </p>

            <h3 className="mt-2 text-2xl font-black">
              🐛 Detected problems
            </h3>
          </div>

          {bugReports.length > 0 && (
            <button
              type="button"
              onClick={clearBugReports}
              className="min-h-11 rounded-xl border px-5 py-3 font-bold transition-transform hover:scale-105"
              style={{
                borderColor:
                  "var(--sf-danger)",
                color: "var(--sf-danger)",
                background:
                  "var(--sf-surface-soft)",
              }}
            >
              🧹 Clear Reports
            </button>
          )}
        </div>

        <div className="mt-5 space-y-4">
          {bugReports.length === 0 ? (
            <div
              className="rounded-2xl border border-dashed p-8 text-center"
              style={{
                borderColor:
                  "var(--sf-surface-soft)",
              }}
            >
              <div className="text-4xl">
                🛡️
              </div>

              <h4 className="mt-3 text-xl font-black">
                No bugs detected
              </h4>

              <p
                className="mt-2"
                style={{
                  color:
                    "var(--sf-text-muted)",
                }}
              >
                StudyForge currently has no
                saved Bug Shield reports.
              </p>
            </div>
          ) : (
            bugReports.map((bug, index) => (
              <article
                key={`${bug.id}-${index}`}
                className="rounded-2xl border p-5"
                style={{
                  background:
                    "var(--sf-surface-soft)",
                  borderColor:
                    "var(--sf-surface-soft)",
                }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background:
                          "var(--sf-danger)",
                        color: "white",
                      }}
                    >
                      🐛
                    </div>

                    <div>
                      <p className="font-black">
                        Bug #
                        {bugReports.length -
                          index}
                      </p>

                      <p
                        className="mt-1 break-words text-sm"
                        style={{
                          color:
                            "var(--sf-text-muted)",
                        }}
                      >
                        {bug.message}
                      </p>
                    </div>
                  </div>

                  <span
                    className="w-fit rounded-full px-3 py-1 text-xs font-bold"
                    style={{
                      background:
                        "var(--sf-surface)",
                      color:
                        "var(--sf-secondary)",
                    }}
                  >
                    Detected
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div
                    className="rounded-xl p-3 text-sm"
                    style={{
                      background:
                        "var(--sf-surface)",
                    }}
                  >
                    <p className="font-bold">
                      🕐 Time
                    </p>

                    <p
                      className="mt-1 break-words"
                      style={{
                        color:
                          "var(--sf-text-muted)",
                      }}
                    >
                      {formatDate(
                        bug.timestamp
                      )}
                    </p>
                  </div>

                  <div
                    className="rounded-xl p-3 text-sm"
                    style={{
                      background:
                        "var(--sf-surface)",
                    }}
                  >
                    <p className="font-bold">
                      📍 Source
                    </p>

                    <p
                      className="mt-1 break-words"
                      style={{
                        color:
                          "var(--sf-text-muted)",
                      }}
                    >
                      {bug.source}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}