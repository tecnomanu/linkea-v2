/**
 * AI System Prompt for JSON-based Actions
 *
 * The model responds with JSON containing:
 * - message: Always present - text to show the user
 * - action: Optional - action to execute (add_block, update_design, remove_block)
 */

export interface AIAction {
    action: "add_block" | "update_design" | "remove_block";
    // For add_block
    type?: string;
    title?: string;
    url?: string;
    phoneNumber?: string;
    emailAddress?: string;
    icon?: string;
    // For update_design
    backgroundColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
}

export interface AIResponse {
    message: string;
    action?: AIAction;
}

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

Current blocks: ${currentBlocksSummary}

ALWAYS respond with JSON in this exact format:
{"message":"Your response text here","action":{...}}

The "message" field is REQUIRED - always include a friendly response.
The "action" field is OPTIONAL - only include when executing an action.

EXAMPLES:

User asks to add Instagram:
{"message":"Listo! Agregué tu link de Instagram","action":{"action":"add_block","type":"link","title":"Instagram","url":"https://instagram.com/user","icon":"instagram"}}

User asks a question:
{"message":"Claro! Cual es tu usuario de Instagram?"}

User wants yellow background:
{"message":"Perfecto, cambié el fondo a amarillo!","action":{"action":"update_design","backgroundColor":"#FFEB3B"}}

User wants to delete something:
{"message":"Eliminé el bloque de Instagram","action":{"action":"remove_block","title":"Instagram"}}

ACTION TYPES:
- add_block: type (link/header/whatsapp/youtube/spotify/email), title, url, icon, phoneNumber, emailAddress
- update_design: backgroundColor, buttonColor, buttonTextColor (hex colors)
- remove_block: title

ICONS: instagram, tiktok, twitter, youtube, facebook, linkedin, github, discord, twitch, spotify

RULES:
1. ALWAYS include "message" with friendly text
2. If user gives @username, build full URL (instagram.com/username, tiktok.com/@username)
3. If info is MISSING, ask in message without action
4. WhatsApp needs phone with country code (+5491155667788)
5. Colors: yellow=#FFEB3B, red=#F44336, blue=#2196F3, green=#4CAF50, dark=#1a1a1a, pink=#E91E63

ONLY output valid JSON. No other text.`;
}

/**
 * Parse the AI response to extract message and action
 */
export function parseAIResponse(response: string): AIResponse {
    try {
        // Try to find JSON in the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            
            // Extract message (required)
            const message = parsed.message || generateMessageFromAction(parsed.action || parsed);
            
            // Extract action (optional)
            let action: AIAction | undefined;
            if (parsed.action && parsed.action.action) {
                action = parsed.action;
            } else if (parsed.action && ["add_block", "update_design", "remove_block"].includes(parsed.action)) {
                // Old format where action was at root level
                action = parsed as AIAction;
            }

            return { message, action };
        }
    } catch (e) {
        console.warn("Failed to parse AI response as JSON:", e);
    }

    // If no valid JSON found, treat response as plain message
    return {
        message: response.trim() || "Entendido!",
    };
}

/**
 * Generate a friendly message from an action (fallback)
 */
function generateMessageFromAction(action: AIAction): string {
    if (!action || !action.action) return "Listo!";

    switch (action.action) {
        case "add_block":
            if (action.type === "whatsapp") return `Agregué un botón de WhatsApp`;
            if (action.type === "header") return `Agregué el encabezado "${action.title}"`;
            if (action.type === "email") return `Agregué un link de email`;
            if (action.icon) return `Agregué tu link de ${action.icon}`;
            return `Agregué "${action.title || "nuevo bloque"}"`;
        
        case "update_design":
            const changes = [];
            if (action.backgroundColor) changes.push("fondo");
            if (action.buttonColor) changes.push("botones");
            if (action.buttonTextColor) changes.push("texto");
            return `Cambié ${changes.join(" y ")}!`;
        
        case "remove_block":
            return `Eliminé "${action.title}"`;
        
        default:
            return "Listo!";
    }
}
