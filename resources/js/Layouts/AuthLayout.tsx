import { AuthHeroSection } from "@/Components/Auth";
import { Head, Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

interface AuthLayoutProps {
    title: string;
    subtitle?: string;
    heroVariant?: "login" | "register" | "default";
}

/**
 * Auth layout with split design: form on left, hero image on right
 * Responsive: full-width form on mobile, split on desktop
 */
export default function AuthLayout({
    title,
    subtitle,
    heroVariant = "default",
    children,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen flex font-sans">
            <Head title={`${title} - Linkea`}>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {/* Left side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col min-h-screen bg-white dark:bg-neutral-950">
                {/* Header with logo */}
                <header className="p-6 lg:p-8">
                    <Link href="/" className="inline-block">
                        <img
                            src="/assets/images/logo.svg"
                            alt="Linkea"
                            className="h-8 w-auto dark:hidden"
                        />
                        <img
                            src="/assets/images/logo-white.svg"
                            alt="Linkea"
                            className="h-8 w-auto hidden dark:block"
                        />
                    </Link>
                </header>

                {/* Main content area */}
                <main className="flex-1 flex flex-col justify-center px-6 lg:px-16 xl:px-24 pb-12">
                    <div className="w-full max-w-md mx-auto lg:mx-0">
                        {/* Title */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            {title}
                        </h1>

                        {/* Subtitle */}
                        {subtitle && (
                            <p className="mt-3 text-neutral-500 dark:text-neutral-400 text-base">
                                {subtitle}
                            </p>
                        )}

                        {/* Form content */}
                        <div className="mt-8">{children}</div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="p-6 lg:p-8 text-center lg:text-left">
                    <p className="text-xs text-neutral-400 dark:text-neutral-600">
                        Al continuar, aceptas nuestros{" "}
                        <Link
                            href="/terms"
                            className="text-neutral-500 hover:text-brand-500 underline underline-offset-2"
                        >
                            Terminos de servicio
                        </Link>{" "}
                        y{" "}
                        <Link
                            href="/privacy"
                            className="text-neutral-500 hover:text-brand-500 underline underline-offset-2"
                        >
                            Politica de privacidad
                        </Link>
                    </p>
                </footer>
            </div>

            {/* Right side - Hero (hidden on mobile) */}
            <div className="hidden lg:block lg:w-1/2">
                <AuthHeroSection variant={heroVariant} />
            </div>
        </div>
    );
}
