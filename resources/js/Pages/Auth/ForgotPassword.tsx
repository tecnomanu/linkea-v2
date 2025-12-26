import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link, useForm, usePage } from "@inertiajs/react";
import { ArrowLeft, CheckCircle, X } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";

interface PageProps {
    status?: string;
    [key: string]: unknown;
}

const THROTTLE_KEY = "forgot_password_throttle";
const THROTTLE_DURATION = 60;

export default function ForgotPassword() {
    const { status } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: "",
    });

    const [countdown, setCountdown] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    // Check localStorage for existing throttle on mount
    useEffect(() => {
        const stored = localStorage.getItem(THROTTLE_KEY);
        if (stored) {
            const expiry = parseInt(stored, 10);
            const remaining = Math.ceil((expiry - Date.now()) / 1000);
            if (remaining > 0) {
                setCountdown(remaining);
            } else {
                localStorage.removeItem(THROTTLE_KEY);
            }
        }
    }, []);

    // Detect throttle error and start countdown
    useEffect(() => {
        if (errors.email?.toLowerCase().includes("espera")) {
            startThrottle();
            clearErrors("email");
        }
    }, [errors.email]);

    // On success, show message and start throttle
    useEffect(() => {
        if (status) {
            setShowSuccess(true);
            startThrottle();
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const startThrottle = () => {
        const expiry = Date.now() + THROTTLE_DURATION * 1000;
        localStorage.setItem(THROTTLE_KEY, expiry.toString());
        setCountdown(THROTTLE_DURATION);
    };

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    localStorage.removeItem(THROTTLE_KEY);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (countdown > 0) return;
        post(route("password.email") as string);
    };

    const isDisabled = processing || countdown > 0;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0
            ? `${mins}:${secs.toString().padStart(2, "0")}`
            : `${secs}s`;
    };

    return (
        <AuthLayout
            title="Recuperar contrasena"
            subtitle="Te enviaremos un enlace para restablecer tu contrasena"
        >
            {/* Success message - auto-hides after 5 seconds */}
            {showSuccess && status && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-300 flex-1">
                        {status}
                    </p>
                    <button
                        onClick={() => setShowSuccess(false)}
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <Input
                    id="email"
                    type="email"
                    label="Correo electronico"
                    placeholder="tu@email.com"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    autoFocus
                    error={countdown > 0 ? undefined : errors.email}
                />

                <Button
                    className="w-full py-6 text-base rounded-xl font-bold"
                    isLoading={processing}
                    disabled={isDisabled}
                >
                    {countdown > 0
                        ? `Reintentar en ${formatTime(countdown)}`
                        : status
                        ? "Reenviar enlace"
                        : "Enviar enlace de recuperacion"}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <Link
                    href={route("login") as string}
                    className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al login
                </Link>
            </div>
        </AuthLayout>
    );
}
