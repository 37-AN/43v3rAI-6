# UnifiedAI Services

This directory contains the four core pillars of the UnifiedAI platform, plus the integration layer.

## Architecture

```
services/
├── data-engine/           # Pillar 1: Unified Data Engine
├── model-orchestrator/    # Pillar 2: Model Orchestrator
├── agentic-workspace/     # Pillar 3: Agentic Workspace
├── evaluation-layer/      # Pillar 4: Evaluation Layer (SEAL)
├── unified-platform/      # Integration Layer
└── backend/              # Legacy API server (to be migrated)
```

## Quick Start

### Install All Services

```bash
# From the services directory
for dir in data-engine model-orchestrator agentic-workspace evaluation-layer unified-platform; do
  cd $dir && npm install && cd ..
done
```

### Start Individual Services

```bash
# Data Engine
cd data-engine && npm run dev

# Model Orchestrator
cd model-orchestrator && npm run dev

# Agentic Workspace
cd agentic-workspace && npm run dev

# Evaluation Layer
cd evaluation-layer && npm run dev

# Unified Platform (runs all)
cd unified-platform && npm run dev
```

### Using the Unified Platform

```typescript
import { unifiedPlatform } from './unified-platform/src';

// Initialize the platform
await unifiedPlatform.initialize();

// Make a query
const response = await unifiedPlatform.query({
  query: 'What were our sales last quarter?',
  agentRole: 'data-analyst',
  options: {
    maxCost: 0.05,
    maxLatency: 3000,
  },
});

console.log(response.response);
console.log('Cost:', response.metadata.cost);
console.log('Evaluation score:', response.metadata.evaluation?.score);
```

## Service Details

### 1. Data Engine
**Port:** 8081 (when run standalone)
**Purpose:** Multi-source data ingestion, cleaning, and unification

**Key Features:**
- Universal connectors (CSV, APIs, databases, SaaS)
- Auto-schema detection
- Data quality scoring
- Entity linking
- Lineage tracking

### 2. Model Orchestrator
**Port:** 8082 (when run standalone)
**Purpose:** Intelligent routing across AI models

**Key Features:**
- Multi-provider support (OpenAI, Anthropic, Google, Meta, Mistral)
- Cost-aware routing
- Performance tracking
- Model comparison
- A/B testing

### 3. Agentic Workspace
**Port:** 8083 (when run standalone)
**Purpose:** Adaptive AI agents with tool calling

**Key Features:**
- Pre-built agents (Data Analyst, Workflow Automation, etc.)
- Custom agent creation
- Short-term and long-term memory
- Tool framework
- Feedback-based learning (RLHF)

### 4. Evaluation Layer
**Port:** 8084 (when run standalone)
**Purpose:** AI safety, accuracy, and alignment

**Key Features:**
- Safety checks (harmful content, PII, jailbreaks)
- Accuracy validation
- Bias detection
- Custom metrics
- Benchmark testing

### 5. Unified Platform
**Port:** 8080 (default)
**Purpose:** Integration layer for all four pillars

**Key Features:**
- Single API for all services
- End-to-end query processing
- Automatic evaluation
- Health monitoring
- Comprehensive statistics

## Development

### Running Tests

```bash
# Test individual services
cd data-engine && npm test
cd model-orchestrator && npm test
cd agentic-workspace && npm test
cd evaluation-layer && npm test

# Test integration
cd unified-platform && npm test
```

### Building for Production

```bash
# Build all services
for dir in data-engine model-orchestrator agentic-workspace evaluation-layer unified-platform; do
  cd $dir && npm run build && cd ..
done
```

## API Examples

### Query with Data Context

```typescript
// Ingest data first
await unifiedPlatform.registerDataSource({
  id: 'salesforce',
  name: 'Salesforce CRM',
  type: 'saas',
  connector: 'salesforce',
  config: { apiKey: process.env.SF_API_KEY },
  status: 'connected',
});

await unifiedPlatform.ingestData('salesforce', salesData);

// Query with context
const response = await unifiedPlatform.query({
  query: 'Show me high-value leads from last month',
  agentRole: 'data-analyst',
  context: { dataSource: 'salesforce' },
});
```

### Create Custom Agent

```typescript
const customAgent = unifiedPlatform.createAgent({
  name: 'Compliance Monitor',
  role: 'compliance-monitor',
  description: 'Monitors data usage for GDPR compliance',
  capabilities: ['audit-logs', 'policy-enforcement'],
  tools: [
    {
      name: 'check_compliance',
      description: 'Check if data usage is compliant',
      parameters: { dataId: 'string', regulation: 'string' },
      execute: async (params) => {
        // Check compliance logic
        return { compliant: true, details: '...' };
      },
    },
  ],
});
```

### Run Evaluation

```typescript
const evaluation = await unifiedPlatform.evaluationLayer.evaluate(
  'request_123',
  'What is our EBITDA?',
  'Your EBITDA is $5.2M',
  'EBITDA: $5.2M'
);

if (!evaluation.passed) {
  console.log('Quality issues detected:', evaluation.issues);
  console.log('Recommendations:', evaluation.recommendations);
}
```

## Environment Variables

Create a `.env` file in each service directory:

```env
# Model API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...

# Database
DATABASE_URL=postgresql://localhost:5432/unifiedai
REDIS_URL=redis://localhost:6379

# Service Ports
DATA_ENGINE_PORT=8081
MODEL_ORCHESTRATOR_PORT=8082
AGENTIC_WORKSPACE_PORT=8083
EVALUATION_LAYER_PORT=8084
UNIFIED_PLATFORM_PORT=8080

# Logging
LOG_LEVEL=info
NODE_ENV=development
```

## Monitoring

Each service emits events that can be monitored:

```typescript
unifiedPlatform.on('query:completed', (response) => {
  console.log('Query completed:', response.metadata);
});

unifiedPlatform.on('evaluation:failed', (data) => {
  console.log('Evaluation failed:', data.evaluation);
});

unifiedPlatform.on('data:ingested', (data) => {
  console.log('Data ingested:', data.recordsIngested);
});
```

## Documentation

- [Architecture Overview](../ARCHITECTURE.md)
- [Implementation Guide](../docs/IMPLEMENTATION_GUIDE.md)
- [Scale AI Comparison](../docs/SCALE_AI_COMPARISON.md)

## Support

For issues or questions, contact the development team or open an issue on GitHub.
