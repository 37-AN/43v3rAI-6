// services/backend/src/api/metrics.ts
import { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.DATABASE_URL || 'http://localhost:5432',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key'
);

// Initialize Redis client
let redis: Redis | null = null;
try {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
} catch (error) {
  console.warn('Redis not available, running without cache');
}

export async function metricsRoutes(fastify: FastifyInstance) {

  // GET /api/v1/metrics/dashboard - Get all dashboard metrics
  fastify.get('/dashboard', async (request, reply) => {
    try {
      // Try cache first
      if (redis) {
        const cached = await redis.get('metrics:dashboard');
        if (cached) {
          fastify.log.info('Returning cached dashboard metrics');
          return JSON.parse(cached);
        }
      }

      // Mock data for now (until database is connected)
      // TODO: Replace with real Supabase queries
      const dashboard = {
        revenue: {
          value: 4200000,
          currency: 'USD',
          period: '2025-01',
          growth_rate: 12.5,
          previous_value: 3733333,
          chart_data: [
            { month: 'Aug', revenue: 3500000 },
            { month: 'Sep', revenue: 3650000 },
            { month: 'Oct', revenue: 3800000 },
            { month: 'Nov', revenue: 4000000 },
            { month: 'Dec', revenue: 4100000 },
            { month: 'Jan', revenue: 4200000 }
          ]
        },
        customers: {
          value: 12458,
          new_this_month: 1027,
          growth_rate: 8.3,
          retention_rate: 94.2,
          churn_rate: 5.8,
          previous_value: 11501,
          chart_data: [
            { month: 'Aug', customers: 10200 },
            { month: 'Sep', customers: 10800 },
            { month: 'Oct', customers: 11200 },
            { month: 'Nov', customers: 11500 },
            { month: 'Dec', customers: 12000 },
            { month: 'Jan', customers: 12458 }
          ]
        },
        api_calls: {
          value: 1247890,
          change_percent: 15.7,
          average_latency_ms: 142,
          error_rate_percent: 0.3,
          previous_value: 1078234
        },
        uptime: {
          value: 99.8,
          unit: 'percent',
          change_percent: 0.2,
          incidents_count: 1,
          mttr_minutes: 12,
          previous_value: 99.6
        },
        mqls: {
          value: 850,
          channels: {
            organic: 320,
            paid: 280,
            referral: 150,
            email: 100
          },
          change_percent: -1.8,
          conversion_rate: 12.5,
          previous_value: 866
        },
        timestamp: new Date().toISOString()
      };

      // Cache for 5 minutes
      if (redis) {
        await redis.setex('metrics:dashboard', 300, JSON.stringify(dashboard));
      }

      return dashboard;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch metrics' });
    }
  });

  // POST /api/v1/metrics/update - Update a metric (for real-time updates)
  fastify.post('/update', async (request, reply) => {
    const { metric_id, value, metadata } = request.body as any;

    try {
      fastify.log.info(`Updating metric: ${metric_id}`);

      // TODO: Implement real database update
      // For now, just invalidate cache
      if (redis) {
        await redis.del('metrics:dashboard');
      }

      return {
        success: true,
        metric_id,
        message: 'Metric updated successfully (mock)'
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to update metric' });
    }
  });

  // GET /api/v1/metrics/revenue/history - Get revenue history
  fastify.get('/revenue/history', async (request, reply) => {
    const { period = '30d' } = request.query as any;

    try {
      // Mock historical data
      const history = [
        { date: '2024-08-01', value: 3500000, growth_rate: 10.2 },
        { date: '2024-09-01', value: 3650000, growth_rate: 4.3 },
        { date: '2024-10-01', value: 3800000, growth_rate: 4.1 },
        { date: '2024-11-01', value: 4000000, growth_rate: 5.3 },
        { date: '2024-12-01', value: 4100000, growth_rate: 2.5 },
        { date: '2025-01-01', value: 4200000, growth_rate: 2.4 }
      ];

      return { history, period };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch revenue history' });
    }
  });

  // GET /api/v1/metrics/:metric_id - Get specific metric
  fastify.get('/:metric_id', async (request, reply) => {
    const { metric_id } = request.params as any;

    try {
      fastify.log.info(`Fetching metric: ${metric_id}`);

      // Mock response
      return {
        metric_id,
        value: 12458,
        change_percent: 8.3,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch metric' });
    }
  });
}
