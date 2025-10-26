# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**UnifiedAI** is an AI-driven data integration platform that connects, understands, and optimizes organizational data sources into one intelligent ecosystem. The architecture is inspired by Scale AI's proven four-pillar approach.

## Architecture

The project implements four core pillars:

1. **Unified Data Engine** (`services/data-engine`) - Multi-source data ingestion, ETL, quality scoring, and lineage tracking
2. **Model Orchestrator** (`services/model-orchestrator`) - Intelligent AI model routing with cost optimization
3. **Agentic Workspace** (`services/agentic-workspace`) - Domain-specific AI agents with tool calling
4. **Evaluation Layer** (`services/evaluation-layer`) - Safety, accuracy, and alignment validation (SEAL)

The **Unified Platform** (`services/unified-platform`) integrates all four pillars into a single API.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Recharts
- **Backend**: Node.js with TypeScript, Fastify
- **AI**: Google Gemini (primary), OpenAI, Anthropic Claude support planned
- **Infrastructure**: Docker Compose, Kubernetes, Terraform, Apache Airflow
- **Data Layer**: PostgreSQL, Redis, Elasticsearch, Milvus (vector DB), MinIO (S3)

## Project Structure

```
43v3rAI-6/
├── components/              # React UI components
├── services/
│   ├── data-engine/        # Pillar 1: DataEngine class with quality scoring
│   ├── model-orchestrator/ # Pillar 2: Model routing and optimization
│   ├── agentic-workspace/  # Pillar 3: AI agents with memory
│   ├── evaluation-layer/   # Pillar 4: SEAL evaluation framework
│   ├── unified-platform/   # Integration layer (depends on all pillars)
│   ├── backend/           # Legacy API server
│   └── geminiService.ts   # Gemini AI integration
├── infrastructure/
│   ├── docker/            # Docker Compose setup
│   ├── database/          # Database schemas and migrations
│   ├── terraform/         # IaC for cloud deployment
│   └── monitoring/        # Prometheus/Grafana configs
├── docs/                  # Comprehensive documentation
├── App.tsx               # Main React app with routing
├── vite.config.ts        # Vite configuration
└── package.json          # Root package (npm workspaces)
```

## Development Commands

### Frontend

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint TypeScript/React code
npm run lint
```

### Backend Services

```bash
# Start backend API server
npm run dev:backend
# OR
cd services/backend && npm run dev

# Start unified platform (all four pillars)
npm run dev:platform
# OR
cd services/unified-platform && npm run dev

# Start both frontend and backend
npm run dev:all
```

### Individual Services

Each service in `services/` has the same script commands:

```bash
cd services/data-engine && npm run dev
cd services/model-orchestrator && npm run dev
cd services/agentic-workspace && npm run dev
cd services/evaluation-layer && npm run dev
```

### Infrastructure

```bash
# Start all infrastructure services (PostgreSQL, Redis, Elasticsearch, etc.)
npm run docker:up
# OR
cd infrastructure/docker && docker-compose up -d

# Stop all services
npm run docker:down

# View logs
npm run docker:logs

# Database operations
npm run db:migrate    # Run migrations
npm run db:seed      # Seed with test data
npm run db:reset     # Reset database (down, up, migrate)
```

### Setup

```bash
# Initial setup
npm run setup
# OR
bash setup.sh

# Deploy to free hosting (Vercel + Railway + Supabase)
bash deploy.sh
```

## Key Implementation Details

### Frontend Architecture

- **App.tsx**: Main component with view routing (dashboard, workflows, architecture, settings)
- **State Management**: React hooks (useState, useEffect, useCallback)
- **AI Chat**: `sendChatMessage()` from `services/geminiService.ts`
- **Data Flow**: KPIs → Charts → AI Insights (passed to Gemini as context)
- **Styling**: Tailwind CSS with custom brand colors (`brand-primary`, `brand-secondary`, `brand-cyan`)

### Backend Services Architecture

All services extend `EventEmitter` and follow a common pattern:

- `start()` / `stop()` lifecycle methods
- Event emission for monitoring (`source:registered`, `data:ingested`, etc.)
- TypeScript interfaces for type safety
- In-memory stores (Map objects) for MVP, database integration planned

**Data Engine** (`services/data-engine/src/index.ts`):
- `DataEngine` class with `registerDataSource()`, `ingestData()`, `transformData()`
- Automatic quality scoring (completeness, accuracy, consistency)
- Data lineage tracking
- Schema mapping and transformation

**Unified Platform**:
- Depends on all four pillar packages via npm workspaces
- Single entry point for queries: `unifiedPlatform.query()`
- Automatic evaluation of responses

### Environment Variables

Required in `.env.local`:

```env
GEMINI_API_KEY=your_key_here          # Primary AI model
VITE_BACKEND_URL=http://localhost:8000
DATABASE_URL=postgresql://localhost:5432/unifiedai
REDIS_URL=redis://localhost:6379
```

Optional:
```env
OPENAI_API_KEY=sk-...                 # For Model Orchestrator
ANTHROPIC_API_KEY=sk-ant-...          # For Model Orchestrator
```

### Vite Configuration

- Dev server on port 3000
- Environment variable injection via `define`
- Path alias: `@/*` maps to root directory
- React plugin with fast refresh

### TypeScript Configuration

- Target: ES2022
- Module: ESNext with bundler resolution
- JSX: react-jsx
- Strict mode enabled with `experimentalDecorators`
- Path mapping: `@/*` → `./*`

## Common Development Tasks

### Adding a New Data Connector

1. Create connector in `services/data-engine/src/connectors/YourConnector.ts`
2. Extend `BaseConnector` interface (define `test()`, `fetch()`, `disconnect()`)
3. Implement data transformation to match `DataRecord` interface
4. Register in `ConnectorRegistry.ts`
5. Add UI component in `components/ConnectorStatus.tsx`

### Adding a New AI Agent

1. Create agent in `services/agentic-workspace/src/agents/YourAgent.ts`
2. Define role, capabilities, and tools
3. Implement memory system (short-term/long-term)
4. Register in `AgenticWorkspace` class
5. Add to frontend in `components/AiInsight.tsx`

### Modifying Database Schema

1. Create migration in `infrastructure/database/schemas/00X_description.sql`
2. Use sequential numbering (001, 002, 003...)
3. Test locally: `npm run docker:up && npm run db:migrate`
4. Update TypeScript interfaces to match schema

### Adding a New View to UI

1. Create component in `components/YourView.tsx`
2. Add view to `ActiveView` type in `types.ts`
3. Add sidebar item in `components/Sidebar.tsx`
4. Add case to `renderActiveView()` switch in `App.tsx`

## Code Patterns

### TypeScript Conventions

- Interfaces for data shapes (prefer over `type`)
- Async/await for asynchronous operations
- EventEmitter pattern for inter-service communication
- Singleton exports for services: `export const dataEngine = new DataEngine()`

### React Conventions

- Functional components with hooks
- PascalCase for components: `YourComponent.tsx`
- camelCase for utilities: `yourUtility.ts`
- Props interfaces: `interface YourComponentProps { ... }`
- Custom hooks for business logic

### File Naming

- Components: `ComponentName.tsx`
- Services: `serviceName.ts`
- Types: `types.ts` or inline
- Tests: `ComponentName.test.tsx` (not yet implemented)

## Deployment Options

### 1. Free Hosting (Recommended for MVP)

```bash
bash deploy.sh
```

Stack:
- **Frontend**: Vercel (unlimited bandwidth)
- **Backend**: Railway ($5/month free credit)
- **Database**: Supabase (500MB PostgreSQL)

See: `docs/QUICK_DEPLOY.md`, `docs/FREE_DEPLOYMENT_GUIDE.md`

### 2. Local Docker

```bash
cd infrastructure/docker
docker-compose up -d
```

Includes: PostgreSQL, Redis, Elasticsearch, Milvus, MinIO, Grafana, Airflow

### 3. AWS/Kubernetes

```bash
cd infrastructure/terraform
terraform init
terraform apply
```

See: `infrastructure/terraform/` for IaC configs

## Important Notes

### Current Implementation Status

- ✅ Frontend UI with dashboard, charts, AI chat
- ✅ Gemini AI integration
- ✅ Data Engine core implementation
- ✅ Four-pillar architecture defined
- 🔄 Model Orchestrator (in progress)
- 🔄 Agentic Workspace (in progress)
- 🔄 Evaluation Layer (in progress)
- 🔄 Full integration testing
- ❌ Tests (not yet implemented)

### Known Limitations

- No test suite yet (`npm test` returns placeholder message)
- Services use in-memory storage (Map objects) instead of databases
- Only Gemini AI is fully integrated (OpenAI/Anthropic planned)
- Docker infrastructure defined but not all services connected
- Database schemas defined but migrations not hooked up to services

### Workspace Configuration

This is an npm workspaces monorepo:
- Root `package.json` defines `workspaces: ["services/*"]`
- Services can import each other: `import { dataEngine } from '@unifiedai/data-engine'`
- Run `npm install` at root to install all dependencies
- Individual service changes require rebuild/restart

## Documentation Resources

- **Architecture**: `ARCHITECTURE.md` - Complete system design
- **Implementation Guide**: `docs/IMPLEMENTATION_GUIDE.md` - API usage examples
- **MVP Roadmap**: `docs/MVP_ROADMAP.md` - Development phases
- **Phase 1 Plan**: `docs/PHASE1_PLAN.md` - Current phase details
- **Technical Architecture**: `docs/TECHNICAL_ARCHITECTURE.md` - Deep dive
- **Scale AI Comparison**: `docs/SCALE_AI_COMPARISON.md` - Inspiration source
- **Services README**: `services/README.md` - Backend services guide

## Debugging

### Check Service Health

```bash
# Check if Docker services are running
docker ps

# Check frontend
curl http://localhost:3000

# Check backend
curl http://localhost:8000/health

# Check unified platform
curl http://localhost:8080/health
```

### Common Issues

**Port already in use (Windows)**:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Environment variables not loading**:
- Ensure `.env.local` exists (copy from `.env.example`)
- Restart Vite dev server after changes
- Check `vite.config.ts` for correct variable mapping

**TypeScript errors after git pull**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Docker services not starting**:
```bash
cd infrastructure/docker
docker-compose down
docker-compose up -d
docker-compose logs -f
```

---

**Last Updated**: 2025-10-25
**Compatible with**: Claude Code CLI
**Node Version**: 18+
**Platform**: Windows/macOS/Linux
