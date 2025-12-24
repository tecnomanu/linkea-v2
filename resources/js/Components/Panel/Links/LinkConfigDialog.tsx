import { Button } from "@/Components/ui/Button";
import {
    Dialog,
    DialogBody,
    DialogCloseButton,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/Components/ui/Dialog";
import { LinkBlock } from "@/types";
import React from "react";
import { BLOCK_CONFIG } from "./BlockSelector";
import {
    DefaultConfig,
    HeaderConfig,
    MediaConfig,
    WhatsAppConfig,
} from "./configs";

interface LinkConfigDialogProps {
    isOpen: boolean;
    onClose: () => void;
    link: LinkBlock;
    onUpdate: (id: string, updates: Partial<LinkBlock>) => void;
}

export const LinkConfigDialog: React.FC<LinkConfigDialogProps> = ({
    isOpen,
    onClose,
    link,
    onUpdate,
}) => {
    const config = BLOCK_CONFIG[link.type] || BLOCK_CONFIG["link"];

    const renderConfigContent = () => {
        switch (link.type) {
            case "header":
                return <HeaderConfig link={link} onUpdate={onUpdate} />;
            case "whatsapp":
                return <WhatsAppConfig link={link} onUpdate={onUpdate} />;
            case "video":
            case "music":
                return <MediaConfig link={link} onUpdate={onUpdate} />;
            case "classic":
            case "twitter":
            case "mastodon":
            default:
                return <DefaultConfig />;
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogContent maxWidth="md" className="rounded-[28px]">
                <DialogHeader
                    className={`p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between ${
                        link.isEnabled ? "" : "grayscale"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${config.colorClass}`}
                        >
                            {config.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-900 dark:text-white text-lg">
                                Configure Block
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">
                                {config.label}
                            </p>
                        </div>
                    </div>
                    <DialogCloseButton onClick={onClose} variant="minimal" />
                </DialogHeader>

                <DialogBody className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                    {renderConfigContent()}
                </DialogBody>

                <DialogFooter className="justify-end bg-neutral-50/50 dark:bg-neutral-900/50">
                    <Button onClick={onClose}>Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
