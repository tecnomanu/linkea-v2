import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { ArrowLeft } from "lucide-react";

interface Props {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("password.store"));
    };

    return (
        <AuthLayout
            title="Nueva contrasena"
            subtitle="Ingresa tu nueva contrasena para recuperar el acceso a tu cuenta"
        >
            <form onSubmit={submit} className="space-y-5">
                <Input
                    id="email"
                    type="email"
                    label="Correo electronico"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    error={errors.email}
                    disabled
                />

                <Input
                    id="password"
                    type="password"
                    label="Nueva contrasena"
                    placeholder="Minimo 8 caracteres"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    autoFocus
                    error={errors.password}
                />

                <Input
                    id="password_confirmation"
                    type="password"
                    label="Confirmar contrasena"
                    placeholder="Repeti tu nueva contrasena"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    error={errors.password_confirmation}
                />

                <Button
                    className="w-full text-base py-6 rounded-2xl"
                    isLoading={processing}
                >
                    Cambiar contrasena
                </Button>
            </form>

            <div className="mt-6 text-center">
                <Link
                    href={route("login")}
                    className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-brand-500 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al login
                </Link>
            </div>
        </AuthLayout>
    );
}

