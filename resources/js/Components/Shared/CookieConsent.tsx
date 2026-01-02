/**
 * Cookie Consent Component
 *
 * Migrated from legacy manage-cookies.js to React.
 * Handles cookie consent banner with Google Analytics and Facebook Pixel tracking.
 *
 * Styling matches legacy: subtle prebanner with theme color, dark modal banner.
 */

import { X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

// Multi-language translations
const TRANSLATIONS: Record<
    string,
    {
        bannerHeading: string;
        bannerDescription: string;
        bannerLinkText: string;
        acceptBtnText: string;
        rejectBtnText: string;
        manageText: string;
    }
> = {
    en: {
        bannerHeading: "We use cookies",
        bannerDescription:
            "We use our own and third-party cookies to personalize content and to analyze web traffic.",
        bannerLinkText: "Read more about cookies",
        acceptBtnText: "Accept cookies",
        rejectBtnText: "Reject",
        manageText: "Manage cookies",
    },
    es: {
        bannerHeading: "Uso de cookies",
        bannerDescription:
            "Utilizamos cookies propias y de terceros para personalizar el contenido y para analizar el trafico de la web.",
        bannerLinkText: "Ver mas sobre las cookies",
        acceptBtnText: "Aceptar cookies",
        rejectBtnText: "Rechazar",
        manageText: "Cookies",
    },
    pt: {
        bannerHeading: "Uso de cookies",
        bannerDescription:
            "Usamos cookies proprios e de terceiros para personalizar o conteudo e analisar o trafego da web.",
        bannerLinkText: "Leia mais sobre os cookies",
        acceptBtnText: "Aceitar cookies",
        rejectBtnText: "Rejeitar",
        manageText: "Gerenciar cookies",
    },
};

interface CookieConsentProps {
    language?: string;
    /** Google Analytics IDs - can be single string or array */
    googleAnalyticsIds?: string | string[];
    facebookPixelId?: string;
    /** Primary color for accept button (defaults to theme button color) */
    accentColor?: string;
    /** Text color for the prebanner - matches landing text color for contrast */
    textColor?: string;
    policyLink?: string;
    position?: "left" | "right";
    hideAfterClick?: boolean;
    /** Hide the floating mini-banner (use when integrating trigger into footer) */
    hideMiniBanner?: boolean;
}

const STORAGE_KEY = "linkea_cookie_consent";

export const CookieConsent: React.FC<CookieConsentProps> = ({
    language = "es",
    googleAnalyticsIds,
    googleAnalyticsId, // deprecated, for backwards compatibility
    facebookPixelId,
    accentColor = "#253b48",
    textColor,
    policyLink = "/privacy",
    position = "left",
    hideAfterClick = false,
    hideMiniBanner = false,
}) => {
    // Normalize analytics IDs to array
    const normalizedGaIds: string[] = (() => {
        const ids: string[] = [];
        if (googleAnalyticsIds) {
            if (Array.isArray(googleAnalyticsIds)) {
                ids.push(...googleAnalyticsIds.filter(Boolean));
            } else if (googleAnalyticsIds) {
                ids.push(googleAnalyticsIds);
            }
        }
        if (googleAnalyticsId && !ids.includes(googleAnalyticsId)) {
            ids.push(googleAnalyticsId);
        }
        return ids;
    })();
    const [showBanner, setShowBanner] = useState(false);
    const [showMiniBanner, setShowMiniBanner] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Get translations
    const browserLang =
        typeof window !== "undefined" ? navigator.language.split("-")[0] : "es";
    const t =
        TRANSLATIONS[language] || TRANSLATIONS[browserLang] || TRANSLATIONS.es;

    // Check consent status on mount
    useEffect(() => {
        const consent = localStorage.getItem(STORAGE_KEY);
        if (consent === "1") {
            // User accepted - activate tracking
            activateTracking();
            if (!hideAfterClick && !hideMiniBanner) {
                setShowMiniBanner(true);
            }
        } else if (consent === "0") {
            // User rejected
            if (!hideAfterClick && !hideMiniBanner) {
                setShowMiniBanner(true);
            }
        } else {
            // No decision yet - show banner
            setIsAnimating(true);
            setTimeout(() => setShowBanner(true), 100);
        }
    }, [hideAfterClick, hideMiniBanner]);

    // Listen for external open event (from footer link)
    useEffect(() => {
        const handleExternalOpen = () => {
            setShowMiniBanner(false);
            setIsAnimating(true);
            setTimeout(() => setShowBanner(true), 100);
        };

        window.addEventListener("linkea:openCookieModal", handleExternalOpen);
        return () => {
            window.removeEventListener(
                "linkea:openCookieModal",
                handleExternalOpen
            );
        };
    }, []);

    // Activate Google Analytics
    const activateGoogleAnalytics = useCallback(() => {
        if (normalizedGaIds.length === 0) return;

        // Load gtag script once
        if (
            !document.querySelector('script[src*="googletagmanager.com/gtag"]')
        ) {
            const script = document.createElement("script");
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${normalizedGaIds[0]}`;
            document.head.appendChild(script);
        }

        // Initialize gtag with all IDs
        const configScript = document.createElement("script");
        configScript.text = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${normalizedGaIds
                .map((id) => `gtag('config', '${id}');`)
                .join("\n")}
        `;
        document.head.appendChild(configScript);
    }, [normalizedGaIds]);

    // Activate Facebook Pixel
    const activateFacebookPixel = useCallback(() => {
        if (!facebookPixelId) return;

        const script = document.createElement("script");
        script.text = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${facebookPixelId}');
            fbq('track', 'PageView');
        `;
        document.head.appendChild(script);

        // Add noscript fallback
        const noscript = document.createElement("noscript");
        const img = document.createElement("img");
        img.height = 1;
        img.width = 1;
        img.style.display = "none";
        img.src = `https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`;
        noscript.appendChild(img);
        document.head.appendChild(noscript);
    }, [facebookPixelId]);

    const activateTracking = useCallback(() => {
        activateGoogleAnalytics();
        activateFacebookPixel();
    }, [activateGoogleAnalytics, activateFacebookPixel]);

    const handleAccept = () => {
        localStorage.setItem(STORAGE_KEY, "1");
        setShowBanner(false);
        activateTracking();
        if (!hideAfterClick) {
            setTimeout(() => setShowMiniBanner(true), 300);
        }
    };

    const handleReject = () => {
        localStorage.setItem(STORAGE_KEY, "0");
        setShowBanner(false);
        // Clear existing cookies
        clearCookies();
        if (!hideAfterClick) {
            setTimeout(() => setShowMiniBanner(true), 300);
        }
    };

    const handleOpenBanner = () => {
        setShowMiniBanner(false);
        setIsAnimating(true);
        setTimeout(() => setShowBanner(true), 100);
    };

    const clearCookies = () => {
        // Clear all cookies except essential ones
        const cookies = document.cookie.split("; ");
        cookies.forEach((cookie) => {
            const name = cookie.split("=")[0];
            // Don't clear our consent cookie
            if (name !== STORAGE_KEY) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }
        });
    };

    // Don't render anything server-side
    if (typeof window === "undefined") return null;

    return (
        <>
            {/* Mini Banner - Only show if not hidden via prop */}
            {/* Mobile: centered at bottom | Desktop: positioned left/right */}
            {showMiniBanner && !hideMiniBanner && (
                <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center sm:block sm:left-auto sm:right-auto">
                    <button
                        onClick={handleOpenBanner}
                        className={`flex items-center gap-1.5 py-2 transition-all duration-200 hover:scale-[0.97] animate-in slide-in-from-bottom-4 fade-in sm:fixed sm:bottom-4 ${
                            position === "left" ? "sm:left-4" : "sm:right-4"
                        }`}
                        style={{ color: textColor || "inherit" }}
                    >
                        <svg
                            fill="currentColor"
                            height="15"
                            viewBox="0 0 512 512"
                            className="mt-0.5"
                        >
                            <path d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 0 0-57.79 57.81l-35.1 68.88a132.645 132.645 0 0 0-12.82 80.95l12.08 76.27a132.521 132.521 0 0 0 37.16 72.96l54.77 54.76a132.036 132.036 0 0 0 72.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0 0 57.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z" />
                        </svg>
                        <span className="text-sm font-bold">
                            {t.manageText}
                        </span>
                    </button>
                </div>
            )}

            {/* Main Banner - Bottom centered */}
            {showBanner && (
                <div
                    className={`fixed z-50 bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] max-w-sm bg-neutral-800 rounded-2xl shadow-2xl overflow-hidden ${
                        isAnimating
                            ? "animate-in slide-in-from-bottom-4 fade-in duration-300"
                            : ""
                    }`}
                >
                    {/* Close button */}
                    <button
                        onClick={handleReject}
                        className="absolute top-3 right-3 p-1 rounded-full hover:bg-neutral-700 transition-colors"
                    >
                        <X size={18} className="text-neutral-400" />
                    </button>

                    <div className="p-4 sm:p-5">
                        {/* Heading */}
                        {t.bannerHeading && (
                            <h3 className="font-bold text-white mb-2 pr-6 text-base sm:text-lg">
                                {t.bannerHeading}
                            </h3>
                        )}

                        {/* Description */}
                        <p className="text-sm text-neutral-300 mb-4">
                            {t.bannerDescription}{" "}
                            <a
                                href={policyLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline font-bold hover:text-white transition-colors text-white"
                            >
                                {t.bannerLinkText}
                            </a>
                        </p>

                        {/* Buttons - Stack on mobile, row on desktop */}
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-2.5">
                            <button
                                onClick={handleReject}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-neutral-200 text-neutral-700 transition-all duration-200 hover:bg-neutral-300 hover:scale-[1.02]"
                            >
                                {t.rejectBtnText}
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:brightness-90 hover:scale-[1.02]"
                                style={{ backgroundColor: accentColor }}
                            >
                                {t.acceptBtnText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieConsent;
