import {
    Headphones,
    Link as LinkIcon,
    MessageCircle,
    Type,
    Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LinkBlock, UserProfile } from "../../../types";
import { PhonePreview } from "../../Shared/PhonePreview";

export default function FeaturesSection() {
    const mockUser: UserProfile = {
        name: "Features Demo",
        handle: "@demo",
        avatar: "https://ui-avatars.com/api/?name=Features&background=8b5cf6&color=fff",
        bio: "Mira todo lo que puedes agregar a tu Linkea.",
        theme: "midnight",
        customDesign: {
            backgroundColor: "#1e1b4b",
            buttonStyle: "hard",
            buttonShape: "sharp",
            buttonColor: "#f43f5e",
            buttonTextColor: "#ffffff",
            fontPair: "mono",
        },
    };

    const mockLinks: LinkBlock[] = [
        {
            id: "1",
            title: "Video Destacado",
            url: "https://youtube.com",
            isEnabled: true,
            clicks: 0,
            type: "youtube",
            showInlinePlayer: true,
            sparklineData: [],
        },
        {
            id: "2",
            title: "Mi Playlist",
            url: "https://spotify.com",
            isEnabled: true,
            clicks: 0,
            type: "spotify",
            showInlinePlayer: true,
            playerSize: "compact",
            sparklineData: [],
        },
        {
            id: "3",
            title: "Contactame",
            url: "#",
            isEnabled: true,
            clicks: 0,
            type: "whatsapp",
            phoneNumber: "123456",
            sparklineData: [],
        },
        {
            id: "4",
            title: "Seccion Importante",
            url: "",
            isEnabled: true,
            clicks: 0,
            type: "header",
            headerSize: "medium",
            sparklineData: [],
        },
        {
            id: "5",
            title: "Sitio Web",
            url: "https://linkea.ar",
            isEnabled: true,
            clicks: 0,
            type: "link",
            sparklineData: [],
        },
    ];

    const features = [
        {
            id: "youtube",
            title: "YouTube",
            desc: "Muestra en linea videos de la plataforma mas famosa del mundo.",
            icon: Youtube,
            color: "text-white",
            bg: "bg-red-500",
        },
        {
            id: "spotify",
            title: "Spotify",
            desc: "Pone play a tus canciones en linea para tus visitantes con el reproductor integrado.",
            icon: Headphones,
            color: "text-white",
            bg: "bg-green-500",
        },
        {
            id: "whatsapp",
            title: "WhatsApp",
            desc: "Es importante que los usuarios puedan comunicarse con vos directamente. Abre WhatsApp con un mensaje predefinido.",
            icon: MessageCircle,
            color: "text-white",
            bg: "bg-emerald-500",
        },
        {
            id: "heading",
            title: "Linea de Texto",
            desc: "Es bueno organizarse, para eso podes usar lineas de titulos que separen tus bloques como mas te guste.",
            icon: Type,
            color: "text-white",
            bg: "bg-gray-700",
        },
        {
            id: "link",
            title: "Enlace",
            desc: "Crea enlaces a tus redes o cualquier sitio en la web que quieras compartir con los visitantes.",
            icon: LinkIcon,
            color: "text-white",
            bg: "bg-blue-500",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

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

    return (
        <section className="py-24 bg-gradient-to-br from-primary-500 via-primary-600 to-orange-500 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
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
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {features.map((feature) => (
                                <div key={feature.id} className="w-full flex-shrink-0 px-4">
                                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm mx-auto flex gap-4 items-start">
                                        <div
                                            className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center ${feature.bg} ${feature.color} shadow-lg`}
                                        >
                                            <feature.icon size={28} strokeWidth={2} />
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

                    {/* Phone Preview below slider on mobile */}
                    <div className="flex justify-center mt-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/10 rounded-[3rem] blur-2xl scale-90" />
                            <PhonePreview
                                user={mockUser}
                                links={mockLinks}
                                device="mobile"
                                scale={0.7}
                                className="relative z-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex flex-row gap-12 items-start max-w-6xl mx-auto">
                    {/* Phone Preview (Sticky) */}
                    <div className="flex-1 w-full sticky top-24 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/10 rounded-[3rem] blur-2xl scale-90" />
                            <PhonePreview
                                user={mockUser}
                                links={mockLinks}
                                device="mobile"
                                scale={0.8}
                                className="relative z-10"
                            />
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="flex-1 w-full space-y-4">
                        {features.map((feature, idx) => (
                            <div
                                key={feature.id}
                                className="group bg-white rounded-2xl p-5 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex gap-4 items-start"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div
                                    className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${feature.bg} ${feature.color} shadow-lg`}
                                >
                                    <feature.icon size={24} strokeWidth={2} />
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
