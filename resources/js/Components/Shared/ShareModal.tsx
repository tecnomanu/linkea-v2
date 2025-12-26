/**
 * ShareModal - Modal for sharing landing page on social networks
 * Similar to Linktree's share modal with quick copy and social buttons
 */

import {
    Dialog,
    DialogBody,
    DialogCloseButton,
    DialogContent,
} from "@/Components/ui/Dialog";
import { UserProfile } from "@/types";
import { usePage } from "@inertiajs/react";
import { Check, Copy, Facebook, Linkedin, QrCode } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

// X (Twitter) icon component
const XIcon: React.FC<{ size?: number; className?: string }> = ({
    size = 24,
    className,
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

// Messenger icon component
const MessengerIcon: React.FC<{ size?: number; className?: string }> = ({
    size = 24,
    className,
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.913 1.454 5.512 3.726 7.21V22l3.405-1.869c.909.252 1.871.388 2.869.388 5.523 0 10-4.145 10-9.259C22 6.145 17.523 2 12 2zm.994 12.469l-2.547-2.72-4.97 2.72 5.467-5.803 2.609 2.72 4.908-2.72-5.467 5.803z" />
    </svg>
);

// Telegram icon component
const TelegramIcon: React.FC<{ size?: number; className?: string }> = ({
    size = 24,
    className,
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
);

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile;
    /** The full URL to share */
    shareUrl: string;
}

interface ShareOption {
    id: string;
    name: string;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    getUrl: (url: string, title: string) => string;
}

const shareOptions: ShareOption[] = [
    {
        id: "x",
        name: "X",
        icon: <XIcon size={22} />,
        bgColor: "bg-black",
        textColor: "text-white",
        getUrl: (url, title) =>
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                url
            )}&text=${encodeURIComponent(title)}`,
    },
    {
        id: "facebook",
        name: "Facebook",
        icon: <Facebook size={22} />,
        bgColor: "bg-[#1877F2]",
        textColor: "text-white",
        getUrl: (url) =>
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                url
            )}`,
    },
    {
        id: "whatsapp",
        name: "WhatsApp",
        icon: (
            <img
                src="/assets/images/icons/brands/whatsapp.svg"
                alt="WhatsApp"
                className="w-6 h-6"
            />
        ),
        bgColor: "bg-[#25D366]",
        textColor: "text-white",
        getUrl: (url, title) =>
            `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        icon: <Linkedin size={22} />,
        bgColor: "bg-[#0A66C2]",
        textColor: "text-white",
        getUrl: (url) =>
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                url
            )}`,
    },
    {
        id: "messenger",
        name: "Messenger",
        icon: <MessengerIcon size={22} />,
        bgColor: "bg-gradient-to-br from-[#00B2FF] to-[#006AFF]",
        textColor: "text-white",
        getUrl: (url) =>
            `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
                url
            )}&app_id=291494419107518&redirect_uri=${encodeURIComponent(url)}`,
    },
    {
        id: "telegram",
        name: "Telegram",
        icon: <TelegramIcon size={22} />,
        bgColor: "bg-[#0088cc]",
        textColor: "text-white",
        getUrl: (url, title) =>
            `https://t.me/share/url?url=${encodeURIComponent(
                url
            )}&text=${encodeURIComponent(title)}`,
    },
];

export const ShareModal: React.FC<ShareModalProps> = ({
    isOpen,
    onClose,
    user,
    shareUrl,
}) => {
    const [copied, setCopied] = useState(false);
    const { appUrl } = usePage<{ appUrl: string }>().props;

    // Display domain without protocol for cleaner look
    const displayDomain = appUrl?.replace(/^https?:\/\//, "") || "linkea.ar";
    const cleanHandle = user.handle?.replace("@", "") || "";

    // Use SEO title if available, otherwise fallback to name, then handle
    const displayName = user.seoTitle || user.name || `@${cleanHandle}`;

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [shareUrl]);

    const handleShare = (option: ShareOption) => {
        const title = displayName ? `${displayName} en Linkea` : "Mi Linkea";
        const url = option.getUrl(shareUrl, title);
        window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
    };

    // Generate QR code URL using free QRServer API (dark mode: black bg, white code)
    const qrCodeUrl = useMemo(() => {
        const size = 200;
        const bgColor = "000000"; // Black background
        const fgColor = "FFFFFF"; // White foreground
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
            shareUrl
        )}&bgcolor=${bgColor}&color=${fgColor}&margin=1`;
    }, [shareUrl]);

    return (
        <Dialog isOpen={isOpen} onClose={onClose} zIndex={200}>
            <DialogContent maxWidth="sm" className="!rounded-3xl">
                {/* Header - Compact */}
                <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <h2 className="text-lg font-bold text-neutral-900">
                        Compartir Linkea
                    </h2>
                    <DialogCloseButton onClick={onClose} variant="minimal" />
                </div>

                <DialogBody className="!p-4 !pt-0">
                    {/* Hero Card - Same background as landing */}
                    <div
                        className="rounded-2xl p-5 mb-4 text-center"
                        style={{
                            backgroundColor:
                                user.customDesign?.backgroundColor || "#1a1a1a",
                        }}
                    >
                        {/* QR Code - Black bg, white code */}
                        <div className="w-32 h-32 mx-auto mb-4 rounded-xl overflow-hidden bg-black p-2 shadow-lg">
                            <img
                                src={qrCodeUrl}
                                alt="QR Code"
                                className="w-full h-full"
                                loading="lazy"
                            />
                        </div>

                        {/* Handle and URL */}
                        <p
                            className="font-bold text-lg mb-1"
                            style={{
                                color:
                                    user.customDesign?.textColor || "#ffffff",
                            }}
                        >
                            @{cleanHandle}
                        </p>
                        <p
                            className="text-sm opacity-70 flex items-center justify-center gap-1.5"
                            style={{
                                color:
                                    user.customDesign?.textColor || "#ffffff",
                            }}
                        >
                            <QrCode size={14} className="opacity-50" />
                            {displayDomain}/{cleanHandle}
                        </p>
                    </div>

                    {/* Copy Link Button - Black with white text */}
                    <button
                        onClick={handleCopy}
                        className={`w-full flex items-center justify-center gap-2 sm:gap-3 py-2.5 sm:py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 mb-4 text-sm sm:text-base ${
                            copied
                                ? "bg-green-500 text-white"
                                : "bg-black hover:bg-neutral-800 text-white"
                        }`}
                    >
                        {copied ? (
                            <>
                                <Check size={18} className="sm:w-5 sm:h-5" />
                                <span>Link copiado</span>
                            </>
                        ) : (
                            <>
                                <Copy size={18} className="sm:w-5 sm:h-5" />
                                <span>Copiar link</span>
                            </>
                        )}
                    </button>

                    {/* Social Share Options */}
                    <div className="grid grid-cols-6 gap-3 pb-4">
                        {shareOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleShare(option)}
                                className={`flex flex-col items-center gap-1.5 group`}
                                title={option.name}
                            >
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center ${option.bgColor} ${option.textColor} transition-transform duration-200 group-hover:scale-110 group-active:scale-95`}
                                >
                                    {option.icon}
                                </div>
                                <span className="text-[10px] text-neutral-500 font-medium truncate w-full text-center">
                                    {option.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </DialogBody>

                {/* Footer CTA - Same size as copy button, 50/50 split */}
                <div className="border-t border-neutral-100 px-4 pb-4 pt-3 bg-neutral-50/50">
                    <div className="text-center mb-3">
                        <p className="text-sm sm:text-base font-bold text-neutral-900">
                            Unite a Linkea
                        </p>
                        <p className="text-sm sm:text-base text-neutral-500">
                            Obtene tu propio Linkea gratis.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href="/auth/register"
                            className="flex-1 py-2.5 sm:py-3.5 bg-black text-white text-center font-semibold rounded-xl hover:bg-neutral-800 transition-colors text-sm sm:text-base"
                        >
                            Registrate
                        </a>
                        <a
                            href="/"
                            className="flex-1 py-2.5 sm:py-3.5 bg-white border border-neutral-200 text-neutral-900 text-center font-semibold rounded-xl hover:bg-neutral-50 transition-colors text-sm sm:text-base"
                        >
                            Descubrir
                        </a>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareModal;
