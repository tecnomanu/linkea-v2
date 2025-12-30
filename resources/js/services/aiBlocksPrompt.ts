/**
 * AI Blocks Prompt Utilities
 *
 * Helper functions for AI chat - message generation from tool calls.
 * The actual prompts are defined in the Laravel backend (GroqService).
 */

export interface AIAction {
    action: "add_block" | "edit_block" | "update_design" | "remove_block";
    type?: string;
    title?: string;
    url?: string;
    phoneNumber?: string;
    emailAddress?: string;
    mapAddress?: string;
    icon?: string;
    backgroundColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    buttonStyle?: string;
    buttonShape?: string;
    fontPair?: string;
    roundedAvatar?: boolean;
    // For edit_block
    currentTitle?: string;
    newTitle?: string;
    newUrl?: string;
    newIcon?: string;
}

export interface ToolCall {
    name: string;
    arguments: Record<string, unknown>;
}

/**
 * Generate a friendly message from a tool call
 */
export function generateMessageFromTool(
    toolName: string,
    args: Record<string, unknown>
): string {
    switch (toolName) {
        case "add_block": {
            const type = args.type as string;
            const title = args.title as string;
            const icon = args.icon as string;

            // Specific block types
            if (type === "whatsapp") return "Listo! Agregue tu WhatsApp";
            if (type === "header") return `Agregue el encabezado "${title}"`;
            if (type === "email") return "Agregue un boton de email";
            if (type === "map") return "Agregue tu ubicacion en el mapa";
            if (type === "calendar") return "Agregue tu calendario de citas";
            if (type === "youtube") return `Agregue tu video de YouTube`;
            if (type === "spotify") return `Agregue tu Spotify`;
            if (type === "twitch") return `Agregue tu canal de Twitch`;
            if (type === "tiktok") return `Agregue tu TikTok`;
            if (type === "vimeo") return `Agregue tu video de Vimeo`;
            if (type === "soundcloud") return `Agregue tu SoundCloud`;

            // Link with icon
            if (icon) return `Listo! Agregue tu link de ${icon}`;

            return `Agregue "${title || "nuevo bloque"}"`;
        }

        case "edit_block": {
            const currentTitle = args.currentTitle as string;
            return `Edite "${currentTitle}"`;
        }

        case "update_design": {
            const changes = [];
            if (args.backgroundColor) changes.push("fondo");
            if (args.buttonColor) changes.push("color de botones");
            if (args.buttonTextColor) changes.push("texto de botones");
            if (args.buttonStyle) changes.push(`estilo ${args.buttonStyle}`);
            if (args.buttonShape) changes.push(`forma ${args.buttonShape}`);
            if (args.fontPair) changes.push(`fuente ${args.fontPair}`);
            if (args.roundedAvatar !== undefined) changes.push("avatar");
            return changes.length
                ? `Cambie ${changes.join(", ")}!`
                : "Diseno actualizado!";
        }

        case "remove_block":
            return `Elimine "${args.title}"`;

        default:
            return "Listo!";
    }
}

/**
 * Convert tool call to AIAction for UI display
 */
export function toolCallToAction(toolCall: ToolCall): AIAction | null {
    const { name, arguments: args } = toolCall;

    switch (name) {
        case "add_block":
            return {
                action: "add_block",
                type: args.type as string,
                title: args.title as string,
                url: args.url as string,
                phoneNumber: args.phoneNumber as string,
                emailAddress: args.emailAddress as string,
                mapAddress: args.mapAddress as string,
                icon: args.icon as string,
            };

        case "edit_block":
            return {
                action: "edit_block",
                currentTitle: args.currentTitle as string,
                newTitle: args.newTitle as string,
                newUrl: args.newUrl as string,
                newIcon: args.newIcon as string,
            };

        case "update_design":
            return {
                action: "update_design",
                backgroundColor: args.backgroundColor as string,
                buttonColor: args.buttonColor as string,
                buttonTextColor: args.buttonTextColor as string,
                buttonStyle: args.buttonStyle as string,
                buttonShape: args.buttonShape as string,
                fontPair: args.fontPair as string,
                roundedAvatar: args.roundedAvatar as boolean,
            };

        case "remove_block":
            return {
                action: "remove_block",
                title: args.title as string,
            };

        default:
            return null;
    }
}
