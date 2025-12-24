import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link, useForm, router } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { CheckCircle, Mail, RefreshCw } from "lucide-react";

interface Props {
    status?: string;
}

export default function VerifyEmail({ status }: Props) {
    const [resending, setResending] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        code: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("verification.verify"));
    };

    const resendCode = () => {
        setResending(true);
        router.post(
            route("verification.send"),
            {},
            {
                onFinish: () => setResending(false),
            }
        );
    };

    return (
        <AuthLayout
            title="Verifica tu email"
            subtitle="Ingresa el codigo de 6 digitos que enviamos a tu correo electronico"
        >
            {status === "verification-link-sent" && (
                <div className="mb-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                        Enviamos un nuevo codigo a tu correo electronico.
                    </p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <Input
                    id="code"
                    type="text"
                    label="Codigo de verificacion"
                    placeholder="123456"
                    value={data.code}
                    onChange={(e) => setData("code", e.target.value)}
                    autoFocus
                    error={errors.code}
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                />

                <Button
                    className="w-full text-base py-6 rounded-2xl"
                    isLoading={processing}
                >
                    Verificar mi cuenta
                </Button>
            </form>

            <div className="mt-6 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-neutral-500 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Si no recibiste el codigo, revisa tu carpeta de{" "}
                            <strong>spam/correo no deseado</strong> o solicita
                            uno nuevo.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={resendCode}
                            disabled={resending}
                            className="gap-2"
                        >
                            <RefreshCw
                                className={`w-4 h-4 ${resending ? "animate-spin" : ""}`}
                            />
                            Reenviar codigo
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-brand-500 transition-colors"
                >
                    Cerrar sesion
                </Link>
            </div>
        </AuthLayout>
    );
}

