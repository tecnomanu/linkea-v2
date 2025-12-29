/**
 * AI System Prompt - Defines what the AI knows about available blocks
 *
 * This file contains the system prompt that instructs the AI about:
 * - Available block types and their properties
 * - How to respond with JSON block definitions
 * - User interaction guidelines
 */

import {
    BLOCK_TYPES,
    getVisibleBlockTypes,
} from "@/Components/Shared/blocks/blockConfig";

/**
 * Generate a description of all available blocks for the AI
 */
function generateBlocksDescription(): string {
    const visibleTypes = getVisibleBlockTypes();

    const blockDescriptions = visibleTypes.map((type) => {
        const config = BLOCK_TYPES[type];
        let desc = `- **${type}**: ${config.description}`;

        // Add specific fields based on type
        switch (type) {
            case "link":
                desc += "\n  Campos: title (texto del boton), url (destino)";
                break;
            case "header":
                desc += "\n  Campos: title (texto del encabezado)";
                break;
            case "whatsapp":
                desc +=
                    "\n  Campos: title (texto del boton), phoneNumber (numero con codigo de pais, ej: +5491123456789), predefinedMessage (mensaje opcional)";
                break;
            case "youtube":
                desc +=
                    "\n  Campos: title (titulo del video), url (URL del video de YouTube)";
                break;
            case "spotify":
                desc +=
                    "\n  Campos: title (titulo de la cancion/album), url (URL de Spotify)";
                break;
            case "calendar":
                desc +=
                    "\n  Campos: title (ej: 'Agendar Cita'), url (URL de Calendly/Cal.com), calendarProvider ('calendly' | 'cal')";
                break;
            case "email":
                desc +=
                    "\n  Campos: title (texto del boton), emailAddress (email destino), emailSubject (asunto opcional), emailBody (cuerpo opcional)";
                break;
            case "map":
                desc +=
                    "\n  Campos: title (ej: 'Nuestra Ubicacion'), mapAddress (direccion completa)";
                break;
            case "vimeo":
                desc +=
                    "\n  Campos: title (titulo del video), url (URL de Vimeo)";
                break;
            case "tiktok":
                desc +=
                    "\n  Campos: title (titulo del video), url (URL de TikTok)";
                break;
            case "soundcloud":
                desc +=
                    "\n  Campos: title (titulo del audio), url (URL de SoundCloud)";
                break;
            case "twitch":
                desc +=
                    "\n  Campos: title (nombre del canal), url (URL o nombre del canal)";
                break;
            case "mastodon":
                desc +=
                    "\n  Campos: title (nombre del perfil), url (URL del perfil de Mastodon)";
                break;
        }

        return desc;
    });

    return blockDescriptions.join("\n\n");
}

/**
 * The system prompt that defines the AI's behavior and knowledge
 * Designed to be action-oriented and multilingual
 */
export function getSystemPrompt(
    currentBlocks: { type: string; title: string }[] = []
): string {
    const currentBlocksSummary =
        currentBlocks.length > 0
            ? currentBlocks.map((b) => `${b.type}: "${b.title}"`).join(", ")
            : "empty";

    return `You are Linkea's assistant. You help users create their "link in bio" page by EXECUTING actions.
Respond in the SAME LANGUAGE the user writes to you.

CURRENT PAGE BLOCKS: ${currentBlocksSummary}

YOUR ONLY OUTPUT FORMAT - Always respond with valid JSON:
{"message":"your response to user","action":"none|add_blocks|update_design|remove_blocks","blocks":[...],"design":{...},"titles":[...]}

BLOCK TYPES:
- link: {type:"link", title:"Title", url:"https://...", icon:{type:"brands",name:"iconname"}}
- header: {type:"header", title:"Section Title"}
- whatsapp: {type:"whatsapp", title:"WhatsApp", phoneNumber:"+123456789"}
- youtube: {type:"youtube", title:"My Video", url:"https://youtube.com/..."}
- spotify: {type:"spotify", title:"My Music", url:"https://open.spotify.com/..."}
- email: {type:"email", title:"Contact", emailAddress:"email@example.com"}

DESIGN OPTIONS:
- backgroundColor: hex color for page background
- buttonColor: hex color for buttons
- buttonTextColor: hex color for button text

ICON NAMES for social links: instagram, facebook, twitter, tiktok, youtube, linkedin, github, discord, twitch, spotify, whatsapp

RULES:
1. If user provides ALL needed info (username, URL, phone, etc) -> EXECUTE immediately with action
2. If info is MISSING -> ask in message, set action:"none"
3. Social media: if user says "@username" or "username", build the URL yourself
4. Keep messages SHORT - you're executing, not explaining

EXAMPLES:

User: "add instagram @john"
{"message":"Added Instagram!","action":"add_blocks","blocks":[{"type":"link","title":"Instagram","url":"https://instagram.com/john","icon":{"type":"brands","name":"instagram"}}]}

User: "add my tiktok"
{"message":"What's your TikTok username?","action":"none"}

User: "mariaperez"
{"message":"Added TikTok!","action":"add_blocks","blocks":[{"type":"link","title":"TikTok","url":"https://tiktok.com/@mariaperez","icon":{"type":"brands","name":"tiktok"}}]}

User: "yellow background"
{"message":"Done!","action":"update_design","design":{"backgroundColor":"#FFEB3B"}}

User: "agregar whatsapp +54 11 5566 7788"
{"message":"Agregado!","action":"add_blocks","blocks":[{"type":"whatsapp","title":"WhatsApp","phoneNumber":"+5411556677788"}]}

User: "adicionar meu twitter @carlos"
{"message":"Adicionado!","action":"add_blocks","blocks":[{"type":"link","title":"Twitter","url":"https://twitter.com/carlos","icon":{"type":"brands","name":"twitter"}}]}

User: "add header My Links"
{"message":"Added!","action":"add_blocks","blocks":[{"type":"header","title":"My Links"}]}

User: "delete Instagram"
{"message":"Deleted!","action":"remove_blocks","titles":["Instagram"]}

User: "dark theme"
{"message":"Done!","action":"update_design","design":{"backgroundColor":"#1a1a1a","buttonColor":"#ffffff","buttonTextColor":"#1a1a1a"}}

Output ONLY valid JSON. No markdown, no explanation, just JSON.`;
}

/**
 * Parse AI response to extract JSON action if present
 */
export interface AIAction {
    action: "add_blocks" | "update_design" | "remove_blocks" | "reorder_blocks";
    blocks?: Array<{
        type: string;
        title: string;
        url?: string;
        icon?: { type: string; name: string };
        phoneNumber?: string;
        predefinedMessage?: string;
        emailAddress?: string;
        emailSubject?: string;
        emailBody?: string;
        mapAddress?: string;
        calendarProvider?: string;
        [key: string]: unknown;
    }>;
    design?: {
        backgroundColor?: string;
        buttonColor?: string;
        buttonTextColor?: string;
        buttonStyle?: string;
        buttonShape?: string;
        fontPair?: string;
    };
    titles?: string[];
    order?: string[];
}

interface ParsedResponse {
    message?: string;
    action?: string;
    blocks?: AIAction["blocks"];
    design?: AIAction["design"];
}

/**
 * Try to extract JSON from various formats the model might produce
 */
function extractJSON(response: string): ParsedResponse | null {
    // Try 1: Direct JSON (no markdown)
    try {
        const trimmed = response.trim();
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
            return JSON.parse(trimmed);
        }
    } catch {}

    // Try 2: JSON in markdown code block
    const jsonBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
        try {
            return JSON.parse(jsonBlockMatch[1].trim());
        } catch {}
    }

    // Try 3: Find JSON object anywhere in text
    const jsonObjectMatch = response.match(
        /\{[\s\S]*?"(?:action|message)"[\s\S]*?\}/
    );
    if (jsonObjectMatch) {
        try {
            return JSON.parse(jsonObjectMatch[0]);
        } catch {}
    }

    return null;
}

/**
 * Fallback: Try to detect intent from natural language
 * Works on both user input and AI responses
 */
export function detectIntentFromText(text: string): AIAction | null {
    const lower = text.toLowerCase();

    // Detect social media links
    const socialPatterns: {
        pattern: RegExp;
        type: string;
        name: string;
        urlPrefix: string;
    }[] = [
        {
            pattern: /@?([a-zA-Z0-9_.]+)\s*(?:en\s*)?instagram/i,
            type: "link",
            name: "Instagram",
            urlPrefix: "https://instagram.com/",
        },
        {
            pattern: /instagram[:\s]*@?([a-zA-Z0-9_.]+)/i,
            type: "link",
            name: "Instagram",
            urlPrefix: "https://instagram.com/",
        },
        {
            pattern: /@?([a-zA-Z0-9_.]+)\s*(?:en\s*)?tiktok/i,
            type: "link",
            name: "TikTok",
            urlPrefix: "https://tiktok.com/@",
        },
        {
            pattern: /tiktok[:\s]*@?([a-zA-Z0-9_.]+)/i,
            type: "link",
            name: "TikTok",
            urlPrefix: "https://tiktok.com/@",
        },
        {
            pattern: /@?([a-zA-Z0-9_.]+)\s*(?:en\s*)?twitter/i,
            type: "link",
            name: "Twitter",
            urlPrefix: "https://twitter.com/",
        },
        {
            pattern: /twitter[:\s]*@?([a-zA-Z0-9_.]+)/i,
            type: "link",
            name: "Twitter",
            urlPrefix: "https://twitter.com/",
        },
        {
            pattern: /@?([a-zA-Z0-9_.]+)\s*(?:en\s*)?facebook/i,
            type: "link",
            name: "Facebook",
            urlPrefix: "https://facebook.com/",
        },
        {
            pattern: /youtube[:\s]*@?([a-zA-Z0-9_.]+)/i,
            type: "link",
            name: "YouTube",
            urlPrefix: "https://youtube.com/@",
        },
    ];

    for (const { pattern, type, name, urlPrefix } of socialPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            return {
                action: "add_blocks",
                blocks: [
                    {
                        type,
                        title: name,
                        url: urlPrefix + match[1].replace("@", ""),
                        icon: { type: "brands", name: name.toLowerCase() },
                    },
                ],
            };
        }
    }

    // Detect WhatsApp with number
    const whatsappMatch =
        text.match(/whatsapp[:\s]*\+?(\d[\d\s-]+)/i) ||
        text.match(/\+?(\d[\d\s-]{8,})[^\d]*whatsapp/i);
    if (whatsappMatch) {
        const phone = whatsappMatch[1].replace(/[\s-]/g, "");
        return {
            action: "add_blocks",
            blocks: [
                {
                    type: "whatsapp",
                    title: "WhatsApp",
                    phoneNumber: phone.startsWith("+") ? phone : `+${phone}`,
                },
            ],
        };
    }

    // Detect color changes
    const colorPatterns: { pattern: RegExp; color: string }[] = [
        { pattern: /fondo\s*(amarill|yellow)/i, color: "#FFEB3B" },
        { pattern: /fondo\s*(roj|red)/i, color: "#F44336" },
        { pattern: /fondo\s*(azul|blue)/i, color: "#2196F3" },
        { pattern: /fondo\s*(verde|green)/i, color: "#4CAF50" },
        { pattern: /fondo\s*(negr|black|oscur|dark)/i, color: "#1a1a1a" },
        { pattern: /fondo\s*(blanc|white|clar)/i, color: "#FFFFFF" },
        { pattern: /fondo\s*(rosa|pink)/i, color: "#E91E63" },
        { pattern: /fondo\s*(morad|purple|violet)/i, color: "#9C27B0" },
        { pattern: /fondo\s*(naranja|orange)/i, color: "#FF9800" },
        { pattern: /#([0-9A-Fa-f]{6})/i, color: "" }, // Custom hex
    ];

    for (const { pattern, color } of colorPatterns) {
        const match = text.match(pattern);
        if (match) {
            return {
                action: "update_design",
                design: {
                    backgroundColor: color || `#${match[1]}`,
                },
            };
        }
    }

    return null;
}

export function parseAIResponse(response: string): {
    text: string;
    action: AIAction | null;
} {
    // Try to extract JSON from the response
    const parsed = extractJSON(response);

    if (parsed) {
        // Successfully parsed JSON
        const text = parsed.message || "";

        if (parsed.action && parsed.action !== "none") {
            const action: AIAction = {
                action: parsed.action as AIAction["action"],
                blocks: parsed.blocks,
                design: parsed.design,
            };
            return { text, action };
        }

        return { text, action: null };
    }

    // Fallback: Try to detect intent from natural language
    const fallbackAction = detectIntentFromText(response);
    if (fallbackAction) {
        return { text: response, action: fallbackAction };
    }

    // No action detected
    return { text: response.trim(), action: null };
}
