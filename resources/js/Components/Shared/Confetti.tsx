import { useCallback, useRef } from "react";

/**
 * Confetti configuration options
 */
interface ConfettiOptions {
    /** Angle in degrees for the confetti direction (default: 90) */
    angle?: number;
    /** Decay rate for velocity (default: 0.9) */
    decay?: number;
    /** Spread angle in degrees (default: 45) */
    spread?: number;
    /** Initial velocity (default: 45) */
    startVelocity?: number;
    /** Number of confetti elements (default: 50) */
    elementCount?: number;
    /** Array of colors to use (default: vibrant palette) */
    colors?: string[];
    /** Duration of animation in ticks (default: 200) */
    duration?: number;
}

interface ConfettiElement {
    element: HTMLDivElement;
    physics: {
        x: number;
        y: number;
        z?: number;
        wobble: number;
        velocity: number;
        angle2D: number;
        angle3D: number;
        tiltAngle: number;
    };
}

const DEFAULT_COLORS = [
    "#a864fd", // Purple
    "#29cdff", // Cyan
    "#78ff44", // Green
    "#ff718d", // Pink
    "#fdff6a", // Yellow
];

/**
 * Creates a random shape for a confetti element
 */
function applyRandomShape(
    element: HTMLDivElement,
    color: string
): HTMLDivElement {
    const shapes = [
        // Square
        (e: HTMLDivElement) => {
            const size = Math.round((Math.random() + 0.5) * 10) + "px";
            e.style.width = size;
            e.style.height = size;
            e.style.backgroundColor = color;
            return e;
        },
        // Round
        (e: HTMLDivElement) => {
            const size = Math.round((Math.random() + 0.5) * 10) + "px";
            e.style.width = size;
            e.style.height = size;
            e.style.borderRadius = "50%";
            e.style.backgroundColor = color;
            return e;
        },
        // Triangle
        (e: HTMLDivElement) => {
            const size = Math.round((Math.random() + 0.5) * 10);
            e.style.backgroundColor = "transparent";
            e.style.borderBottom = `${size}px solid ${color}`;
            e.style.borderLeft = `${size / 2}px solid transparent`;
            e.style.borderRight = `${size / 2}px solid transparent`;
            e.style.height = "0";
            e.style.width = `${size}px`;
            return e;
        },
    ];

    return shapes[Math.floor(Math.random() * shapes.length)](element);
}

/**
 * Creates confetti elements and appends them to the container
 */
function createElements(
    container: HTMLElement,
    elementCount: number,
    colors: string[]
): HTMLDivElement[] {
    return Array.from({ length: elementCount }).map((_, index) => {
        const element = document.createElement("div");
        const color = colors[index % colors.length];
        element.style.position = "absolute";
        applyRandomShape(element, color);
        container.appendChild(element);
        return element;
    });
}

/**
 * Generates random physics for a confetti element
 */
function randomPhysics(
    angle: number,
    spread: number,
    startVelocity: number,
    containerWidth: number
) {
    const radAngle = angle * (Math.PI / 180);
    const radSpread = spread * (Math.PI / 180);
    return {
        x: containerWidth / 2,
        y: 0,
        wobble: Math.random() * 10,
        velocity: startVelocity * 0.5 + Math.random() * startVelocity,
        angle2D: -radAngle + (0.5 * radSpread - Math.random() * radSpread),
        angle3D: -(Math.PI / 4) + Math.random() * (Math.PI / 2),
        tiltAngle: Math.random() * Math.PI,
    };
}

/**
 * Updates a single confetti element's position and appearance
 */
function updateConfetti(
    fetti: ConfettiElement,
    progress: number,
    decay: number
): void {
    fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.velocity *= decay;
    fetti.physics.y += 3;
    fetti.physics.wobble += 0.1;
    fetti.physics.tiltAngle += 0.1;

    const { x, y, tiltAngle, wobble } = fetti.physics;
    const wobbleX = x + 10 * Math.cos(wobble);
    const wobbleY = y + 10 * Math.sin(wobble);

    const transform = `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotate3d(1, 1, 1, ${tiltAngle}rad)`;

    fetti.element.style.transform = transform;
    fetti.element.style.opacity = String(1 - progress);
    fetti.element.style.zIndex = "99999";
}

/**
 * Animates all confetti elements
 */
function animate(
    container: HTMLElement,
    fettis: ConfettiElement[],
    decay: number,
    duration: number
): void {
    let tick = 0;

    function update() {
        fettis.forEach((fetti) =>
            updateConfetti(fetti, tick / duration, decay)
        );

        tick += 1;
        if (tick < duration) {
            requestAnimationFrame(update);
        } else {
            // Clean up
            fettis.forEach((fetti) => {
                if (fetti.element.parentNode === container) {
                    container.removeChild(fetti.element);
                }
            });
        }
    }

    requestAnimationFrame(update);
}

/**
 * Triggers a confetti explosion from a container element
 */
export function triggerConfetti(
    container: HTMLElement,
    options: ConfettiOptions = {}
): void {
    const {
        angle = 90,
        decay = 0.9,
        spread = 45,
        startVelocity = 45,
        elementCount = 50,
        colors = DEFAULT_COLORS,
        duration = 200,
    } = options;

    const elements = createElements(container, elementCount, colors);
    const containerWidth = container.offsetWidth;

    const fettis: ConfettiElement[] = elements.map((element) => ({
        element,
        physics: randomPhysics(angle, spread, startVelocity, containerWidth),
    }));

    animate(container, fettis, decay, duration);
}

/**
 * React hook for using confetti
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { containerRef, fire } = useConfetti();
 *
 *   return (
 *     <div ref={containerRef} style={{ position: 'relative' }}>
 *       <button onClick={fire}>Celebrate!</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useConfetti(options: ConfettiOptions = {}) {
    const containerRef = useRef<HTMLDivElement>(null);

    const fire = useCallback(() => {
        if (containerRef.current) {
            triggerConfetti(containerRef.current, options);
        }
    }, [options]);

    return { containerRef, fire };
}

/**
 * Confetti wrapper component
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const confettiRef = useRef<{ fire: () => void }>(null);
 *
 *   return (
 *     <Confetti ref={confettiRef}>
 *       <button onClick={() => confettiRef.current?.fire()}>
 *         Celebrate!
 *       </button>
 *     </Confetti>
 *   );
 * }
 * ```
 */
import React from "react";

interface ConfettiProps {
    children: React.ReactNode;
    options?: ConfettiOptions;
    className?: string;
}

export const Confetti = React.forwardRef<{ fire: () => void }, ConfettiProps>(
    ({ children, options = {}, className = "" }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);

        const fire = useCallback(() => {
            if (containerRef.current) {
                triggerConfetti(containerRef.current, options);
            }
        }, [options]);

        React.useImperativeHandle(ref, () => ({ fire }));

        return (
            <div
                ref={containerRef}
                className={`relative overflow-hidden ${className}`}
            >
                {children}
            </div>
        );
    }
);

Confetti.displayName = "Confetti";

export default Confetti;
