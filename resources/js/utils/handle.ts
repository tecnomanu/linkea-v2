/**
 * Handle/Username validation and sanitization utilities.
 * Mirrors backend validation in StringHelper.php
 */

export const HANDLE_MIN_LENGTH = 3;
export const HANDLE_MAX_LENGTH = 30;

// Pattern: start with alphanumeric/underscore, middle can have .-_, end with alphanumeric/underscore
export const HANDLE_PATTERN = /^[a-z0-9_]([a-z0-9._-]*[a-z0-9_])?$/;

/**
 * Sanitize handle input - removes invalid characters.
 * Allowed: a-z, 0-9, _, -, .
 * Note: Does NOT remove special chars from start/end to allow typing mid-word.
 * Validation will catch format errors after user finishes typing.
 */
export function sanitizeHandle(value: string): string {
    return value
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/[^a-z0-9_.-]/g, "") // Remove invalid chars (allow dots)
        .replace(/-{2,}/g, "-") // No consecutive hyphens
        .replace(/_{2,}/g, "_") // No consecutive underscores
        .replace(/\.{2,}/g, ".") // No consecutive dots
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
        return {
            valid: false,
            message: `Minimo ${HANDLE_MIN_LENGTH} caracteres`,
        };
    }

    if (normalized.length > HANDLE_MAX_LENGTH) {
        return {
            valid: false,
            message: `Maximo ${HANDLE_MAX_LENGTH} caracteres`,
        };
    }

    // Check for special chars at start
    if (/^[._-]/.test(normalized)) {
        return {
            valid: false,
            message: "No puede empezar con guion, punto o guion bajo",
        };
    }

    // Check for special chars at end
    if (/[._-]$/.test(normalized)) {
        return {
            valid: false,
            message: "No puede terminar con guion, punto o guion bajo",
        };
    }

    // No consecutive special chars
    if (/[._-]{2,}/.test(normalized)) {
        return {
            valid: false,
            message: "No se permiten caracteres especiales consecutivos",
        };
    }

    if (!HANDLE_PATTERN.test(normalized)) {
        return {
            valid: false,
            message:
                "Solo letras, numeros, guion (-), guion bajo (_) y punto (.)",
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
