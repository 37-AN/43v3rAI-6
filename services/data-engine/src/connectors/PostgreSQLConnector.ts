/**
 * PostgreSQL Connector
 *
 * Connects to PostgreSQL databases to sync table data
 */

import { BaseConnector, ConnectorInstance } from './ConnectorRegistry';

export interface PostgreSQLConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  tables?: string[]; // Optional: specific tables to sync
}

export class PostgreSQLConnector extends BaseConnector {
  id = 'postgresql';
  name = 'PostgreSQL';
  type = 'database' as const;
  description = 'Sync data from PostgreSQL databases';
  icon = '🐘';

  configSchema = {
    type: 'object',
    properties: {
      host: { type: 'string', required: true },
      port: { type: 'number', default: 5432 },
      database: { type: 'string', required: true },
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
      ssl: { type: 'boolean', default: false },
      tables: { type: 'array', items: { type: 'string' } },
    },
  };

  protected async createInstance(config: PostgreSQLConfig): Promise<ConnectorInstance> {
    return new PostgreSQLInstance(this.id, config);
  }
}

class PostgreSQLInstance implements ConnectorInstance {
  id: string;
  connectorId: string;
  config: PostgreSQLConfig;
  isConnected: boolean = false;
  private client: any = null; // In production, use 'pg' library

  constructor(connectorId: string, config: PostgreSQLConfig) {
    this.id = `pg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.connectorId = connectorId;
    this.config = config;
  }

  /**
   * Test the database connection
   */
  async test(): Promise<boolean> {
    try {
      await this.connect();

      // Simple test query
      const result = await this.executeQuery('SELECT 1 as test');

      this.isConnected = result && result.length > 0;
      return this.isConnected;
    } catch (error) {
      console.error('[PostgreSQL] Connection test failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Fetch data from specified tables
   */
  async fetch(params?: { table?: string; limit?: number; offset?: number }): Promise<any[]> {
    await this.connect();

    const tablesToSync = params?.table
      ? [params.table]
      : (this.config.tables || await this.listTables());

    const allData: any[] = [];

    for (const table of tablesToSync) {
      console.log(`[PostgreSQL] Syncing table: ${table}`);

      // Get table schema
      const schema = await this.getTableSchema(table);

      // Build query
      const limit = params?.limit || 1000;
      const offset = params?.offset || 0;
      const query = `SELECT * FROM ${table} LIMIT ${limit} OFFSET ${offset}`;

      // Execute query
      const rows = await this.executeQuery(query);

      // Transform rows to standard format
      const records = rows.map((row: any) => ({
        table,
        data: row,
        schema,
        source: 'postgresql',
        syncedAt: new Date(),
      }));

      allData.push(...records);
    }

    console.log(`[PostgreSQL] Fetched ${allData.length} total records`);
    return allData;
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      // In production: await this.client.end();
      this.client = null;
    }
    this.isConnected = false;
    console.log('[PostgreSQL] Disconnected');
  }

  // Private helper methods

  private async connect(): Promise<void> {
    if (this.isConnected && this.client) {
      return;
    }

    // In production, use the 'pg' library:
    // const { Client } = require('pg');
    // this.client = new Client({
    //   host: this.config.host,
    //   port: this.config.port,
    //   database: this.config.database,
    //   user: this.config.username,
    //   password: this.config.password,
    //   ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
    // });
    // await this.client.connect();

    // Mock connection for now
    this.client = { connected: true };
    this.isConnected = true;

    console.log('[PostgreSQL] Connected to database');
  }

  private async listTables(): Promise<string[]> {
    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    `;

    const result = await this.executeQuery(query);
    return result.map((row: any) => row.table_name);
  }

  private async getTableSchema(table: string): Promise<any> {
    const query = `
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = '${table}'
      ORDER BY ordinal_position
    `;

    const columns = await this.executeQuery(query);

    return {
      table,
      columns: columns.map((col: any) => ({
        name: col.column_name,
        type: col.data_type,
        nullable: col.is_nullable === 'YES',
        default: col.column_default,
      })),
    };
  }

  private async executeQuery(query: string): Promise<any[]> {
    if (!this.client) {
      throw new Error('Not connected to database');
    }

    try {
      // In production: const result = await this.client.query(query);
      // return result.rows;

      // Mock result for now
      console.log(`[PostgreSQL] Executing query: ${query.substring(0, 100)}...`);
      return [];
    } catch (error) {
      console.error('[PostgreSQL] Query execution failed:', error);
      throw error;
    }
  }
}

// Export the connector class
export default PostgreSQLConnector;
