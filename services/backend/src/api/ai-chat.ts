// services/backend/src/api/ai-chat.ts
import { FastifyInstance } from 'fastify';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Initialize Supabase client (optional for now)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:5432',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key'
);

export async function aiChatRoutes(fastify: FastifyInstance) {

  // POST /api/v1/ai/chat - Send message and get response
  fastify.post('/chat', async (request, reply) => {
    const { message, conversation_id, context } = request.body as any;
    const user_id = (request as any).user?.id; // From auth middleware

    try {
      fastify.log.info(`AI chat request: ${message.substring(0, 50)}...`);

      // Build context-aware prompt with dashboard data
      const contextData = context || {
        revenue: { value: 4200000, growth_rate: 12.5 },
        customers: { value: 12458, growth_rate: 8.3 },
        mqls: { value: 850, change_percent: -1.8 },
        uptime: { value: 99.8 }
      };

      const contextPrompt = `You are an AI assistant for the 43v3rAI platform. You have access to the following company data:

**Current Metrics:**
- Revenue: $${(contextData.revenue.value / 1000000).toFixed(1)}M (${contextData.revenue.growth_rate > 0 ? '+' : ''}${contextData.revenue.growth_rate}%)
- Customers: ${contextData.customers.value.toLocaleString()} (${contextData.customers.growth_rate > 0 ? '+' : ''}${contextData.customers.growth_rate}%)
- Marketing Qualified Leads: ${contextData.mqls.value} (${contextData.mqls.change_percent}%)
- System Uptime: ${contextData.uptime.value}%

User question: ${message}

Provide a helpful, accurate response based on the available data. If the data doesn't contain enough information, say so and suggest what additional information might be needed. Keep responses concise and actionable.`;

      // Call Gemini API
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        systemInstruction: "You are a helpful business intelligence assistant for the 43v3rAI platform."
      });

      const result = await model.generateContent(contextPrompt);
      const response = result.response.text();

      fastify.log.info('AI response generated successfully');

      // TODO: Save conversation to database when Supabase is connected

      return {
        response,
        conversation_id: conversation_id || `conv_${Date.now()}`,
        metadata: {
          model: 'gemini-2.0-flash-exp',
          tokens: result.response.usageMetadata?.totalTokenCount || 0,
          context_sources: Object.keys(contextData).length
        }
      };

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'AI chat failed' });
    }
  });

  // GET /api/v1/ai/conversations - List user's conversations
  fastify.get('/conversations', async (request, reply) => {
    const user_id = (request as any).user?.id;

    try {
      // Mock conversations data
      const conversations = [
        {
          id: 'conv_001',
          messages: [
            {
              user: 'What is our current revenue?',
              assistant: 'Based on the latest data, your current monthly recurring revenue (MRR) is $4.2M, representing a 12.5% growth rate.',
              timestamp: new Date(Date.now() - 3600000).toISOString()
            }
          ],
          last_updated: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      return { conversations };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch conversations' });
    }
  });

  // POST /api/v1/ai/analyze - Analyze dashboard data and provide insights
  fastify.post('/analyze', async (request, reply) => {
    const { dashboardData } = request.body as any;

    try {
      const prompt = `Analyze the following business metrics and provide:
1. Overall performance summary
2. Top 3 positive trends
3. Top 2 areas of concern with recommendations

Metrics:
${JSON.stringify(dashboardData, null, 2)}

Provide a concise analysis (max 200 words).`;

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp"
      });

      const result = await model.generateContent(prompt);
      const analysis = result.response.text();

      return {
        analysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Analysis failed' });
    }
  });

  // DELETE /api/v1/ai/conversations/:conversation_id - Delete a conversation
  fastify.delete('/conversations/:conversation_id', async (request, reply) => {
    const { conversation_id } = request.params as any;

    try {
      fastify.log.info(`Deleting conversation: ${conversation_id}`);

      // TODO: Implement real deletion when database is connected

      return { success: true, message: 'Conversation deleted' };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete conversation' });
    }
  });
}
