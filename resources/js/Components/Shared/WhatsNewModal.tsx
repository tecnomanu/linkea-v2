import { Dialog, DialogBody, DialogContent } from "@/Components/ui/Dialog";
import {
    ArrowRight,
    BarChart3,
    Bot,
    ChevronLeft,
    ChevronRight,
    Moon,
    Palette,
    Rocket,
    Sparkles,
    X,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

interface WhatsNewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Slide {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
    iconBg: string;
    visual?: React.ReactNode;
}

const SLIDES: Slide[] = [
    {
        id: "welcome",
        icon: <Rocket size={48} strokeWidth={1.5} />,
        title: "Bienvenido a Linkea 2.0",
        description:
            "Una nueva experiencia completamente rediseñada. Más rápida, más intuitiva y con herramientas poderosas para destacar tu presencia online.",
        gradient: "from-brand-500 via-purple-500 to-pink-500",
        iconBg: "bg-white/20",
        visual: (
            <div className="relative w-full h-40 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-32 h-32 rounded-full bg-white/10 animate-ping"
                            style={{
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: "3s",
                            }}
                        />
                    ))}
                </div>
                <div className="relative text-8xl font-black text-white/90 tracking-tighter">
                    2.0
                </div>
            </div>
        ),
    },
    {
        id: "stats",
        icon: <BarChart3 size={48} strokeWidth={1.5} />,
        title: "Estadísticas en Tiempo Real",
        description:
            "Ahora cada link tiene su historial de clicks diarios. Visualiza el rendimiento con sparklines y descubre qué contenido conecta mejor con tu audiencia.",
        gradient: "from-emerald-500 via-teal-500 to-cyan-500",
        iconBg: "bg-emerald-400/30",
        visual: (
            <div className="relative w-full h-40 flex items-end justify-center gap-2 px-8">
                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                    <div
                        key={i}
                        className="w-8 bg-white/30 rounded-t-lg animate-pulse"
                        style={{
                            height: `${height}%`,
                            animationDelay: `${i * 0.1}s`,
                        }}
                    >
                        <div
                            className="w-full bg-white rounded-t-lg transition-all duration-1000"
                            style={{
                                height: `${Math.random() * 30 + 70}%`,
                                animationDelay: `${i * 0.15}s`,
                            }}
                        />
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: "ai",
        icon: <Bot size={48} strokeWidth={1.5} />,
        title: "AI Magic",
        description:
            "Configura tus links hablando con nuestra IA. Describí tu negocio y dejá que la inteligencia artificial genere una landing profesional en segundos.",
        gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
        iconBg: "bg-violet-400/30",
        visual: (
            <div className="relative w-full h-40 flex items-center justify-center">
                <div className="relative">
                    <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                        <Sparkles
                            className="text-yellow-300 animate-spin"
                            style={{ animationDuration: "3s" }}
                            size={20}
                        />
                        <span className="text-white/90 font-medium">
                            Generando tu landing...
                        </span>
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "themes",
        icon: <Palette size={48} strokeWidth={1.5} />,
        title: "Sistema de Themes",
        description:
            "Cambiá el diseño completo de tu landing en un click. Themes prediseñados por expertos o personalizá cada detalle a tu gusto.",
        gradient: "from-orange-500 via-rose-500 to-pink-500",
        iconBg: "bg-orange-400/30",
        visual: (
            <div className="relative w-full h-40 flex items-center justify-center gap-3 px-4">
                {[
                    "from-blue-400 to-cyan-300",
                    "from-purple-400 to-pink-300",
                    "from-amber-400 to-orange-300",
                    "from-emerald-400 to-teal-300",
                ].map((gradient, i) => (
                    <div
                        key={i}
                        className={`w-16 h-24 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg transform transition-all duration-500 hover:scale-110`}
                        style={{
                            transform: `rotate(${
                                (i - 1.5) * 8
                            }deg) translateY(${Math.abs(i - 1.5) * 8}px)`,
                            animationDelay: `${i * 0.1}s`,
                        }}
                    >
                        <div className="w-full h-full rounded-2xl border-2 border-white/30" />
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: "darkmode",
        icon: <Moon size={48} strokeWidth={1.5} />,
        title: "Modo Oscuro",
        description:
            "Para los que prefieren trabajar de noche o simplemente cuidan sus ojos. Todo el panel ahora soporta tema oscuro.",
        gradient: "from-slate-700 via-slate-800 to-slate-900",
        iconBg: "bg-slate-600/50",
        visual: (
            <div className="relative w-full h-40 flex items-center justify-center">
                <div className="relative">
                    {/* Moon glow effect */}
                    <div className="absolute -inset-8 bg-yellow-200/20 rounded-full blur-2xl" />
                    <div className="absolute -inset-4 bg-yellow-100/10 rounded-full blur-xl" />
                    {/* Moon */}
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-[0_0_60px_rgba(253,224,71,0.4)]">
                        {/* Craters */}
                        <div className="absolute top-4 left-6 w-4 h-4 rounded-full bg-yellow-300/50" />
                        <div className="absolute top-10 left-3 w-3 h-3 rounded-full bg-yellow-300/40" />
                        <div className="absolute top-6 right-4 w-5 h-5 rounded-full bg-yellow-300/30" />
                    </div>
                    {/* Stars */}
                    {[
                        { top: -30, left: -60 },
                        { top: -20, left: 80 },
                        { top: 10, left: -80 },
                        { top: -40, left: 40 },
                        { top: 30, left: -40 },
                        { top: -10, left: 100 },
                        { top: 40, left: 60 },
                        { top: -50, left: -20 },
                    ].map((star, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                            style={{
                                top: `calc(50% + ${star.top}px)`,
                                left: `calc(50% + ${star.left}px)`,
                                animationDelay: `${i * 0.2}s`,
                            }}
                        />
                    ))}
                </div>
            </div>
        ),
    },
];

const LOCAL_STORAGE_KEY = "linkea_whats_new_v2_seen";

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState<"left" | "right">("right");
    const [isAnimating, setIsAnimating] = useState(false);

    const goToSlide = useCallback(
        (index: number) => {
            if (isAnimating || index === currentSlide) return;
            setDirection(index > currentSlide ? "right" : "left");
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentSlide(index);
                setIsAnimating(false);
            }, 150);
        },
        [currentSlide, isAnimating]
    );

    const nextSlide = useCallback(() => {
        if (currentSlide < SLIDES.length - 1) {
            goToSlide(currentSlide + 1);
        }
    }, [currentSlide, goToSlide]);

    const prevSlide = useCallback(() => {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }, [currentSlide, goToSlide]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "ArrowRight") nextSlide();
            if (e.key === "ArrowLeft") prevSlide();
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, nextSlide, prevSlide, onClose]);

    const handleClose = () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, "true");
        onClose();
    };

    const handleGetStarted = () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, "true");
        onClose();
    };

    const slide = SLIDES[currentSlide];
    const isLastSlide = currentSlide === SLIDES.length - 1;

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} zIndex={200}>
            <DialogContent
                maxWidth="xl"
                className="!p-0 !rounded-[32px] overflow-hidden"
            >
                <DialogBody padding={false} className="relative">
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all backdrop-blur-sm"
                    >
                        <X size={20} />
                    </button>

                    {/* Main content area with gradient background */}
                    <div
                        className={`relative bg-gradient-to-br ${slide.gradient} min-h-[500px] md:min-h-[560px] transition-all duration-500`}
                    >
                        {/* Decorative elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
                        </div>

                        {/* Content */}
                        <div
                            className={`relative z-10 flex flex-col items-center justify-between h-full p-8 md:p-12 transition-all duration-300 ${
                                isAnimating
                                    ? direction === "right"
                                        ? "opacity-0 translate-x-8"
                                        : "opacity-0 -translate-x-8"
                                    : "opacity-100 translate-x-0"
                            }`}
                        >
                            {/* Icon */}
                            <div
                                className={`${slide.iconBg} p-5 rounded-3xl text-white mb-6 backdrop-blur-sm`}
                            >
                                {slide.icon}
                            </div>

                            {/* Visual element */}
                            {slide.visual}

                            {/* Text content */}
                            <div className="text-center mt-6 max-w-md">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                                    {slide.title}
                                </h2>
                                <p className="text-white/80 text-base md:text-lg leading-relaxed">
                                    {slide.description}
                                </p>
                            </div>
                        </div>

                        {/* Navigation arrows */}
                        <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-4">
                            <button
                                onClick={prevSlide}
                                disabled={currentSlide === 0}
                                className={`p-3 rounded-full bg-white/20 backdrop-blur-sm text-white transition-all ${
                                    currentSlide === 0
                                        ? "opacity-0 pointer-events-none"
                                        : "opacity-100 hover:bg-white/30 hover:scale-110 cursor-pointer"
                                }`}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                disabled={isLastSlide}
                                className={`p-3 rounded-full bg-white/20 backdrop-blur-sm text-white transition-all ${
                                    isLastSlide
                                        ? "opacity-0 pointer-events-none"
                                        : "opacity-100 hover:bg-white/30 hover:scale-110 cursor-pointer"
                                }`}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Bottom section */}
                    <div className="bg-white dark:bg-neutral-900 px-8 py-6">
                        <div className="flex items-center justify-between">
                            {/* Dots indicator */}
                            <div className="flex items-center gap-2">
                                {SLIDES.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`transition-all duration-300 rounded-full ${
                                            index === currentSlide
                                                ? "w-8 h-2 bg-brand-500"
                                                : "w-2 h-2 bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500"
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-3">
                                {!isLastSlide && (
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                                    >
                                        Saltar
                                    </button>
                                )}
                                <button
                                    onClick={
                                        isLastSlide
                                            ? handleGetStarted
                                            : nextSlide
                                    }
                                    className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
                                >
                                    {isLastSlide ? (
                                        <>
                                            <span>Comenzar</span>
                                            <Sparkles size={16} />
                                        </>
                                    ) : (
                                        <>
                                            <span>Siguiente</span>
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};

// Hook to manage the modal state based on localStorage
export const useWhatsNewModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Small delay to avoid showing immediately on page load
        const timer = setTimeout(() => {
            const hasSeenWhatsNew = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (!hasSeenWhatsNew) {
                setIsOpen(true);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    }, []);

    const reset = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setIsOpen(true);
    }, []);

    return { isOpen, close, reset };
};
