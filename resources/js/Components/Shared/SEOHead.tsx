/**
 * SEOHead - Centralized SEO meta tags component
 *
 * All SEO is handled from React, not from app.blade.php.
 * This prevents duplication and allows per-page customization.
 *
 * Usage:
 *   <SEOHead
 *     title="My Page Title"
 *     description="Page description"
 *     canonical="/my-page"
 *   />
 */

import { Head } from "@inertiajs/react";

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

const BASE_URL = "https://linkea.ar";
const DEFAULT_IMAGE = "/assets/images/meta_tag_image.jpg";
const DEFAULT_FAVICON = "/favicon-32x32.png";
const DEFAULT_APPLE_ICON = "/apple-touch-icon.png";
const DEFAULT_DESCRIPTION =
    "Linkea - Todos tus enlaces en un solo lugar. Crea tu pagina de links personalizada gratis.";

export default function SEOHead({
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    canonical,
    type = "website",
    noIndex = false,
    jsonLd,
    favicon,
}: SEOHeadProps) {
    const fullImage = image.startsWith("http") ? image : `${BASE_URL}${image}`;
    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;

    // Use custom favicon if provided, otherwise defaults
    const faviconUrl = favicon || DEFAULT_FAVICON;
    const appleIconUrl = favicon || DEFAULT_APPLE_ICON;

    return (
        <Head>
            <title>{title}</title>

            {/* Favicons */}
            <link rel="icon" type="image/png" sizes="32x32" href={faviconUrl} />
            <link rel="shortcut icon" href={faviconUrl} />
            <link rel="apple-touch-icon" sizes="180x180" href={appleIconUrl} />

            {/* Basic SEO */}
            <meta name="description" content={description} />
            {noIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}

            {/* Canonical */}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph */}
            <meta property="og:site_name" content="Linkea" />
            <meta property="og:locale" content="es_AR" />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />

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
 * Default JSON-LD for the main website (Home page)
 */
export const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Linkea",
    url: "https://linkea.ar",
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
        name: "Linkea",
        url: "https://linkea.ar",
    },
};

/**
 * Generate JSON-LD for a user's landing page
 */
export function landingJsonLd(
    name: string,
    handle: string,
    bio?: string,
    avatar?: string
) {
    return {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
            "@type": "Person",
            name: name,
            url: `https://linkea.ar/${handle}`,
            ...(bio && { description: bio }),
            ...(avatar && { image: avatar }),
        },
    };
}

/**
 * Generate JSON-LD breadcrumb for navigation
 * Useful for pages with hierarchical structure (e.g., blog posts, categories)
 * NOT needed for flat onepage landings
 */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url.startsWith("http")
                ? item.url
                : `https://linkea.ar${item.url}`,
        })),
    };
}

/**
 * JSON-LD for landing pages - just ProfilePage
 * Breadcrumbs removed: landings are onepage with flat URLs, no internal navigation hierarchy
 */
export function landingFullJsonLd(
    name: string,
    handle: string,
    bio?: string,
    avatar?: string
) {
    // Only ProfilePage - breadcrumbs don't add value for onepage landings
    return landingJsonLd(name, handle, bio, avatar);
}
