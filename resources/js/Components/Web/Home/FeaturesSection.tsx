import {
    getWebFeatures,
    renderBlockTypeIcon,
} from "@/Components/Shared/blocks/blockConfig";
import { PhonePreview } from "@/Components/Shared/PhonePreview";
import { BlockType, LinkBlock, UserProfile } from "@/types";
import { useEffect, useState } from "react";

// Demo profiles for the phone preview
interface DemoProfile {
    id: string;
    label: string;
    user: UserProfile;
    links: LinkBlock[];
}

const DEMO_PROFILES: DemoProfile[] = [
    // Musician - Showcases Spotify embeds
    {
        id: "musician",
        label: "Musico",
        user: {
            name: "Lucas Beats",
            handle: "lucasbeats",
            avatar: "https://ui-avatars.com/api/?name=Lucas+B&background=7c3aed&color=fff&size=200",
            title: "Lucas Beats",
            subtitle: "Productor Musical & DJ",
            theme: "midnight",
            customDesign: {
                backgroundColor: "#1e1b4b",
                buttonStyle: "soft",
                buttonShape: "pill",
                buttonColor: "#a855f7",
                buttonTextColor: "#ffffff",
                fontPair: "mono",
            },
        },
        links: [
            {
                id: "1",
                title: "Mi musica",
                url: "",
                isEnabled: true,
                clicks: 0,
                type: "header",
                headerSize: "small",
                sparklineData: [],
            },
            {
                id: "2",
                title: "Escucha en Spotify",
                url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
                isEnabled: true,
                clicks: 1250,
                type: "spotify",
                mediaDisplayMode: "preview",
                playerSize: "compact",
                sparklineData: [],
            },
            {
                id: "3",
                title: "Nuevo EP disponible",
                url: "https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv",
                isEnabled: true,
                clicks: 890,
                type: "spotify",
                mediaDisplayMode: "both",
                sparklineData: [],
            },
            {
                id: "4",
                title: "Beats para comprar",
                url: "https://linkea.ar",
                isEnabled: true,
                clicks: 456,
                type: "link",
                sparklineData: [],
            },
            {
                id: "5",
                title: "Contacto profesional",
                url: "mailto:lucas@beats.com",
                isEnabled: true,
                clicks: 234,
                type: "email",
                emailAddress: "lucas@beats.com",
                sparklineData: [],
            },
        ],
    },
    // Fitness Coach - Showcases Calendar + WhatsApp
    {
        id: "fitness",
        label: "Fitness",
        user: {
            name: "Sofia Martinez",
            handle: "sofimart",
            avatar: "https://ui-avatars.com/api/?name=Sofia+M&background=ec4899&color=fff&size=200",
            title: "Sofia Martinez",
            subtitle: "Fitness Coach & Content Creator",
            theme: "sunset",
            customDesign: {
                backgroundColor: "#fef3c7",
                buttonStyle: "solid",
                buttonShape: "rounded",
                buttonColor: "#ec4899",
                buttonTextColor: "#ffffff",
                fontPair: "modern",
            },
        },
        links: [
            {
                id: "1",
                title: "Mis servicios",
                url: "",
                isEnabled: true,
                clicks: 0,
                type: "header",
                headerSize: "small",
                sparklineData: [],
            },
            {
                id: "2",
                title: "Agenda tu clase",
                url: "https://calendly.com/sofimart",
                isEnabled: true,
                clicks: 345,
                type: "calendar",
                calendarProvider: "calendly",
                calendarDisplayMode: "button",
                sparklineData: [],
            },
            {
                id: "3",
                title: "Plan de nutricion",
                url: "https://linkea.ar",
                isEnabled: true,
                clicks: 189,
                type: "link",
                sparklineData: [],
            },
            {
                id: "4",
                title: "Mis rutinas en YouTube",
                url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
                isEnabled: true,
                clicks: 567,
                type: "youtube",
                mediaDisplayMode: "both",
                sparklineData: [],
            },
            {
                id: "5",
                title: "Escribime por WhatsApp",
                url: "https://wa.me/5491112345678",
                isEnabled: true,
                clicks: 312,
                type: "whatsapp",
                phoneNumber: "5491112345678",
                predefinedMessage: "Hola! Quiero info sobre clases",
                sparklineData: [],
            },
        ],
    },
    // Streamer - Showcases Twitch + YouTube embeds
    {
        id: "streamer",
        label: "Streamer",
        user: {
            name: "NightWolf Gaming",
            handle: "nightwolfgg",
            avatar: "https://ui-avatars.com/api/?name=NW&background=6366f1&color=fff&size=200",
            title: "NightWolf Gaming",
            subtitle: "Streamer & Content Creator",
            theme: "ocean",
            customDesign: {
                backgroundColor: "#0f172a",
                buttonStyle: "hard",
                buttonShape: "rounded",
                buttonColor: "#6366f1",
                buttonTextColor: "#ffffff",
                fontPair: "modern",
            },
        },
        links: [
            {
                id: "1",
                title: "Mis redes",
                url: "",
                isEnabled: true,
                clicks: 0,
                type: "header",
                headerSize: "small",
                sparklineData: [],
            },
            {
                id: "2",
                title: "En vivo en Twitch",
                url: "https://twitch.tv/nightwolfgg",
                isEnabled: true,
                clicks: 3420,
                type: "twitch",
                mediaDisplayMode: "preview",
                sparklineData: [],
            },
            {
                id: "3",
                title: "Ultimo video",
                url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
                isEnabled: true,
                clicks: 2100,
                type: "youtube",
                mediaDisplayMode: "preview",
                sparklineData: [],
            },
            {
                id: "4",
                title: "Discord comunidad",
                url: "https://discord.gg/nightwolf",
                isEnabled: true,
                clicks: 1560,
                type: "link",
                sparklineData: [],
            },
            {
                id: "5",
                title: "Tienda de merch",
                url: "https://linkea.ar/merch",
                isEnabled: true,
                clicks: 780,
                type: "link",
                sparklineData: [],
            },
        ],
    },
];

export default function FeaturesSection() {
    const [activeProfileIndex, setActiveProfileIndex] = useState(0);
    const activeProfile = DEMO_PROFILES[activeProfileIndex];

    // Get features from centralized config - always in sync
    const features = getWebFeatures();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Auto-advance on mobile
    useEffect(() => {
        if (!isMobile) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % features.length);
        }, 3500);

        return () => clearInterval(interval);
    }, [isMobile, features.length]);

    // Swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;
        const threshold = 50;

        if (diff > threshold) {
            // Swipe left - next
            setCurrentIndex((prev) => (prev + 1) % features.length);
        } else if (diff < -threshold) {
            // Swipe right - previous
            setCurrentIndex(
                (prev) => (prev - 1 + features.length) % features.length
            );
        }
        setTouchStart(null);
    };

    return (
        <section className="py-12 md:py-24 bg-gradient-to-br from-primary-500 via-primary-600 to-orange-500 relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-8 md:mb-16">
                    <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-4">
                        Mas herramientas
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        Bloques disponibles
                    </h2>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Todo lo que necesitas para crear una pagina increible
                    </p>
                </div>

                {/* Mobile Slider */}
                <div className="lg:hidden">
                    <div
                        className="overflow-hidden touch-pan-y"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{
                                transform: `translateX(-${
                                    currentIndex * 100
                                }%)`,
                            }}
                        >
                            {features.map((feature) => (
                                <div
                                    key={feature.id}
                                    className="w-full flex-shrink-0 px-4"
                                >
                                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm mx-auto flex gap-4 items-start">
                                        <div
                                            className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center ${feature.colorClass} shadow-lg`}
                                        >
                                            {renderBlockTypeIcon(
                                                feature.id as BlockType,
                                                28
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {feature.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots indicator */}
                    <div className="flex justify-center gap-2 mt-6">
                        {features.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    idx === currentIndex
                                        ? "bg-white w-6"
                                        : "bg-white/40 w-2"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop Layout - Grid enables proper sticky behavior */}
                <div className="hidden lg:grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Phone Preview (Sticky) - sticky applied directly to grid cell */}
                    <div className="sticky top-24 self-start flex flex-col items-center justify-self-end">
                        <PhonePreview
                            user={activeProfile.user}
                            links={activeProfile.links}
                            device="mobile"
                            scale={0.7}
                        />
                        {/* Profile selector buttons */}
                        <div className="flex gap-2 mt-6">
                            {DEMO_PROFILES.map((profile, idx) => (
                                <button
                                    key={profile.id}
                                    onClick={() => setActiveProfileIndex(idx)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                        activeProfileIndex === idx
                                            ? "bg-white text-gray-900 shadow-lg"
                                            : "bg-white/20 text-white hover:bg-white/30"
                                    }`}
                                >
                                    {profile.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                        {features.map((feature, idx) => (
                            <div
                                key={feature.id}
                                className="group bg-white rounded-2xl p-5 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex gap-4 items-start"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div
                                    className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${feature.colorClass} shadow-lg`}
                                >
                                    {renderBlockTypeIcon(
                                        feature.id as BlockType,
                                        24
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
