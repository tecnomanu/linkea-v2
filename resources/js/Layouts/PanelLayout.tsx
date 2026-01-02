import { MobileNav } from "@/Components/Shared/MobileNav";
import { Sidebar } from "@/Components/Shared/Sidebar";
import { UnsavedChangesDialog } from "@/Components/Shared/UnsavedChangesDialog";
import { AutoSaveProvider } from "@/contexts/AutoSaveContext";
import { Head, usePage } from "@inertiajs/react";
import { PropsWithChildren, useEffect, useState } from "react";

interface PanelLayoutProps {
    title?: string;
    user: any;
}

export default function PanelLayout({
    title,
    user,
    children,
}: PropsWithChildren<PanelLayoutProps>) {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        // Check localStorage, default to false (light mode)
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("darkMode");
            const isDark = saved === "true";
            // Apply immediately on initialization
            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            return isDark;
        }
        return false;
    });
    const { url } = usePage();

    // Apply theme when isDarkMode changes
    useEffect(() => {
        // Force apply with requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            if (isDarkMode) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            localStorage.setItem("darkMode", isDarkMode.toString());
        });
    }, [isDarkMode]);

    const getActiveTab = () => {
        if (url.includes("/panel/design")) return "appearance";
        if (url.includes("/panel/settings")) return "settings";
        if (url.includes("/panel/links")) return "links";
        if (url.includes("/panel/profile")) return "profile";
        return "dashboard";
    };

    const activeTab = getActiveTab();

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <AutoSaveProvider>
            <div
                className={`${
                    isDarkMode ? "dark" : ""
                } transition-colors duration-300 min-h-screen bg-slate-50 dark:bg-neutral-950`}
            >
                <Head>
                    {title && <title>{title}</title>}
                    <meta name="robots" content="noindex, nofollow" />
                </Head>

                <div className="flex min-h-screen font-sans selection:bg-brand-500/20 selection:text-brand-900 dark:text-white">
                    <Sidebar
                        activeTab={activeTab}
                        toggleTheme={toggleTheme}
                        isDarkMode={isDarkMode}
                        user={user}
                    />

                    {/* Mobile Navigation */}
                    <MobileNav
                        activeTab={activeTab}
                        toggleTheme={toggleTheme}
                        isDarkMode={isDarkMode}
                        userAvatar={user?.avatar}
                        userAvatarThumb={user?.avatar_thumb}
                        userName={user?.name}
                        userEmail={user?.email}
                        userRole={user?.role_name}
                    />

                    <main className="flex-1 ml-0 md:ml-[72px] flex flex-col xl:flex-row relative">
                        {children}
                    </main>
                </div>

                {/* Navigation confirmation dialog */}
                <UnsavedChangesDialog />
            </div>
        </AutoSaveProvider>
    );
}
