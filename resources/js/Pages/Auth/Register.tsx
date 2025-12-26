import { AuthDivider, SocialLoginButtons } from "@/Components/Auth";
import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import AuthLayout from "@/Layouts/AuthLayout";
import { sanitizeHandle } from "@/utils/handle";
import { Link, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useMemo } from "react";

interface PageProps {
    appUrl?: string;
    [key: string]: unknown;
}

export default function Register() {
    const { appUrl } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleUsernameChange = (value: string) => {
        setData("username", sanitizeHandle(value));
    };

    // Generate preview URL
    const previewUrl = useMemo(() => {
        const baseUrl = appUrl?.replace(/^https?:\/\//, "") || "linkea.ar";
        return `${baseUrl}/${data.username || "tu-linkea"}`;
    }, [appUrl, data.username]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("register") as string, {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    // Social login handlers (placeholder - needs OAuth implementation)
    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth
        console.log("Google login clicked");
    };

    const handleAppleLogin = () => {
        // TODO: Implement Apple OAuth
        console.log("Apple login clicked");
    };

    return (
        <AuthLayout
            title="Unite a Linkea"
            subtitle="Crea tu cuenta gratis y empeza hoy"
            heroVariant="register"
        >
            {/* Email field first (like Linktree) */}
            <form onSubmit={submit} className="space-y-4">
                <Input
                    id="email"
                    type="email"
                    label="Email"
                    placeholder="tu@email.com"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    autoFocus
                    error={errors.email}
                />

                {/* Username with linkea.ar/ prefix */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                        Tu Linkea
                    </label>
                    <div className="flex items-stretch">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm font-medium">
                            linkea.ar/
                        </span>
                        <input
                            id="username"
                            type="text"
                            placeholder="tu-linkea"
                            value={data.username}
                            onChange={(e) =>
                                handleUsernameChange(e.target.value)
                            }
                            className={`flex-1 px-4 py-3 rounded-r-xl border text-sm transition-colors
                                ${
                                    errors.username
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                        : "border-neutral-300 dark:border-neutral-600 focus:border-brand-500 focus:ring-brand-500/20"
                                }
                                bg-white dark:bg-neutral-900 
                                text-neutral-900 dark:text-white 
                                placeholder:text-neutral-400
                                focus:outline-none focus:ring-2`}
                        />
                    </div>
                    {errors.username && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.username}
                        </p>
                    )}
                    {data.username && !errors.username && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            Tu perfil estara en:{" "}
                            <span className="font-medium text-brand-500">
                                {previewUrl}
                            </span>
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        id="first_name"
                        type="text"
                        label="Nombre"
                        placeholder="Juan"
                        value={data.first_name}
                        onChange={(e) => setData("first_name", e.target.value)}
                        error={errors.first_name}
                    />

                    <Input
                        id="last_name"
                        type="text"
                        label="Apellido"
                        placeholder="Perez"
                        value={data.last_name}
                        onChange={(e) => setData("last_name", e.target.value)}
                        error={errors.last_name}
                    />
                </div>

                <Input
                    id="password"
                    type="password"
                    label="Contrasena"
                    placeholder="Minimo 8 caracteres"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    error={errors.password}
                />

                <Input
                    id="password_confirmation"
                    type="password"
                    label="Confirmar contrasena"
                    placeholder="Repeti tu contrasena"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    error={errors.password_confirmation}
                />

                <Button
                    className="w-full py-6 text-base rounded-xl font-bold"
                    isLoading={processing}
                >
                    Crear cuenta
                </Button>
            </form>

            {/* Divider */}
            <AuthDivider />

            {/* Social login options */}
            <SocialLoginButtons
                onGoogleClick={handleGoogleLogin}
                onAppleClick={handleAppleLogin}
                disabled={processing}
            />

            {/* Link to login */}
            <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                Ya tenes una cuenta?{" "}
                <Link
                    href={route("login") as string}
                    className="text-brand-500 hover:text-brand-600 font-semibold transition-colors"
                >
                    Ingresa
                </Link>
            </div>
        </AuthLayout>
    );
}
