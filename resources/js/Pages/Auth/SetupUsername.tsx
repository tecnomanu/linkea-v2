import { Button } from "@/Components/ui/Button";
import { HandleInput } from "@/Components/ui/HandleInput";
import { useHandleValidation } from "@/hooks/useHandleValidation";
import AuthLayout from "@/Layouts/AuthLayout";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useMemo } from "react";

export default function SetupUsername({
    initialUsername,
}: {
    initialUsername: string;
}) {
    const { data, setData, post, processing, errors } = useForm({
        username: initialUsername || "",
    });

    // Username validation with async availability check
    const handleValidation = useHandleValidation({
        checkAvailability: true,
        debounceMs: 500,
        initialValue: initialUsername,
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

    const canSubmit = useMemo(() => {
        return handleValidation.isValid && data.username.length > 0;
    }, [data, handleValidation.isValid]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("auth.setup.username") as string);
    };

    return (
        <AuthLayout
            title="Elegi tu Linkea"
            subtitle="Crea tu enlace unico para compartir todo lo que sos."
            heroVariant="login" // Using login variant which is usually simpler or center aligned
        >
            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Este sera tu enlace personal. Podes cambiarlo despues,
                        pero es mejor elegir uno bueno ahora.
                    </p>

                    {/* Username with linkea.ar/ prefix */}
                    <HandleInput
                        id="username"
                        label="Tu Linkea"
                        value={handleValidation.value}
                        onChange={handleUsernameChange}
                        status={handleValidation.status}
                        message={handleValidation.message}
                        error={errors.username}
                        autoFocus
                    />
                </div>

                <Button
                    className="w-full py-6 text-base rounded-xl font-bold"
                    isLoading={processing}
                    disabled={!canSubmit || processing}
                >
                    Confirmar y Crear
                </Button>
            </form>
        </AuthLayout>
    );
}
