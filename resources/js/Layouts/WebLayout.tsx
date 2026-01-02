import { CookieConsent } from "@/Components/Shared/CookieConsent";
import React from "react";
import Footer from "../Components/Web/Home/Footer";
import Header from "../Components/Web/Home/Header";

interface WebLayoutProps {
    children: React.ReactNode;
}

export default function WebLayout({ children }: WebLayoutProps) {
    // SEO is handled server-side in app.blade.php via controllers' withViewData()
    // No need to duplicate in React - bots read the server-rendered HTML
    return (
        <div className="min-h-screen bg-white font-sans antialiased text-gray-900 selection:bg-primary-500 selection:text-white">
            <Header />

            <main className="w-full">{children}</main>

            <Footer />

            {/* Cookie Consent with Linkea's Google Analytics */}
            <CookieConsent
                googleAnalyticsIds={["G-PVN62HZNPH"]}
                accentColor="#ea580c"
                hideMiniBanner={true}
            />
        </div>
    );
}
