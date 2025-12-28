import { Link } from "@inertiajs/react";

type LogoVariant = "full" | "icon" | "text";
type LogoColor = "default" | "white" | "dark";
type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

interface LogoProps {
    variant?: LogoVariant;
    color?: LogoColor;
    size?: LogoSize;
    href?: string;
    className?: string;
}

// Size mappings for icon and text
const sizes = {
    xs: { icon: 20, text: "text-lg", gap: "gap-1" },
    sm: { icon: 24, text: "text-xl", gap: "gap-1.5" },
    md: { icon: 28, text: "text-2xl", gap: "gap-2" },
    lg: { icon: 36, text: "text-3xl", gap: "gap-2.5" },
    xl: { icon: 48, text: "text-4xl", gap: "gap-3" },
};

// Text color mappings
const textColors = {
    default: "text-gray-900",
    white: "text-white",
    dark: "text-gray-900",
};

/**
 * Linkea Logo Icon - Inline SVG for the chain link icon
 * This is the colorful version with gradients
 */
function LogoIcon({ size = 28 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
        >
            {/* Orange circle background */}
            <circle cx="128" cy="128" r="128" fill="#FE6A16" />
            {/* Darker orange overlay */}
            <path
                d="M255.1,112.6c-0.7-5.9-1.8-11.6-3.3-17.2l-60.9-47.7l-69.4,26.6l-49,73.1l-11.1,57.6l3.3,3l61.7,48c5.6,0.1,11.3-0.2,17-0.9C213.6,246.5,263.6,182.8,255.1,112.6z"
                fill="#EA4006"
            />
            {/* Yellow chain link */}
            <path
                d="M131.6,92.2l-13,16.6c-2.1,2.7-3.4,5.7-3.9,8.9c6.2-2.6,13.6-1.8,19.3,2.6c5.7,4.4,8.2,11.5,7.1,18.1c-0.5,3.1-1.8,6.2-3.9,8.9l-13,16.6l-16.8,21.5c-6.5,8.3-18.7,9.8-27,3.3c-8.3-6.5-9.8-18.7-3.3-27l16.8-21.5c-5.9-12-6.1-26.4-0.1-38.8c-2.4,2-4.6,4.2-6.6,6.8l-29.8,38.1c-15,19.2-11.7,47.1,7.5,62.1s47.1,11.7,62.1-7.5l29.8-38.1c2-2.5,3.6-5.2,5-8c6-12.4,5.8-26.7-0.1-38.8c-2.8-5.8-7-11.1-12.4-15.3C144.1,96.3,138,93.5,131.6,92.2L131.6,92.2z"
                fill="#FFCE00"
            />
            <path
                d="M134.1,120.2c5.7,4.4,8.2,11.5,7.1,18.1c-0.5,3.1-1.8,6.2-3.9,8.9l-13,16.6l-16.8,21.5c-6.5,8.3-18.7,9.8-27,3.3c-0.1-0.1-0.3-0.2-0.4-0.3L64.7,208c0.1,0.1,0.2,0.2,0.4,0.3c19.2,15,47.1,11.7,62.1-7.5l29.8-38.1c2-2.5,3.6-5.2,5-8c6-12.4,5.8-26.7-0.1-38.8c-2.8-5.8-7-11.1-12.4-15.3L134.1,120.2z"
                fill="#FDBA12"
            />
            {/* White chain link */}
            <path
                d="M128.8,55.2L99,93.3c-2,2.5-3.6,5.2-5,8c-6,12.4-5.8,26.7,0.1,38.8c2.8,5.8,7,11.1,12.4,15.3c5.4,4.2,11.5,7,17.9,8.4l13-16.6c2.1-2.7,3.4-5.7,3.9-8.9c-6.2,2.6-13.6,1.8-19.3-2.6c-5.7-4.4-8.2-11.5-7.1-18.1c0.5-3.1,1.8-6.2,3.9-8.9l13-16.6l16.8-21.5c6.5-8.3,18.7-9.8,27-3.3c8.3,6.5,9.8,18.7,3.3,27l-16.8,21.5c5.9,12,6.1,26.4,0.1,38.8c2.4-2,4.6-4.2,6.6-6.8l29.8-38.1c15-19.2,11.7-47.1-7.5-62.1S143.9,36,128.8,55.2L128.8,55.2z"
                fill="#FFFFFF"
            />
            {/* Highlights */}
            <path
                d="M106.5,155.4c5.4,4.2,11.5,7,17.9,8.4l13-16.6c2.1-2.7,3.4-5.7,3.9-8.9c-6.2,2.6-13.6,1.8-19.3-2.6L106.5,155.4z"
                fill="#E9EDF5"
            />
            <path
                d="M175.5,67.4c8.3,6.5,9.8,18.7,3.3,27l-16.8,21.5c5.9,12,6.1,26.4,0.1,38.8c2.4-2,4.6-4.2,6.6-6.8l29.8-38.1c15-19.2,11.7-47.1-7.5-62.1L175.5,67.4z"
                fill="#E9EDF5"
            />
        </svg>
    );
}

/**
 * Linkea Logo Text - Using DM Sans font
 */
function LogoText({
    size = "md",
    color = "default",
}: {
    size?: LogoSize;
    color?: LogoColor;
}) {
    const sizeClass = sizes[size].text;
    const colorClass = textColors[color];

    return (
        <span
            className={`font-sans font-semibold tracking-tight ${sizeClass} ${colorClass}`}
            style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
            Linkea
        </span>
    );
}

/**
 * Linkea Logo Component
 *
 * A flexible logo component that can show:
 * - Full logo (icon + text)
 * - Icon only
 * - Text only
 *
 * With support for different colors and sizes.
 *
 * @example
 * <Logo variant="full" size="md" />
 * <Logo variant="icon" size="lg" />
 * <Logo variant="full" color="white" href="/" />
 */
export function Logo({
    variant = "full",
    color = "default",
    size = "md",
    href,
    className = "",
}: LogoProps) {
    const sizeConfig = sizes[size];

    const content = (
        <div className={`flex items-center ${sizeConfig.gap} ${className}`}>
            {(variant === "full" || variant === "icon") && (
                <LogoIcon size={sizeConfig.icon} />
            )}
            {(variant === "full" || variant === "text") && (
                <LogoText size={size} color={color} />
            )}
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="flex items-center shrink-0">
                {content}
            </Link>
        );
    }

    return content;
}

export default Logo;
