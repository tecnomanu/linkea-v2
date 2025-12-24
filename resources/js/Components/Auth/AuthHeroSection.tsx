import { Instagram, Youtube, Music } from "lucide-react";

interface AuthHeroSectionProps {
    variant?: "login" | "register" | "default";
}

/**
 * Decorative hero section for auth pages
 * Shows a colorful background with floating elements and an image
 */
export function AuthHeroSection({ variant = "default" }: AuthHeroSectionProps) {
    // Different color schemes based on variant
    const colorSchemes = {
        login: "from-brand-500 via-brand-600 to-indigo-700",
        register: "from-amber-400 via-orange-500 to-rose-500",
        default: "from-brand-500 via-purple-600 to-indigo-700",
    };

    return (
        <div
            className={`hidden lg:flex relative w-full h-full bg-gradient-to-br ${colorSchemes[variant]} overflow-hidden`}
        >
            {/* Background decorative shapes */}
            <div className="absolute inset-0">
                {/* Large circle */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

                {/* Geometric shapes */}
                <div className="absolute top-1/4 right-1/4 w-32 h-32 border-4 border-white/20 rounded-3xl rotate-12 animate-pulse" />
                <div className="absolute bottom-1/3 left-1/4 w-24 h-24 border-4 border-white/20 rounded-full animate-pulse delay-300" />
            </div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12">
                {/* Floating social icons */}
                <div className="absolute top-16 right-16 flex flex-col gap-4">
                    <FloatingIcon
                        icon={<Instagram className="w-6 h-6" />}
                        delay="0ms"
                    />
                    <FloatingIcon
                        icon={<Youtube className="w-6 h-6" />}
                        delay="150ms"
                    />
                    <FloatingIcon
                        icon={<Music className="w-6 h-6" />}
                        delay="300ms"
                    />
                </div>

                {/* Main image */}
                <div className="relative">
                    <img
                        src="/assets/images/girl-holding-phone.webp"
                        alt="Persona usando Linkea"
                        className="w-full max-w-md object-contain drop-shadow-2xl"
                    />

                    {/* Floating card element */}
                    <div className="absolute -left-8 top-1/3 bg-white rounded-2xl shadow-2xl p-4 animate-float">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full" />
                            <div>
                                <div className="h-2 w-20 bg-neutral-200 rounded-full" />
                                <div className="h-2 w-14 bg-neutral-100 rounded-full mt-1" />
                            </div>
                        </div>
                    </div>

                    {/* Phone preview element */}
                    <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-2xl p-3 animate-float-delayed">
                        <img
                            src="/assets/images/linkea-cellphone-perspective.webp"
                            alt="Preview del celular"
                            className="w-24 h-auto"
                        />
                    </div>
                </div>

                {/* Bottom tagline */}
                <div className="mt-8 text-center">
                    <p className="text-white/90 text-lg font-medium">
                        Tu espacio digital, todos tus links
                    </p>
                    <p className="text-white/70 text-sm mt-1">
                        en un solo lugar
                    </p>
                </div>
            </div>
        </div>
    );
}

// Floating icon component
function FloatingIcon({
    icon,
    delay,
}: {
    icon: React.ReactNode;
    delay: string;
}) {
    return (
        <div
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl text-neutral-800 animate-bounce-slow"
            style={{ animationDelay: delay }}
        >
            {icon}
        </div>
    );
}

