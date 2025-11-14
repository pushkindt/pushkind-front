/**
 * @file index.tsx hydrates the React app and registers routing/providers.
 */
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { CartProvider } from "./contexts/CartContext";
import ErrorBoundary from "./components/ErrorBoundary";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Не удалось найти корневой элемент для монтирования");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 p-6">
            <div className="max-w-lg text-center space-y-4">
              <p className="text-lg font-semibold">Загрузка...</p>
              <p className="text-sm text-gray-600">
                Подождите немного, пока мы подготавливаем витрину.
              </p>
            </div>
          </div>
        }
      >
        <BrowserRouter>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
);
