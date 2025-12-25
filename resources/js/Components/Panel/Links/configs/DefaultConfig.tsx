/**
 * DefaultConfig - Placeholder for blocks without extra configuration
 */

import React from "react";

export const DefaultConfig: React.FC = () => {
    return (
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700">
            <p className="text-xs text-neutral-500">
                Este tipo de bloque no tiene configuraciones adicionales.
            </p>
        </div>
    );
};
