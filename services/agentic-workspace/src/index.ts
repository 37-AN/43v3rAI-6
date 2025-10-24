/**
 * Agentic Workspace
 *
 * Adaptive AI agents that learn from user interactions
 * Inspired by Scale AI's Agentic Solutions architecture
 */

import { EventEmitter } from 'events';

export type AgentRole =
  | 'data-analyst'
  | 'workflow-automation'
  | 'integration-specialist'
  | 'compliance-monitor'
  | 'customer-success'
  | 'general-assistant';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  capabilities: string[];
  memory: AgentMemory;
  tools: Tool[];
  status: 'idle' | 'working' | 'waiting' | 'error';
}

export interface AgentMemory {
  shortTerm: ConversationMessage[];
  longTerm: KnowledgeEntry[];
  preferences: Record<string, any>;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface KnowledgeEntry {
  id: string;
  type: 'fact' | 'procedure' | 'preference' | 'feedback';
  content: string;
  confidence: number;
  timestamp: Date;
  source: string;
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<any>;
}

export interface AgentTask {
  id: string;
  agentId: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Feedback {
  taskId: string;
  rating: number;
  comment?: string;
  timestamp: Date;
}

/**
 * Agentic Workspace class
 * Manages multiple AI agents and their interactions
 */
export class AgenticWorkspace extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, AgentTask> = new Map();
  private feedbackLog: Feedback[] = [];
  private isRunning: boolean = false;

  constructor() {
    super();
  }

  /**
   * Start the agentic workspace
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Agentic Workspace is already running');
    }

    this.isRunning = true;
    this.initializeDefaultAgents();
    this.emit('started');
    console.log('[Agentic Workspace] Started successfully');
  }

  /**
   * Stop the agentic workspace
   */
  async stop(): Promise<void> {
    this.isRunning = false;
    this.emit('stopped');
    console.log('[Agentic Workspace] Stopped successfully');
  }

  /**
   * Create a new agent
   */
  createAgent(config: {
    name: string;
    role: AgentRole;
    description: string;
    capabilities: string[];
    tools?: Tool[];
  }): Agent {
    const agent: Agent = {
      id: this.generateId('agent'),
      name: config.name,
      role: config.role,
      description: config.description,
      capabilities: config.capabilities,
      memory: {
        shortTerm: [],
        longTerm: [],
        preferences: {},
      },
      tools: config.tools || [],
      status: 'idle',
    };

    this.agents.set(agent.id, agent);
    this.emit('agent:created', agent);
    console.log(`[Agentic Workspace] Created agent: ${agent.name}`);

    return agent;
  }

  /**
   * Get an agent by ID
   */
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * List all agents
   */
  listAgents(role?: AgentRole): Agent[] {
    const agents = Array.from(this.agents.values());
    return role ? agents.filter(a => a.role === role) : agents;
  }

  /**
   * Send a message to an agent
   */
  async chat(agentId: string, message: string, context?: any): Promise<string> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    // Add user message to short-term memory
    const userMessage: ConversationMessage = {
      id: this.generateId('msg'),
      role: 'user',
      content: message,
      timestamp: new Date(),
      metadata: context,
    };

    agent.memory.shortTerm.push(userMessage);

    // Keep only last 20 messages in short-term memory
    if (agent.memory.shortTerm.length > 20) {
      agent.memory.shortTerm = agent.memory.shortTerm.slice(-20);
    }

    // Process message and generate response
    const response = await this.processMessage(agent, message, context);

    // Add agent response to short-term memory
    const agentMessage: ConversationMessage = {
      id: this.generateId('msg'),
      role: 'agent',
      content: response,
      timestamp: new Date(),
    };

    agent.memory.shortTerm.push(agentMessage);

    this.emit('chat:message', { agentId, userMessage, agentMessage });

    return response;
  }

  /**
   * Assign a task to an agent
   */
  async assignTask(agentId: string, description: string): Promise<AgentTask> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    const task: AgentTask = {
      id: this.generateId('task'),
      agentId,
      description,
      status: 'pending',
      createdAt: new Date(),
    };

    this.tasks.set(task.id, task);
    this.emit('task:created', task);

    // Execute task asynchronously
    this.executeTask(task, agent);

    return task;
  }

  /**
   * Get task status
   */
  getTask(taskId: string): AgentTask | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks for an agent
   */
  getAgentTasks(agentId: string): AgentTask[] {
    return Array.from(this.tasks.values()).filter(t => t.agentId === agentId);
  }

  /**
   * Submit feedback for a task
   */
  submitFeedback(taskId: string, rating: number, comment?: string): void {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const feedback: Feedback = {
      taskId,
      rating,
      comment,
      timestamp: new Date(),
    };

    this.feedbackLog.push(feedback);

    // Learn from feedback
    this.learnFromFeedback(task, feedback);

    this.emit('feedback:submitted', feedback);
    console.log(`[Agentic Workspace] Feedback received for task ${taskId}: ${rating}/5`);
  }

  /**
   * Get agent performance metrics
   */
  getAgentMetrics(agentId: string): {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    averageRating: number;
    successRate: number;
  } {
    const tasks = this.getAgentTasks(agentId);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const failedTasks = tasks.filter(t => t.status === 'failed').length;

    const taskIds = new Set(tasks.map(t => t.id));
    const relevantFeedback = this.feedbackLog.filter(f => taskIds.has(f.taskId));
    const averageRating = relevantFeedback.length > 0
      ? relevantFeedback.reduce((sum, f) => sum + f.rating, 0) / relevantFeedback.length
      : 0;

    const successRate = totalTasks > 0 ? completedTasks / totalTasks : 0;

    return {
      totalTasks,
      completedTasks,
      failedTasks,
      averageRating,
      successRate,
    };
  }

  /**
   * Add a tool to an agent
   */
  addTool(agentId: string, tool: Tool): void {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    agent.tools.push(tool);
    console.log(`[Agentic Workspace] Added tool "${tool.name}" to agent ${agent.name}`);
  }

  // Private helper methods

  private initializeDefaultAgents(): void {
    // Data Analyst Agent
    this.createAgent({
      name: 'Data Analyst',
      role: 'data-analyst',
      description: 'Analyzes data, generates insights, and creates visualizations',
      capabilities: [
        'query-data',
        'analyze-trends',
        'generate-reports',
        'create-visualizations',
        'answer-questions',
      ],
      tools: [
        {
          name: 'query_database',
          description: 'Execute SQL queries on the unified database',
          parameters: { query: 'string' },
          execute: async (params) => {
            console.log(`Executing query: ${params.query}`);
            return { rows: [], count: 0 };
          },
        },
        {
          name: 'generate_chart',
          description: 'Generate a chart from data',
          parameters: { data: 'array', chartType: 'string' },
          execute: async (params) => {
            console.log(`Generating ${params.chartType} chart`);
            return { chartUrl: '/charts/example.png' };
          },
        },
      ],
    });

    // Workflow Automation Agent
    this.createAgent({
      name: 'Workflow Automator',
      role: 'workflow-automation',
      description: 'Creates and manages automated workflows',
      capabilities: [
        'create-workflows',
        'schedule-tasks',
        'monitor-triggers',
        'execute-actions',
      ],
      tools: [
        {
          name: 'create_workflow',
          description: 'Create a new workflow',
          parameters: { name: 'string', trigger: 'object', actions: 'array' },
          execute: async (params) => {
            console.log(`Creating workflow: ${params.name}`);
            return { workflowId: 'wf_123', status: 'active' };
          },
        },
      ],
    });

    // Integration Specialist Agent
    this.createAgent({
      name: 'Integration Specialist',
      role: 'integration-specialist',
      description: 'Manages data source connections and integrations',
      capabilities: [
        'connect-sources',
        'configure-integrations',
        'troubleshoot-connections',
        'sync-data',
      ],
      tools: [
        {
          name: 'test_connection',
          description: 'Test a data source connection',
          parameters: { sourceId: 'string' },
          execute: async (params) => {
            console.log(`Testing connection: ${params.sourceId}`);
            return { status: 'connected', latency: 45 };
          },
        },
      ],
    });

    console.log(`[Agentic Workspace] Initialized ${this.agents.size} default agents`);
  }

  private async processMessage(agent: Agent, message: string, context?: any): Promise<string> {
    agent.status = 'working';

    try {
      // Analyze message intent
      const intent = this.analyzeIntent(message);

      // Check if any tools are needed
      const toolCall = this.identifyToolCall(message, agent.tools);

      let response = '';

      if (toolCall) {
        // Execute tool and generate response based on result
        const result = await toolCall.tool.execute(toolCall.params);
        response = this.generateResponseWithTool(agent, message, toolCall.tool.name, result);
      } else {
        // Generate contextual response
        response = this.generateResponse(agent, message, context);
      }

      agent.status = 'idle';
      return response;
    } catch (error) {
      agent.status = 'error';
      throw error;
    }
  }

  private analyzeIntent(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('analyze') || lower.includes('insight')) return 'analyze';
    if (lower.includes('create') || lower.includes('build')) return 'create';
    if (lower.includes('query') || lower.includes('find')) return 'query';
    if (lower.includes('help') || lower.includes('how')) return 'help';

    return 'general';
  }

  private identifyToolCall(message: string, tools: Tool[]): { tool: Tool; params: any } | null {
    const lower = message.toLowerCase();

    // Simple heuristic tool matching
    for (const tool of tools) {
      if (lower.includes(tool.name.replace(/_/g, ' '))) {
        return { tool, params: {} };
      }
    }

    return null;
  }

  private generateResponse(agent: Agent, message: string, context?: any): string {
    // Placeholder for actual LLM integration
    const responses = {
      'data-analyst': `As your data analyst, I've examined the information. ${message}`,
      'workflow-automation': `I can help automate that workflow. ${message}`,
      'integration-specialist': `Let me help you integrate that system. ${message}`,
      'compliance-monitor': `I'll check compliance requirements for ${message}`,
      'customer-success': `I'm here to help! Regarding ${message}, let me assist you.`,
      'general-assistant': `I understand you need help with: ${message}`,
    };

    return responses[agent.role] || `I've processed your request: ${message}`;
  }

  private generateResponseWithTool(agent: Agent, message: string, toolName: string, result: any): string {
    return `I've executed ${toolName} for your request. Result: ${JSON.stringify(result)}`;
  }

  private async executeTask(task: AgentTask, agent: Agent): Promise<void> {
    task.status = 'in-progress';
    agent.status = 'working';
    this.emit('task:started', task);

    try {
      // Simulate task execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, this would use the model orchestrator for complex reasoning
      task.result = {
        success: true,
        output: `Task "${task.description}" completed successfully`,
      };

      task.status = 'completed';
      task.completedAt = new Date();
      agent.status = 'idle';

      this.emit('task:completed', task);
      console.log(`[Agentic Workspace] Task ${task.id} completed by ${agent.name}`);
    } catch (error: any) {
      task.status = 'failed';
      task.error = error.message;
      agent.status = 'error';

      this.emit('task:failed', task);
      console.error(`[Agentic Workspace] Task ${task.id} failed:`, error.message);
    }
  }

  private learnFromFeedback(task: AgentTask, feedback: Feedback): void {
    const agent = this.agents.get(task.agentId);
    if (!agent) return;

    // Store feedback as long-term knowledge
    const knowledge: KnowledgeEntry = {
      id: this.generateId('know'),
      type: 'feedback',
      content: `Task: ${task.description}, Rating: ${feedback.rating}, Comment: ${feedback.comment || 'none'}`,
      confidence: feedback.rating / 5,
      timestamp: new Date(),
      source: 'user-feedback',
    };

    agent.memory.longTerm.push(knowledge);

    // Adjust agent preferences based on feedback
    if (feedback.rating >= 4) {
      // Positive feedback - reinforce behavior
      console.log(`[Agentic Workspace] Positive feedback for ${agent.name}`);
    } else if (feedback.rating <= 2) {
      // Negative feedback - adjust approach
      console.log(`[Agentic Workspace] Negative feedback for ${agent.name}, adjusting approach`);
    }
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const agenticWorkspace = new AgenticWorkspace();
