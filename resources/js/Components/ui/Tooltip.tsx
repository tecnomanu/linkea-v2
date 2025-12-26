import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";

// ============================================================================
// Types
// ============================================================================

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipState {
    content: string;
    x: number;
    y: number;
    position: TooltipPosition;
    visible: boolean;
}

// ============================================================================
// Context
// ============================================================================

const TooltipContext = createContext<boolean>(false);

export const useTooltipContext = () => useContext(TooltipContext);

// ============================================================================
// Tooltip Provider - Add this once at app root
// ============================================================================

interface TooltipProviderProps {
    children: React.ReactNode;
    /** Delay before showing tooltip (ms) */
    delay?: number;
}

/**
 * TooltipProvider - Enables tooltips throughout the app
 *
 * Usage:
 * 1. Wrap your app with <TooltipProvider>
 * 2. Add data-tooltip="text" to any element
 * 3. Optionally add data-tooltip-position="top|bottom|left|right"
 *
 * @example
 * <button data-tooltip="Settings" data-tooltip-position="bottom">
 *   <Settings />
 * </button>
 */
export const TooltipProvider: React.FC<TooltipProviderProps> = ({
    children,
    delay = 300,
}) => {
    const [tooltip, setTooltip] = useState<TooltipState>({
        content: "",
        x: 0,
        y: 0,
        position: "top",
        visible: false,
    });

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const currentTargetRef = useRef<HTMLElement | null>(null);

    const showTooltip = useCallback((target: HTMLElement) => {
        const content = target.dataset.tooltip;
        if (!content) return;

        const position =
            (target.dataset.tooltipPosition as TooltipPosition) || "top";
        const rect = target.getBoundingClientRect();

        // Calculate position
        let x = 0;
        let y = 0;
        const gap = 8;

        switch (position) {
            case "top":
                x = rect.left + rect.width / 2;
                y = rect.top - gap;
                break;
            case "bottom":
                x = rect.left + rect.width / 2;
                y = rect.bottom + gap;
                break;
            case "left":
                x = rect.left - gap;
                y = rect.top + rect.height / 2;
                break;
            case "right":
                x = rect.right + gap;
                y = rect.top + rect.height / 2;
                break;
        }

        currentTargetRef.current = target;
        setTooltip({ content, x, y, position, visible: true });
    }, []);

    const hideTooltip = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        currentTargetRef.current = null;
        setTooltip((prev) => ({ ...prev, visible: false }));
    }, []);

    // Global event listeners using event delegation
    useEffect(() => {
        const handleMouseEnter = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest(
                "[data-tooltip]"
            ) as HTMLElement | null;

            if (!target) return;

            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set timeout to show tooltip
            timeoutRef.current = setTimeout(() => {
                showTooltip(target);
            }, delay);
        };

        const handleMouseLeave = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest(
                "[data-tooltip]"
            ) as HTMLElement | null;

            if (target === currentTargetRef.current) {
                hideTooltip();
            }
        };

        const handleScroll = () => {
            hideTooltip();
        };

        // Use capture phase to catch events before they bubble
        document.addEventListener("mouseenter", handleMouseEnter, true);
        document.addEventListener("mouseleave", handleMouseLeave, true);
        document.addEventListener("scroll", handleScroll, true);

        return () => {
            document.removeEventListener("mouseenter", handleMouseEnter, true);
            document.removeEventListener("mouseleave", handleMouseLeave, true);
            document.removeEventListener("scroll", handleScroll, true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [delay, showTooltip, hideTooltip]);

    return (
        <TooltipContext.Provider value={true}>
            {children}
            {tooltip.visible &&
                createPortal(
                    <TooltipBubble
                        content={tooltip.content}
                        x={tooltip.x}
                        y={tooltip.y}
                        position={tooltip.position}
                    />,
                    document.body
                )}
        </TooltipContext.Provider>
    );
};

// ============================================================================
// Tooltip Bubble (visual component)
// ============================================================================

interface TooltipBubbleProps {
    content: string;
    x: number;
    y: number;
    position: TooltipPosition;
}

const TooltipBubble: React.FC<TooltipBubbleProps> = ({
    content,
    x,
    y,
    position,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [finalPos, setFinalPos] = useState({ x, y });
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        let finalX = x;
        let finalY = y;

        // Adjust based on position and tooltip size
        switch (position) {
            case "top":
                finalX = x - rect.width / 2;
                finalY = y - rect.height;
                break;
            case "bottom":
                finalX = x - rect.width / 2;
                finalY = y;
                break;
            case "left":
                finalX = x - rect.width;
                finalY = y - rect.height / 2;
                break;
            case "right":
                finalX = x;
                finalY = y - rect.height / 2;
                break;
        }

        // Keep within viewport
        const padding = 8;
        finalX = Math.max(
            padding,
            Math.min(finalX, window.innerWidth - rect.width - padding)
        );
        finalY = Math.max(
            padding,
            Math.min(finalY, window.innerHeight - rect.height - padding)
        );

        setFinalPos({ x: finalX, y: finalY });
        // Small delay to trigger animation after position is set
        requestAnimationFrame(() => setReady(true));
    }, [x, y, position]);

    return (
        <div
            ref={ref}
            role="tooltip"
            className={`
                fixed z-[9999] px-2.5 py-1.5 text-xs font-medium text-white
                bg-neutral-900 dark:bg-neutral-700 rounded-lg shadow-lg
                pointer-events-none select-none whitespace-nowrap
                transition-opacity duration-150 ease-out
                ${ready ? "opacity-100" : "opacity-0"}
            `}
            style={{
                left: finalPos.x,
                top: finalPos.y,
            }}
        >
            {content}
        </div>
    );
};

// ============================================================================
// Standalone Tooltip Component (for special cases)
// ============================================================================

interface TooltipProps {
    /** Content to show in tooltip */
    content: React.ReactNode;
    /** Element that triggers the tooltip */
    children: React.ReactElement;
    /** Position of tooltip */
    position?: TooltipPosition;
    /** Whether tooltip is disabled */
    disabled?: boolean;
}

/**
 * Standalone Tooltip wrapper - use when you can't add data attributes
 * Prefer using data-tooltip attribute with TooltipProvider instead
 */
export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = "top",
    disabled = false,
}) => {
    if (disabled || !content) return children;

    const tooltipProps: Record<string, unknown> = {
        "data-tooltip": typeof content === "string" ? content : undefined,
        "data-tooltip-position": position,
    };

    // Clone child and add data attributes
    return React.cloneElement(children, tooltipProps);
};

export default TooltipProvider;
