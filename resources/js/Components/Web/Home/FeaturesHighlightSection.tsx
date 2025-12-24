import { Link } from "@inertiajs/react";
import {
    ArrowRight,
    BarChart3,
    Bot,
    Moon,
    Palette,
    Sparkles,
} from "lucide-react";

// Day/Night transition - Pure CSS version with layered sky backgrounds
// Timeline: 12s total
// 0-3s: Sun arc (dawn → day → dusk)
// 3-4s: Transition to night
// 4-11s: Moon arc (night with 5s pause at top)
// 11-12s: Dawn transition
const DayNightVisual: React.FC = () => {
    return (
        <div className="relative w-full h-32 flex items-center justify-center overflow-hidden rounded-xl">
            {/* CSS Keyframes - using animation-timing-function per keyframe for natural bounce */}
            <style>{`
                @keyframes sunArc {
                    0% { 
                        transform: rotate(-120deg); 
                        opacity: 0;
                        animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
                    }
                    3% { opacity: 1; }
                    15% { 
                        transform: rotate(0deg);
                        animation-timing-function: ease-in;
                    }
                    17% { transform: rotate(0deg); }
                    27% { 
                        transform: rotate(120deg); 
                        opacity: 1;
                    }
                    30%, 100% { 
                        transform: rotate(120deg); 
                        opacity: 0; 
                    }
                }
                @keyframes moonArc {
                    0%, 30% { 
                        transform: rotate(-120deg); 
                        opacity: 0;
                    }
                    33% { 
                        transform: rotate(-120deg); 
                        opacity: 1;
                        animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
                    }
                    45% { 
                        transform: rotate(0deg);
                        animation-timing-function: linear;
                    }
                    83% { 
                        transform: rotate(0deg);
                        animation-timing-function: ease-in;
                    }
                    93% { 
                        transform: rotate(120deg); 
                        opacity: 1;
                    }
                    96%, 100% { 
                        transform: rotate(120deg); 
                        opacity: 0; 
                    }
                }
                @keyframes skyDawn {
                    0%, 96% { opacity: 1; }
                    10%, 90% { opacity: 0; }
                }
                @keyframes skyDay {
                    0%, 5% { opacity: 0; }
                    12%, 20% { opacity: 1; }
                    28%, 100% { opacity: 0; }
                }
                @keyframes skyDusk {
                    0%, 20% { opacity: 0; }
                    28%, 33% { opacity: 1; }
                    40%, 100% { opacity: 0; }
                }
                @keyframes skyNight {
                    0%, 30% { opacity: 0; }
                    38%, 92% { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes starsOpacity {
                    0%, 30% { opacity: 0; }
                    40%, 90% { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes sunRays {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                @keyframes horizonGlow {
                    0%, 28% { opacity: 0.6; }
                    35%, 100% { opacity: 0; }
                }
            `}</style>

            {/* Sky layers - each with its own opacity animation */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-slate-800 via-orange-400 to-amber-200"
                style={{ animation: "skyDawn 12s ease-in-out infinite" }}
            />
            <div
                className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100"
                style={{ animation: "skyDay 12s ease-in-out infinite" }}
            />
            <div
                className="absolute inset-0 bg-gradient-to-b from-orange-500 via-orange-400 to-slate-800"
                style={{ animation: "skyDusk 12s ease-in-out infinite" }}
            />
            <div
                className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700"
                style={{ animation: "skyNight 12s ease-in-out infinite" }}
            />

            {/* Horizon glow */}
            <div
                className="absolute bottom-0 left-0 right-0 h-12"
                style={{
                    background:
                        "linear-gradient(to top, rgba(255,200,100,0.5), transparent)",
                    animation: "horizonGlow 12s ease-in-out infinite",
                }}
            />

            {/* Stars */}
            <div
                className="absolute inset-0"
                style={{ animation: "starsOpacity 12s ease-in-out infinite" }}
            >
                {[
                    { top: "12%", left: "15%", size: 2 },
                    { top: "20%", left: "75%", size: 1.5 },
                    { top: "35%", left: "10%", size: 1 },
                    { top: "15%", left: "88%", size: 2 },
                    { top: "45%", left: "82%", size: 1 },
                    { top: "25%", left: "45%", size: 1.5 },
                ].map((star, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-pulse"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: "2s",
                        }}
                    />
                ))}
            </div>

            {/* Sun orbit container */}
            <div
                className="absolute left-1/2 bottom-0 w-0 h-0"
                style={{
                    transformOrigin: "center center",
                    animation: "sunArc 12s linear infinite",
                }}
            >
                <div
                    className="absolute"
                    style={{ left: "-22px", bottom: "55px" }}
                >
                    {/* Rays */}
                    <div
                        className="absolute w-16 h-16"
                        style={{
                            top: "50%",
                            left: "50%",
                            animation: "sunRays 3s linear infinite",
                        }}
                    >
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute bg-yellow-300/60 rounded-full"
                                style={{
                                    width: 3,
                                    height: 12,
                                    top: "50%",
                                    left: "50%",
                                    transformOrigin: "center center",
                                    transform: `translate(-50%, -50%) rotate(${
                                        i * 45
                                    }deg) translateY(-28px)`,
                                }}
                            />
                        ))}
                    </div>
                    {/* Glow */}
                    <div
                        className="absolute w-14 h-14 rounded-full blur-lg -top-1 -left-1"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(251,191,36,0.7) 0%, transparent 70%)",
                        }}
                    />
                    {/* Body */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-400 shadow-[0_0_25px_rgba(251,191,36,0.9)]" />
                </div>
            </div>

            {/* Moon orbit container */}
            <div
                className="absolute left-1/2 bottom-0 w-0 h-0"
                style={{
                    transformOrigin: "center center",
                    animation: "moonArc 12s linear infinite",
                }}
            >
                <div
                    className="absolute"
                    style={{ left: "-20px", bottom: "55px" }}
                >
                    {/* Glow */}
                    <div
                        className="absolute w-12 h-12 rounded-full blur-md -top-0.5 -left-0.5"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(253,224,71,0.4) 0%, transparent 70%)",
                        }}
                    />
                    {/* Body */}
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 shadow-[0_0_20px_rgba(253,224,71,0.5)]">
                        <div className="absolute top-1.5 left-3 w-2 h-2 rounded-full bg-yellow-300/30" />
                        <div className="absolute top-4 left-1.5 w-1.5 h-1.5 rounded-full bg-yellow-300/25" />
                        <div className="absolute top-2.5 right-1.5 w-2.5 h-2.5 rounded-full bg-yellow-300/20" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Animated bar chart visual
const StatsVisual: React.FC = () => {
    const bars = [35, 55, 45, 70, 50, 85, 60];

    return (
        <div className="relative w-full h-32 flex items-end justify-center gap-2 px-4">
            {bars.map((height, i) => (
                <div
                    key={i}
                    className="w-6 bg-white/30 rounded-t-md overflow-hidden"
                    style={{ height: `${height}%` }}
                >
                    <div
                        className="w-full bg-white rounded-t-md animate-pulse"
                        style={{
                            height: "100%",
                            animationDelay: `${i * 0.1}s`,
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

// AI Magic visual
const AIVisual: React.FC = () => {
    return (
        <div className="relative w-full h-32 flex items-center justify-center">
            <div className="relative">
                <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl animate-pulse" />
                <div className="relative flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl border border-white/25">
                    <Sparkles
                        className="text-yellow-300 animate-spin"
                        style={{ animationDuration: "3s" }}
                        size={18}
                    />
                    <span className="text-white/90 font-medium text-sm">
                        Generando tu landing...
                    </span>
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Theme cards visual
const ThemesVisual: React.FC = () => {
    const gradients = [
        "from-blue-400 to-cyan-300",
        "from-purple-400 to-pink-300",
        "from-amber-400 to-orange-300",
        "from-emerald-400 to-teal-300",
    ];

    return (
        <div className="relative w-full h-32 flex items-center justify-center gap-2">
            {gradients.map((gradient, i) => (
                <div
                    key={i}
                    className={`w-12 h-20 rounded-xl bg-gradient-to-br ${gradient} shadow-lg transform transition-all duration-300 hover:scale-110`}
                    style={{
                        transform: `rotate(${(i - 1.5) * 6}deg) translateY(${
                            Math.abs(i - 1.5) * 6
                        }px)`,
                    }}
                >
                    <div className="w-full h-full rounded-xl border-2 border-white/30" />
                </div>
            ))}
        </div>
    );
};

interface Feature {
    id: string;
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
    visual: React.ReactNode;
}

const features: Feature[] = [
    {
        id: "stats",
        icon: BarChart3,
        title: "Estadisticas en Tiempo Real",
        description:
            "Cada link ahora tiene su historial de clicks diarios. Visualiza el rendimiento con sparklines y descubri que contenido conecta mejor con tu audiencia.",
        gradient: "from-emerald-500 via-teal-500 to-cyan-500",
        visual: <StatsVisual />,
    },
    {
        id: "ai",
        icon: Bot,
        title: "AI Magic",
        description:
            "Configura tus links hablando con nuestra IA. Describi tu negocio y deja que la inteligencia artificial genere una landing profesional en segundos.",
        gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
        visual: <AIVisual />,
    },
    {
        id: "themes",
        icon: Palette,
        title: "Sistema de Themes",
        description:
            "Cambia el diseño completo de tu landing en un click. Themes prediseñados por expertos o personaliza cada detalle a tu gusto.",
        gradient: "from-orange-500 via-rose-500 to-pink-500",
        visual: <ThemesVisual />,
    },
    {
        id: "darkmode",
        icon: Moon,
        title: "Modo Oscuro",
        description:
            "Para los que prefieren trabajar de noche o simplemente cuidan sus ojos. Todo el panel ahora soporta tema oscuro.",
        gradient: "from-slate-600 via-slate-700 to-slate-800",
        visual: <DayNightVisual />,
    },
];

export default function FeaturesHighlightSection() {
    return (
        <section className="py-24 bg-gradient-to-b from-white via-white to-gray-50 relative overflow-hidden">
            {/* Background decoration - only at bottom */}
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-brand-100/30 rounded-full blur-3xl translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-sm font-semibold mb-6">
                        <Sparkles size={16} />
                        <span>Nueva version 2.0</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                        Mas poderoso que nunca
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Herramientas nuevas para llevar tu presencia online al
                        siguiente nivel
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {features.map((feature, idx) => (
                        <div
                            key={feature.id}
                            className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Gradient background */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`}
                            />

                            {/* Content */}
                            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
                                {/* Icon */}
                                <div className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                                    <feature.icon
                                        className="text-white"
                                        size={28}
                                    />
                                </div>

                                {/* Visual */}
                                {feature.visual}

                                {/* Text */}
                                <div className="mt-auto pt-4">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-white/80 text-sm md:text-base leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <span>Proba estas funciones gratis</span>
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
