/**
 * LandingCard - Mini phone preview for gallery grid
 *
 * Uses PhonePreview scaled down for consistent rendering.
 * Wraps in a Link to the actual landing page.
 */

import { PhonePreview } from "@/Components/Shared/PhonePreview";
import { FeaturedLanding } from "@/Components/Web/Home/HeroSection";
import { ExternalLink } from "lucide-react";

interface LandingCardProps {
    landing: FeaturedLanding;
}

export function LandingCard({ landing }: LandingCardProps) {
    const { landing: landingProfile, links } = landing;
    const handle = landingProfile.handle?.replace("@", "") || "";

    return (
        <a
            href={`/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block"
        >
            {/* Card container */}
            <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-brand-200">
                {/* Mini phone preview - scaled down, no frame */}
                <div className="relative overflow-hidden flex justify-center pt-3 pb-12">
                    {/* Wrapper to clip and contain the scaled phone */}
                    <div
                        className="relative pointer-events-none"
                        style={{
                            width: 380 * 0.55,
                            height: 780 * 0.55,
                            overflow: "hidden",
                        }}
                    >
                        <PhonePreview
                            landing={landingProfile}
                            links={links.slice(0, 4)}
                            socialLinks={[]}
                            device="mobile"
                            scale={0.55}
                            isPreview={true}
                            showFrame={false}
                        />
                    </div>

                    {/* Hover overlay - Only over preview area */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-white text-gray-900 px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 transform scale-90 translate-y-4 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300">
                            <ExternalLink
                                size={16}
                                className="text-brand-500"
                            />
                            <span className="text-sm font-bold tracking-tight">
                                Visitar
                            </span>
                        </div>
                    </div>
                </div>

                {/* Card footer - centered handle */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-4 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                        <span className="text-xs font-semibold text-gray-700 truncate max-w-[140px]">
                            @{handle}
                        </span>
                        {(landingProfile.isVerified || landingProfile.isLegacy) && (
                            <img
                                src="/assets/images/icons/official.svg"
                                alt="Verificado"
                                className="w-4 h-4 shrink-0"
                                title="Cuenta verificada"
                            />
                        )}
                    </div>
                </div>
            </div>
        </a>
    );
}
