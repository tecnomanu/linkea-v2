import { BarChart3, Link2, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Stats {
    landings: number;
    blocks: number;
    clicks: number;
}

interface StatsSectionProps {
    stats?: Stats;
}

// Format number: 1234567 -> "1.2M", 12345 -> "12.3K", 123 -> "123"
function formatNumber(num: number): string {
    if (num >= 1_000_000) {
        const formatted = (num / 1_000_000).toFixed(1);
        return formatted.endsWith(".0")
            ? formatted.slice(0, -2) + "M"
            : formatted + "M";
    }
    if (num >= 1_000) {
        const formatted = (num / 1_000).toFixed(1);
        return formatted.endsWith(".0")
            ? formatted.slice(0, -2) + "K"
            : formatted + "K";
    }
    return num.toString();
}

// Animated counter hook
function useAnimatedCounter(
    targetValue: number,
    duration: number,
    shouldStart: boolean
): number {
    const [count, setCount] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!shouldStart || hasAnimated.current || targetValue === 0) return;

        hasAnimated.current = true;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(targetValue * easeOut);

            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [shouldStart, targetValue, duration]);

    return count;
}

// Animated stat card component
function AnimatedStatCard({
    icon: Icon,
    value,
    label,
    color,
    shouldAnimate,
    delay,
}: {
    icon: typeof Users;
    value: number;
    label: string;
    color: string;
    shouldAnimate: boolean;
    delay: number;
}) {
    const [startAnimation, setStartAnimation] = useState(false);
    const animatedValue = useAnimatedCounter(value, 1500, startAnimation);

    // Stagger animation start
    useEffect(() => {
        if (shouldAnimate) {
            const timer = setTimeout(() => setStartAnimation(true), delay);
            return () => clearTimeout(timer);
        }
    }, [shouldAnimate, delay]);

    return (
        <div className="group relative text-center md:text-left p-4 md:p-6 md:bg-white md:rounded-2xl md:shadow-xl md:shadow-gray-200/50 md:border md:border-gray-100 md:hover:shadow-2xl md:hover:-translate-y-1 transition-all duration-300">
            <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} mb-3 md:mb-4`}
            >
                <Icon className="text-white" size={24} />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1 tabular-nums">
                {formatNumber(animatedValue)}+
            </div>
            <div className="text-gray-500 font-medium text-sm md:text-base">
                {label}
            </div>
        </div>
    );
}

export default function StatsSection({ stats }: StatsSectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Detect when section is visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Fallback values if no stats provided or if stats are 0
    const finalStats = {
        landings: stats?.landings || 500,
        blocks: stats?.blocks || 2500,
        clicks: stats?.clicks || 50000,
    };

    const statItems = [
        {
            icon: Users,
            value: finalStats.landings,
            label: "Linkeas creados",
            color: "from-primary-500 to-orange-500",
        },
        {
            icon: Link2,
            value: finalStats.blocks,
            label: "Bloques activos",
            color: "from-violet-500 to-purple-500",
        },
        {
            icon: BarChart3,
            value: finalStats.clicks,
            label: "Clicks totales",
            color: "from-emerald-500 to-teal-500",
        },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative z-20 -mt-8 md:-mt-12 mb-12 md:mb-16"
        >
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 max-w-4xl mx-auto">
                    {statItems.map((stat, idx) => (
                        <AnimatedStatCard
                            key={idx}
                            icon={stat.icon}
                            value={stat.value}
                            label={stat.label}
                            color={stat.color}
                            shouldAnimate={isVisible}
                            delay={idx * 150}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
