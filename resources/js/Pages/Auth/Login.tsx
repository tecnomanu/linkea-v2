import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        identifier: "",
        password: "",
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <AuthLayout
            title="Bienvenido"
            subtitle="Ingresa con tu email o nombre de tu linkea"
        >
            <form onSubmit={submit} className="space-y-5">
                <Input
                    id="identifier"
                    type="text"
                    label="Email o nombre del linkea"
                    placeholder="tu@email.com o tu-linkea"
                    value={data.identifier}
                    onChange={(e) => setData("identifier", e.target.value)}
                    autoFocus
                    error={errors.identifier}
                />

                <Input
                    id="password"
                    type="password"
                    label="Contrasena"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    error={errors.password}
                />

                <div className="flex items-center justify-between">
                    <Link
                        href={route("password.request")}
                        className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-brand-500 transition-colors"
                    >
                        Olvidaste tu contrasena?
                    </Link>
                    <Link
                        href={route("register")}
                        className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-brand-500 transition-colors"
                    >
                        Registrate
                    </Link>
                </div>

                <Button
                    className="w-full text-base py-6 rounded-2xl"
                    isLoading={processing}
                >
                    Ingresar
                </Button>
            </form>
        </AuthLayout>
    );
}
