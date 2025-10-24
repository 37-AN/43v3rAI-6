/**
 * Connector Registry
 *
 * Manages all available data connectors and their configurations
 */

export interface Connector {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'saas' | 'stream';
  description: string;
  icon: string;
  configSchema: Record<string, any>;
  connect: (config: Record<string, any>) => Promise<ConnectorInstance>;
}

export interface ConnectorInstance {
  id: string;
  connectorId: string;
  config: Record<string, any>;
  isConnected: boolean;
  fetch: (params?: any) => Promise<any[]>;
  disconnect: () => Promise<void>;
  test: () => Promise<boolean>;
}

/**
 * Abstract base class for all connectors
 */
export abstract class BaseConnector implements Connector {
  abstract id: string;
  abstract name: string;
  abstract type: 'database' | 'api' | 'file' | 'saas' | 'stream';
  abstract description: string;
  abstract icon: string;
  abstract configSchema: Record<string, any>;

  async connect(config: Record<string, any>): Promise<ConnectorInstance> {
    return this.createInstance(config);
  }

  protected abstract createInstance(config: Record<string, any>): Promise<ConnectorInstance>;
}

/**
 * Connector Registry to manage all available connectors
 */
export class ConnectorRegistry {
  private connectors: Map<string, Connector> = new Map();
  private instances: Map<string, ConnectorInstance> = new Map();

  constructor() {
    this.registerDefaultConnectors();
  }

  /**
   * Register a new connector
   */
  register(connector: Connector): void {
    this.connectors.set(connector.id, connector);
    console.log(`[Connector Registry] Registered: ${connector.name}`);
  }

  /**
   * Get a connector by ID
   */
  get(connectorId: string): Connector | undefined {
    return this.connectors.get(connectorId);
  }

  /**
   * List all available connectors
   */
  list(): Connector[] {
    return Array.from(this.connectors.values());
  }

  /**
   * Connect to a data source
   */
  async connect(connectorId: string, config: Record<string, any>): Promise<ConnectorInstance> {
    const connector = this.connectors.get(connectorId);
    if (!connector) {
      throw new Error(`Connector not found: ${connectorId}`);
    }

    const instance = await connector.connect(config);
    this.instances.set(instance.id, instance);

    console.log(`[Connector Registry] Connected: ${connector.name}`);
    return instance;
  }

  /**
   * Disconnect a connector instance
   */
  async disconnect(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Connector instance not found: ${instanceId}`);
    }

    await instance.disconnect();
    this.instances.delete(instanceId);

    console.log(`[Connector Registry] Disconnected: ${instanceId}`);
  }

  /**
   * Get a connector instance
   */
  getInstance(instanceId: string): ConnectorInstance | undefined {
    return this.instances.get(instanceId);
  }

  /**
   * Register default connectors
   */
  private registerDefaultConnectors(): void {
    // Register built-in connectors here
    // This will be expanded with actual connector implementations
    console.log('[Connector Registry] Initialized with default connectors');
  }
}

// Export singleton instance
export const connectorRegistry = new ConnectorRegistry();
