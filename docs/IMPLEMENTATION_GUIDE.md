# UnifiedAI Implementation Guide

## Overview

This guide explains how to implement and integrate the four core pillars of the UnifiedAI architecture.

## Four Pillars Architecture

### 1. Unified Data Engine
**Location:** `/services/data-engine/`

**Purpose:** Multi-source data ingestion, transformation, and quality management

**Key Classes:**
- `DataEngine` - Main orchestrator
- `ConnectorRegistry` - Manages data source connectors
- `DataRecord` - Unified data representation
- `QualityScore` - Data quality metrics

**Example Usage:**
```typescript
import { dataEngine } from './services/data-engine/src';

// Start the data engine
await dataEngine.start();

// Register a data source
await dataEngine.registerDataSource({
  id: 'salesforce-prod',
  name: 'Salesforce Production',
  type: 'saas',
  connector: 'salesforce',
  config: { apiKey: 'xxx', instance: 'prod' },
  status: 'connected',
});

// Ingest data
const records = await dataEngine.ingestData('salesforce-prod', rawData);

// Query unified data
const contacts = await dataEngine.query({
  entityType: 'contact',
  minQuality: 0.8,
});

// Get quality metrics
const metrics = dataEngine.getQualityMetrics();
console.log(`Average quality: ${metrics.averageQuality}`);
```

**Key Features:**
- Automatic schema detection and entity linking
- Real-time data quality assessment
- Data lineage tracking
- Multi-source unification

---

### 2. Model Orchestrator
**Location:** `/services/model-orchestrator/`

**Purpose:** Intelligent routing across multiple AI models with cost and performance optimization

**Key Classes:**
- `ModelOrchestrator` - Main routing engine
- `ModelConfig` - Model specifications
- `RoutingDecision` - Explains model selection
- `InferenceResponse` - Inference results with metadata

**Example Usage:**
```typescript
import { modelOrchestrator } from './services/model-orchestrator/src';

// Start the orchestrator
await modelOrchestrator.start();

// Register a custom model
modelOrchestrator.registerModel({
  id: 'custom-model',
  name: 'Custom Fine-tuned Model',
  provider: 'custom',
  modelId: 'ft-model-v1',
  capabilities: ['text-generation', 'classification'],
  costPer1kTokens: 0.001,
  maxTokens: 4096,
  avgLatency: 500,
  accuracy: 0.94,
  contextWindow: 8192,
  supportsStreaming: true,
  supportsFineTuning: true,
});

// Make an inference with automatic routing
const result = await modelOrchestrator.infer({
  taskType: 'question-answering',
  prompt: 'What is the total revenue for Q4?',
  context: { data: salesData },
  constraints: {
    maxCost: 0.01,
    maxLatency: 2000,
    minAccuracy: 0.90,
  },
});

console.log(`Model used: ${result.modelUsed}`);
console.log(`Response: ${result.response}`);
console.log(`Cost: $${result.metadata.cost}`);

// Get statistics
const stats = modelOrchestrator.getStats();
console.log(`Total requests: ${stats.totalRequests}`);
console.log(`Total cost: $${stats.totalCost}`);
console.log(`Average latency: ${stats.avgLatency}ms`);

// Compare models for a task
const comparison = modelOrchestrator.compareModels(
  'code-generation',
  'Write a function to sort an array'
);
comparison.forEach(c => {
  console.log(`${c.model.name}: Score ${c.score}, Cost $${c.estimatedCost}`);
});
```

**Key Features:**
- Multi-provider support (OpenAI, Anthropic, Google, Meta, Mistral)
- Intelligent routing based on task requirements and constraints
- Cost and performance tracking
- Model comparison and benchmarking

---

### 3. Agentic Workspace
**Location:** `/services/agentic-workspace/`

**Purpose:** Deploy domain-specific AI agents that learn from user interactions

**Key Classes:**
- `AgenticWorkspace` - Main agent manager
- `Agent` - Individual AI agent
- `AgentMemory` - Short-term and long-term memory
- `Tool` - Actions agents can perform
- `Feedback` - User feedback for learning

**Example Usage:**
```typescript
import { agenticWorkspace } from './services/agentic-workspace/src';

// Start the workspace
await agenticWorkspace.start();

// Create a custom agent
const agent = agenticWorkspace.createAgent({
  name: 'Sales Analyst',
  role: 'data-analyst',
  description: 'Analyzes sales data and provides insights',
  capabilities: ['query-data', 'analyze-trends', 'generate-reports'],
  tools: [
    {
      name: 'query_sales_data',
      description: 'Query the sales database',
      parameters: { query: 'string', timeRange: 'string' },
      execute: async (params) => {
        // Execute query logic
        return { results: [], count: 0 };
      },
    },
  ],
});

// Chat with the agent
const response = await agenticWorkspace.chat(
  agent.id,
  'What were our top 5 products last month?',
  { userId: 'user123', department: 'sales' }
);

console.log(response);

// Assign a task
const task = await agenticWorkspace.assignTask(
  agent.id,
  'Generate a comprehensive Q4 sales report with charts'
);

// Check task status
const taskStatus = agenticWorkspace.getTask(task.id);
console.log(`Status: ${taskStatus?.status}`);

// Submit feedback (for RLHF)
agenticWorkspace.submitFeedback(task.id, 5, 'Excellent analysis!');

// Get agent performance metrics
const metrics = agenticWorkspace.getAgentMetrics(agent.id);
console.log(`Success rate: ${metrics.successRate * 100}%`);
console.log(`Average rating: ${metrics.averageRating}/5`);
```

**Key Features:**
- Pre-built agents (Data Analyst, Workflow Automation, Integration Specialist)
- Custom agent creation
- Tool calling framework
- Short-term and long-term memory
- Continuous learning from feedback (RLHF)
- Multi-agent orchestration

---

### 4. Evaluation Layer (SEAL)
**Location:** `/services/evaluation-layer/`

**Purpose:** Ensure AI safety, accuracy, and alignment through continuous evaluation

**Key Classes:**
- `EvaluationLayer` - Main evaluation engine
- `EvaluationMetric` - Custom metrics
- `SafetyCheck` - Safety validators
- `BiasDetector` - Bias detection
- `BenchmarkResult` - Testing results

**Example Usage:**
```typescript
import { evaluationLayer } from './services/evaluation-layer/src';

// Start the evaluation layer
await evaluationLayer.start();

// Register a custom metric
evaluationLayer.registerMetric({
  id: 'domain-accuracy',
  name: 'Domain Accuracy',
  type: 'accuracy',
  description: 'Measures accuracy for domain-specific queries',
  threshold: 0.92,
  weight: 1.5,
  calculate: async (input, output, groundTruth) => {
    // Custom calculation logic
    return 0.95;
  },
});

// Evaluate an AI response
const evaluation = await evaluationLayer.evaluate(
  'req_123',
  'What is our EBITDA?',
  'Your EBITDA for Q4 2024 is $5.2M, up 12% from Q3.',
  'EBITDA Q4 2024: $5.2M'
);

console.log(`Overall score: ${evaluation.overallScore}`);
console.log(`Passed: ${evaluation.passed}`);
if (!evaluation.passed) {
  console.log('Issues:', evaluation.issues);
  console.log('Recommendations:', evaluation.recommendations);
}

// Check safety
const safetyResult = await evaluationLayer.checkSafety(
  'Here is sensitive data: SSN 123-45-6789'
);
console.log(`Safe: ${safetyResult.safe}`);
if (!safetyResult.safe) {
  console.log('Violations:', safetyResult.violations);
}

// Detect bias
const biasResult = await evaluationLayer.detectBias(
  'The doctor said he would be here soon'
);
console.log(`Biased: ${biasResult.biased}`);
if (biasResult.biased) {
  console.log('Detections:', biasResult.detections);
}

// Run a benchmark
evaluationLayer.addTestCase({
  id: 'test_001',
  category: 'financial-qa',
  input: 'What is the revenue growth rate?',
  expectedOutput: 'Revenue grew 15% YoY',
  constraints: { maxLatency: 2000 },
});

const benchmark = await evaluationLayer.runBenchmark(
  'financial-suite-v1',
  'gpt-4-turbo',
  ['test_001', 'test_002', 'test_003'],
  async (input) => {
    // Your inference function
    return await modelOrchestrator.infer({
      taskType: 'question-answering',
      prompt: input,
    }).then(r => r.response);
  }
);

console.log(`Pass rate: ${benchmark.passRate * 100}%`);
console.log(`Overall score: ${benchmark.overallScore}`);

// Get evaluation statistics
const stats = evaluationLayer.getStats();
console.log(`Total evaluations: ${stats.totalEvaluations}`);
console.log(`Pass rate: ${stats.passRate * 100}%`);
console.log(`Average score: ${stats.averageScore}`);
```

**Key Features:**
- Pre-built metrics (Safety, Accuracy, Bias, Relevance, Hallucination)
- Custom metric registration
- Safety checks (harmful content, PII, jailbreaks)
- Bias detection (gender, racial, cultural)
- Benchmark testing framework
- Real-time monitoring and alerting

---

## Integration Pattern

### Full Stack Flow

Here's how all four pillars work together:

```typescript
// 1. DATA ENGINE: Ingest and unify data
import { dataEngine } from './services/data-engine/src';
await dataEngine.start();

await dataEngine.registerDataSource({
  id: 'crm',
  name: 'CRM System',
  type: 'saas',
  connector: 'salesforce',
  config: { /* ... */ },
  status: 'connected',
});

const customerData = await dataEngine.ingestData('crm', rawCustomerData);

// 2. AGENTIC WORKSPACE: Agent processes user query
import { agenticWorkspace } from './services/agentic-workspace/src';
await agenticWorkspace.start();

const agent = agenticWorkspace.listAgents('data-analyst')[0];
const userQuery = 'Analyze customer churn patterns';

// 3. MODEL ORCHESTRATOR: Route to optimal model
import { modelOrchestrator } from './services/model-orchestrator/src';
await modelOrchestrator.start();

const inference = await modelOrchestrator.infer({
  taskType: 'analysis',
  prompt: `${userQuery}\n\nData: ${JSON.stringify(customerData)}`,
  constraints: {
    maxLatency: 3000,
    minAccuracy: 0.90,
  },
});

// 4. EVALUATION LAYER: Validate response
import { evaluationLayer } from './services/evaluation-layer/src';
await evaluationLayer.start();

const evaluation = await evaluationLayer.evaluate(
  inference.requestId,
  userQuery,
  inference.response
);

// 5. Return result to user (only if evaluation passes)
if (evaluation.passed) {
  return {
    response: inference.response,
    metadata: {
      modelUsed: inference.modelUsed,
      cost: inference.metadata.cost,
      evaluationScore: evaluation.overallScore,
    },
  };
} else {
  // Log failure and retry with different model/approach
  console.error('Evaluation failed:', evaluation.issues);
  return {
    error: 'Response did not meet quality standards',
    issues: evaluation.issues,
    recommendations: evaluation.recommendations,
  };
}
```

---

## API Server Integration

Create a unified API server that exposes all four pillars:

```typescript
// services/api-server/src/index.ts
import Fastify from 'fastify';
import { dataEngine } from '../data-engine/src';
import { modelOrchestrator } from '../model-orchestrator/src';
import { agenticWorkspace } from '../agentic-workspace/src';
import { evaluationLayer } from '../evaluation-layer/src';

const server = Fastify();

// Initialize all services
async function initialize() {
  await dataEngine.start();
  await modelOrchestrator.start();
  await agenticWorkspace.start();
  await evaluationLayer.start();
}

// Unified endpoint for AI queries
server.post('/api/v1/query', async (request, reply) => {
  const { query, agentRole, context } = request.body as any;

  // Get appropriate agent
  const agents = agenticWorkspace.listAgents(agentRole || 'general-assistant');
  const agent = agents[0];

  // Process query through agent
  const response = await agenticWorkspace.chat(agent.id, query, context);

  // Evaluate response
  const evaluation = await evaluationLayer.evaluate(
    `req_${Date.now()}`,
    query,
    response
  );

  return {
    response,
    evaluation: {
      passed: evaluation.passed,
      score: evaluation.overallScore,
      metrics: evaluation.metrics,
    },
  };
});

// Data ingestion endpoint
server.post('/api/v1/data/ingest', async (request, reply) => {
  const { sourceId, data } = request.body as any;
  const records = await dataEngine.ingestData(sourceId, data);

  return {
    ingested: records.length,
    quality: dataEngine.getQualityMetrics(),
  };
});

// Model comparison endpoint
server.post('/api/v1/models/compare', async (request, reply) => {
  const { taskType, prompt } = request.body as any;
  const comparison = modelOrchestrator.compareModels(taskType, prompt);

  return { models: comparison };
});

// Agent task assignment
server.post('/api/v1/agents/tasks', async (request, reply) => {
  const { agentId, description } = request.body as any;
  const task = await agenticWorkspace.assignTask(agentId, description);

  return task;
});

// Evaluation endpoint
server.post('/api/v1/evaluate', async (request, reply) => {
  const { input, output, groundTruth } = request.body as any;

  const evaluation = await evaluationLayer.evaluate(
    `eval_${Date.now()}`,
    input,
    output,
    groundTruth
  );

  return evaluation;
});

// Start server
async function start() {
  await initialize();
  await server.listen({ port: 8080, host: '0.0.0.0' });
  console.log('UnifiedAI API Server running on port 8080');
}

start();
```

---

## Environment Setup

### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Data Engine
cd services/data-engine
npm install

# Model Orchestrator
cd ../model-orchestrator
npm install

# Agentic Workspace
cd ../agentic-workspace
npm install

# Evaluation Layer
cd ../evaluation-layer
npm install
```

### 2. Environment Variables

Create `.env` file:

```env
# Model API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/unifiedai
REDIS_URL=redis://localhost:6379

# Vector Database
MILVUS_URL=http://localhost:19530

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# Object Storage
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# API Server
API_PORT=8080
API_HOST=0.0.0.0

# Logging
LOG_LEVEL=info
```

### 3. Run Services

Development mode:
```bash
# Terminal 1: Data Engine
cd services/data-engine && npm run dev

# Terminal 2: Model Orchestrator
cd services/model-orchestrator && npm run dev

# Terminal 3: Agentic Workspace
cd services/agentic-workspace && npm run dev

# Terminal 4: Evaluation Layer
cd services/evaluation-layer && npm run dev

# Terminal 5: API Server
cd services/api-server && npm run dev

# Terminal 6: Frontend
npm run dev
```

Production mode:
```bash
# Build all services
npm run build

# Start with PM2
pm2 start ecosystem.config.js
```

---

## Testing

### Unit Tests

```bash
# Test individual pillars
cd services/data-engine && npm test
cd services/model-orchestrator && npm test
cd services/agentic-workspace && npm test
cd services/evaluation-layer && npm test
```

### Integration Tests

```bash
# Run full integration test suite
npm run test:integration
```

### Load Tests

```bash
# Run load tests
npm run test:load
```

---

## Monitoring

### Metrics to Track

1. **Data Engine:**
   - Records ingested/second
   - Data quality scores
   - Connector health
   - Storage usage

2. **Model Orchestrator:**
   - Requests/second
   - Average latency
   - Total cost
   - Model usage distribution

3. **Agentic Workspace:**
   - Active agents
   - Task completion rate
   - Average feedback rating
   - Tool execution success rate

4. **Evaluation Layer:**
   - Evaluation pass rate
   - Safety violation rate
   - Bias detection rate
   - Average scores per metric

### Dashboards

Use Grafana to visualize:
- Real-time throughput
- Cost tracking
- Quality metrics
- Error rates
- System health

---

## Deployment

### Docker Compose

```yaml
version: '3.8'

services:
  data-engine:
    build: ./services/data-engine
    environment:
      - DATABASE_URL=${DATABASE_URL}
    ports:
      - "8081:8081"

  model-orchestrator:
    build: ./services/model-orchestrator
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    ports:
      - "8082:8082"

  agentic-workspace:
    build: ./services/agentic-workspace
    ports:
      - "8083:8083"

  evaluation-layer:
    build: ./services/evaluation-layer
    ports:
      - "8084:8084"

  api-server:
    build: ./services/api-server
    ports:
      - "8080:8080"
    depends_on:
      - data-engine
      - model-orchestrator
      - agentic-workspace
      - evaluation-layer
```

### Kubernetes

See `/k8s/` directory for Kubernetes manifests.

---

## Best Practices

1. **Always evaluate responses** before returning to users
2. **Track costs** for each model inference
3. **Log data lineage** for compliance
4. **Use appropriate models** based on task complexity
5. **Collect user feedback** for continuous learning
6. **Monitor quality metrics** continuously
7. **Implement rate limiting** to prevent abuse
8. **Use caching** for common queries
9. **Implement retry logic** with exponential backoff
10. **Keep security top of mind** (encryption, auth, audit logs)

---

## Troubleshooting

### Common Issues

**Issue:** Data Engine not connecting to source
- Check connector configuration
- Verify API keys and credentials
- Test network connectivity

**Issue:** Model Orchestrator high latency
- Check model selection constraints
- Consider using faster models
- Implement caching for common queries

**Issue:** Agent tasks failing
- Review agent tool implementations
- Check agent permissions
- Verify context is being passed correctly

**Issue:** Evaluations failing
- Review metric thresholds
- Check ground truth quality
- Adjust metric weights

---

## Support

For issues, questions, or contributions:
- GitHub Issues: [github.com/unifiedai/platform/issues](https://github.com/unifiedai/platform/issues)
- Documentation: [docs.unifiedai.com](https://docs.unifiedai.com)
- Email: support@unifiedai.com

---

**Last Updated:** 2025-10-24
**Version:** 1.0.0
