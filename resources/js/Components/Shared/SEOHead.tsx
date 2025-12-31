/**
 * SEOHead - Centralized SEO meta tags component
 *
 * Used for client-side SPA navigation (Inertia).
 * Server-side meta tags are handled by app.blade.php using SeoDefaults.php.
 *
 * SEO defaults come from PHP via Inertia shared data (seoDefaults prop).
 * This ensures a single source of truth in app/Constants/SeoDefaults.php.
 *
 * Usage:
 *   <SEOHead
 *     title="My Page Title"
 *     description="Page description"
 *     canonical="/my-page"
 *   />
 */

import { SharedProps } from "@/types/inertia";
import { Head, usePage } from "@inertiajs/react";

interface SEOHeadProps {
    title: string;
    description?: string;
    image?: string;
    canonical?: string;
    type?: "website" | "article" | "profile";
    noIndex?: boolean;
    jsonLd?: object;
    /** Custom favicon URL (defaults to Linkea favicon) */
    favicon?: string;
}

/**
 * Build full URL from relative path.
 */
function buildUrl(path: string, baseUrl: string): string {
    if (path.startsWith("http")) {
        return path;
    }
    return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export default function SEOHead({
    title,
    description,
    image,
    canonical,
    type = "website",
    noIndex = false,
    jsonLd,
    favicon,
}: SEOHeadProps) {
    // Get SEO defaults from PHP via Inertia shared data
    const { appUrl, seoDefaults } = usePage<SharedProps>().props;

    // Use defaults from PHP if not provided
    const finalDescription = description || seoDefaults.defaultDescription;
    const finalImage = image
        ? buildUrl(image, appUrl)
        : seoDefaults.defaultImage;
    const canonicalUrl = canonical ? `${appUrl}${canonical}` : undefined;

    // Use custom favicon if provided, otherwise defaults from PHP
    const faviconUrl = favicon || seoDefaults.favicon;
    const appleIconUrl = favicon || seoDefaults.appleTouchIcon;

    return (
        <Head>
            <title>{title}</title>

            {/* Favicons */}
            <link rel="icon" type="image/png" sizes="32x32" href={faviconUrl} />
            <link rel="shortcut icon" href={faviconUrl} />
            <link rel="apple-touch-icon" sizes="180x180" href={appleIconUrl} />

            {/* Basic SEO */}
            <meta name="description" content={finalDescription} />
            {noIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}

            {/* Canonical */}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph */}
            <meta property="og:site_name" content={seoDefaults.siteName} />
            <meta property="og:locale" content={seoDefaults.locale} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta
                property="og:image:width"
                content={seoDefaults.ogImageWidth}
            />
            <meta
                property="og:image:height"
                content={seoDefaults.ogImageHeight}
            />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Head>
    );
}

/**
 * Generate JSON-LD for the main website (Home page)
 */
export function websiteJsonLd(baseUrl: string, siteName: string = "Linkea") {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: siteName,
        url: baseUrl,
        description:
            "Plataforma argentina de link in bio. Crea tu pagina de links personalizada gratis.",
        applicationCategory: "SocialNetworkingApplication",
        operatingSystem: "Web",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "ARS",
        },
        author: {
            "@type": "Organization",
            name: siteName,
            url: baseUrl,
        },
    };
}

/**
 * Generate JSON-LD for a user's landing page
 */
export function landingJsonLd(
    name: string,
    handle: string,
    bio?: string,
    avatar?: string,
    baseUrl?: string
) {
    return {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
            "@type": "Person",
            name: name,
            url: baseUrl ? `${baseUrl}/${handle}` : undefined,
            ...(bio && { description: bio }),
            ...(avatar && { image: avatar }),
        },
    };
}

/**
 * JSON-LD for landing pages - just ProfilePage
 */
export function landingFullJsonLd(
    name: string,
    handle: string,
    bio?: string,
    avatar?: string,
    baseUrl?: string
) {
    return landingJsonLd(name, handle, bio, avatar, baseUrl);
}
