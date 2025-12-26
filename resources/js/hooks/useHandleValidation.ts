import { sanitizeHandle, validateHandle } from "@/utils/handle";
import { useCallback, useEffect, useRef, useState } from "react";

export type HandleStatus = "idle" | "checking" | "available" | "taken" | "invalid";

interface UseHandleValidationOptions {
    /** Initial handle value */
    initialValue?: string;
    /** Minimum length before triggering async validation */
    minLengthForCheck?: number;
    /** Debounce delay in ms */
    debounceMs?: number;
    /** Whether to check availability via API (default: true) */
    checkAvailability?: boolean;
    /** Current handle to exclude from availability check (for edit mode) */
    currentHandle?: string;
}

interface UseHandleValidationReturn {
    /** Current sanitized handle value */
    value: string;
    /** Validation status */
    status: HandleStatus;
    /** Validation/status message */
    message: string;
    /** Whether the handle is valid for submission */
    isValid: boolean;
    /** Handle input change */
    onChange: (rawValue: string) => void;
    /** Set value directly (sanitized) */
    setValue: (value: string) => void;
    /** Reset to initial state */
    reset: () => void;
}

/**
 * Hook for handle/username validation with async availability check.
 * Encapsulates sanitization, format validation, and API availability check.
 */
export function useHandleValidation(
    options: UseHandleValidationOptions = {}
): UseHandleValidationReturn {
    const {
        initialValue = "",
        minLengthForCheck = 3,
        debounceMs = 500,
        checkAvailability = true,
        currentHandle,
    } = options;

    const [value, setValueState] = useState(() => sanitizeHandle(initialValue));
    const [status, setStatus] = useState<HandleStatus>("idle");
    const [message, setMessage] = useState("");
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

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

    // Check availability via API
    const checkUsernameAvailability = useCallback(
        async (handle: string) => {
            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Skip check if it's the current handle (edit mode)
            if (currentHandle && handle === sanitizeHandle(currentHandle)) {
                setStatus("available");
                setMessage("Tu nombre actual");
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
                });

                const result = await response.json();

                if (controller.signal.aborted) return;

                if (result.data?.available) {
                    setStatus("available");
                    setMessage(result.data.message || "Disponible");
                } else {
                    const isTaken = !result.data?.message?.includes("caracteres");
                    setStatus(isTaken ? "taken" : "invalid");
                    setMessage(result.data?.message || "No disponible");
                }
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    return; // Ignore abort errors
                }
                // On network error, fall back to format validation
                setStatus("idle");
                setMessage("");
            }
        },
        [currentHandle]
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
                setMessage("Verificando...");

                debounceRef.current = setTimeout(() => {
                    checkUsernameAvailability(sanitized);
                }, debounceMs);
            } else {
                // Just format validation
                setStatus("available");
                setMessage("Formato valido");
            }
        },
        [checkAvailability, checkUsernameAvailability, debounceMs, minLengthForCheck]
    );

    // Set value directly (already sanitized)
    const setValue = useCallback(
        (newValue: string) => {
            const sanitized = sanitizeHandle(newValue);
            setValueState(sanitized);

            if (sanitized.length >= minLengthForCheck) {
                const formatValidation = validateHandle(sanitized);
                if (formatValidation.valid) {
                    if (checkAvailability) {
                        setStatus("checking");
                        checkUsernameAvailability(sanitized);
                    } else {
                        setStatus("available");
                        setMessage("Formato valido");
                    }
                } else {
                    setStatus("invalid");
                    setMessage(formatValidation.message);
                }
            }
        },
        [checkAvailability, checkUsernameAvailability, minLengthForCheck]
    );

    // Reset to initial state
    const reset = useCallback(() => {
        setValueState(sanitizeHandle(initialValue));
        setStatus("idle");
        setMessage("");
    }, [initialValue]);

    const isValid = status === "available";

    return {
        value,
        status,
        message,
        isValid,
        onChange,
        setValue,
        reset,
    };
}

