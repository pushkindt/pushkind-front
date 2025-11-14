/**
 * @file toast.ts provides a tiny pub/sub toast notification service.
 */

export type ToastType = "info" | "error";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export interface ToastSubscription {
  onShow: (toast: ToastMessage) => void;
  onDismiss?: (toastId: string) => void;
}

const TOAST_DURATION_MS = 4000;

const listeners = new Set<ToastSubscription>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

/** Generates a reasonably unique toast id. */
const createToastId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

/** Notifies all listeners about a new toast. */
const notifyShow = (toast: ToastMessage) => {
  listeners.forEach((listener) => {
    listener.onShow(toast);
  });
};

/** Notifies listeners that a toast has been dismissed. */
const notifyDismiss = (toastId: string) => {
  listeners.forEach((listener) => {
    listener.onDismiss?.(toastId);
  });
};

/** Publishes a toast message to all listeners. */
export const showToast = (message: string, type: ToastType = "info") => {
  const toast: ToastMessage = {
    id: createToastId(),
    message,
    type,
    duration: TOAST_DURATION_MS,
  };

  notifyShow(toast);

  const timeoutId = globalThis.setTimeout(() => {
    timers.delete(toast.id);
    notifyDismiss(toast.id);
  }, toast.duration);

  timers.set(toast.id, timeoutId);

  return toast.id;
};

/** Dismisses a toast early and clears its timer. */
export const dismissToast = (toastId: string) => {
  const timeoutId = timers.get(toastId);
  if (timeoutId) {
    globalThis.clearTimeout(timeoutId);
    timers.delete(toastId);
  }

  notifyDismiss(toastId);
};

/** Registers a listener for toast show/dismiss events. */
export const registerToastListener = (
  listener: ToastSubscription | ToastSubscription["onShow"],
) => {
  const subscription: ToastSubscription =
    typeof listener === "function" ? { onShow: listener } : listener;

  listeners.add(subscription);

  return () => {
    listeners.delete(subscription);
  };
};
