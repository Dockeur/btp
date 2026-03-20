import React from "react";

interface State { hasError: boolean; error?: Error; }

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 max-w-md w-full shadow-sm text-center">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-xl">!</span>
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-2">
              Une erreur est survenue
            </h2>
            <p className="text-xs text-gray-400 mb-6 font-mono break-all">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-Cprimary hover:bg-Csecondary1 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;