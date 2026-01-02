import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import { router, useForm } from "@inertiajs/react";
import { Camera, Check, Loader2, Lock, Save, User } from "lucide-react";
import React, { useState } from "react";

interface ProfileTabProps {
    user: any; // The auth user object
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user }) => {
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            current_password: "",
            password: "",
            password_confirmation: "",
        });

    const [avatarPreview, setAvatarPreview] = useState(
        user.avatar || "/images/logos/logo-icon.webp"
    );
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [avatarSuccess, setAvatarSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("profile.update"), {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => {
                setData("current_password", "");
                setData("password", "");
                setData("password_confirmation", "");
            },
        });
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarPreview(URL.createObjectURL(file));
            setUploadingAvatar(true);
            setAvatarSuccess(false);

            // Upload avatar immediately using Inertia's file upload
            router.post(route("profile.avatar"), { avatar: file }, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    setAvatarSuccess(true);
                    setTimeout(() => setAvatarSuccess(false), 2000);
                },
                onFinish: () => {
                    setUploadingAvatar(false);
                },
            });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
            {/* Profile Header / Avatar */}
            <div className="bg-white dark:bg-neutral-800 rounded-[32px] overflow-hidden border border-neutral-100 dark:border-neutral-700 shadow-soft-xl">
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="relative group cursor-pointer mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-neutral-700 shadow-lg">
                            <img
                                src={avatarPreview}
                                alt="Perfil"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className={`absolute inset-0 bg-black/40 rounded-full transition-opacity flex items-center justify-center text-white ${
                            uploadingAvatar || avatarSuccess ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}>
                            {uploadingAvatar ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : avatarSuccess ? (
                                <Check size={24} className="text-green-400" />
                            ) : (
                                <Camera size={24} />
                            )}
                        </div>
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleAvatarChange}
                            accept="image/*"
                            disabled={uploadingAvatar}
                        />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                        {user.first_name} {user.last_name}
                    </h2>
                    <p className="text-neutral-400">{user.email}</p>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white dark:bg-neutral-800 rounded-[32px] overflow-hidden border border-neutral-100 dark:border-neutral-700 shadow-soft-xl">
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-xl text-brand-600 dark:text-brand-400">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                                Información Personal
                            </h2>
                            <p className="text-sm text-neutral-400">
                                Actualizá tus datos personales.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            id="first_name"
                            type="text"
                            label="Nombre"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            error={errors.first_name}
                        />
                        <Input
                            id="last_name"
                            type="text"
                            label="Apellido"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            error={errors.last_name}
                        />
                    </div>

                    <Input
                        id="email"
                        type="email"
                        label="Correo electrónico"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        error={errors.email}
                    />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            isLoading={processing}
                            className="gap-2"
                        >
                            <Save size={18} />
                            Guardar cambios
                        </Button>
                    </div>
                </form>
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-neutral-800 rounded-[32px] overflow-hidden border border-neutral-100 dark:border-neutral-700 shadow-soft-xl">
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                                Seguridad
                            </h2>
                            <p className="text-sm text-neutral-400">
                                Cambiá tu contraseña.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="p-8 space-y-6">
                    <Input
                        id="current_password"
                        type="password"
                        label="Contraseña actual"
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        error={errors.current_password}
                    />
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            id="password"
                            type="password"
                            label="Nueva contraseña"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            error={errors.password}
                        />
                        <Input
                            id="password_confirmation"
                            type="password"
                            label="Confirmar contraseña"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            error={errors.password_confirmation}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="secondary"
                            isLoading={processing}
                            className="gap-2"
                        >
                            <Save size={18} />
                            Actualizar contraseña
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
