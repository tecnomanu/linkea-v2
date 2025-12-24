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
import { BlockType, LinkBlock, UserProfile } from "@/types";
import { Head } from "@inertiajs/react";
import { useEffect, useMemo } from "react";

interface SocialLinkData {
    id: string;
    link: string;
    icon?: { type: string; name: string } | null;
    state: boolean;
}

interface LandingViewProps {
    landing: any;
    links: any[];
    socialLinks?: SocialLinkData[];
    storageUrl?: string; // Base URL for S3/storage (e.g., https://linkea.s3.amazonaws.com/)
}

export default function LandingView({
    landing,
    links: serverLinks,
    socialLinks: serverSocialLinks = [],
    storageUrl = "",
}: LandingViewProps) {
    // Transform social links to common format
    const socialLinks: SocialLink[] = serverSocialLinks
        .filter((s) => s.state)
        .map((s) => ({
            id: s.id.toString(),
            url: s.link || "",
            icon: s.icon as SocialLink["icon"],
            active: s.state,
        }));

    // Transform server links to LinkBlock format
    const links: LinkBlock[] = serverLinks.map((link) => ({
        id: link.id.toString(),
        title: link.text,
        url: link.link,
        isEnabled: link.state,
        clicks: link.visited || 0,
        type: (link.type as BlockType) || "link",
        sparklineData: [],
        icon: link.icon,
        // Config fields come from the config JSON column
        headerSize: link.config?.header_size,
        showInlinePlayer: link.config?.show_inline_player,
        autoPlay: link.config?.auto_play,
        startMuted: link.config?.start_muted,
        playerSize: link.config?.player_size,
        // WhatsApp
        phoneNumber: link.config?.phone_number,
        predefinedMessage: link.config?.predefined_message,
        // Calendar
        calendarProvider: link.config?.calendar_provider,
        calendarDisplayMode: link.config?.calendar_display_mode,
        // Email
        emailAddress: link.config?.email_address,
        emailSubject: link.config?.email_subject,
        emailBody: link.config?.email_body,
        // Map
        mapAddress: link.config?.map_address,
        mapQuery: link.config?.map_query,
        mapZoom: link.config?.map_zoom,
        mapDisplayMode: link.config?.map_display_mode,
    }));

    // Resolve background image - can be string (CSS/SVG) or object {image: 'path'}
    const resolveBackgroundImageUrl = (
        bg: string | { image?: string; thumb?: string } | undefined
    ): string | undefined => {
        if (!bg) return undefined;
        if (typeof bg === "string") return bg; // Already CSS string (SVG patterns, gradients)
        if (typeof bg === "object" && bg.image) {
            const imagePath = bg.image;
            // If already absolute URL, use as-is
            if (imagePath.startsWith("http")) return `url("${imagePath}")`;
            // Build full S3 URL from relative path
            if (storageUrl) return `url("${storageUrl}${imagePath}")`;
            // Fallback: use relative path (won't work without storageUrl)
            return `url("/${imagePath}")`;
        }
        return undefined;
    };

    const bgConfig = landing?.template_config?.background;

    // Build user profile from landing data
    const user: UserProfile = {
        name: landing?.template_config?.title || landing?.name || "Linkea",
        handle: landing?.slug || landing?.domain_name || "linkea",
        avatar: landing?.logo?.image || "/images/logo_only.png",
        bio: landing?.template_config?.subtitle || landing?.options?.bio || "",
        theme: (bgConfig?.bgName as any) || "custom",
        customDesign: {
            backgroundColor: bgConfig?.backgroundColor || "#ffffff",
            backgroundImage: resolveBackgroundImageUrl(
                bgConfig?.backgroundImage
            ),
            backgroundSize:
                bgConfig?.backgroundSize || bgConfig?.props?.size || "cover",
            backgroundPosition:
                bgConfig?.backgroundPosition ||
                bgConfig?.props?.position ||
                "center",
            backgroundAttachment:
                bgConfig?.backgroundAttachment ||
                (bgConfig?.props?.attachment ? "fixed" : "scroll"),
            backgroundRepeat:
                bgConfig?.backgroundRepeat ||
                (bgConfig?.props?.repeat ? "repeat" : "no-repeat"),
            buttonStyle: landing?.template_config?.buttons?.style || "solid",
            buttonShape: landing?.template_config?.buttons?.shape || "rounded",
            buttonColor:
                landing?.template_config?.buttons?.backgroundColor || "#000000",
            buttonTextColor:
                landing?.template_config?.buttons?.textColor || "#ffffff",
            showButtonIcons:
                landing?.template_config?.buttons?.showIcons ?? true,
            buttonIconAlignment:
                landing?.template_config?.buttons?.iconAlignment || "left",
            fontPair: landing?.template_config?.fontPair || "modern",
            // Text color from backend (legacy support) - if not set, will be auto-calculated
            textColor: landing?.template_config?.textColor || undefined,
            roundedAvatar:
                landing?.template_config?.header?.roundedAvatar ??
                landing?.template_config?.image_rounded ??
                true,
        },
        seoTitle: landing?.options?.title || "",
        seoDescription: landing?.options?.description || "",
        isVerified: landing?.verify || false,
        isLegacy: !!landing?.mongo_id,
    };

    // SEO data
    const seoTitle = landing?.options?.title || `${user.name} | Linkea`;
    const seoDescription =
        landing?.options?.description ||
        `Links de ${user.name} - Creado con Linkea`;
    const seoImage = user.avatar?.startsWith("http")
        ? user.avatar
        : `https://linkea.ar${user.avatar}`;
    const canonicalUrl = `https://linkea.ar/${user.handle}`;

    // JSON-LD structured data for this profile (includes breadcrumbs)
    const profileJsonLd = landingFullJsonLd(
        user.name,
        user.handle,
        user.bio,
        seoImage
    );

    // Tracking IDs (support both new and legacy field names)
    const googleAnalyticsId =
        landing?.options?.google_analytics_id ||
        landing?.options?.analytics?.google_code;
    const facebookPixelId =
        landing?.options?.facebook_pixel_id ||
        landing?.options?.analytics?.facebook_pixel;

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
                <meta name="robots" content="index, follow" />

                {/* Canonical URL */}
                <link rel="canonical" href={canonicalUrl} />

                {/* Favicon - use landing logo if available, otherwise default */}
                <link
                    rel="icon"
                    type="image/png"
                    href={user.avatar || "/favicon.ico"}
                />
                <link
                    rel="apple-touch-icon"
                    href={user.avatar || "/assets/images/logo_only.png"}
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
                user={user}
                links={links}
                socialLinks={socialLinks}
                device="mobile"
                isPreview={false}
                fullScreen={true}
            />

            {/* Cookie Consent - Only on public pages */}
            <CookieConsent
                googleAnalyticsIds={
                    googleAnalyticsId
                        ? ["G-FH87DE17XF", googleAnalyticsId]
                        : ["G-FH87DE17XF"]
                }
                facebookPixelId={facebookPixelId}
                accentColor={user.customDesign.buttonColor}
            />
        </>
    );
}
