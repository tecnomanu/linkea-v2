import { AuthDivider, SocialLoginButtons } from "@/Components/Auth";
import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("register"), {
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

                <Input
                    id="username"
                    type="text"
                    label="Nombre de tu linkea"
                    placeholder="tu-linkea"
                    value={data.username}
                    onChange={(e) => setData("username", e.target.value)}
                    error={errors.username}
                />

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
                    href={route("login")}
                    className="text-brand-500 hover:text-brand-600 font-semibold transition-colors"
                >
                    Ingresa
                </Link>
            </div>
        </AuthLayout>
    );
}
