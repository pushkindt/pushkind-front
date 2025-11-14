/**
 * @file ErrorBoundary.tsx catches render-time errors and surfaces a friendly
 * fallback UI.
 */
import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Class-based boundary used to prevent the entire app from unmounting when a
 * render-time exception occurs.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Unhandled error caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 p-6">
          <div className="max-w-lg text-center space-y-4">
            <p className="text-xl font-semibold">Что-то пошло не так.</p>
            <p className="text-sm text-gray-600">
              Мы зафиксировали сбой и пытаемся восстановиться. Пожалуйста,
              попробуйте обновить страницу.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Перезагрузить
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
