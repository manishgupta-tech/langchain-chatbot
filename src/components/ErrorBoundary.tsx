import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy-900 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass rounded-3xl p-8 text-center space-y-6 border border-red-500/20 shadow-2xl shadow-red-500/5">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="text-red-500" size={32} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Something went wrong</h1>
              <p className="text-[var(--text-secondary)] text-sm">
                An unexpected error occurred. We've been notified and are looking into it.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-black/5 dark:bg-black/40 rounded-xl p-4 text-left overflow-auto max-h-32">
                <code className="text-xs text-red-500 dark:text-red-400 font-mono">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-primary)] rounded-xl transition-all border border-[var(--border-color)]"
              >
                <RefreshCcw size={18} />
                <span>Retry</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20"
              >
                <Home size={18} />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
