import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Chat } from '@google/genai';
// Fix: Import `exit` from `process` to resolve TypeScript error "Property 'exit' does not exist on type 'Process'".
import { exit } from 'process';
import { mkdir } from 'fs/promises';
import ingestRoutes from './ingestController.js';

// Load environment variables from .env file
dotenv.config();

const server = Fastify({ logger: true });

// Check for API Key
const apiKey = process.env.API_KEY;
if (!apiKey) {
  server.log.error('API_KEY is not set. Please add it to your .env file.');
  // Fix: Replaced `process.exit` with imported `exit` to correct TypeScript type error.
  exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// In-memory chat session for simplicity. 
// In a real app, you'd manage sessions per user.
let chat: Chat | null = null;

// Register CORS
await server.register(cors, { 
  origin: '*', // Allow all origins for development. Restrict in production.
});

// Health check endpoint
server.get('/api/health', async (request, reply) => {
  return { status: 'ok', timestamp: Date.now() };
});

// Placeholder ingest endpoint - The main route is now in ingestController
server.post('/api/ingest', async (request, reply) => {
    return { status: 'received', message: 'This is a generic ingest endpoint. Use specific routes like /api/ingest/csv for functionality.'};
});

// Question/Answering endpoint
server.post('/api/qa', async (request, reply) => {
  const { dashboardData, message } = request.body as { dashboardData: object, message: string };

  if (!dashboardData || !message) {
    reply.status(400).send({ message: 'Missing dashboardData or message in request body' });
    return;
  }
  
  try {
    // Re-initialize chat for each request to include the latest data, or manage sessions.
    // This stateless approach is simpler for this example.
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are an expert business analyst for 'Forever (43v3r) Technology'. Your task is to analyze the following KPIs from our 'Data Convergence AI' platform and answer user questions. The data is a snapshot from our unified dashboard.

Data Snapshot:
${JSON.stringify(dashboardData, null, 2)}

When the user asks for an initial analysis, a summary, or something similar, provide:
1. A brief, high-level summary of the current business performance.
2. One key positive trend to highlight and capitalize on.
3. One area of concern with a specific, actionable recommendation for improvement.

For all other follow-up questions, provide concise and data-driven answers based on the provided data snapshot. Format your response as clear, easy-to-read text. Do not use markdown formatting. Be conversational and helpful.`
        },
    });

    const response = await chat.sendMessage({ message });
    return { text: response.text };

  } catch (error) {
    server.log.error(error, 'Error calling Gemini API');
    reply.status(500).send({ message: 'Failed to get a response from the AI.' });
  }
});

// Start the server
const start = async () => {
  try {
    // Ensure data directory exists
    const DATA_DIR = './data';
    await mkdir(DATA_DIR, { recursive: true });
    server.log.info(`Data directory '${DATA_DIR}' is ready.`);

    // Register ingestion routes
    await server.register(ingestRoutes);

    const port = Number(process.env.BACKEND_PORT) || 8000;
    await server.listen({ port, host: '0.0.0.0' });
    server.log.info(`Backend server listening on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    // Fix: Replaced `process.exit` with imported `exit` to correct TypeScript type error.
    exit(1);
  }
};

start();