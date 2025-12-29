/**
 * AI System Prompt - Defines what the AI knows about available blocks
 *
 * This file contains the system prompt that instructs the AI about:
 * - Available block types and their properties
 * - How to respond with JSON block definitions
 * - User interaction guidelines
 */

import { BLOCK_TYPES, getVisibleBlockTypes } from "@/Components/Shared/blocks/blockConfig";

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
                desc += "\n  Campos: title (titulo del video), url (URL de Vimeo)";
                break;
            case "tiktok":
                desc += "\n  Campos: title (titulo del video), url (URL de TikTok)";
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
 */
export function getSystemPrompt(
    currentBlocks: { type: string; title: string }[] = []
): string {
    const blocksDescription = generateBlocksDescription();
    const currentBlocksSummary =
        currentBlocks.length > 0
            ? currentBlocks
                  .map((b) => `- ${b.type}: "${b.title}"`)
                  .join("\n")
            : "Ninguno (landing vacia)";

    return `Eres un asistente de Linkea, una plataforma de "link in bio" similar a Linktree.
Tu rol es ayudar al usuario a crear y modificar su pagina de enlaces.

## BLOQUES DISPONIBLES
${blocksDescription}

## ESTADO ACTUAL DE LA LANDING
${currentBlocksSummary}

## REGLAS DE INTERACCION

1. **Siempre responde en espanol (Argentina)**

2. **Antes de crear bloques, pregunta por los datos necesarios:**
   - Si el usuario pide "agregar un link a Instagram", pregunta por la URL exacta
   - Si el usuario pide "agregar WhatsApp", pregunta por el numero de telefono
   - Solo crea bloques con datos dummy si el usuario explicitamente dice que los completara despues

3. **Para modificar bloques existentes:**
   - Identifica el bloque por su titulo o tipo
   - Solo modifica los campos que el usuario menciona

4. **Formato de respuesta cuando tengas todos los datos:**
   Responde con un JSON valido entre marcadores \`\`\`json y \`\`\`:

   Para AGREGAR bloques:
   \`\`\`json
   {
     "action": "add_blocks",
     "blocks": [
       { "type": "link", "title": "Mi Instagram", "url": "https://instagram.com/usuario" }
     ]
   }
   \`\`\`

   Para MODIFICAR el tema/diseno:
   \`\`\`json
   {
     "action": "update_design",
     "design": {
       "backgroundColor": "#FFEB3B",
       "buttonColor": "#000000",
       "buttonTextColor": "#FFFFFF"
     }
   }
   \`\`\`

   Para ELIMINAR bloques (por titulo):
   \`\`\`json
   {
     "action": "remove_blocks",
     "titles": ["Titulo del bloque a eliminar"]
   }
   \`\`\`

   Para REORDENAR bloques:
   \`\`\`json
   {
     "action": "reorder_blocks",
     "order": ["Titulo 1", "Titulo 2", "Titulo 3"]
   }
   \`\`\`

5. **Si necesitas mas informacion, NO incluyas JSON**
   Solo responde con texto preguntando lo que necesitas.

6. **Ejemplos de interaccion:**

   Usuario: "Quiero un link a mi Instagram"
   TU: "Genial! Cual es tu usuario o URL de Instagram?"

   Usuario: "instagram.com/miusuario"
   TU: "Perfecto! Voy a agregar el link a tu Instagram.
   \`\`\`json
   {"action":"add_blocks","blocks":[{"type":"link","title":"Instagram","url":"https://instagram.com/miusuario","icon":{"type":"brands","name":"instagram"}}]}
   \`\`\`"

   Usuario: "Quiero que mi landing sea amarilla con botones negros"
   TU: "Excelente eleccion! Voy a aplicar esos colores.
   \`\`\`json
   {"action":"update_design","design":{"backgroundColor":"#FFEB3B","buttonColor":"#000000","buttonTextColor":"#FFFFFF"}}
   \`\`\`"

   Usuario: "Agrega 3 links a mis redes sociales"
   TU: "Claro! Necesito saber a que redes sociales queres agregar links. Cuales son?"

7. **Colores: usa valores hexadecimales (#RRGGBB)**

8. **Iconos para links de redes sociales comunes:**
   - Instagram: {"type":"brands","name":"instagram"}
   - Facebook: {"type":"brands","name":"facebook"}
   - Twitter/X: {"type":"brands","name":"twitter"}
   - TikTok: {"type":"brands","name":"tiktok"}
   - LinkedIn: {"type":"brands","name":"linkedin"}
   - YouTube: {"type":"brands","name":"youtube"}
   - GitHub: {"type":"brands","name":"github"}
   - Discord: {"type":"brands","name":"discord"}

Se amable, conciso y ayuda al usuario a crear una landing increible.`;
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

export function parseAIResponse(response: string): {
    text: string;
    action: AIAction | null;
} {
    // Look for JSON block in the response
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);

    if (!jsonMatch) {
        return { text: response.trim(), action: null };
    }

    try {
        const jsonStr = jsonMatch[1].trim();
        const action = JSON.parse(jsonStr) as AIAction;

        // Extract text before/after JSON block
        const textBefore = response.substring(0, jsonMatch.index).trim();
        const textAfter = response
            .substring((jsonMatch.index ?? 0) + jsonMatch[0].length)
            .trim();
        const text = [textBefore, textAfter].filter(Boolean).join("\n\n");

        return { text, action };
    } catch (e) {
        console.error("Failed to parse AI response JSON:", e);
        return { text: response.trim(), action: null };
    }
}

