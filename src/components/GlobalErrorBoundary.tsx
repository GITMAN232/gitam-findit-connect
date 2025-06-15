
import React from "react";

/**
 * GlobalErrorBoundary catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  errorInfo: string | null;
}

class GlobalErrorBoundary extends React.Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Optionally log error to an analytics service here
    console.error("Error Boundary caught:", error, errorInfo);
  }

  handleReload = () => {
    // Simple reload; could also try a reset logic if desirable
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-white">
          <div className="max-w-xl bg-red-50 border border-red-200 rounded-xl p-10 flex flex-col items-center shadow-lg">
            <div className="text-6xl mb-4">🚨</div>
            <h1 className="text-2xl font-bold text-maroon mb-2">
              Oops! Something went wrong.
            </h1>
            <p className="text-gray-700 text-center mb-4">
              Sorry, an unexpected error occurred. Please try refreshing the page.
            </p>
            {this.state.errorInfo && (
              <details className="mb-6 text-sm bg-gray-100 p-4 rounded-lg border">
                {this.state.errorInfo}
              </details>
            )}
            <button
              onClick={this.handleReload}
              className="bg-maroon text-white px-4 py-2 rounded-md shadow hover:bg-maroon/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default GlobalErrorBoundary;
