/**
 * AI Blocks Prompt Utilities
 *
 * Helper functions for AI chat - message generation from tool calls.
 * The actual prompts are defined in the Laravel backend (GroqService).
 */

export interface AIAction {
    action: "add_block" | "update_design" | "remove_block";
    type?: string;
    title?: string;
    url?: string;
    phoneNumber?: string;
    emailAddress?: string;
    icon?: string;
    backgroundColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
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
        case "add_block":
            if (args.type === "whatsapp") return "Listo! Agregue tu WhatsApp";
            if (args.type === "header")
                return `Agregue el encabezado "${args.title}"`;
            if (args.type === "email") return "Agregue un link de email";
            if (args.icon) return `Listo! Agregue tu link de ${args.icon}`;
            return `Agregue "${args.title || "nuevo bloque"}"`;

        case "update_design":
            const changes = [];
            if (args.backgroundColor) changes.push("fondo");
            if (args.buttonColor) changes.push("botones");
            if (args.buttonTextColor) changes.push("texto");
            return changes.length
                ? `Cambie ${changes.join(" y ")}!`
                : "Diseno actualizado!";

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
                icon: args.icon as string,
            };

        case "update_design":
            return {
                action: "update_design",
                backgroundColor: args.backgroundColor as string,
                buttonColor: args.buttonColor as string,
                buttonTextColor: args.buttonTextColor as string,
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
