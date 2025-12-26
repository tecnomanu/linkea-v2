import { sanitizeHandle, validateHandle } from "@/utils/handle";
import { useCallback, useEffect, useRef, useState } from "react";

export type HandleStatus = 
    | "idle" 
    | "checking" 
    | "available" 
    | "taken" 
    | "invalid"
    | "current"; // The user's own current handle

interface UseHandleValidationOptions {
    /** Initial handle value (the user's current handle) */
    initialValue?: string;
    /** Minimum length before triggering async validation */
    minLengthForCheck?: number;
    /** Debounce delay in ms */
    debounceMs?: number;
    /** Whether to check availability via API (default: true) */
    checkAvailability?: boolean;
}

interface UseHandleValidationReturn {
    /** Current sanitized handle value */
    value: string;
    /** The original/saved handle value */
    originalValue: string;
    /** Validation status */
    status: HandleStatus;
    /** Validation/status message */
    message: string;
    /** Whether the handle is valid for submission (available or current) */
    isValid: boolean;
    /** Whether the value has changed from original */
    hasChanged: boolean;
    /** Whether the change can be saved (valid and changed) */
    canSave: boolean;
    /** Handle input change */
    onChange: (rawValue: string) => void;
    /** Reset to original value */
    reset: () => void;
    /** Confirm the change (call this after successful save) */
    confirm: () => void;
}

/**
 * Hook for handle/username validation with async availability check.
 * Tracks original value and only allows saving valid changes.
 */
export function useHandleValidation(
    options: UseHandleValidationOptions = {}
): UseHandleValidationReturn {
    const {
        initialValue = "",
        minLengthForCheck = 3,
        debounceMs = 500,
        checkAvailability = true,
    } = options;

    // Sanitize and store the initial value - only set once on mount
    const sanitizedInitial = sanitizeHandle(initialValue);
    const originalRef = useRef<string>(sanitizedInitial);
    const isInitializedRef = useRef(false);
    
    const [value, setValueState] = useState(sanitizedInitial);
    const [status, setStatus] = useState<HandleStatus>(() => {
        // Start with "current" if initial value is valid
        if (sanitizedInitial.length >= minLengthForCheck) {
            const formatValidation = validateHandle(sanitizedInitial);
            if (formatValidation.valid) {
                return "current";
            }
        }
        return "idle";
    });
    const [message, setMessage] = useState("");
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Initialize only once when initialValue becomes available
    useEffect(() => {
        if (isInitializedRef.current) return;
        
        const sanitized = sanitizeHandle(initialValue);
        if (sanitized.length > 0) {
            isInitializedRef.current = true;
            originalRef.current = sanitized;
            setValueState(sanitized);
            
            if (sanitized.length >= minLengthForCheck) {
                const formatValidation = validateHandle(sanitized);
                if (formatValidation.valid) {
                    setStatus("current");
                    setMessage("");
                }
            }
        }
    }, [initialValue, minLengthForCheck]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // Check if handle matches original (case-insensitive, sanitized)
    const isOriginalHandle = useCallback((handle: string): boolean => {
        const sanitized = sanitizeHandle(handle);
        const original = originalRef.current;
        return sanitized.toLowerCase() === original.toLowerCase();
    }, []);

    // Check availability via API
    const checkUsernameAvailability = useCallback(
        async (handle: string) => {
            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Double-check if it's the original handle
            if (isOriginalHandle(handle)) {
                setStatus("current");
                setMessage("");
                return;
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            try {
                const response = await fetch("/api/auth/check-username", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ username: handle }),
                    signal: controller.signal,
                    credentials: "same-origin", // Include session cookies
                });

                const result = await response.json();

                if (controller.signal.aborted) return;

                if (result.data?.available) {
                    setStatus("available");
                    setMessage("Disponible");
                } else {
                    const isTaken = !result.data?.message?.includes("caracteres");
                    setStatus(isTaken ? "taken" : "invalid");
                    setMessage(result.data?.message || "No disponible");
                }
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    return;
                }
                // On network error, assume valid format is enough
                setStatus("available");
                setMessage("");
            }
        },
        [isOriginalHandle]
    );

    // Handle value change with sanitization and validation
    const onChange = useCallback(
        (rawValue: string) => {
            const sanitized = sanitizeHandle(rawValue);
            setValueState(sanitized);

            // Clear pending debounce
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            // If back to original, mark as current immediately
            if (isOriginalHandle(sanitized)) {
                setStatus("current");
                setMessage("");
                return;
            }

            // Basic format validation first
            const formatValidation = validateHandle(sanitized);

            if (sanitized.length < minLengthForCheck) {
                setStatus("idle");
                setMessage("");
                return;
            }

            if (!formatValidation.valid) {
                setStatus("invalid");
                setMessage(formatValidation.message);
                return;
            }

            // If availability check is enabled, show checking state and debounce API call
            if (checkAvailability) {
                setStatus("checking");
                setMessage("");

                debounceRef.current = setTimeout(() => {
                    checkUsernameAvailability(sanitized);
                }, debounceMs);
            } else {
                setStatus("available");
                setMessage("");
            }
        },
        [checkAvailability, checkUsernameAvailability, debounceMs, minLengthForCheck, isOriginalHandle]
    );

    // Reset to original value
    const reset = useCallback(() => {
        setValueState(originalRef.current);
        setStatus("current");
        setMessage("");
    }, []);

    // Confirm the change (update original after successful save)
    const confirm = useCallback(() => {
        originalRef.current = value;
        setStatus("current");
        setMessage("");
    }, [value]);

    const hasChanged = !isOriginalHandle(value);
    const isValid = status === "available" || status === "current";
    const canSave = hasChanged && status === "available";

    return {
        value,
        originalValue: originalRef.current,
        status,
        message,
        isValid,
        hasChanged,
        canSave,
        onChange,
        reset,
        confirm,
    };
}
