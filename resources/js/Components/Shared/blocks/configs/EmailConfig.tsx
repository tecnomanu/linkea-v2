/**
 * EmailConfig - Configuration panel for Email block
 *
 * Creates a mailto: link with optional subject and body
 *
 * Related files:
 * - types.ts: LinkBlock.emailAddress, emailSubject, emailBody
 * - LandingContent.tsx: Renders as mailto link
 */

import { LinkBlock } from "@/types/index";
import { Mail } from "lucide-react";
import React from "react";

interface EmailConfigProps {
    link: LinkBlock;
    onUpdate: (id: string, updates: Partial<LinkBlock>) => void;
}

export const EmailConfig: React.FC<EmailConfigProps> = ({ link, onUpdate }) => {
    return (
        <div className="space-y-5">
            {/* Email Address */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Email de destino
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail
                            size={16}
                            className="text-sky-500 dark:text-sky-400"
                        />
                    </div>
                    <input
                        type="email"
                        value={link.emailAddress || ""}
                        onChange={(e) =>
                            onUpdate(link.id, { emailAddress: e.target.value })
                        }
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                        placeholder="tu@email.com"
                    />
                </div>
                <p className="text-xs text-neutral-400">
                    Los visitantes podran enviarte un email a esta direccion
                </p>
            </div>

            {/* Subject (optional) */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Asunto predefinido (opcional)
                </label>
                <input
                    type="text"
                    value={link.emailSubject || ""}
                    onChange={(e) =>
                        onUpdate(link.id, { emailSubject: e.target.value })
                    }
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                    placeholder="Ej: Consulta desde tu bio"
                />
            </div>

            {/* Body (optional) */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Mensaje predefinido (opcional)
                </label>
                <textarea
                    value={link.emailBody || ""}
                    onChange={(e) =>
                        onUpdate(link.id, { emailBody: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none"
                    placeholder="Ej: Hola, me gustaria contactarte por..."
                />
            </div>

        </div>
    );
};

