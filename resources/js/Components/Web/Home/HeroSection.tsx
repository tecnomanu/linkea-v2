import { Link } from "@inertiajs/react";
import { ArrowRight, Rocket, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { LinkBlock, UserProfile } from "../../../types";
import { PhonePreview } from "../../Shared/PhonePreview";

export interface FeaturedLanding {
    id: string;
    user: UserProfile;
    links: LinkBlock[];
}

interface HeroSectionProps {
    landings?: FeaturedLanding[];
}

// Fallback mock data in case API fails
const fallbackData: FeaturedLanding[] = [
    {
        id: "fallback-1",
        user: {
            name: "Sofi Music",
            handle: "sofimusic",
            avatar: "/assets/images/screenshots/screen1.webp",
            bio: "Cantante y compositora",
            theme: "ocean",
            customDesign: {
                backgroundColor: "#38bdf8",
                buttonStyle: "solid",
                buttonShape: "rounded",
                buttonColor: "#dc2626",
                buttonTextColor: "#ffffff",
                fontPair: "modern",
                roundedAvatar: true,
            },
        },
        links: [
            {
                id: "1",
                title: "Mi Spotify",
                url: "#",
                isEnabled: true,
                clicks: 150,
                type: "link",
                sparklineData: [],
            },
            {
                id: "2",
                title: "YouTube",
                url: "#",
                isEnabled: true,
                clicks: 89,
                type: "link",
                sparklineData: [],
            },
            {
                id: "3",
                title: "Instagram",
                url: "#",
                isEnabled: true,
                clicks: 45,
                type: "link",
                sparklineData: [],
            },
        ],
    },
    {
        id: "fallback-2",
        user: {
            name: "Tech Studio",
            handle: "techstudio",
            avatar: "/assets/images/screenshots/screen2.webp",
            bio: "Desarrollo web y apps",
            theme: "sunset",
            customDesign: {
                backgroundColor: "#fbbf24",
                buttonStyle: "solid",
                buttonShape: "pill",
                buttonColor: "#7c3aed",
                buttonTextColor: "#ffffff",
                fontPair: "elegant",
                roundedAvatar: true,
            },
        },
        links: [
            {
                id: "1",
                title: "Portfolio",
                url: "#",
                isEnabled: true,
                clicks: 200,
                type: "link",
                sparklineData: [],
            },
            {
                id: "2",
                title: "GitHub",
                url: "#",
                isEnabled: true,
                clicks: 120,
                type: "link",
                sparklineData: [],
            },
            {
                id: "3",
                title: "LinkedIn",
                url: "#",
                isEnabled: true,
                clicks: 80,
                type: "link",
                sparklineData: [],
            },
        ],
    },
    {
        id: "fallback-3",
        user: {
            name: "Fitness Pro",
            handle: "fitnesspro",
            avatar: "/assets/images/screenshots/screen3.webp",
            bio: "Entrenador personal",
            theme: "forest",
            customDesign: {
                backgroundColor: "#22c55e",
                buttonStyle: "soft",
                buttonShape: "rounded",
                buttonColor: "#15803d",
                buttonTextColor: "#ffffff",
                fontPair: "modern",
                roundedAvatar: true,
            },
        },
        links: [
            {
                id: "1",
                title: "Planes",
                url: "#",
                isEnabled: true,
                clicks: 300,
                type: "link",
                sparklineData: [],
            },
            {
                id: "2",
                title: "WhatsApp",
                url: "#",
                isEnabled: true,
                clicks: 250,
                type: "link",
                sparklineData: [],
            },
            {
                id: "3",
                title: "Tienda",
                url: "#",
                isEnabled: true,
                clicks: 180,
                type: "link",
                sparklineData: [],
            },
        ],
    },
];

export default function HeroSection({
    landings: initialLandings,
}: HeroSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    // Use props or fallback data
    const landings =
        initialLandings && initialLandings.length > 0
            ? initialLandings
            : fallbackData;

    // Auto-rotate every 4 seconds
    useEffect(() => {
        if (landings.length === 0) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % landings.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [landings.length]);

    // Calculate position for each phone based on activeIndex
    // Creates a swipe carousel effect - back phone on left, front exits right
    const getPhonePosition = (phoneIndex: number) => {
        const totalPhones = landings.length;
        const relativePos =
            (phoneIndex - activeIndex + totalPhones) % totalPhones;

        // Position configurations with lateral movement for swipe effect
        if (relativePos === 0) {
            // Front - main phone (centered, lower)
            return {
                translateX: 0,
                translateY: 40,
                translateZ: 60,
                rotateX: -3,
                rotateY: 0,
                scale: 0.58,
                opacity: 1,
                zIndex: 50,
            };
        } else if (relativePos === 1) {
            // Next - behind, to the left, and above (waiting to come in)
            return {
                translateX: -80,
                translateY: -50,
                translateZ: -30,
                rotateX: 10,
                rotateY: 8,
                scale: 0.52,
                opacity: 0.9,
                zIndex: 40,
            };
        } else if (relativePos === totalPhones - 1) {
            // Previous - exiting to the right (just left the front)
            return {
                translateX: 120,
                translateY: 20,
                translateZ: -40,
                rotateX: 0,
                rotateY: -10,
                scale: 0.45,
                opacity: 0,
                zIndex: 30,
            };
        } else {
            // Hidden phones - far left, stacked behind
            return {
                translateX: -80,
                translateY: -60,
                translateZ: -60,
                rotateX: 12,
                rotateY: 8,
                scale: 0.42,
                opacity: 0,
                zIndex: 10,
            };
        }
    };

    // Show content if we have landings
    const showContent = landings.length > 0;

    return (
        <section className="relative min-h-screen flex items-center pt-20 pb-40 lg:pb-28 lg:pt-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary-50">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                <div className="absolute top-20 -left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 -right-20 w-72 h-72 md:w-96 md:h-96 bg-orange-300/20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Grid layout: text left (aligned right), phones center-right on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-center">
                    {/* Text Content - Left column, aligned towards phone */}
                    <div className="text-center lg:text-right max-w-xl mx-auto lg:mx-0 lg:ml-auto lg:pr-8 mb-8 lg:mb-0">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-full text-sm font-semibold mb-6">
                            <Rocket size={14} />
                            <span>Version 2.0 disponible</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-[1.1] tracking-tight">
                            Todos tus enlaces <br className="hidden sm:block" />
                            <span className="text-brand-500">
                                en un solo lugar.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                            Mantene a toda tu audiencia conectada a tus redes,
                            contenidos y pasiones desde un unico perfil
                            personalizable.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4 mb-6">
                            <Link
                                href="/auth/register"
                                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-base sm:text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <Zap className="w-5 h-5 sm:w-[20px] sm:h-[20px]" />
                                CREA TU LINKEA GRATIS
                                <ArrowRight className="w-5 h-5 sm:w-[20px] sm:h-[20px]" />
                            </Link>
                        </div>

                        {/* Features highlight */}
                        <div className="inline-flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                100% gratis
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                                Sin limites
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                                Personalizable
                            </span>
                        </div>

                        <div className="mt-6 text-gray-500">
                            Ya estas en Linkea?{" "}
                            <Link
                                href="/auth/login"
                                className="text-brand-500 font-semibold hover:text-brand-600 hover:underline transition-colors"
                            >
                                Iniciar Sesion
                            </Link>
                        </div>
                    </div>

                    {/* 3D Phone Stack Carousel - Right column, positioned towards center */}
                    <div className="flex flex-col items-center justify-center lg:pl-8 mt-6 lg:mt-0">
                        {/* Floating animation container */}
                        <div
                            className="relative flex items-center justify-center h-[380px] lg:h-[480px] w-[260px] lg:w-[300px]"
                            style={{
                                perspective: "1000px",
                                transformStyle: "preserve-3d",
                            }}
                        >
                            {/* CSS animations for different floating effects */}
                            <style>{`
                                @keyframes float-front {
                                    0%, 100% { transform: translateY(0px); }
                                    50% { transform: translateY(-10px); }
                                }
                                @keyframes float-back {
                                    0%, 100% { transform: translateY(0px); }
                                    50% { transform: translateY(-6px); }
                                }
                                .animate-float-front {
                                    animation: float-front 4s ease-in-out infinite;
                                }
                                .animate-float-back {
                                    animation: float-back 2.8s ease-in-out infinite;
                                    animation-delay: -0.5s;
                                }
                            `}</style>

                            {/* Render phones in reverse order so front is rendered last (on top) */}
                            {showContent &&
                                [...landings]
                                    .reverse()
                                    .map((landing, reverseIdx) => {
                                        const phoneIndex =
                                            landings.length - 1 - reverseIdx;
                                        const pos =
                                            getPhonePosition(phoneIndex);
                                        const isFront =
                                            (phoneIndex -
                                                activeIndex +
                                                landings.length) %
                                                landings.length ===
                                            0;

                                        return (
                                            <div
                                                key={landing.id}
                                                className="absolute left-1/2 top-1/2 transition-all duration-700 ease-out"
                                                style={{
                                                    transform: `
                                                        translateX(calc(-50% + ${pos.translateX}px))
                                                        translateY(calc(-50% + ${pos.translateY}px))
                                                        translateZ(${pos.translateZ}px)
                                                        rotateX(${pos.rotateX}deg)
                                                        rotateY(${pos.rotateY}deg)
                                                        scale(${pos.scale})
                                                    `,
                                                    transformStyle:
                                                        "preserve-3d",
                                                    opacity: pos.opacity,
                                                    zIndex: pos.zIndex,
                                                    filter: isFront
                                                        ? "none"
                                                        : "brightness(0.9)",
                                                }}
                                            >
                                                <a
                                                    href={`/${landing.user.handle.replace(
                                                        "@",
                                                        ""
                                                    )}`}
                                                    target="_blank"
                                                    className={`relative block ${
                                                        isFront
                                                            ? "animate-float-front"
                                                            : "animate-float-back"
                                                    }`}
                                                >
                                                    {/* Glow effect for front phone */}
                                                    {isFront && (
                                                        <div
                                                            className="absolute inset-0 bg-gradient-to-b from-primary-500/30 via-brand-500/20 to-orange-500/30 rounded-[3rem] blur-2xl scale-110 animate-pulse"
                                                            style={{
                                                                animationDuration:
                                                                    "3s",
                                                            }}
                                                        />
                                                    )}
                                                    {/* Shadow under phone */}
                                                    <div
                                                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[60%] h-8 bg-black/20 rounded-[100%] blur-xl transition-all duration-700"
                                                        style={{
                                                            opacity: isFront
                                                                ? 0.4
                                                                : 0.15,
                                                            transform: `translateX(-50%) scale(${
                                                                isFront
                                                                    ? 1
                                                                    : 0.7
                                                            })`,
                                                        }}
                                                    />
                                                    {/* PhonePreview - non-interactive, entire phone is the link */}
                                                    <div className="pointer-events-none overflow-hidden rounded-[56px]">
                                                        <PhonePreview
                                                            user={landing.user}
                                                            links={
                                                                landing.links
                                                            }
                                                            device="mobile"
                                                            scale={1}
                                                            className="relative z-10"
                                                            isPreview={true}
                                                        />
                                                    </div>
                                                </a>
                                            </div>
                                        );
                                    })}
                        </div>

                        {/* Navigation dots - dynamic based on number of landings */}
                        {showContent && (
                            <div className="flex gap-2.5 mt-32 lg:mt-20 pb-4">
                                {landings.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveIndex(index)}
                                        className={`h-2.5 rounded-full transition-all duration-300 ${
                                            activeIndex === index
                                                ? "bg-brand-500 w-8"
                                                : "bg-gray-300 hover:bg-gray-400 w-2.5"
                                        }`}
                                        aria-label={`Ver linkea ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
