import AdminLayout from "@/Layouts/AdminLayout";
import { router, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";
import React from "react";

interface Notification {
    id?: string;
    title: string;
    text: string;
    type: string | null;
}

interface NotificationFormProps {
    auth: {
        user: any;
    };
    notification: Notification | null;
}

export default function NotificationForm({ auth, notification }: NotificationFormProps) {
    const isEditing = !!notification?.id;

    const { data, setData, post, put, processing, errors } = useForm({
        title: notification?.title || "",
        text: notification?.text || "",
        type: notification?.type || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route("admin.notifications.update", notification.id));
        } else {
            post(route("admin.notifications.store"));
        }
    };

    return (
        <AdminLayout
            title={`Admin - ${isEditing ? "Editar" : "Nueva"} Notificacion`}
            user={auth.user}
        >
            <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.visit(route("admin.notifications"))}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            {isEditing ? "Editar Notificacion" : "Nueva Notificacion"}
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                            {isEditing
                                ? "Modifica el contenido de la notificacion"
                                : "Crea una nueva notificacion para enviar a los usuarios"}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                            >
                                Titulo
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={data.title}
                                onChange={(e) => setData("title", e.target.value)}
                                placeholder="Titulo de la notificacion..."
                                className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                                    errors.title
                                        ? "border-red-500"
                                        : "border-neutral-200 dark:border-neutral-700"
                                }`}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>

                        {/* Type */}
                        <div>
                            <label
                                htmlFor="type"
                                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                            >
                                Tipo (opcional)
                            </label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData("type", e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            >
                                <option value="">General</option>
                                <option value="info">Informativa</option>
                                <option value="warning">Advertencia</option>
                                <option value="success">Exito</option>
                                <option value="error">Error</option>
                                <option value="update">Actualizacion</option>
                                <option value="promo">Promocional</option>
                            </select>
                        </div>

                        {/* Text */}
                        <div>
                            <label
                                htmlFor="text"
                                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                            >
                                Mensaje
                            </label>
                            <textarea
                                id="text"
                                value={data.text}
                                onChange={(e) => setData("text", e.target.value)}
                                placeholder="Escribe el contenido de la notificacion..."
                                rows={6}
                                className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none ${
                                    errors.text
                                        ? "border-red-500"
                                        : "border-neutral-200 dark:border-neutral-700"
                                }`}
                            />
                            {errors.text && (
                                <p className="mt-1 text-sm text-red-500">{errors.text}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <button
                                type="button"
                                onClick={() => router.visit(route("admin.notifications"))}
                                className="px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                            >
                                {processing ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save size={18} />
                                )}
                                {isEditing ? "Guardar cambios" : "Crear notificacion"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

