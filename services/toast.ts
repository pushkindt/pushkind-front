export type ToastType = "info" | "error";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

const TOAST_DURATION_MS = 4000;

const listeners = new Set<(toast: ToastMessage) => void>();

const createToastId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const showToast = (message: string, type: ToastType = "info") => {
  const toast: ToastMessage = {
    id: createToastId(),
    message,
    type,
    duration: TOAST_DURATION_MS,
  };
  listeners.forEach((listener) => listener(toast));
};

export const registerToastListener = (
  listener: (toast: ToastMessage) => void,
) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
