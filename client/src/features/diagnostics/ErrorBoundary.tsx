
import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: "",
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || "An unexpected error occurred.",
    };
  }

  componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo
  ): void {
    console.error("StudyForge Bug Shield caught an error:", error);
    console.error("Component error details:", errorInfo);

    try {
      const existingErrors = JSON.parse(
        localStorage.getItem("studyforge_bug_reports") || "[]"
      );

      const bugReport = {
        id: Date.now(),
        message: error.message || "Unknown error",
        timestamp: new Date().toISOString(),
        source: "React Error Boundary",
      };

      localStorage.setItem(
        "studyforge_bug_reports",
        JSON.stringify([
          ...existingErrors,
          bugReport,
        ])
      );
    } catch {
      console.error("Bug Shield could not save the error report.");
    }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      errorMessage: "",
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main
        className="flex min-h-screen items-center justify-center p-6"
        style={{
          background: "var(--sf-bg)",
          color: "var(--sf-text)",
        }}
      >
        <section
          className="w-full max-w-xl rounded-3xl border p-8 text-center"
          style={{
            background: "var(--sf-surface)",
            borderColor: "var(--sf-danger)",
            boxShadow: "var(--sf-shadow)",
          }}
        >
          <div className="text-6xl" aria-hidden="true">
            🛡️
          </div>

          <p
            className="mt-4 text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--sf-danger)" }}
          >
            BUG SHIELD ACTIVATED
          </p>

          <h1 className="mt-3 text-3xl font-black">
            StudyForge protected your session
          </h1>

          <p
            className="mt-4"
            style={{ color: "var(--sf-text-muted)" }}
          >
            Something unexpected happened, but your StudyForge
            session is still protected.
          </p>

          <div
            className="mt-5 rounded-2xl p-4 text-left text-sm"
            style={{ background: "var(--sf-surface-soft)" }}
          >
            <p className="font-bold">Detected issue</p>

            <p
              className="mt-2 break-words"
              style={{ color: "var(--sf-text-muted)" }}
            >
              {this.state.errorMessage}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="min-h-11 rounded-xl px-6 py-3 font-black"
              style={{
                background: "var(--sf-primary)",
                color: "var(--sf-bg)",
              }}
            >
              🔄 Try Again
            </button>

            <button
              type="button"
              onClick={this.handleReload}
              className="min-h-11 rounded-xl border px-6 py-3 font-black"
              style={{
                borderColor: "var(--sf-surface-soft)",
                color: "var(--sf-text)",
              }}
            >
              ↻ Reload StudyForge
            </button>
          </div>
        </section>
      </main>
    );
  }
}

