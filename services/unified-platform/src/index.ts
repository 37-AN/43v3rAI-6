/**
 * UnifiedAI Platform Integration Layer
 *
 * Orchestrates all four pillars into a cohesive AI platform
 */

import { EventEmitter } from 'events';
import { dataEngine, DataEngine } from '../../data-engine/src';
import { modelOrchestrator, ModelOrchestrator } from '../../model-orchestrator/src';
import { agenticWorkspace, AgenticWorkspace } from '../../agentic-workspace/src';
import { evaluationLayer, EvaluationLayer } from '../../evaluation-layer/src';

export interface PlatformConfig {
  enableDataEngine?: boolean;
  enableModelOrchestrator?: boolean;
  enableAgenticWorkspace?: boolean;
  enableEvaluationLayer?: boolean;
  autoEvaluate?: boolean;
  evaluationThreshold?: number;
}

export interface UnifiedQuery {
  query: string;
  agentRole?: 'data-analyst' | 'workflow-automation' | 'integration-specialist' | 'compliance-monitor' | 'customer-success' | 'general-assistant';
  context?: any;
  options?: {
    maxCost?: number;
    maxLatency?: number;
    minAccuracy?: number;
    requireEvaluation?: boolean;
  };
}

export interface UnifiedResponse {
  response: string;
  metadata: {
    agentId: string;
    agentName: string;
    modelUsed: string;
    cost: number;
    latency: number;
    tokensUsed: number;
    evaluation?: {
      passed: boolean;
      score: number;
      metrics: Array<{
        metric: string;
        score: number;
        passed: boolean;
      }>;
      issues?: string[];
      recommendations?: string[];
    };
  };
  success: boolean;
  error?: string;
}

export interface PlatformStats {
  dataEngine: {
    totalRecords: number;
    averageQuality: number;
    sourcesConnected: number;
  };
  modelOrchestrator: {
    totalRequests: number;
    totalCost: number;
    avgLatency: number;
    modelUsage: Record<string, number>;
  };
  agenticWorkspace: {
    totalAgents: number;
    activeTasks: number;
    completedTasks: number;
    averageRating: number;
  };
  evaluationLayer: {
    totalEvaluations: number;
    passRate: number;
    averageScore: number;
  };
}

/**
 * UnifiedAI Platform
 * Main integration class that orchestrates all four pillars
 */
export class UnifiedAIPlatform extends EventEmitter {
  private config: PlatformConfig;
  private isInitialized: boolean = false;

  // References to the four pillars
  public dataEngine: DataEngine;
  public modelOrchestrator: ModelOrchestrator;
  public agenticWorkspace: AgenticWorkspace;
  public evaluationLayer: EvaluationLayer;

  constructor(config: PlatformConfig = {}) {
    super();

    this.config = {
      enableDataEngine: true,
      enableModelOrchestrator: true,
      enableAgenticWorkspace: true,
      enableEvaluationLayer: true,
      autoEvaluate: true,
      evaluationThreshold: 0.85,
      ...config,
    };

    this.dataEngine = dataEngine;
    this.modelOrchestrator = modelOrchestrator;
    this.agenticWorkspace = agenticWorkspace;
    this.evaluationLayer = evaluationLayer;
  }

  /**
   * Initialize the entire platform
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[UnifiedAI Platform] Already initialized');
      return;
    }

    console.log('[UnifiedAI Platform] Initializing...');

    try {
      // Start all enabled services
      if (this.config.enableDataEngine) {
        await this.dataEngine.start();
      }

      if (this.config.enableModelOrchestrator) {
        await this.modelOrchestrator.start();
      }

      if (this.config.enableAgenticWorkspace) {
        await this.agenticWorkspace.start();
      }

      if (this.config.enableEvaluationLayer) {
        await this.evaluationLayer.start();
      }

      this.isInitialized = true;
      this.emit('initialized');
      console.log('[UnifiedAI Platform] Initialized successfully');
    } catch (error) {
      console.error('[UnifiedAI Platform] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Shutdown the platform
   */
  async shutdown(): Promise<void> {
    console.log('[UnifiedAI Platform] Shutting down...');

    if (this.config.enableDataEngine) {
      await this.dataEngine.stop();
    }

    if (this.config.enableModelOrchestrator) {
      await this.modelOrchestrator.stop();
    }

    if (this.config.enableAgenticWorkspace) {
      await this.agenticWorkspace.stop();
    }

    if (this.config.enableEvaluationLayer) {
      await this.evaluationLayer.stop();
    }

    this.isInitialized = false;
    this.emit('shutdown');
    console.log('[UnifiedAI Platform] Shutdown complete');
  }

  /**
   * Process a unified query through the entire platform
   */
  async query(request: UnifiedQuery): Promise<UnifiedResponse> {
    if (!this.isInitialized) {
      throw new Error('Platform not initialized. Call initialize() first.');
    }

    const startTime = Date.now();

    try {
      // Step 1: Get appropriate agent
      const agents = this.agenticWorkspace.listAgents(request.agentRole || 'general-assistant');
      if (agents.length === 0) {
        throw new Error(`No agents available for role: ${request.agentRole || 'general-assistant'}`);
      }
      const agent = agents[0];

      // Step 2: Process query through agent (which uses model orchestrator internally)
      // For now, we'll route directly through model orchestrator
      // In a full implementation, agents would have access to model orchestrator

      const inferenceResult = await this.modelOrchestrator.infer({
        taskType: 'question-answering',
        prompt: request.query,
        context: request.context,
        constraints: {
          maxCost: request.options?.maxCost,
          maxLatency: request.options?.maxLatency,
          minAccuracy: request.options?.minAccuracy,
        },
      });

      // Step 3: Evaluate response (if enabled)
      let evaluationResult;
      const requireEvaluation = request.options?.requireEvaluation ?? this.config.autoEvaluate;

      if (requireEvaluation && this.config.enableEvaluationLayer) {
        evaluationResult = await this.evaluationLayer.evaluate(
          inferenceResult.requestId,
          request.query,
          inferenceResult.response
        );

        // Check if evaluation passes threshold
        if (evaluationResult.overallScore < (this.config.evaluationThreshold || 0.85)) {
          this.emit('evaluation:failed', {
            request,
            evaluation: evaluationResult,
          });

          return {
            response: inferenceResult.response,
            metadata: {
              agentId: agent.id,
              agentName: agent.name,
              modelUsed: inferenceResult.modelUsed,
              cost: inferenceResult.metadata.cost,
              latency: Date.now() - startTime,
              tokensUsed: inferenceResult.metadata.tokensUsed,
              evaluation: {
                passed: false,
                score: evaluationResult.overallScore,
                metrics: evaluationResult.metrics,
                issues: evaluationResult.issues,
                recommendations: evaluationResult.recommendations,
              },
            },
            success: false,
            error: 'Response did not meet quality standards',
          };
        }
      }

      // Step 4: Return successful response
      const response: UnifiedResponse = {
        response: inferenceResult.response,
        metadata: {
          agentId: agent.id,
          agentName: agent.name,
          modelUsed: inferenceResult.modelUsed,
          cost: inferenceResult.metadata.cost,
          latency: Date.now() - startTime,
          tokensUsed: inferenceResult.metadata.tokensUsed,
          evaluation: evaluationResult ? {
            passed: evaluationResult.passed,
            score: evaluationResult.overallScore,
            metrics: evaluationResult.metrics,
          } : undefined,
        },
        success: true,
      };

      this.emit('query:completed', response);
      return response;
    } catch (error: any) {
      console.error('[UnifiedAI Platform] Query failed:', error);

      return {
        response: '',
        metadata: {
          agentId: '',
          agentName: '',
          modelUsed: '',
          cost: 0,
          latency: Date.now() - startTime,
          tokensUsed: 0,
        },
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Ingest data from external sources
   */
  async ingestData(sourceId: string, data: any[]): Promise<{
    recordsIngested: number;
    qualityMetrics: any;
  }> {
    if (!this.config.enableDataEngine) {
      throw new Error('Data Engine is not enabled');
    }

    const records = await this.dataEngine.ingestData(sourceId, data);
    const qualityMetrics = this.dataEngine.getQualityMetrics();

    this.emit('data:ingested', {
      sourceId,
      recordsIngested: records.length,
      qualityMetrics,
    });

    return {
      recordsIngested: records.length,
      qualityMetrics,
    };
  }

  /**
   * Register a new data source
   */
  async registerDataSource(source: any): Promise<void> {
    if (!this.config.enableDataEngine) {
      throw new Error('Data Engine is not enabled');
    }

    await this.dataEngine.registerDataSource(source);
    this.emit('datasource:registered', source);
  }

  /**
   * Create a new AI agent
   */
  createAgent(config: any): any {
    if (!this.config.enableAgenticWorkspace) {
      throw new Error('Agentic Workspace is not enabled');
    }

    const agent = this.agenticWorkspace.createAgent(config);
    this.emit('agent:created', agent);
    return agent;
  }

  /**
   * Assign a task to an agent
   */
  async assignTask(agentId: string, description: string): Promise<any> {
    if (!this.config.enableAgenticWorkspace) {
      throw new Error('Agentic Workspace is not enabled');
    }

    const task = await this.agenticWorkspace.assignTask(agentId, description);
    this.emit('task:assigned', task);
    return task;
  }

  /**
   * Submit feedback for continuous learning
   */
  submitFeedback(taskId: string, rating: number, comment?: string): void {
    if (!this.config.enableAgenticWorkspace) {
      throw new Error('Agentic Workspace is not enabled');
    }

    this.agenticWorkspace.submitFeedback(taskId, rating, comment);
    this.emit('feedback:submitted', { taskId, rating, comment });
  }

  /**
   * Get comprehensive platform statistics
   */
  getStats(): PlatformStats {
    const stats: PlatformStats = {
      dataEngine: {
        totalRecords: 0,
        averageQuality: 0,
        sourcesConnected: 0,
      },
      modelOrchestrator: {
        totalRequests: 0,
        totalCost: 0,
        avgLatency: 0,
        modelUsage: {},
      },
      agenticWorkspace: {
        totalAgents: 0,
        activeTasks: 0,
        completedTasks: 0,
        averageRating: 0,
      },
      evaluationLayer: {
        totalEvaluations: 0,
        passRate: 0,
        averageScore: 0,
      },
    };

    if (this.config.enableDataEngine) {
      const dataStats = this.dataEngine.getQualityMetrics();
      stats.dataEngine = {
        totalRecords: dataStats.totalRecords,
        averageQuality: dataStats.averageQuality,
        sourcesConnected: 0, // Would be tracked separately
      };
    }

    if (this.config.enableModelOrchestrator) {
      const modelStats = this.modelOrchestrator.getStats();
      stats.modelOrchestrator = modelStats;
    }

    if (this.config.enableAgenticWorkspace) {
      const agents = this.agenticWorkspace.listAgents();
      const allTasks = agents.flatMap(a => this.agenticWorkspace.getAgentTasks(a.id));

      stats.agenticWorkspace = {
        totalAgents: agents.length,
        activeTasks: allTasks.filter(t => t.status === 'in-progress').length,
        completedTasks: allTasks.filter(t => t.status === 'completed').length,
        averageRating: 0, // Would calculate from feedback
      };
    }

    if (this.config.enableEvaluationLayer) {
      const evalStats = this.evaluationLayer.getStats();
      stats.evaluationLayer = evalStats;
    }

    return stats;
  }

  /**
   * Health check for all services
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    services: Record<string, boolean>;
  }> {
    const services: Record<string, boolean> = {
      dataEngine: this.config.enableDataEngine || false,
      modelOrchestrator: this.config.enableModelOrchestrator || false,
      agenticWorkspace: this.config.enableAgenticWorkspace || false,
      evaluationLayer: this.config.enableEvaluationLayer || false,
    };

    const healthy = Object.values(services).every(s => s === true);

    return {
      healthy,
      services,
    };
  }

  /**
   * Compare different models for a task
   */
  compareModels(taskType: any, prompt: string): any[] {
    if (!this.config.enableModelOrchestrator) {
      throw new Error('Model Orchestrator is not enabled');
    }

    return this.modelOrchestrator.compareModels(taskType, prompt);
  }

  /**
   * Run a benchmark test
   */
  async runBenchmark(
    benchmarkId: string,
    modelId: string,
    testCaseIds: string[]
  ): Promise<any> {
    if (!this.config.enableEvaluationLayer) {
      throw new Error('Evaluation Layer is not enabled');
    }

    return await this.evaluationLayer.runBenchmark(
      benchmarkId,
      modelId,
      testCaseIds,
      async (input: string) => {
        const result = await this.modelOrchestrator.infer({
          taskType: 'question-answering',
          prompt: input,
        });
        return result.response;
      }
    );
  }
}

// Export singleton instance with default configuration
export const unifiedPlatform = new UnifiedAIPlatform();
