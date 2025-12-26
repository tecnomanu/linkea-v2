import React, { useRef, useState, useEffect, ClipboardEvent, KeyboardEvent } from "react";

interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    autoFocus?: boolean;
    disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
    length = 6,
    value,
    onChange,
    error,
    autoFocus = false,
    disabled = false,
}) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    // Split value into array of single chars
    const valueArray = value.split("").slice(0, length);
    while (valueArray.length < length) {
        valueArray.push("");
    }

    // Focus first input on mount if autoFocus
    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    const focusInput = (index: number) => {
        const clampedIndex = Math.max(0, Math.min(index, length - 1));
        inputRefs.current[clampedIndex]?.focus();
        setActiveIndex(clampedIndex);
    };

    const handleChange = (index: number, inputValue: string) => {
        // Only allow digits
        const digit = inputValue.replace(/\D/g, "").slice(-1);
        
        if (digit) {
            const newValue = valueArray.slice();
            newValue[index] = digit;
            onChange(newValue.join(""));
            
            // Move to next input
            if (index < length - 1) {
                focusInput(index + 1);
            }
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newValue = valueArray.slice();
            
            if (valueArray[index]) {
                // Clear current input
                newValue[index] = "";
                onChange(newValue.join(""));
            } else if (index > 0) {
                // Move to previous and clear it
                newValue[index - 1] = "";
                onChange(newValue.join(""));
                focusInput(index - 1);
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            e.preventDefault();
            focusInput(index - 1);
        } else if (e.key === "ArrowRight" && index < length - 1) {
            e.preventDefault();
            focusInput(index + 1);
        } else if (e.key === "Delete") {
            e.preventDefault();
            const newValue = valueArray.slice();
            newValue[index] = "";
            onChange(newValue.join(""));
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        
        if (pastedData) {
            onChange(pastedData);
            // Focus the next empty input or last input
            const nextIndex = Math.min(pastedData.length, length - 1);
            focusInput(nextIndex);
        }
    };

    const handleFocus = (index: number) => {
        setActiveIndex(index);
        // Select the content when focusing
        inputRefs.current[index]?.select();
    };

    // Handle clicking on the container to focus appropriate input
    const handleContainerClick = () => {
        // Focus the first empty input, or last input if all filled
        const firstEmptyIndex = valueArray.findIndex(v => !v);
        focusInput(firstEmptyIndex === -1 ? length - 1 : firstEmptyIndex);
    };

    return (
        <div className="space-y-2">
            <div 
                className="flex justify-center gap-2 sm:gap-3"
                onClick={handleContainerClick}
            >
                {valueArray.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        onFocus={() => handleFocus(index)}
                        disabled={disabled}
                        className={`
                            w-11 h-14 sm:w-14 sm:h-16
                            text-center text-2xl sm:text-3xl font-bold
                            rounded-xl border-2 
                            transition-all duration-200
                            focus:outline-none focus:ring-2
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${error
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/10"
                                : digit
                                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/10 focus:ring-brand-500/20"
                                : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 focus:border-brand-500 focus:ring-brand-500/20"
                            }
                            text-neutral-900 dark:text-white
                        `}
                        aria-label={`Digit ${index + 1}`}
                    />
                ))}
            </div>
            {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
            )}
        </div>
    );
};

