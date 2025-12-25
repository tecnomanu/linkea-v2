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
    title = "Linkea - Todos tus enlaces en un solo lugar",
    description,
    image,
    canonical,
    jsonLd,
}: WebLayoutProps) {
    const { appUrl } = usePage<{ appUrl: string }>().props;
    const finalJsonLd = jsonLd || websiteJsonLd(appUrl);
    
    return (
        <div className="min-h-screen bg-white font-sans antialiased text-gray-900 selection:bg-primary-500 selection:text-white">
            <SEOHead
                title={title}
                description={description}
                image={image}
                canonical={canonical}
                jsonLd={finalJsonLd}
                baseUrl={appUrl}
            />

            <Header />

            <main className="w-full">{children}</main>

            <Footer />
        </div>
    );
}
