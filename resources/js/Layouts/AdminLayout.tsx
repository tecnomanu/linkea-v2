import { AdminMobileNav } from "@/Components/Admin/AdminMobileNav";
import { AdminSidebar } from "@/Components/Admin/AdminSidebar";
import { Head, usePage } from "@inertiajs/react";
import { PropsWithChildren, useEffect, useState } from "react";

interface AdminLayoutProps {
    title?: string;
    user: any;
}

export default function AdminLayout({
    title,
    user,
    children,
}: PropsWithChildren<AdminLayoutProps>) {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("darkMode");
            const isDark = saved === "true";
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

    useEffect(() => {
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
        if (url.includes("/admin/landings")) return "landings";
        if (url.includes("/admin/users")) return "users";
        if (url.includes("/admin/companies")) return "companies";
        if (url.includes("/admin/newsletters")) return "newsletters";
        if (url.includes("/admin/notifications")) return "notifications";
        return "dashboard";
    };

    const activeTab = getActiveTab();

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div
            className={`${
                isDarkMode ? "dark" : ""
            } transition-colors duration-300 min-h-screen bg-slate-50 dark:bg-neutral-950`}
        >
            <Head>
                {title && <title>{title}</title>}
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex min-h-screen font-sans selection:bg-red-500/20 selection:text-red-900 dark:text-white">
                <AdminSidebar
                    activeTab={activeTab}
                    toggleTheme={toggleTheme}
                    isDarkMode={isDarkMode}
                    user={user}
                />

                {/* Mobile Navigation */}
                <AdminMobileNav
                    activeTab={activeTab}
                    toggleTheme={toggleTheme}
                    isDarkMode={isDarkMode}
                    userAvatar={user?.avatar}
                    userAvatarThumb={user?.avatar_thumb}
                    userName={user?.name}
                    userEmail={user?.email}
                />

                <main className="flex-1 ml-0 md:ml-[220px] flex flex-col relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
