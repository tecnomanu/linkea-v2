import { useEffect, useState } from "react";

/**
 * Hook that debounces a value.
 * Returns the debounced value after the specified delay.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook that tracks if a value is currently being debounced.
 * Returns [debouncedValue, isPending]
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Tuple of [debouncedValue, isPending]
 */
export function useDebounceWithPending<T>(
    value: T,
    delay: number = 300
): [T, boolean] {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        // If value is different from debounced, mark as pending immediately
        const isDifferent = value !== debouncedValue;
        if (isDifferent) {
            setIsPending(true);
        }

        const timer = setTimeout(() => {
            setDebouncedValue(value);
            setIsPending(false);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, delay]);

    return [debouncedValue, isPending];
}

