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
 * Generate a friendly message from a tool call (fallback when AI doesn't send one)
 */
export function generateMessageFromTool(
    toolName: string,
    args: Record<string, unknown>
): string {
    // Friendly prefixes for variety
    const addPrefixes = ["Dale!", "Perfecto!", "Listo!", "Ahi va!"];
    const editPrefixes = ["Hecho!", "Listo!", "Ya esta!"];
    const removePrefixes = ["Ya lo saque!", "Eliminado!", "Listo!"];

    const randomPrefix = (arr: string[]) =>
        arr[Math.floor(Math.random() * arr.length)];

    switch (toolName) {
        case "add_block": {
            const type = args.type as string;
            const title = args.title as string;
            const icon = args.icon as string;
            const prefix = randomPrefix(addPrefixes);

            // Specific block types
            if (type === "whatsapp") return `${prefix} Agregue tu WhatsApp`;
            if (type === "header")
                return `${prefix} Agregue el encabezado "${title}"`;
            if (type === "email") return `${prefix} Agregue tu boton de email`;
            if (type === "map") return `${prefix} Agregue tu ubicacion`;
            if (type === "calendar") return `${prefix} Agregue tu calendario`;
            if (type === "youtube")
                return `${prefix} Agregue tu video de YouTube`;
            if (type === "spotify") return `${prefix} Agregue tu Spotify`;
            if (type === "twitch")
                return `${prefix} Agregue tu canal de Twitch`;
            if (type === "tiktok") return `${prefix} Agregue tu TikTok`;
            if (type === "vimeo") return `${prefix} Agregue tu video de Vimeo`;
            if (type === "soundcloud") return `${prefix} Agregue tu SoundCloud`;

            // Link with icon (social networks)
            if (icon) return `${prefix} Agregue tu ${icon}`;

            return `${prefix} Agregue "${title || "nuevo bloque"}"`;
        }

        case "edit_block": {
            const currentTitle = args.currentTitle as string;
            return `${randomPrefix(editPrefixes)} Modifique "${currentTitle}"`;
        }

        case "update_design": {
            const changes = [];
            if (args.backgroundColor) changes.push("el fondo");
            if (args.buttonColor) changes.push("los botones");
            if (args.buttonTextColor) changes.push("el texto");
            if (args.buttonStyle) changes.push("el estilo");
            if (args.buttonShape) changes.push("la forma");
            if (args.fontPair) changes.push("la fuente");
            if (args.roundedAvatar !== undefined) changes.push("el avatar");
            return changes.length
                ? `${randomPrefix(editPrefixes)} Cambie ${changes.join(" y ")}!`
                : "Diseno actualizado!";
        }

        case "remove_block":
            return `${randomPrefix(removePrefixes)} "${args.title}"`;

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
