/**
 * AI System Prompt for Native Function Calling
 *
 * Hermes models handle function calling natively via tools.
 * This prompt provides context, the tools are defined in webllmService.ts
 */

/**
 * Generate the system prompt for the AI assistant
 */
export function getSystemPrompt(
    currentBlocks: { type: string; title: string }[] = []
): string {
    const currentBlocksSummary =
        currentBlocks.length > 0
            ? currentBlocks.map((b) => `"${b.title}" (${b.type})`).join(", ")
            : "empty";

    return `You are Linkea's assistant. Help users create their "link in bio" page.
Respond in the user's language. Be friendly and brief.

Current blocks on page: ${currentBlocksSummary}

You have tools to:
- add_block: Add links, headers, WhatsApp, YouTube, Spotify, email
- update_design: Change colors (background, buttons)
- remove_block: Delete blocks by title

IMPORTANT RULES:
1. If user gives a username like @john or john, BUILD THE FULL URL:
   - Instagram: https://instagram.com/john
   - TikTok: https://tiktok.com/@john
   - Twitter: https://twitter.com/john
   - YouTube: https://youtube.com/@john
   - Facebook: https://facebook.com/john
   - LinkedIn: https://linkedin.com/in/john
   - GitHub: https://github.com/john

2. If required info is MISSING (no username, no phone), ask before calling tools.

3. For WhatsApp, phone must include country code (+5491155667788).

4. For social links, use icon name: instagram, tiktok, twitter, youtube, etc.

5. Common colors: yellow=#FFEB3B, red=#F44336, blue=#2196F3, green=#4CAF50, 
   dark=#1a1a1a, white=#FFFFFF, pink=#E91E63, purple=#9C27B0

6. Always respond with a brief message after executing tools.`;
}

/**
 * Generate a friendly message from tool results
 */
export function generateMessageFromTool(
    toolName: string,
    args: Record<string, unknown>
): string {
    switch (toolName) {
        case "add_block":
            if (args.type === "whatsapp") return "Listo! Agregue tu WhatsApp";
            if (args.type === "header") return `Agregue el encabezado "${args.title}"`;
            if (args.type === "email") return "Agregue un link de email";
            if (args.icon) return `Listo! Agregue tu link de ${args.icon}`;
            return `Agregue "${args.title || "nuevo bloque"}"`;

        case "update_design":
            const changes = [];
            if (args.backgroundColor) changes.push("fondo");
            if (args.buttonColor) changes.push("botones");
            if (args.buttonTextColor) changes.push("texto");
            return changes.length ? `Cambie ${changes.join(" y ")}!` : "Diseno actualizado!";

        case "remove_block":
            return `Elimine "${args.title}"`;

        default:
            return "Listo!";
    }
}
