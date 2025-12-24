import { clsx, type ClassValue } from "clsx";
import { LabelHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    /** Smaller helper text shown beside label */
    hint?: string;
    /** Whether field is required */
    required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, children, hint, required, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    "text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2",
                    className
                )}
                {...props}
            >
                {children}
                {required && <span className="text-red-500">*</span>}
                {hint && (
                    <span className="text-neutral-400 dark:text-neutral-500 font-normal">
                        {hint}
                    </span>
                )}
            </label>
        );
    }
);

Label.displayName = "Label";

