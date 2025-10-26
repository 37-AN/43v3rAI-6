import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { exit } from 'process';
import { mkdir } from 'fs/promises';
import ingestRoutes from './ingestController.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Import new API routes
import { metricsRoutes } from './api/metrics.js';
import { aiChatRoutes } from './api/ai-chat.js';
import { dataSourcesRoutes } from './api/data-sources.js';
import { authMiddleware, authRoutes } from './auth/index.js';

// Get directory paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env.local file
dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });

const server = Fastify({ logger: true });

// Check for API Key
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
  server.log.error('GEMINI_API_KEY or API_KEY is not set. Please add it to your .env.local file.');
  exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// In-memory chat session for legacy endpoint
let chat: any = null;

// Register CORS
await server.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
});

// Register authentication middleware
await authMiddleware(server);

// ============================================================================
// HEALTH CHECK
// ============================================================================

server.get('/api/health', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: Date.now(),
    version: '2.0.0',
    services: {
      database: 'mock',
      redis: 'mock',
      ai: 'gemini-2.0-flash-exp'
    }
  };
});

// ============================================================================
// API V1 ROUTES
// ============================================================================

// Auth routes
await server.register(authRoutes, { prefix: '/api/v1/auth' });

// Metrics routes
await server.register(metricsRoutes, { prefix: '/api/v1/metrics' });

// AI Chat routes
await server.register(aiChatRoutes, { prefix: '/api/v1/ai' });

// Data Sources routes
await server.register(dataSourcesRoutes, { prefix: '/api/v1/data-sources' });

// ============================================================================
// LEGACY ROUTES (Keep for backwards compatibility)
// ============================================================================

// Legacy ingest endpoint
server.post('/api/ingest', async (request, reply) => {
  return {
    status: 'received',
    message: 'This is a generic ingest endpoint. Use specific routes like /api/ingest/csv for functionality.'
  };
});

// Legacy Question/Answering endpoint
server.post('/api/qa', async (request, reply) => {
  const { dashboardData, message } = request.body as { dashboardData: object, message: string };

  if (!dashboardData || !message) {
    reply.status(400).send({ message: 'Missing dashboardData or message in request body' });
    return;
  }

  try {
    // Use the same logic as the new AI chat endpoint for consistency
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: `You are an expert business analyst for 'Forever (43v3r) Technology'. Your task is to analyze the following KPIs from our 'Data Convergence AI' platform and answer user questions. The data is a snapshot from our unified dashboard.

Data Snapshot:
${JSON.stringify(dashboardData, null, 2)}

When the user asks for an initial analysis, a summary, or something similar, provide:
1. A brief, high-level summary of the current business performance.
2. One key positive trend to highlight and capitalize on.
3. One area of concern with a specific, actionable recommendation for improvement.

For all other follow-up questions, provide concise and data-driven answers based on the provided data snapshot. Format your response as clear, easy-to-read text. Do not use markdown formatting. Be conversational and helpful.`
    });

    chat = model.startChat();
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return { text: response.text() };

  } catch (error) {
    server.log.error(error, 'Error calling Gemini API');
    reply.status(500).send({ message: 'Failed to get a response from the AI.' });
  }
});

// ============================================================================
// START SERVER
// ============================================================================

const start = async () => {
  try {
    // Ensure data directory exists
    const DATA_DIR = './data';
    await mkdir(DATA_DIR, { recursive: true });
    server.log.info(`Data directory '${DATA_DIR}' is ready.`);

    // Register legacy ingestion routes
    await server.register(ingestRoutes);

    const port = Number(process.env.PORT || process.env.BACKEND_PORT) || 4000;
    await server.listen({ port, host: '0.0.0.0' });

    server.log.info(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 43v3rAI Backend Server v2.0.0                           ║
║                                                               ║
║   Server running at: http://localhost:${port}                     ║
║                                                               ║
║   API Endpoints:                                              ║
║   ├── Health:          GET  /api/health                       ║
║   ├── Auth:            POST /api/v1/auth/login                ║
║   ├── Metrics:         GET  /api/v1/metrics/dashboard         ║
║   ├── AI Chat:         POST /api/v1/ai/chat                   ║
║   ├── Data Sources:    GET  /api/v1/data-sources              ║
║   └── Legacy QA:       POST /api/qa                           ║
║                                                               ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);
  } catch (err) {
    server.log.error(err);
    exit(1);
  }
};

start();
