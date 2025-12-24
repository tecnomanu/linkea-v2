interface AuthDividerProps {
    text?: string;
}

/**
 * Simple divider with centered text for auth pages
 * Used to separate login form from social login options
 */
export function AuthDivider({ text = "O" }: AuthDividerProps) {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-neutral-900 px-4 text-neutral-500 dark:text-neutral-400 font-medium">
                    {text}
                </span>
            </div>
        </div>
    );
}

