/**
 * AI System Prompt for JSON-based Actions
 *
 * Since Qwen 2.5 doesn't support native function calling,
 * we ask the model to respond with structured JSON that we parse.
 */

export interface AIAction {
    action: "add_block" | "update_design" | "remove_block" | "message";
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
    // For message (when AI needs to ask/respond)
    text?: string;
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
Respond in the user's language.

Current blocks: ${currentBlocksSummary}

RESPOND ONLY WITH JSON. No other text. Use this format:

For adding a block:
{"action":"add_block","type":"link","title":"Mi Instagram","url":"https://instagram.com/user","icon":"instagram"}

Block types: link, header, whatsapp, youtube, spotify, email
Icons: instagram, tiktok, twitter, youtube, facebook, linkedin, github, discord, twitch, spotify

For WhatsApp (needs phone with country code):
{"action":"add_block","type":"whatsapp","title":"WhatsApp","phoneNumber":"+5491155667788"}

For header:
{"action":"add_block","type":"header","title":"Mis Redes"}

For changing colors:
{"action":"update_design","backgroundColor":"#FFEB3B","buttonColor":"#1a1a1a"}

For removing:
{"action":"remove_block","title":"Mi Instagram"}

To ask or respond (when info is missing):
{"action":"message","text":"What's your Instagram username?"}

RULES:
1. If user gives @username, build full URL: instagram.com/username, tiktok.com/@username, etc.
2. If info is MISSING, use action "message" to ask.
3. Colors: yellow=#FFEB3B, red=#F44336, blue=#2196F3, green=#4CAF50, dark=#1a1a1a, pink=#E91E63
4. ONLY output JSON. Never explain.`;
}

/**
 * Parse the AI response to extract JSON action
 */
export function parseAIResponse(response: string): AIAction | null {
    try {
        // Try to find JSON in the response
        const jsonMatch = response.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.action) {
                return parsed as AIAction;
            }
        }
    } catch (e) {
        console.warn("Failed to parse AI response as JSON:", e);
    }

    // If no valid JSON found, treat as message
    return {
        action: "message",
        text: response.trim(),
    };
}
