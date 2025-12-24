import AdminLayout from "@/Layouts/AdminLayout";
import { RichTextEditor } from "@/Components/Admin/RichTextEditor";
import { router, useForm } from "@inertiajs/react";
import {
    AlertTriangle,
    ArrowLeft,
    BarChart3,
    Check,
    Mail,
    Save,
    Send,
    Trash2,
    X,
} from "lucide-react";
import React, { useState } from "react";

interface NewsletterUser {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    sent: boolean;
    viewed_count: number;
    ip: string | null;
    date: string | null;
}

interface Newsletter {
    id?: string;
    subject: string;
    message: string;
    sent: boolean;
    status: string;
    recipients?: NewsletterUser[];
    recipients_count?: number;
    sent_count?: number;
    viewed_count?: number;
}

interface NewsletterFormProps {
    auth: {
        user: any;
    };
    newsletter: Newsletter | null;
}

type TabType = "editor" | "stats";

export default function NewsletterForm({ auth, newsletter }: NewsletterFormProps) {
    const isEditing = !!newsletter?.id;
    const [activeTab, setActiveTab] = useState<TabType>("editor");
    // Testing mode only available when editing, default to true
    const [testMode, setTestMode] = useState(true);
    const [testEmail, setTestEmail] = useState(auth.user?.email || "");
    const [sendingTest, setSendingTest] = useState(false);
    const [sending, setSending] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        subject: newsletter?.subject || "",
        message: newsletter?.message || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route("admin.newsletters.update", newsletter.id));
        } else {
            post(route("admin.newsletters.store"));
        }
    };

    const handleSaveAndSend = async () => {
        if (!data.subject || !data.message) {
            alert("Complete el asunto y el mensaje antes de enviar.");
            return;
        }
        
        if (!confirm("Guardar y enviar este newsletter a todos los usuarios?")) {
            return;
        }

        setSending(true);
        try {
            // First save
            await new Promise<void>((resolve, reject) => {
                put(route("admin.newsletters.update", newsletter?.id), {
                    onSuccess: () => resolve(),
                    onError: () => reject(),
                });
            });
            
            // Then send
            router.post(route("admin.newsletters.send", newsletter?.id));
        } catch {
            alert("Error al guardar el newsletter");
        } finally {
            setSending(false);
        }
    };

    const handleSendTest = async () => {
        if (!testEmail || !data.subject || !data.message) return;
        setSendingTest(true);
        
        try {
            await fetch(route("admin.newsletters.send-test", newsletter?.id), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                },
                body: JSON.stringify({ email: testEmail }),
            });
            alert("Email de prueba enviado a " + testEmail);
        } catch {
            alert("Error al enviar el email de prueba");
        } finally {
            setSendingTest(false);
        }
    };

    const handleClear = () => {
        if (confirm("Limpiar el contenido del mensaje?")) {
            setData("message", "");
        }
    };

    const tabs = [
        { id: "editor" as TabType, label: "Newsletter", icon: <Mail size={16} /> },
        ...(isEditing ? [{ id: "stats" as TabType, label: "Estadisticas", icon: <BarChart3 size={16} /> }] : []),
    ];

    return (
        <AdminLayout
            title={`Admin - ${isEditing ? "Editar" : "Nuevo"} Newsletter`}
            user={auth.user}
        >
            <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.visit(route("admin.newsletters"))}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Envio de mensajes por sistema
                        </h1>
                    </div>
                </div>

                {/* Tabs - only show if editing */}
                {isEditing && (
                    <div className="flex gap-1 mb-6 border-b border-neutral-200 dark:border-neutral-700">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                    activeTab === tab.id
                                        ? "text-red-500 border-red-500"
                                        : "text-neutral-500 border-transparent hover:text-neutral-700 dark:hover:text-neutral-300"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Editor Tab */}
                {activeTab === "editor" && (
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-6">
                            {/* Test Mode Toggle - only show when editing */}
                            {isEditing && (
                                <>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={testMode}
                                                onChange={(e) => setTestMode(e.target.checked)}
                                                className="w-4 h-4 rounded border-neutral-300 text-orange-500 focus:ring-orange-500"
                                            />
                                            <span className="text-sm font-semibold text-orange-600">
                                                TESTING
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            value={testEmail}
                                            onChange={(e) => setTestEmail(e.target.value)}
                                            placeholder="Email de prueba"
                                            className="flex-1 px-3 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                        />
                                    </div>

                                    {testMode && (
                                        <div className="flex items-center gap-2 px-4 py-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                                            <AlertTriangle className="text-orange-500 shrink-0" size={18} />
                                            <span className="text-sm text-orange-600 dark:text-orange-400">
                                                El mensaje se enviara solo como prueba.
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Subject */}
                            <div>
                                <label
                                    htmlFor="subject"
                                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                                >
                                    Asunto
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={data.subject}
                                    onChange={(e) => setData("subject", e.target.value)}
                                    placeholder="Asunto del mensaje"
                                    className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                                        errors.subject
                                            ? "border-red-500"
                                            : "border-neutral-200 dark:border-neutral-700"
                                    }`}
                                />
                                {errors.subject && (
                                    <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                                )}
                            </div>

                            {/* Message - Rich Editor */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        Cuerpo del mensaje
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        LIMPIAR MENSAJE
                                    </button>
                                </div>
                                <RichTextEditor
                                    content={data.message}
                                    onChange={(html) => setData("message", html)}
                                    placeholder="Ingrese el mensaje que se enviara."
                                />
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                                )}
                            </div>

                            {/* Save and Send Button - only when editing and not in test mode */}
                            {isEditing && !testMode && (
                                <button
                                    type="button"
                                    onClick={handleSaveAndSend}
                                    disabled={sending || processing}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50 shadow-lg shadow-orange-500/25"
                                >
                                    {sending ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Send size={20} />
                                    )}
                                    GUARDAR Y ENVIAR
                                </button>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-3 pt-4">
                                {testMode && isEditing && (
                                    <button
                                        type="button"
                                        onClick={handleSendTest}
                                        disabled={sendingTest || !testEmail}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                                    >
                                        {sendingTest ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Send size={18} />
                                        )}
                                        ENVIAR PRUEBA
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                                >
                                    {processing ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    GUARDAR
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.visit(route("admin.newsletters"))}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium text-sm transition-colors"
                                >
                                    <X size={18} />
                                    CANCELAR
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Stats Tab */}
                {activeTab === "stats" && isEditing && newsletter?.recipients && (
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        {/* Stats Summary */}
                        <div className="grid grid-cols-3 gap-4 p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    {newsletter.recipients_count || 0}
                                </div>
                                <div className="text-xs text-neutral-500">Total destinatarios</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-500">
                                    {newsletter.sent_count || 0}
                                </div>
                                <div className="text-xs text-neutral-500">Enviados</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-500">
                                    {newsletter.viewed_count || 0}
                                </div>
                                <div className="text-xs text-neutral-500">Vistos</div>
                            </div>
                        </div>

                        {/* Recipients Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-xs uppercase tracking-wider text-neutral-500">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Usuario</th>
                                        <th className="px-4 py-3 text-left font-medium">IP</th>
                                        <th className="px-4 py-3 text-center font-medium">Enviado</th>
                                        <th className="px-4 py-3 text-center font-medium">Visto</th>
                                        <th className="px-4 py-3 text-center font-medium">Cant. Visto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                    {newsletter.recipients?.map((recipient) => (
                                        <tr
                                            key={recipient.id}
                                            className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-neutral-900 dark:text-white">
                                                    {recipient.user?.name || "Usuario eliminado"}{" "}
                                                    <span className="text-neutral-500">
                                                        ({recipient.user?.email || "N/A"})
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-neutral-500">
                                                {recipient.ip || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {recipient.sent ? (
                                                    <Check className="inline-block text-emerald-500" size={18} />
                                                ) : (
                                                    <X className="inline-block text-rose-500" size={18} />
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {recipient.viewed_count > 0 ? (
                                                    <Check className="inline-block text-emerald-500" size={18} />
                                                ) : (
                                                    <X className="inline-block text-rose-500" size={18} />
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm text-neutral-900 dark:text-white">
                                                {recipient.viewed_count}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!newsletter.recipients || newsletter.recipients.length === 0) && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                                                No hay destinatarios para este newsletter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
