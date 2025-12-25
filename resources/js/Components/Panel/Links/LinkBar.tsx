import { usePage } from "@inertiajs/react";
import { Check, Copy, ExternalLink, Globe, Share2 } from "lucide-react";
import React, { useState } from "react";

interface LinkBarProps {
    landing: any;
    user: any;
}

export const LinkBar: React.FC<LinkBarProps> = ({ landing, user }) => {
    const { appUrl } = usePage<{ appUrl: string }>().props;
    const [copied, setCopied] = useState(false);
    const domain = landing?.domain_name || landing?.slug || "your-link";
    const publicUrl = `${appUrl}/${domain}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(publicUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: landing?.options?.title || `${user?.name} on Linkea`,
                    text: landing?.name || "Check out my Linkea",
                    url: publicUrl,
                });
            } catch (err) {
                console.log("Share canceled");
            }
        } else {
            // Fallback: Copy to clipboard if Web Share API not supported
            handleCopy();
        }
    };

    return (
        <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-colors">
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
                <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-500 dark:text-neutral-400 shrink-0">
                    <Globe size={20} />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        Tu Linkea:
                    </span>
                    <a
                        href={publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-neutral-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 truncate transition-colors flex items-center gap-1"
                    >
                        {publicUrl}
                        <ExternalLink size={12} className="opacity-50" />
                    </a>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                    onClick={handleCopy}
                    className={`
                flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95
                ${
                    copied
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    <span>{copied ? "¡Copiado!" : "Copiar"}</span>
                </button>

                <button
                    onClick={handleShare}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-xl font-bold text-sm hover:bg-brand-600 active:scale-95 transition-all shadow-lg shadow-brand-500/20"
                >
                    <Share2 size={18} />
                    <span>Compartir</span>
                </button>
            </div>
        </div>
    );
};
