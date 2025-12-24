import { Head } from "@inertiajs/react";
import React from "react";
import Footer from "../Components/Web/Home/Footer";
import Header from "../Components/Web/Home/Header";

interface WebLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function WebLayout({ children, title }: WebLayoutProps) {
    return (
        <div className="min-h-screen bg-white font-sans antialiased text-gray-900 selection:bg-primary-500 selection:text-white">
            <Head title={title} />

            <Header />

            <main className="w-full">{children}</main>

            <Footer />
        </div>
    );
}
