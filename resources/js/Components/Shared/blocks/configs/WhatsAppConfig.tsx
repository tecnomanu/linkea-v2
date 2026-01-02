import { LinkBlock } from "@/types/index";
import React from "react";

interface WhatsAppConfigProps {
    link: LinkBlock;
    onUpdate: (id: string, updates: Partial<LinkBlock>) => void;
}

export const WhatsAppConfig: React.FC<WhatsAppConfigProps> = ({
    link,
    onUpdate,
}) => {
    return (
        <div className="space-y-4">
            {/* Phone Number */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Numero de WhatsApp
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-neutral-400 font-bold">+</span>
                    </div>
                    <input
                        type="tel"
                        value={link.phoneNumber || ""}
                        onChange={(e) =>
                            onUpdate(link.id, {
                                phoneNumber: e.target.value,
                            })
                        }
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-7 pr-4 py-3 font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        placeholder="5491112345678"
                    />
                </div>
                <p className="text-xs text-neutral-400">
                    Incluye el codigo de pais, sin espacios.
                </p>
            </div>

            {/* Predefined Message */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Mensaje predefinido
                </label>
                <textarea
                    value={link.predefinedMessage || ""}
                    onChange={(e) =>
                        onUpdate(link.id, {
                            predefinedMessage: e.target.value,
                        })
                    }
                    rows={3}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
                    placeholder="Hola! Vi tu enlace y queria..."
                />
            </div>
        </div>
    );
};

