# Claude.md - Claude Code CLI Configuration

This project is configured for use with Claude Code CLI.

## Project Overview

**UnifiedAI** is a universal AI data integration platform that connects, understands, and optimizes all organizational data sources into one intelligent ecosystem.

## Architecture

The project follows a four-pillar architecture inspired by Scale AI:

1. **Unified Data Engine** - Multi-source data ingestion and ETL
2. **Model Orchestrator** - Intelligent AI model routing and optimization
3. **Agentic Workspace** - Adaptive AI agents that learn from interactions
4. **Evaluation Layer (SEAL)** - Safety, accuracy, and alignment validation

## Project Structure

```
43v3rAI-6/
├── components/           # React UI components
├── services/            # Backend microservices
│   ├── data-engine/    # Pillar 1: Data ingestion
│   ├── model-orchestrator/  # Pillar 2: AI routing
│   ├── agentic-workspace/   # Pillar 3: AI agents
│   ├── evaluation-layer/    # Pillar 4: Quality validation
│   ├── unified-platform/    # Integration layer
│   └── backend/        # Legacy API server
├── infrastructure/      # IaC and deployment
├── docs/               # Documentation
└── README.md
```

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, TypeScript, Fastify
- **Database:** PostgreSQL, Redis, Elasticsearch, Milvus
- **AI/ML:** OpenAI, Anthropic, Google Gemini, LangChain
- **Infrastructure:** Docker, Kubernetes, Terraform

## Development Workflow

### Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### With Full Stack (Docker)

```bash
# Start all services
cd infrastructure/docker
docker-compose up -d

# Run migrations
npm run db:migrate

# Start development
npm run dev
```

## Common Tasks

### Adding a New Connector

1. Create connector in `/services/data-engine/src/connectors/`
2. Extend `BaseConnector` class
3. Implement required methods: `test()`, `fetch()`, `disconnect()`
4. Register in `ConnectorRegistry.ts`
5. Add tests in `/services/data-engine/tests/`

### Adding a New AI Agent

1. Create agent in `/services/agentic-workspace/src/agents/`
2. Define agent role and capabilities
3. Implement tools for the agent
4. Register in `AgenticWorkspace`
5. Add to frontend UI

### Modifying Database Schema

1. Create migration in `/infrastructure/database/schemas/`
2. Use sequential numbering: `002_add_feature.sql`
3. Test locally with Docker
4. Update TypeScript types if needed
5. Run migration script

## Code Style Guidelines

### TypeScript

- Use strict mode
- Prefer interfaces over types for object shapes
- Use async/await over promises
- Add JSDoc comments for public APIs
- Export types alongside implementations

### React

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for props
- Follow naming: PascalCase for components, camelCase for functions
- Extract business logic to custom hooks

### File Naming

- Components: `ComponentName.tsx`
- Utilities: `utilityName.ts`
- Tests: `ComponentName.test.tsx`
- Types: `types.ts` or `ComponentName.types.ts`

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- ComponentName.test.tsx

# Generate coverage report
npm run test:coverage
```

## Documentation

- **Architecture:** `/docs/ARCHITECTURE.md`
- **Technical Specs:** `/docs/TECHNICAL_ARCHITECTURE.md`
- **Implementation Guide:** `/docs/IMPLEMENTATION_GUIDE.md`
- **MVP Roadmap:** `/docs/MVP_ROADMAP.md`
- **Deployment:** `/docs/FREE_DEPLOYMENT_GUIDE.md`

## MCP Servers Configured

This project uses the following MCP (Model Context Protocol) servers:

1. **Memory MCP** - Persistent conversation memory
2. **Filesystem MCP** - File system operations
3. **Git MCP** - Git operations and history
4. **PostgreSQL MCP** - Database queries and management
5. **Web Search MCP** - Web search capabilities

See `.claude/mcp_config.json` for configuration.

## Environment Variables

Required variables are documented in `.env.example`. Key ones:

- `GEMINI_API_KEY` - Google Gemini API key
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `DATABASE_URL` - PostgreSQL connection string
- `VITE_BACKEND_URL` - Backend API URL

## Deployment

The project supports multiple deployment options:

1. **Free Hosting** - Vercel + Railway + Supabase (see `docs/QUICK_DEPLOY.md`)
2. **AWS** - Full stack on AWS (see `infrastructure/terraform/`)
3. **Local Docker** - All services in containers (see `infrastructure/docker/`)

Quick deploy to free hosting:
```bash
bash deploy.sh
```

## Key Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run preview            # Preview production build

# Backend
cd services/backend && npm run dev    # Start backend
cd services/unified-platform && npm run dev  # Start platform

# Infrastructure
cd infrastructure/docker && docker-compose up -d  # Start all services
docker-compose down        # Stop all services
docker-compose logs -f     # View logs

# Database
npm run db:migrate         # Run migrations
npm run db:seed           # Seed database
npm run db:reset          # Reset database

# Deployment
bash deploy.sh            # Deploy to free hosting
terraform apply           # Deploy to AWS
kubectl apply -f k8s/     # Deploy to Kubernetes
```

## Troubleshooting

### Common Issues

**Issue: Port already in use**
```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 <PID>
```

**Issue: Database connection failed**
```bash
# Check Docker containers
docker-compose ps
# Restart database
docker-compose restart postgres
```

**Issue: Type errors after pulling changes**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Run linter: `npm run lint`
4. Run tests: `npm test`
5. Commit with conventional commits: `feat:`, `fix:`, `docs:`, etc.
6. Push and create PR

## Support

- **Issues:** Open GitHub issue
- **Documentation:** Check `/docs` directory
- **Questions:** Add to project discussions

## Claude Code Tips

When working with this project using Claude Code:

1. **Ask for architecture context** - "Explain the four-pillar architecture"
2. **Request specific implementations** - "Add a Slack connector"
3. **Get code reviews** - "Review this component for best practices"
4. **Generate tests** - "Create tests for GoogleDriveConnector"
5. **Debug issues** - "Why is the database connection failing?"

Claude Code has access to:
- Full codebase via filesystem MCP
- Git history via git MCP
- Database schema via PostgreSQL MCP
- Conversation memory via memory MCP
- Web search for documentation

## Project Goals

**Phase 1 (Current):** MVP with 4 connectors, basic AI chat, pilot customers
**Phase 2 (3-6mo):** Knowledge graph, predictive analytics, 10+ connectors
**Phase 3 (6-12mo):** Workflow automation, marketplace, 100+ customers
**Phase 4 (12-18mo):** Enterprise features, global deployment, SOC 2

## License

MIT License - see LICENSE file for details

---

**Last Updated:** 2025-10-25
**Claude Code Compatible:** Yes ✓
**MCP Servers:** Configured ✓
