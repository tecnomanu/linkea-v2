import { AuthDivider, SocialLoginButtons } from "@/Components/Auth";
import { Button } from "@/Components/ui/Button";
import { HandleInput } from "@/Components/ui/HandleInput";
import { Input } from "@/Components/ui/Input";
import { useHandleValidation } from "@/hooks/useHandleValidation";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useMemo } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    // Username validation with async availability check
    const handleValidation = useHandleValidation({
        checkAvailability: true,
        debounceMs: 500,
    });

    // Sync handle value with form data
    const handleUsernameChange = (value: string) => {
        handleValidation.onChange(value);
    };

    // Keep form data in sync when validation updates the value
    useEffect(() => {
        if (handleValidation.value !== data.username) {
            setData("username", handleValidation.value);
        }
    }, [handleValidation.value]);

    // Check if form is valid and can be submitted
    const canSubmit = useMemo(() => {
        const hasRequiredFields =
            data.email.trim() !== "" &&
            data.username.trim() !== "" &&
            data.password.trim() !== "" &&
            data.password_confirmation.trim() !== "";

        const isUsernameValid = handleValidation.isValid;
        const passwordsMatch = data.password === data.password_confirmation;
        const passwordLongEnough = data.password.length >= 8;

        return (
            hasRequiredFields &&
            isUsernameValid &&
            passwordsMatch &&
            passwordLongEnough
        );
    }, [data, handleValidation.isValid]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("register") as string, {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    // Social login handlers
    // Social login handlers
    const handleAppleLogin = () => {
        window.location.href = route("auth.social.redirect", "apple") as string;
    };

    return (
        <AuthLayout
            title="Unite a Linkea"
            subtitle="Crea tu cuenta gratis y empeza hoy"
            heroVariant="register"
        >
            <form onSubmit={submit} className="space-y-4">
                {/* Email field first (like Linktree) */}
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
                <HandleInput
                    id="username"
                    label="Tu Linkea"
                    value={handleValidation.value}
                    onChange={handleUsernameChange}
                    status={handleValidation.status}
                    message={handleValidation.message}
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
                    disabled={!canSubmit || processing}
                >
                    Crear cuenta
                </Button>
            </form>

            {/* Divider */}
            <AuthDivider />

            {/* Social login options */}
            {/* Social login options */}
            <SocialLoginButtons
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
