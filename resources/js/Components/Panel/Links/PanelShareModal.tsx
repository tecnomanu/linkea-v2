/**
 * PanelShareModal - Simplified share modal for Panel users
 * Similar to ShareModal but without registration CTAs (user is already logged in)
 */

import {
    Dialog,
    DialogBody,
    DialogCloseButton,
    DialogContent,
} from "@/Components/ui/Dialog";
import { usePage } from "@inertiajs/react";
import { Check, Copy, Facebook, Linkedin, Mail } from "lucide-react";
import React, { useCallback, useState } from "react";

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

interface PanelShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareUrl: string;
    title?: string;
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
        icon: <XIcon size={20} />,
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
        icon: <Facebook size={20} />,
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
                className="w-5 h-5"
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
        icon: <Linkedin size={20} />,
        bgColor: "bg-[#0A66C2]",
        textColor: "text-white",
        getUrl: (url) =>
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                url
            )}`,
    },
    {
        id: "telegram",
        name: "Telegram",
        icon: <TelegramIcon size={20} />,
        bgColor: "bg-[#0088cc]",
        textColor: "text-white",
        getUrl: (url, title) =>
            `https://t.me/share/url?url=${encodeURIComponent(
                url
            )}&text=${encodeURIComponent(title)}`,
    },
    {
        id: "email",
        name: "Email",
        icon: <Mail size={20} />,
        bgColor: "bg-neutral-600",
        textColor: "text-white",
        getUrl: (url, title) =>
            `mailto:?subject=${encodeURIComponent(
                "Mirá mi Linkea!"
            )}&body=${encodeURIComponent(
                `Te invito a conocer mi nuevo Linkea: ${url}`
            )}`,
    },
];

export const PanelShareModal: React.FC<PanelShareModalProps> = ({
    isOpen,
    onClose,
    shareUrl,
    title = "Hey! Te comparto mi Linkea",
}) => {
    const [copied, setCopied] = useState(false);

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
        const url = option.getUrl(shareUrl, title);
        window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} zIndex={200}>
            <DialogContent maxWidth="sm" className="!rounded-3xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                        Compartir en redes
                    </h2>
                    <DialogCloseButton onClick={onClose} variant="minimal" />
                </div>

                <DialogBody className="!p-5 !pt-0">
                    {/* URL Display */}
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3 mb-4">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 font-medium">
                            Tu link:
                        </p>
                        <p className="text-sm font-mono text-neutral-900 dark:text-white truncate">
                            {shareUrl}
                        </p>
                    </div>

                    {/* Copy Link Button */}
                    <button
                        onClick={handleCopy}
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 mb-5 ${
                            copied
                                ? "bg-green-500 text-white"
                                : "bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900"
                        }`}
                    >
                        {copied ? (
                            <>
                                <Check size={18} />
                                <span>¡Copiado!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={18} />
                                <span>Copiar link</span>
                            </>
                        )}
                    </button>

                    {/* Social Share Options */}
                    <div className="space-y-2">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-3">
                            O compartir directamente en:
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {shareOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleShare(option)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl ${option.bgColor} ${option.textColor} transition-transform duration-200 hover:scale-105 active:scale-95`}
                                    title={option.name}
                                >
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        {option.icon}
                                    </div>
                                    <span className="text-xs font-medium">
                                        {option.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};

export default PanelShareModal;

