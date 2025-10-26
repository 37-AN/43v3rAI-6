// services/backend/src/api/webhooks.ts
import { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:5432',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key'
);

export async function webhookRoutes(fastify: FastifyInstance) {

  // POST /api/v1/webhooks/:source_id - Receive webhook data
  fastify.post('/:source_id', async (request, reply) => {
    const { source_id } = request.params as any;
    const signature = request.headers['x-webhook-signature'] as string;
    const payload = request.body;

    try {
      fastify.log.info(`Received webhook for source: ${source_id}`);

      // Mock source data
      const source = {
        id: source_id,
        connector_type: 'webhook',
        config: {
          webhook_secret: process.env.WEBHOOK_SECRET
        }
      };

      // Verify webhook signature if configured
      if (source.config.webhook_secret && signature) {
        const expectedSignature = crypto
          .createHmac('sha256', source.config.webhook_secret)
          .update(JSON.stringify(payload))
          .digest('hex');

        if (signature !== expectedSignature) {
          fastify.log.warn('Invalid webhook signature');
          return reply.status(401).send({ error: 'Invalid signature' });
        }
      }

      // Process webhook data based on type
      const records = processWebhookPayload(payload);

      fastify.log.info(`Processed ${records.length} records from webhook`);

      // TODO: Insert records into database when connected

      return {
        success: true,
        records_processed: records.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Webhook processing failed' });
    }
  });

  // GET /api/v1/webhooks/:source_id/url - Get webhook URL for a source
  fastify.get('/:source_id/url', async (request, reply) => {
    const { source_id } = request.params as any;

    try {
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
      const webhookUrl = `${backendUrl}/api/v1/webhooks/${source_id}`;

      return {
        webhook_url: webhookUrl,
        source_id,
        instructions: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': 'HMAC-SHA256 signature (optional)'
          },
          example_payload: {
            event: 'record.created',
            data: {
              id: '123',
              field1: 'value1',
              field2: 'value2'
            },
            timestamp: new Date().toISOString()
          }
        }
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to generate webhook URL' });
    }
  });

  // POST /api/v1/webhooks/:source_id/test - Test webhook endpoint
  fastify.post('/:source_id/test', async (request, reply) => {
    const { source_id } = request.params as any;

    try {
      const testPayload = {
        event: 'test.ping',
        data: {
          message: 'This is a test webhook',
          source_id
        },
        timestamp: new Date().toISOString()
      };

      fastify.log.info(`Test webhook sent for source: ${source_id}`);

      return {
        success: true,
        message: 'Test webhook processed successfully',
        payload: testPayload
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Test webhook failed' });
    }
  });
}

// Helper function to process webhook payloads
function processWebhookPayload(payload: any): any[] {
  // Detect webhook type and process accordingly
  if (payload.type === 'stripe' || payload.object === 'event') {
    return processStripeWebhook(payload);
  } else if (payload.domain === 'shopify' || payload.topic) {
    return processShopifyWebhook(payload);
  } else {
    return processGenericWebhook(payload);
  }
}

function processStripeWebhook(payload: any): any[] {
  // Example: Process Stripe webhook events
  try {
    const eventType = payload.type;
    const eventData = payload.data?.object || {};

    return [{
      type: 'payment',
      event: eventType,
      id: eventData.id || payload.id,
      data: {
        amount: eventData.amount ? eventData.amount / 100 : 0,
        currency: eventData.currency || 'usd',
        customer: eventData.customer,
        status: eventData.status,
        created: eventData.created ? new Date(eventData.created * 1000).toISOString() : new Date().toISOString()
      },
      metadata: {
        source: 'stripe',
        event_type: eventType
      }
    }];
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return [];
  }
}

function processShopifyWebhook(payload: any): any[] {
  // Example: Process Shopify webhook events
  try {
    const topic = payload.topic || 'unknown';

    return [{
      type: 'order',
      event: topic,
      id: payload.id || crypto.randomUUID(),
      data: {
        total: payload.total_price || 0,
        customer_email: payload.email,
        items_count: payload.line_items?.length || 0,
        created_at: payload.created_at || new Date().toISOString()
      },
      metadata: {
        source: 'shopify',
        topic
      }
    }];
  } catch (error) {
    console.error('Error processing Shopify webhook:', error);
    return [];
  }
}

function processGenericWebhook(payload: any): any[] {
  // Generic processing for custom webhooks
  return [{
    type: 'webhook_event',
    event: payload.event || 'generic',
    id: payload.id || crypto.randomUUID(),
    data: payload.data || payload,
    metadata: {
      source: 'custom',
      received_at: new Date().toISOString()
    }
  }];
}
