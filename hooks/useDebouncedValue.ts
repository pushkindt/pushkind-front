/**
 * @file useDebouncedValue.ts delays propagating rapidly changing values until
 * the caller stops updating them for the specified delay.
 */
import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of the provided value.
 *
 * @param value - Source value to debounce.
 * @param delay - Delay in milliseconds before updating the debounced value.
 */
const useDebouncedValue = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
};

export default useDebouncedValue;
