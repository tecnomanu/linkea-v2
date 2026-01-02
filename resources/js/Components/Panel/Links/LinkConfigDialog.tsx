import {
    getBlockConfig,
    renderBlockTypeIcon,
} from "@/Components/Shared/blocks/blockConfig";
import {
    CalendarConfig,
    DefaultConfig,
    EmailConfig,
    HeaderConfig,
    MapConfig,
    MediaConfig,
    SoundCloudConfig,
    VideoEmbedConfig,
    WhatsAppConfig,
} from "@/Components/Shared/blocks/configs";
import { Button } from "@/Components/ui/Button";
import {
    Dialog,
    DialogBody,
    DialogCloseButton,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/Components/ui/Dialog";
import { LinkBlock } from "@/types/index";
import React from "react";

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
    const config = getBlockConfig(link.type);

    const renderConfigContent = () => {
        switch (link.type) {
            case "header":
                return <HeaderConfig link={link} onUpdate={onUpdate} />;
            case "whatsapp":
                return <WhatsAppConfig link={link} onUpdate={onUpdate} />;
            case "video":
            case "music":
            case "youtube":
            case "spotify":
                return <MediaConfig link={link} onUpdate={onUpdate} />;
            case "calendar":
                return <CalendarConfig link={link} onUpdate={onUpdate} />;
            case "email":
                return <EmailConfig link={link} onUpdate={onUpdate} />;
            case "map":
                return <MapConfig link={link} onUpdate={onUpdate} />;
            case "vimeo":
            case "tiktok":
            case "twitch":
                return <VideoEmbedConfig link={link} onUpdate={onUpdate} />;
            case "soundcloud":
                return <SoundCloudConfig link={link} onUpdate={onUpdate} />;
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
                            {renderBlockTypeIcon(link.type, 20, "", true)}
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-900 dark:text-white text-lg">
                                Configurar Bloque
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">
                                {config.label}
                            </p>
                        </div>
                    </div>
                    <DialogCloseButton onClick={onClose} variant="minimal" />
                </DialogHeader>

                <DialogBody className="p-6 space-y-6 max-h-[60vh] overflow-y-auto overlay-scrollbar">
                    {renderConfigContent()}
                </DialogBody>

                <DialogFooter className="justify-end bg-neutral-50/50 dark:bg-neutral-900/50">
                    <Button onClick={onClose}>Listo</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
