import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-8">
          <div className="max-w-md text-center space-y-6">
            <div className="text-6xl font-mono font-bold text-[#0099ff]">
              404
            </div>
            <h1 className="text-xl font-mono text-white">
              Something went wrong
            </h1>
            <p className="font-mono text-sm text-gray-400">
              {"An unexpected error occurred. Please try reloading the page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="font-mono text-sm px-6 py-3 border-2 border-[#0099ff] text-[#0099ff] hover:bg-[#0099ff] hover:text-black transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
