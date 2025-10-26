// services/backend/src/api/data-sources.ts
import { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:5432',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key'
);

export async function dataSourcesRoutes(fastify: FastifyInstance) {

  // GET /api/v1/data-sources - List all data sources
  fastify.get('/', async (request, reply) => {
    const organization_id = (request as any).user?.organization_id;

    try {
      // Mock data sources
      const dataSources = [
        {
          id: '880e8400-e29b-41d4-a716-446655440000',
          name: 'Production Database',
          type: 'database',
          connector_type: 'postgresql',
          status: 'connected',
          last_sync_at: new Date(Date.now() - 3600000).toISOString(),
          records_count: 15420,
          created_at: new Date(Date.now() - 86400000 * 30).toISOString()
        },
        {
          id: '880e8400-e29b-41d4-a716-446655440001',
          name: 'Sales CRM (HubSpot)',
          type: 'saas',
          connector_type: 'hubspot',
          status: 'connected',
          last_sync_at: new Date(Date.now() - 1800000).toISOString(),
          records_count: 3240,
          created_at: new Date(Date.now() - 86400000 * 60).toISOString()
        },
        {
          id: '880e8400-e29b-41d4-a716-446655440002',
          name: 'Marketing Analytics',
          type: 'saas',
          connector_type: 'google_analytics',
          status: 'connected',
          last_sync_at: new Date(Date.now() - 900000).toISOString(),
          records_count: 8920,
          created_at: new Date(Date.now() - 86400000 * 45).toISOString()
        },
        {
          id: '880e8400-e29b-41d4-a716-446655440003',
          name: 'Internal Metrics Tracker',
          type: 'database',
          connector_type: 'internal',
          status: 'connected',
          last_sync_at: new Date(Date.now() - 300000).toISOString(),
          records_count: 45,
          created_at: new Date(Date.now() - 86400000 * 7).toISOString()
        }
      ];

      return { data_sources: dataSources };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch data sources' });
    }
  });

  // POST /api/v1/data-sources - Create new data source
  fastify.post('/', async (request, reply) => {
    const { name, type, connector_type, config } = request.body as any;
    const organization_id = (request as any).user?.organization_id;
    const user_id = (request as any).user?.id;

    try {
      fastify.log.info(`Creating data source: ${name} (${connector_type})`);

      // Mock creation
      const newDataSource = {
        id: `ds_${Date.now()}`,
        name,
        type,
        connector_type,
        config: config || {},
        status: 'disconnected',
        organization_id,
        created_by: user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return { data_source: newDataSource };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create data source' });
    }
  });

  // GET /api/v1/data-sources/:id - Get specific data source
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as any;

    try {
      // Mock data source detail
      const dataSource = {
        id,
        name: 'Production Database',
        type: 'database',
        connector_type: 'postgresql',
        status: 'connected',
        config: {
          host: 'localhost',
          port: 5432,
          database: 'production'
        },
        last_sync_at: new Date(Date.now() - 3600000).toISOString(),
        last_error: null,
        sync_frequency: 'hourly',
        created_at: new Date(Date.now() - 86400000 * 30).toISOString()
      };

      return { data_source: dataSource };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch data source' });
    }
  });

  // PUT /api/v1/data-sources/:id - Update data source
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const updates = request.body as any;

    try {
      fastify.log.info(`Updating data source: ${id}`);

      // Mock update
      return {
        success: true,
        data_source: { id, ...updates, updated_at: new Date().toISOString() }
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to update data source' });
    }
  });

  // DELETE /api/v1/data-sources/:id - Delete data source
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as any;

    try {
      fastify.log.info(`Deleting data source: ${id}`);

      // Mock deletion
      return { success: true, message: 'Data source deleted' };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete data source' });
    }
  });

  // POST /api/v1/data-sources/:id/sync - Trigger manual sync
  fastify.post('/:id/sync', async (request, reply) => {
    const { id } = request.params as any;

    try {
      fastify.log.info(`Triggering sync for data source: ${id}`);

      // Mock sync job creation
      const syncJob = {
        id: `job_${Date.now()}`,
        source_id: id,
        status: 'pending',
        started_at: new Date().toISOString(),
        estimated_completion: new Date(Date.now() + 300000).toISOString()
      };

      return { job: syncJob };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to trigger sync' });
    }
  });

  // GET /api/v1/data-sources/:id/status - Get sync status
  fastify.get('/:id/status', async (request, reply) => {
    const { id } = request.params as any;

    try {
      // Mock sync history
      const syncHistory = [
        {
          id: 'job_001',
          source_id: id,
          status: 'completed',
          records_processed: 15420,
          records_failed: 0,
          started_at: new Date(Date.now() - 7200000).toISOString(),
          completed_at: new Date(Date.now() - 6900000).toISOString()
        },
        {
          id: 'job_002',
          source_id: id,
          status: 'completed',
          records_processed: 3240,
          records_failed: 12,
          started_at: new Date(Date.now() - 3600000).toISOString(),
          completed_at: new Date(Date.now() - 3300000).toISOString()
        }
      ];

      return { sync_history: syncHistory };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch sync status' });
    }
  });

  // POST /api/v1/data-sources/:id/test - Test connection
  fastify.post('/:id/test', async (request, reply) => {
    const { id } = request.params as any;

    try {
      fastify.log.info(`Testing connection for data source: ${id}`);

      // Mock connection test
      return {
        success: true,
        status: 'connected',
        message: 'Connection successful',
        latency_ms: 45
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Connection test failed' });
    }
  });
}
