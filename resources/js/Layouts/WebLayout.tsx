import { SharedProps } from "@/types/inertia";
import { usePage } from "@inertiajs/react";
import React from "react";
import SEOHead, { websiteJsonLd } from "../Components/Shared/SEOHead";
import Footer from "../Components/Web/Home/Footer";
import Header from "../Components/Web/Home/Header";

interface WebLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    image?: string;
    canonical?: string;
    jsonLd?: object;
}

export default function WebLayout({
    children,
    title,
    description,
    image,
    canonical,
    jsonLd,
}: WebLayoutProps) {
    const { appUrl, seoDefaults } = usePage<SharedProps>().props;
    const finalTitle = title || seoDefaults.defaultTitle;
    const finalJsonLd = jsonLd || websiteJsonLd(appUrl, seoDefaults.siteName);

    return (
        <div className="min-h-screen bg-white font-sans antialiased text-gray-900 selection:bg-primary-500 selection:text-white">
            <SEOHead
                title={finalTitle}
                description={description}
                image={image}
                canonical={canonical}
                jsonLd={finalJsonLd}
            />

            <Header />

            <main className="w-full">{children}</main>

            <Footer />
        </div>
    );
}
