import { Button } from "@/Components/ui/Button";
import { OtpInput } from "@/Components/ui/OtpInput";
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

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 text-center">
                        Codigo de verificacion
                    </label>
                    <OtpInput
                        length={6}
                    value={data.code}
                        onChange={(value) => setData("code", value)}
                    autoFocus
                    error={errors.code}
                        disabled={processing}
                />
                </div>

                <Button
                    className="w-full py-6 text-base rounded-xl font-bold"
                    isLoading={processing}
                    disabled={data.code.length !== 6 || processing}
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

