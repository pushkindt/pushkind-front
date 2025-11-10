import React, { useEffect, useState } from "react";
import {
  dismissToast,
  registerToastListener,
  ToastMessage,
} from "../services/toast";

const typeStyles: Record<ToastMessage["type"], string> = {
  info: "border-slate-200 bg-white text-slate-900",
  error: "border-rose-200 bg-rose-50 text-rose-800",
};

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unregister = registerToastListener({
      onShow: (toast) => {
        setToasts((prev) => [...prev, toast]);
      },
      onDismiss: (toastId) => {
        setToasts((current) => current.filter((item) => item.id !== toastId));
      },
    });

    return unregister;
  }, []);

  const handleRemove = (id: string) => {
    dismissToast(id);
  };

  if (!toasts.length) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 pointer-events-none flex items-start justify-end p-4"
    >
      <div className="flex w-full max-w-xs flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all ${typeStyles[toast.type]}`}
          >
            <p className="text-sm leading-relaxed">{toast.message}</p>
            <button
              type="button"
              onClick={() => handleRemove(toast.id)}
              className="text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            >
              Закрыть
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
