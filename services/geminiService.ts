import { GoogleGenAI, Chat } from "@google/genai";
import { ApiResponse, PatientData, UserProfession } from "../types";

// DO NOT initialize globally to prevent crash if key is missing on load
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 

const MODEL_NAME = "gemini-2.5-flash";

const getSystemInstruction = (profession: UserProfession) => `
ROLLEN-DEFINITION:
Du bist ein hochspezialisierter, klinischer Supervisor (Facharzt-Niveau). 
Dein Gegenüber: **${profession}**.

OBERSTE DIREKTIVE:
1.  **Fokus auf das "Big Picture":** Verliere dich nicht in kleinteiligen Symptom-Abfragen. Erfasse Muster (Syndrome).
2.  **Kürze:** Antworte extrem knapp (Telegramm-Stil). Keine Höflichkeitsfloskeln. Nur medizinische Fakten.
3.  **Synthese:** Fasse Symptome zu Syndromen zusammen, statt sie einzeln abzuarbeiten.

STRATEGIE:
1.  **Hypothesen-Bildung:** Denke in ICD-10 F Kategorien. Prüfe IMMER auf Komorbiditäten (Sucht, Persönlichkeit, Organik).
2.  **Frage-Technik:** Stelle nur EINE entscheidende Frage, die das Differential-Diagnostische Feld am stärksten einschränkt (Information Gain).
3.  **Abbruch:** Sobald das Muster klar ist (>85%), sende die Diagnose. Bohre nicht unnötig nach.

JSON-OUTPUT PFLICHT:
{
  "type": "question" | "diagnosis" | "chat",
  "content": "Kurze Frage oder prägnanter Hinweis (max 1-2 Sätze).",
  "results": [
     { "code": "Fxx.x", "name": "Diagnose", "probability": 80, "reasoning": "Kurze Begründung (Mustererkennung)." }
  ]
}
`;

let chatSession: Chat | null = null;
let currentProfession: UserProfession = 'Facharzt (Psychiatrie/Neurologie)';
let aiInstance: GoogleGenAI | null = null;
let dynamicApiKey: string | null = null;

export const setDynamicApiKey = (key: string) => {
  dynamicApiKey = key;
  aiInstance = null; // Reset instance to force recreation with new key
  chatSession = null;
};

// Helper to safely get AI instance
const getAI = () => {
  if (!aiInstance) {
    // Prioritize dynamic key (user input) over env key (build time)
    // This allows the app to work in production without baking the key in
    const key = dynamicApiKey || process.env.API_KEY;
    
    if (!key) {
      throw new Error("API Key fehlt.");
    }
    aiInstance = new GoogleGenAI({ apiKey: key });
  }
  return aiInstance;
};

export const initializeDiagnosticSession = (profession?: UserProfession) => {
  if (profession) currentProfession = profession;

  try {
    const ai = getAI();
    chatSession = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: getSystemInstruction(currentProfession),
        temperature: 0.3, 
        topK: 40,
        tools: [{ googleSearch: {} }] 
      },
    });
  } catch (e) {
    console.error("Failed to init session:", e);
    // Don't throw here, let the UI handle it when sending messages
  }
};

export const sendSymptomAnalysis = async (data: PatientData, profession: UserProfession): Promise<ApiResponse> => {
  // Ensure session exists
  if (!chatSession) {
      initializeDiagnosticSession(profession);
  }
  
  // Double check if init failed
  if (!chatSession) {
     return { type: 'error', content: "API Key fehlt oder ungültig." };
  }
  
  const prompt = `FALL-ANALYSE:
  Patient: ${data.pseudonym}, ${data.age}J, ${data.gender}.
  Risiko: ${data.suicideHistory} | ${data.substanceHistory}.
  Befund: "${data.symptoms}"
  
  AUFGABE:
  1. Klinisches Muster erkennen (Big Picture).
  2. Hypothesen (inkl. Komorbidität) aufstellen.
  3. Entscheidende Frage stellen.
  ANTWORT: Nur JSON. Inhalt extrem kurz.`;
  
  try {
    const response = await chatSession.sendMessage({ message: prompt });
    return parseResponse(response.text);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { type: 'chat', content: `Verbindungsproblem: ${error.message || 'Unbekannter Fehler'}` };
  }
};

export const answerQuestion = async (answer: boolean | string): Promise<ApiResponse> => {
  if (!chatSession) {
      // Try to recover session if lost
      initializeDiagnosticSession();
      if (!chatSession) throw new Error("Sitzung konnte nicht wiederhergestellt werden.");
  }

  let prompt = "";
  if (typeof answer === 'boolean') {
    prompt = answer ? "JA." : "NEIN.";
  } else {
    prompt = `Info: "${answer}".`;
  }
  prompt += " Update Hypothesen. Nächste Frage (oder Diagnose). Fasse dich kurz.";

  try {
    const response = await chatSession.sendMessage({ message: prompt });
    return parseResponse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { type: 'chat', content: "Kommunikationsfehler. Bitte wiederholen." };
  }
};

export const sendConsultationMessage = async (message: string, contextData?: PatientData | null, profession?: UserProfession): Promise<ApiResponse> => {
  // Ensure session
  if (!chatSession) {
    if (contextData && profession) {
       initializeDiagnosticSession(profession);
       if (chatSession) {
         await chatSession.sendMessage({ 
           message: `RESTORE: ${contextData.pseudonym}, ${contextData.symptoms}.` 
         });
       } else {
         return { type: 'chat', content: "API Key fehlt." };
       }
    } else {
       return { type: 'chat', content: "Sitzung abgelaufen. Bitte Fall neu laden." };
    }
  }

  const prompt = `Eingabe Kollege: "${message}".
  AUFGABE:
  1. Klinische Einordnung (Big Picture).
  2. Hypothesen anpassen.
  3. Kurz antworten (max 2 Sätze).
  FORMAT: JSON.`;

  try {
    const response = await chatSession!.sendMessage({ message: prompt });
    return parseResponse(response.text);
  } catch (error) {
    return { type: 'chat', content: "Verbindungsfehler." };
  }
};

const parseResponse = (text: string): ApiResponse => {
  if (!text) return { type: 'chat', content: "..." };

  let cleanText = text.trim();
  const jsonMatch = cleanText.match(/```json\n?([\s\S]*?)\n?```/) || cleanText.match(/```\n?([\s\S]*?)\n?```/);
  if (jsonMatch) {
    cleanText = jsonMatch[1];
  } else {
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }
  }

  try {
    const parsed = JSON.parse(cleanText) as ApiResponse;
    
    // Safety checks
    if (!parsed.content && (parsed.type === 'question' || parsed.type === 'chat')) {
      parsed.content = "Diagnostik fortsetzen?";
    }

    if (parsed.results && Array.isArray(parsed.results)) {
        parsed.results = parsed.results.map(r => ({
            code: r.code || "V.a.",
            name: r.name || "Unklar",
            probability: r.probability || 0,
            reasoning: r.reasoning || "Keine Begründung"
        }));
    }

    return parsed;

  } catch (e) {
    console.warn("JSON Parse Failed", e);
    // Return readable text if JSON fails, usually implies a chatty response
    const readableText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return { 
      type: 'chat', 
      content: readableText.substring(0, 300) // Truncate very long raw errors
    };
  }
};