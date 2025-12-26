/**
 * Handle/Username validation and sanitization utilities.
 * Mirrors backend validation in StringHelper.php
 */

export const HANDLE_MIN_LENGTH = 3;
export const HANDLE_MAX_LENGTH = 30;
export const HANDLE_PATTERN = /^[a-z0-9_-]+$/;

/**
 * Sanitize handle input - removes invalid characters.
 * NOTE: Dots (.) are NOT allowed - they cause routing issues.
 */
export function sanitizeHandle(value: string): string {
    return value
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/[^a-z0-9_-]/g, "") // Remove invalid chars (NO dots)
        .replace(/-{2,}/g, "-") // No consecutive hyphens
        .replace(/_{2,}/g, "_") // No consecutive underscores
        .slice(0, HANDLE_MAX_LENGTH);
}

/**
 * Validate handle format.
 * Returns object with valid flag and message.
 */
export function validateHandle(handle: string): {
    valid: boolean;
    message: string;
} {
    const normalized = handle.replace(/^@/, "").toLowerCase();

    if (!normalized) {
        return { valid: false, message: "El nombre es requerido" };
    }

    if (normalized.length < HANDLE_MIN_LENGTH) {
        return { valid: false, message: `Minimo ${HANDLE_MIN_LENGTH} caracteres` };
    }

    if (normalized.length > HANDLE_MAX_LENGTH) {
        return { valid: false, message: `Maximo ${HANDLE_MAX_LENGTH} caracteres` };
    }

    if (!HANDLE_PATTERN.test(normalized)) {
        return {
            valid: false,
            message: "Solo letras, numeros, guiones y guion bajo",
        };
    }

    return { valid: true, message: "Formato valido" };
}

/**
 * Normalize handle (lowercase, remove @ prefix).
 */
export function normalizeHandle(handle: string): string {
    return handle.replace(/^@/, "").toLowerCase();
}

