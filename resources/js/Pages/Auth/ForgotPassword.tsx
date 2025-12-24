import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";

interface Props {
    status?: string;
}

export default function ForgotPassword({ status }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <AuthLayout
            title="Recuperar contrasena"
            subtitle="Ingresa tu correo electronico y te enviaremos un enlace para restablecer tu contrasena"
        >
            {status && (
                <div className="mb-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                        {status}
                    </p>
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
                    error={errors.email}
                />

                <Button
                    className="w-full text-base py-6 rounded-2xl"
                    isLoading={processing}
                >
                    Enviar enlace de recuperacion
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

