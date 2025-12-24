import { Link } from "@inertiajs/react";
import {
    ArrowRight,
    Check,
    Mail,
    Palette,
    Rocket,
    Share2,
    UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function HowItWorksSection() {
    const steps = [
        {
            icon: UserPlus,
            title: "Crea tu cuenta",
            description:
                "Registrate con tu email y elegi el nombre de usuario que sera tu link unico en Linkea.",
            color: "from-brand-500 to-orange-500",
            highlight: "linkea.ar/tunombre",
        },
        {
            icon: Mail,
            title: "Valida tu correo",
            description:
                "Revisa tu bandeja de entrada y confirma tu cuenta para acceder a todas las funciones.",
            color: "from-emerald-500 to-teal-500",
            highlight: "1 click para activar",
        },
        {
            icon: Palette,
            title: "Diseña tu Linkea",
            description:
                "Personaliza colores, tipografia, y agrega todos los bloques que necesites para tu marca.",
            color: "from-violet-500 to-purple-500",
            highlight: "100% personalizable",
        },
        {
            icon: Share2,
            title: "Comparte con el mundo",
            description:
                "Listo! Ahora podes compartir tu Linkea en todas tus redes y plataformas.",
            color: "from-blue-500 to-cyan-500",
            highlight: "Un link para todo",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Auto-advance on mobile
    useEffect(() => {
        if (!isMobile) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % steps.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isMobile, steps.length]);

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-brand-100/30 rounded-full blur-3xl -translate-x-1/2" />
            <div className="absolute top-1/4 right-0 w-72 h-72 bg-violet-100/30 rounded-full blur-3xl translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-sm font-semibold mb-6">
                        <Rocket size={16} />
                        <span>Facil y rapido</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Como crear mi Linkea?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        En solo 4 pasos tenes tu pagina lista para compartir
                    </p>
                </div>

                {/* Mobile Slider */}
                <div className="md:hidden">
                    {/* Extra padding to prevent shadow/element clipping */}
                    <div className="overflow-hidden px-2 -mx-2 py-6 -my-6">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{
                                transform: `translateX(-${
                                    currentIndex * 100
                                }%)`,
                            }}
                        >
                            {steps.map((step, idx) => (
                                <div
                                    key={idx}
                                    className="w-full flex-shrink-0 px-4 pt-6"
                                >
                                    <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-gray-100 max-w-sm mx-auto">
                                        {/* Step number - centered, white bg */}
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-gray-800 text-sm shadow-md border border-gray-200">
                                            {idx + 1}
                                        </div>

                                        {/* Icon */}
                                        <div
                                            className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${step.color} mb-4 mt-3`}
                                        >
                                            <step.icon
                                                className="text-white"
                                                size={24}
                                            />
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed mb-3">
                                            {step.description}
                                        </p>

                                        {/* Highlight badge */}
                                        <div
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${step.color} text-white`}
                                        >
                                            <Check size={12} />
                                            {step.highlight}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots indicator */}
                    <div className="flex justify-center gap-2 mt-6">
                        {steps.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    idx === currentIndex
                                        ? "bg-brand-500 w-6"
                                        : "bg-gray-300 w-2"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop Timeline */}
                <div className="hidden md:block max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-300 via-violet-300 to-cyan-300 -translate-x-1/2" />

                        {steps.map((step, idx) => {
                            const isEven = idx % 2 === 0;

                            return (
                                <div
                                    key={idx}
                                    className={`relative flex items-center gap-0 mb-12 last:mb-0 ${
                                        isEven ? "flex-row" : "flex-row-reverse"
                                    }`}
                                >
                                    {/* Content card */}
                                    <div
                                        className={`w-[calc(50%-40px)] ${
                                            isEven
                                                ? "pr-0 text-right"
                                                : "pl-0 text-left"
                                        }`}
                                    >
                                        <div
                                            className={`relative bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${
                                                isEven ? "ml-auto" : "mr-auto"
                                            } max-w-md`}
                                        >
                                            {/* Step number - white bg on desktop too */}
                                            <div
                                                className={`absolute -top-3 ${
                                                    isEven
                                                        ? "right-4"
                                                        : "left-4"
                                                } w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-gray-800 text-sm shadow-md border border-gray-200`}
                                            >
                                                {idx + 1}
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed mb-3">
                                                {step.description}
                                            </p>

                                            {/* Highlight badge */}
                                            <div
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${step.color} text-white`}
                                            >
                                                <Check size={12} />
                                                {step.highlight}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center icon */}
                                    <div className="absolute left-1/2 -translate-x-1/2 w-20 h-20 flex items-center justify-center">
                                        <div
                                            className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center transform rotate-45`}
                                        >
                                            <step.icon
                                                className="text-white transform -rotate-45"
                                                size={28}
                                            />
                                        </div>
                                    </div>

                                    {/* Empty space */}
                                    <div className="w-[calc(50%-40px)]" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <span>Empezar ahora</span>
                        <ArrowRight size={20} />
                    </Link>
                    <p className="mt-4 text-gray-500 text-sm">
                        Sin tarjeta de credito. Gratis para siempre.
                    </p>
                </div>
            </div>
        </section>
    );
}
