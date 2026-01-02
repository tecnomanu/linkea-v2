/**
 * LandingView - Public landing page
 *
 * Uses the shared LandingContent component for rendering.
 * Adds: SEO head tags, cookie consent, and analytics tracking.
 *
 * Features migrated from legacy:
 * - YouTube iframe API (loaded when video links exist)
 * - Spotify iframe API (loaded when music links exist)
 * - Mautic tracking
 * - Cookie consent with Google Analytics & Facebook Pixel
 */

import { CookieConsent } from "@/Components/Shared/CookieConsent";
import { LandingContent, SocialLink } from "@/Components/Shared/LandingContent";
import { landingFullJsonLd } from "@/Components/Shared/SEOHead";
import { BlockType, LandingProfile, LinkBlock } from "@/types/index";
import { Head, usePage } from "@inertiajs/react";
import { useEffect, useMemo } from "react";

/**
 * Props from PublicLandingResource
 */
interface LandingViewProps {
    landing: {
        id: string;
        name: string;
        seoTitle: string; // For browser tab title (resolved with fallbacks)
        seoDescription: string; // For meta description (resolved with fallbacks)
        seoImage: string | null; // For OG image (custom or logo fallback)
        slug: string;
        domain_name: string | null;
        verify: boolean;
        isPrivate?: boolean; // Hide from search engines
        googleAnalyticsId?: string | null; // User's GA ID (if configured)
        facebookPixelId?: string | null; // User's FB Pixel ID (if configured)
        logo: { image: string | null; thumb: string | null } | null;
        template_config: {
            title: string; // Displayed on page
            subtitle: string;
            showTitle?: boolean; // Toggle visibility
            showSubtitle?: boolean; // Toggle visibility
            background: {
                bgName: string;
                backgroundColor: string;
                backgroundImage: string | null; // Already in CSS format: url("...")
                backgroundEnabled: boolean;
                backgroundSize: string;
                backgroundPosition: string;
                backgroundAttachment: string;
                backgroundRepeat: string;
                props?: any;
                controls?: any;
            };
            buttons: {
                style: string;
                shape: string;
                size?: string;
                backgroundColor: string;
                textColor: string;
                borderColor?: string | null;
                borderEnabled?: boolean;
                showIcons: boolean;
                iconAlignment: string;
            };
            textColor: string | null;
            fontPair: string;
            header: {
                roundedAvatar: boolean;
                avatarFloating?: boolean;
            };
            showLinkSubtext: boolean;
        };
        links: Array<{
            id: string;
            title: string;
            url: string;
            type: string;
            isEnabled: boolean;
            order: number;
            icon: { type?: string; name?: string } | null;
            headerSize?: string;
            mediaDisplayMode?: string;
            showInlinePlayer?: boolean;
            autoPlay?: boolean;
            startMuted?: boolean;
            playerSize?: string;
            phoneNumber?: string;
            predefinedMessage?: string;
            calendarProvider?: string;
            calendarDisplayMode?: string;
            emailAddress?: string;
            emailSubject?: string;
            emailBody?: string;
            mapAddress?: string;
            mapQuery?: string;
            mapZoom?: number;
            mapDisplayMode?: string;
            mapShowAddress?: boolean;
        }>;
        socialLinks: Array<{
            id: string;
            url: string;
            icon: { type?: string; name?: string } | null;
            isEnabled: boolean;
        }>;
    };
}

export default function LandingView({ landing }: LandingViewProps) {
    const { appUrl } = usePage<{ appUrl: string }>().props;

    // Safe access to template_config (guard for any cache/format issues)
    const templateConfig = landing.template_config || {
        title: landing.name,
        subtitle: "",
        background: {
            bgName: "custom",
            backgroundColor: "#ffffff",
            backgroundImage: null,
            backgroundEnabled: true,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "scroll",
            backgroundRepeat: "no-repeat",
        },
        buttons: {
            style: "solid",
            shape: "rounded",
            size: "compact",
            backgroundColor: "#000000",
            textColor: "#ffffff",
            borderColor: "#000000",
            borderEnabled: false,
            showIcons: true,
            iconAlignment: "left",
        },
        textColor: null,
        fontPair: "modern",
        header: { roundedAvatar: true },
        showLinkSubtext: false,
    };

    const bgConfig = templateConfig.background;
    const buttons = templateConfig.buttons;

    // Transform links to LinkBlock format
    const links: LinkBlock[] = (landing.links || []).map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        isEnabled: link.isEnabled,
        clicks: 0, // Not exposed in public view
        type: (link.type as BlockType) || "link",
        sparklineData: [],
        icon: link.icon,
        headerSize: link.headerSize as LinkBlock["headerSize"],
        mediaDisplayMode:
            link.mediaDisplayMode as LinkBlock["mediaDisplayMode"],
        showInlinePlayer: link.showInlinePlayer,
        autoPlay: link.autoPlay,
        startMuted: link.startMuted,
        playerSize: link.playerSize as LinkBlock["playerSize"],
        phoneNumber: link.phoneNumber,
        predefinedMessage: link.predefinedMessage,
        calendarProvider:
            link.calendarProvider as LinkBlock["calendarProvider"],
        calendarDisplayMode:
            link.calendarDisplayMode as LinkBlock["calendarDisplayMode"],
        emailAddress: link.emailAddress,
        emailSubject: link.emailSubject,
        emailBody: link.emailBody,
        mapAddress: link.mapAddress,
        mapQuery: link.mapQuery,
        mapZoom: link.mapZoom,
        mapDisplayMode: link.mapDisplayMode as LinkBlock["mapDisplayMode"],
        mapShowAddress: link.mapShowAddress,
    }));

    // Transform social links to common format
    const socialLinks: SocialLink[] = (landing.socialLinks || [])
        .filter((s) => s.isEnabled)
        .map((s) => ({
            id: s.id,
            url: s.url || "",
            icon: s.icon as SocialLink["icon"],
            active: s.isEnabled,
        }));

    // Build user profile
    // Title and subtitle come from template_config (as in legacy)
    const landingProfile: LandingProfile = {
        name: landing.name, // Internal name (not displayed)
        handle: landing.domain_name || landing.slug || "linkea",
        avatar: landing.logo?.image || "/images/logos/logo-icon.webp",
        title: templateConfig.title,
        subtitle: templateConfig.subtitle,
        showTitle: templateConfig.showTitle ?? true,
        showSubtitle: templateConfig.showSubtitle ?? true,
        theme: (bgConfig.bgName as any) || "custom",
        customDesign: {
            backgroundColor: bgConfig.backgroundColor,
            backgroundImage: bgConfig.backgroundImage || undefined,
            backgroundEnabled: bgConfig.backgroundEnabled,
            backgroundSize: bgConfig.backgroundSize,
            backgroundPosition: bgConfig.backgroundPosition,
            backgroundAttachment: bgConfig.backgroundAttachment as
                | "scroll"
                | "fixed",
            backgroundRepeat: bgConfig.backgroundRepeat,
            buttonStyle:
                (buttons.style as LandingProfile["customDesign"]["buttonStyle"]) ||
                "solid",
            buttonShape:
                (buttons.shape as LandingProfile["customDesign"]["buttonShape"]) ||
                "rounded",
            buttonSize:
                (buttons.size as LandingProfile["customDesign"]["buttonSize"]) ||
                "compact",
            buttonColor: buttons.backgroundColor,
            buttonTextColor: buttons.textColor,
            buttonBorderColor: buttons.borderColor || "#000000",
            buttonBorderEnabled: buttons.borderEnabled ?? false,
            showButtonIcons: buttons.showIcons,
            buttonIconAlignment: buttons.iconAlignment as
                | "left"
                | "inline"
                | "right",
            fontPair:
                templateConfig.fontPair as LandingProfile["customDesign"]["fontPair"],
            textColor: templateConfig.textColor || undefined,
            roundedAvatar: templateConfig.header?.roundedAvatar ?? true,
            avatarFloating: templateConfig.header?.avatarFloating ?? true,
            showLinkSubtext: templateConfig.showLinkSubtext ?? false,
        },
        isVerified: landing.verify,
    };

    // SEO data - fully resolved by backend with proper fallbacks
    const seoTitle = `${landing.seoTitle} | Linkea`;
    const seoDescription = landing.seoDescription as string;
    // seoImage comes from backend: custom image or logo fallback
    const rawSeoImage = landing.seoImage || landingProfile.avatar;
    const seoImage = rawSeoImage?.startsWith("http")
        ? rawSeoImage
        : `${appUrl}${rawSeoImage}`;
    const canonicalUrl = `${appUrl}/${landingProfile.handle}`;

    // JSON-LD structured data
    const profileJsonLd = landingFullJsonLd(
        landingProfile.title,
        landingProfile.handle,
        landingProfile.subtitle,
        seoImage,
        appUrl
    );

    // Detect if we need to load iframe APIs
    const hasYoutubeEmbed = useMemo(
        () =>
            links.some(
                (l) =>
                    (l.type === "youtube" || l.type === "video") &&
                    l.showInlinePlayer
            ),
        [links]
    );
    const hasSpotifyEmbed = useMemo(
        () =>
            links.some(
                (l) =>
                    (l.type === "spotify" || l.type === "music") &&
                    l.showInlinePlayer
            ),
        [links]
    );

    // Track landing page view (only for human visitors, bot filtering is server-side)
    useEffect(() => {
        // Use sendBeacon for reliable tracking even on page unload
        const trackView = async () => {
            try {
                // Small delay to avoid counting quick bounces/redirects
                await new Promise((resolve) => setTimeout(resolve, 500));

                // Use fetch with keepalive for better reliability
                fetch(`/api/statistics/landing/view/${landing.id}`, {
                    method: "POST",
                    keepalive: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } catch {
                // Silently fail - tracking should not break the page
            }
        };

        trackView();
    }, [landing.id]);

    // Load external scripts (YouTube/Spotify iframe APIs, Mautic)
    useEffect(() => {
        // YouTube iframe API
        if (
            hasYoutubeEmbed &&
            !document.querySelector('script[src*="youtube.com/iframe_api"]')
        ) {
            const ytScript = document.createElement("script");
            ytScript.src = "https://www.youtube.com/iframe_api";
            ytScript.async = true;
            document.body.appendChild(ytScript);
        }

        // Spotify iframe API
        if (
            hasSpotifyEmbed &&
            !document.querySelector('script[src*="spotify.com/embed"]')
        ) {
            const spotifyScript = document.createElement("script");
            spotifyScript.src =
                "https://open.spotify.com/embed-podcast/iframe-api/v1";
            spotifyScript.async = true;
            document.body.appendChild(spotifyScript);
        }

        // Mautic tracking (always load on public landings)
        if (!document.querySelector('script[src*="mautic.linkea.ar"]')) {
            const mauticScript = document.createElement("script");
            mauticScript.text = `
                (function(w,d,t,u,n,a,m){w['MauticTrackingObject']=n;
                    w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)},a=d.createElement(t),
                    m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)
                })(window,document,'script','https://mautic.linkea.ar/mtc.js','mt');
                mt('send', 'pageview');
            `;
            document.body.appendChild(mauticScript);
        }
    }, [hasYoutubeEmbed, hasSpotifyEmbed]);

    return (
        <>
            <Head>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                <meta
                    name="robots"
                    content={
                        landing.isPrivate
                            ? "noindex, nofollow"
                            : "index, follow"
                    }
                />

                {/* Canonical URL */}
                <link rel="canonical" href={canonicalUrl} />

                {/* 
                  Favicon - Currently uses Linkea's default favicon.
                  TODO: Future feature - allow users to customize landing favicon 
                  (e.g. use landing logo: landingProfile.avatar)
                */}
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link rel="shortcut icon" href="/favicon-32x32.png" />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />

                {/* Open Graph */}
                <meta property="og:site_name" content="Linkea" />
                <meta property="og:locale" content="es_AR" />
                <meta property="og:type" content="profile" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:image" content={seoImage} />
                <meta property="og:image:width" content="400" />
                <meta property="og:image:height" content="400" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={seoImage} />

                {/* JSON-LD Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(profileJsonLd)}
                </script>
            </Head>

            {/* Main Content - LandingContent handles its own background */}
            <LandingContent
                landing={landingProfile}
                links={links}
                socialLinks={socialLinks}
                device="mobile"
                isPreview={false}
                fullScreen={true}
            />

            {/* Cookie Consent - Only on public pages, mini-banner hidden (trigger is in footer) */}
            <CookieConsent
                googleAnalyticsIds={[
                    "G-PVN62HZNPH", // Linkea's own analytics (always included)
                    ...(landing.googleAnalyticsId ? [landing.googleAnalyticsId] : []),
                ]}
                facebookPixelId={landing.facebookPixelId || undefined}
                accentColor={landingProfile.customDesign.buttonColor}
                hideMiniBanner={true}
            />
        </>
    );
}
