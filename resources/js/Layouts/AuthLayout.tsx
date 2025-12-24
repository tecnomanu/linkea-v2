import { Head } from "@inertiajs/react";
import { PropsWithChildren } from "react";

interface AuthLayoutProps {
    title: string;
    subtitle?: string;
}

export default function AuthLayout({
    title,
    subtitle,
    children,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center pt-6 sm:pt-0 bg-gray-50 dark:bg-neutral-950 font-sans transition-colors duration-300">
            <Head>
                <title>{title}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="w-full sm:max-w-md mt-6 px-8 py-8 bg-white dark:bg-neutral-900 shadow-soft-xl overflow-hidden sm:rounded-[32px] border border-neutral-100 dark:border-neutral-800 transition-all duration-300">
                <div className="flex flex-col items-center justify-center mb-8">
                    <img
                        src="/images/logo_only.png"
                        alt="Linkea"
                        className="h-12 w-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 text-center">
                            {subtitle}
                        </p>
                    )}
                </div>

                {children}
            </div>
        </div>
    );
}
