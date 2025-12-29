import { LinkBlock, UserProfile } from "@/types";
import { Monitor, Smartphone, Tablet, X } from "lucide-react";
import React, { useState } from "react";
import { LandingContent } from "./LandingContent";
import { DeviceMode, PhonePreview, SocialLink } from "./PhonePreview";

interface DevicePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile;
    links: LinkBlock[];
    socialLinks?: SocialLink[];
    initialDevice?: DeviceMode;
}

export const DevicePreviewModal: React.FC<DevicePreviewModalProps> = ({
    isOpen,
    onClose,
    user,
    links,
    socialLinks = [],
    initialDevice = "mobile",
}) => {
    const [previewDevice, setPreviewDevice] =
        useState<DeviceMode>(initialDevice);

    // Update device when initialDevice changes (e.g., opened from different button)
    React.useEffect(() => {
        setPreviewDevice(initialDevice);
    }, [initialDevice]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-neutral-950 flex flex-col animate-in fade-in duration-200">
            {/* Mobile: Fullscreen content without mockup */}
            <div className="sm:hidden flex-1 relative">
                {/* Close button - top right corner */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm"
                    aria-label="Close Preview"
                >
                    <X size={20} />
                </button>

                {/* Fullscreen content */}
                <div className="h-full w-full overflow-auto overlay-scrollbar">
                    <LandingContent
                        user={user}
                        links={links}
                        socialLinks={socialLinks}
                        device="mobile"
                        isPreview={true}
                    />
                </div>
            </div>

            {/* Desktop/Tablet: Full controls with device selector and mockup */}
            <div className="hidden sm:flex flex-col flex-1">
                {/* Modal Header / Controls */}
                <div className="h-16 shrink-0 bg-neutral-900 border-b border-white/10 flex items-center justify-between px-6 z-50 relative">
                    <h2 className="text-white font-bold text-lg">
                        Device Preview
                    </h2>

                    {/* Device Toggles */}
                    <div className="flex bg-black p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setPreviewDevice("mobile")}
                            className={`p-2 rounded-lg transition-all ${
                                previewDevice === "mobile"
                                    ? "bg-neutral-800 text-white shadow-md"
                                    : "text-neutral-500 hover:text-neutral-300"
                            }`}
                        >
                            <Smartphone size={20} />
                        </button>
                        <button
                            onClick={() => setPreviewDevice("tablet")}
                            className={`p-2 rounded-lg transition-all ${
                                previewDevice === "tablet"
                                    ? "bg-neutral-800 text-white shadow-md"
                                    : "text-neutral-500 hover:text-neutral-300"
                            }`}
                        >
                            <Tablet size={20} />
                        </button>
                        <button
                            onClick={() => setPreviewDevice("desktop")}
                            className={`p-2 rounded-lg transition-all ${
                                previewDevice === "desktop"
                                    ? "bg-neutral-800 text-white shadow-md"
                                    : "text-neutral-500 hover:text-neutral-300"
                            }`}
                        >
                            <Monitor size={20} />
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2.5 bg-neutral-800 hover:bg-red-500/20 text-white hover:text-red-500 border border-white/10 hover:border-red-500/50 rounded-full transition-all"
                        aria-label="Close Preview"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Preview Canvas */}
                <div className="flex-1 overflow-auto overlay-scrollbar bg-neutral-900/50 p-4 sm:p-8 flex items-start justify-center">
                    <PhonePreview
                        user={user}
                        links={links}
                        socialLinks={socialLinks}
                        device={previewDevice}
                        className="animate-in zoom-in-95 duration-300 shadow-2xl"
                        scale={1}
                    />
                </div>
            </div>
        </div>
    );
};
