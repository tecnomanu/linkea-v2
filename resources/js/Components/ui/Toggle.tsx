import React from 'react';

export interface ToggleProps {
    /** Whether the toggle is checked/on */
    checked: boolean;
    /** Callback when toggle state changes */
    onChange: (checked: boolean) => void;
    /** Whether the toggle is disabled */
    disabled?: boolean;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Label text (optional) */
    label?: string;
    /** Label position */
    labelPosition?: 'left' | 'right';
    /** Additional class name for the container */
    className?: string;
    /** Title/tooltip for accessibility */
    title?: string;
}

const SIZE_CLASSES = {
    sm: {
        track: 'w-9 h-5',
        thumb: 'w-3.5 h-3.5',
        translate: 'translate-x-4',
        offset: 'top-[3px] left-[3px]',
    },
    md: {
        track: 'w-11 h-6',
        thumb: 'w-4 h-4',
        translate: 'translate-x-5',
        offset: 'top-1 left-1',
    },
    lg: {
        track: 'w-14 h-8',
        thumb: 'w-6 h-6',
        translate: 'translate-x-6',
        offset: 'top-1 left-1',
    },
};

export const Toggle: React.FC<ToggleProps> = ({
    checked,
    onChange,
    disabled = false,
    size = 'md',
    label,
    labelPosition = 'left',
    className = '',
    title,
}) => {
    const sizeClasses = SIZE_CLASSES[size];

    const handleClick = () => {
        if (!disabled) {
            onChange(!checked);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    const toggleButton = (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label || title}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            title={title}
            className={`
                relative rounded-full transition-colors duration-300 ease-in-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2
                ${sizeClasses.track}
                ${checked 
                    ? 'bg-brand-500' 
                    : 'bg-neutral-200 dark:bg-neutral-700'
                }
                ${disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer'
                }
            `}
        >
            <span
                className={`
                    absolute rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out
                    ${sizeClasses.thumb}
                    ${sizeClasses.offset}
                    ${checked ? sizeClasses.translate : 'translate-x-0'}
                `}
            />
        </button>
    );

    // If no label, return just the button
    if (!label) {
        return toggleButton;
    }

    // With label
    return (
        <div 
            className={`
                flex items-center gap-3
                ${labelPosition === 'right' ? 'flex-row' : 'flex-row-reverse justify-end'}
                ${className}
            `}
        >
            {toggleButton}
            <span 
                className={`
                    text-sm font-medium select-none
                    ${disabled 
                        ? 'text-neutral-400 dark:text-neutral-500' 
                        : 'text-neutral-700 dark:text-neutral-300 cursor-pointer'
                    }
                `}
                onClick={disabled ? undefined : handleClick}
            >
                {label}
            </span>
        </div>
    );
};

export default Toggle;

