
import { GoogleGenAI, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chat: Chat | null = null;

function initializeChat(dashboardData: object): Chat {
    // In a real app, you'd manage chat history more robustly.
    // Here we re-initialize with system instructions if the chat doesn't exist.
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are an expert business analyst for 'Forever (43v3r) Technology'. Your task is to analyze the following KPIs from our 'Data Convergence AI' platform and answer user questions. The data is a snapshot from our unified dashboard, converging data from CRM, finance, and marketing tools.

Data Snapshot:
${JSON.stringify(dashboardData, null, 2)}

When the user asks for an initial analysis, a summary, or something similar, provide:
1. A brief, high-level summary of the current business performance.
2. One key positive trend to highlight and capitalize on.
3. One area of concern with a specific, actionable recommendation for improvement.

For all other follow-up questions, provide concise and data-driven answers based on the provided data snapshot. Format your response as clear, easy-to-read text. Do not use markdown formatting. Be conversational and helpful.`
            },
        });
    }
    return chat;
}

export async function sendChatMessage(dashboardData: object, message: string): Promise<string> {
    try {
        const chatSession = initializeChat(dashboardData);
        const response = await chatSession.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Invalidate chat session on error so it can be re-initialized.
        chat = null;
        throw new Error("Failed to get a response from the AI. The connection may have been reset. Please try again.");
    }
}
