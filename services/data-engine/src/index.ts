/**
 * Unified Data Engine
 *
 * Core service for ingesting, transforming, and unifying data from multiple sources.
 * Inspired by Scale AI's Data Engine architecture.
 */

import { EventEmitter } from 'events';

export interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'saas' | 'stream';
  connector: string;
  config: Record<string, any>;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
}

export interface DataRecord {
  id: string;
  sourceId: string;
  entityType: string;
  data: Record<string, any>;
  metadata: {
    ingestionTime: Date;
    version: number;
    lineage: string[];
    quality: QualityScore;
  };
}

export interface QualityScore {
  completeness: number;
  accuracy: number;
  consistency: number;
  overall: number;
}

export interface SchemaMapping {
  sourceSchema: Record<string, any>;
  targetSchema: Record<string, any>;
  mappings: Array<{
    sourcePath: string;
    targetPath: string;
    transform?: string;
  }>;
}

/**
 * Main Data Engine class
 * Orchestrates data ingestion, transformation, and quality management
 */
export class DataEngine extends EventEmitter {
  private dataSources: Map<string, DataSource> = new Map();
  private schemaMappings: Map<string, SchemaMapping> = new Map();
  private dataStore: Map<string, DataRecord> = new Map();
  private isRunning: boolean = false;

  constructor() {
    super();
  }

  /**
   * Start the data engine
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Data Engine is already running');
    }

    this.isRunning = true;
    this.emit('started');
    console.log('[Data Engine] Started successfully');
  }

  /**
   * Stop the data engine
   */
  async stop(): Promise<void> {
    this.isRunning = false;
    this.emit('stopped');
    console.log('[Data Engine] Stopped successfully');
  }

  /**
   * Register a new data source
   */
  async registerDataSource(source: DataSource): Promise<void> {
    this.dataSources.set(source.id, source);
    this.emit('source:registered', source);
    console.log(`[Data Engine] Registered data source: ${source.name}`);
  }

  /**
   * Ingest data from a source
   */
  async ingestData(sourceId: string, data: any[]): Promise<DataRecord[]> {
    const source = this.dataSources.get(sourceId);
    if (!source) {
      throw new Error(`Data source not found: ${sourceId}`);
    }

    const records: DataRecord[] = [];

    for (const item of data) {
      const record: DataRecord = {
        id: this.generateId(),
        sourceId,
        entityType: this.inferEntityType(item),
        data: item,
        metadata: {
          ingestionTime: new Date(),
          version: 1,
          lineage: [sourceId],
          quality: this.assessQuality(item),
        },
      };

      this.dataStore.set(record.id, record);
      records.push(record);
    }

    this.emit('data:ingested', { sourceId, count: records.length });
    console.log(`[Data Engine] Ingested ${records.length} records from ${source.name}`);

    return records;
  }

  /**
   * Transform data using registered schema mappings
   */
  async transformData(records: DataRecord[], mappingId: string): Promise<DataRecord[]> {
    const mapping = this.schemaMappings.get(mappingId);
    if (!mapping) {
      throw new Error(`Schema mapping not found: ${mappingId}`);
    }

    const transformed = records.map(record => ({
      ...record,
      data: this.applyMapping(record.data, mapping),
      metadata: {
        ...record.metadata,
        version: record.metadata.version + 1,
        lineage: [...record.metadata.lineage, 'transform'],
      },
    }));

    this.emit('data:transformed', { count: transformed.length });
    return transformed;
  }

  /**
   * Query unified data
   */
  async query(filter: {
    entityType?: string;
    sourceId?: string;
    minQuality?: number;
  }): Promise<DataRecord[]> {
    let results = Array.from(this.dataStore.values());

    if (filter.entityType) {
      results = results.filter(r => r.entityType === filter.entityType);
    }

    if (filter.sourceId) {
      results = results.filter(r => r.sourceId === filter.sourceId);
    }

    if (filter.minQuality !== undefined) {
      results = results.filter(r => r.metadata.quality.overall >= filter.minQuality);
    }

    return results;
  }

  /**
   * Get data quality metrics
   */
  getQualityMetrics(): {
    totalRecords: number;
    averageQuality: number;
    qualityDistribution: Record<string, number>;
  } {
    const records = Array.from(this.dataStore.values());
    const totalRecords = records.length;

    if (totalRecords === 0) {
      return {
        totalRecords: 0,
        averageQuality: 0,
        qualityDistribution: {},
      };
    }

    const sumQuality = records.reduce((sum, r) => sum + r.metadata.quality.overall, 0);
    const averageQuality = sumQuality / totalRecords;

    const distribution: Record<string, number> = {
      high: 0,
      medium: 0,
      low: 0,
    };

    records.forEach(r => {
      const quality = r.metadata.quality.overall;
      if (quality >= 0.8) distribution.high++;
      else if (quality >= 0.5) distribution.medium++;
      else distribution.low++;
    });

    return {
      totalRecords,
      averageQuality,
      qualityDistribution: distribution,
    };
  }

  /**
   * Get data lineage for a record
   */
  getLineage(recordId: string): string[] {
    const record = this.dataStore.get(recordId);
    return record ? record.metadata.lineage : [];
  }

  // Private helper methods

  private generateId(): string {
    return `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private inferEntityType(data: any): string {
    // Simple entity type inference based on fields
    const fields = Object.keys(data);

    if (fields.includes('email') || fields.includes('firstName')) {
      return 'contact';
    }
    if (fields.includes('price') || fields.includes('amount')) {
      return 'transaction';
    }
    if (fields.includes('product') || fields.includes('sku')) {
      return 'product';
    }

    return 'generic';
  }

  private assessQuality(data: any): QualityScore {
    const fields = Object.keys(data);
    const values = Object.values(data);

    // Completeness: ratio of non-null/non-empty fields
    const nonEmpty = values.filter(v => v !== null && v !== undefined && v !== '').length;
    const completeness = nonEmpty / fields.length;

    // Accuracy: check for valid formats (simplified)
    let accuracyChecks = 0;
    let accuracyPassed = 0;

    fields.forEach(field => {
      if (field.includes('email')) {
        accuracyChecks++;
        if (this.isValidEmail(data[field])) accuracyPassed++;
      }
      if (field.includes('phone')) {
        accuracyChecks++;
        if (this.isValidPhone(data[field])) accuracyPassed++;
      }
    });

    const accuracy = accuracyChecks > 0 ? accuracyPassed / accuracyChecks : 1;

    // Consistency: check for reasonable data types
    const consistency = 0.9; // Simplified

    const overall = (completeness * 0.4 + accuracy * 0.4 + consistency * 0.2);

    return {
      completeness,
      accuracy,
      consistency,
      overall,
    };
  }

  private isValidEmail(email: any): boolean {
    if (typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isValidPhone(phone: any): boolean {
    if (typeof phone !== 'string') return false;
    return /^[\d\s\-\+\(\)]+$/.test(phone);
  }

  private applyMapping(data: any, mapping: SchemaMapping): any {
    const result: any = {};

    mapping.mappings.forEach(({ sourcePath, targetPath, transform }) => {
      let value = this.getNestedValue(data, sourcePath);

      if (transform) {
        value = this.applyTransform(value, transform);
      }

      this.setNestedValue(result, targetPath, value);
    });

    return result;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  private applyTransform(value: any, transform: string): any {
    switch (transform) {
      case 'uppercase':
        return typeof value === 'string' ? value.toUpperCase() : value;
      case 'lowercase':
        return typeof value === 'string' ? value.toLowerCase() : value;
      case 'trim':
        return typeof value === 'string' ? value.trim() : value;
      case 'number':
        return Number(value);
      default:
        return value;
    }
  }
}

// Export singleton instance
export const dataEngine = new DataEngine();
