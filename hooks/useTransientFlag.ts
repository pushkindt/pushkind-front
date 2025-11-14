/**
 * @file useTransientFlag.ts toggles a boolean state for a set duration.
 */
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_DURATION = 1000;

/**
 * Provides a boolean flag that automatically resets after `duration` ms.
 */
const useTransientFlag = (duration: number = DEFAULT_DURATION) => {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Activates the transient flag, resetting the timer if necessary. */
  const activate = useCallback(() => {
    setIsActive(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
      timeoutRef.current = null;
    }, duration);
  }, [duration]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isActive, activate } as const;
};

export default useTransientFlag;
