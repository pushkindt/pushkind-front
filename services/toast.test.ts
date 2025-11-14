/**
 * @file toast.test.ts checks the toast pub/sub implementation.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { dismissToast, registerToastListener, showToast } from "./toast";

afterEach(() => {
  vi.clearAllTimers();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("toast service", () => {
  it("notifies listeners when showToast is called", () => {
    vi.useFakeTimers();
    const listener = vi.fn();
    const unregister = registerToastListener(listener);

    const toastId = showToast("Hello world");

    expect(listener).toHaveBeenCalledTimes(1);
    const toast = listener.mock.calls[0][0];
    expect(toast.id).toBe(toastId);
    expect(toast.message).toBe("Hello world");
    expect(toast.type).toBe("info");
    expect(toast.duration).toBeGreaterThan(0);

    unregister();
  });

  it("schedules dismissal after the toast duration", () => {
    vi.useFakeTimers();
    const onShow = vi.fn();
    const onDismiss = vi.fn();
    const unregister = registerToastListener({ onShow, onDismiss });

    showToast("Timed toast", "error");

    expect(onShow).toHaveBeenCalledTimes(1);
    const toast = onShow.mock.calls[0][0];

    vi.advanceTimersByTime(toast.duration - 1);
    expect(onDismiss).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith(toast.id);

    unregister();
  });

  it("stops notifying listeners once the cleanup function is called", () => {
    vi.useFakeTimers();
    const listener = vi.fn();
    const unregister = registerToastListener(listener);

    unregister();
    showToast("Should not notify");

    expect(listener).not.toHaveBeenCalled();
  });

  it("allows manual dismissal without scheduling duplicate notifications", () => {
    vi.useFakeTimers();
    const onShow = vi.fn();
    const onDismiss = vi.fn();
    const unregister = registerToastListener({ onShow, onDismiss });

    showToast("Manual close");
    const toast = onShow.mock.calls[0][0];

    vi.advanceTimersByTime(toast.duration / 2);
    dismissToast(toast.id);

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith(toast.id);

    vi.runOnlyPendingTimers();
    expect(onDismiss).toHaveBeenCalledTimes(1);

    unregister();
  });
});
