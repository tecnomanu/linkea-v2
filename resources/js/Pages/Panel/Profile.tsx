import { ProfileTab } from "@/Components/Panel/Profile/ProfileTab";
import PanelLayout from "@/Layouts/PanelLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

interface ProfilePageProps {
    auth: {
        user: any; // AuthUser - The authenticated user
    };
}

/**
 * Profile Page - Manages authenticated user profile (NOT landing page)
 * 
 * This page is separate from the main Dashboard because:
 * - It manages auth.user (authenticated user), not the landing profile
 * - No need for landing preview sidebar
 * - No auto-save for landing data
 * - Simpler navigation (just back to dashboard)
 */
export default function Profile({ auth }: ProfilePageProps) {
    return (
        <>
            <Head title="Mi Perfil" />

            <div className="flex-1 w-full mx-auto p-4 md:p-8 lg:p-12 pt-32 md:pt-8 overflow-y-auto h-screen overlay-scrollbar relative">
                <div className="max-w-3xl mx-auto">
                    {/* Header - Desktop */}
                    <header className="hidden md:flex justify-between items-center mb-8 sticky top-0 z-40 bg-slate-50/90 dark:bg-neutral-950/90 backdrop-blur-xl py-4 -mx-4 px-4 lg:-mx-12 lg:px-12 transition-all">
                        <div>
                            <div className="flex items-center gap-2 text-sm font-bold text-neutral-400 mb-1 uppercase tracking-wider">
                                <span>Panel</span>
                                <span className="text-neutral-300">&gt;</span>
                                <span className="text-brand-500">Perfil</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
                                Mi Perfil
                            </h1>
                        </div>
                        <Link
                            href="/panel"
                            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold text-sm transition-all"
                        >
                            <ArrowLeft size={16} />
                            <span>Volver al Panel</span>
                        </Link>
                    </header>

                    {/* Header - Mobile */}
                    <div className="md:hidden mb-4">
                        <Link
                            href="/panel"
                            className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-brand-500 dark:hover:text-brand-400 mb-3 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            <span>Volver</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Mi Perfil
                        </h1>
                    </div>

                    {/* Profile Content */}
                    <ProfileTab user={auth.user} />
                </div>
            </div>
        </>
    );
}

Profile.layout = (page: any) => (
    <PanelLayout user={page.props.auth.user} title="Mi Perfil">
        {page}
    </PanelLayout>
);

