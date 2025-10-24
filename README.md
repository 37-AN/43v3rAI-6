<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# UnifiedAI — The Universal AI Data Integration Platform

An AI-driven integration layer that seamlessly connects, understands, and optimizes all organizational data sources into one intelligent ecosystem.

**Inspired by Scale AI's proven architecture, adapted for enterprise data unification.**

## Vision

To create an AI-driven integration layer that seamlessly connects, understands, and optimizes all organizational data sources — from CRMs, ERPs, APIs, databases, spreadsheets, and SaaS tools — into one intelligent ecosystem.

View original AI Studio app: https://ai.studio/apps/drive/1cj7pldCnv2Ii0MWc5sPYnDxqa6xI68FY

---

## Four Core Pillars

### 1. Unified Data Engine
Multi-source ingestion, auto-ETL, and data unification with quality management.

### 2. Model Orchestrator
Fine-tunes or routes to best open models (Gemini, Llama, Claude, GPT-4) with cost optimization.

### 3. Agentic Workspace
Adaptive AI copilots across business tools that learn from user interactions.

### 4. Evaluation Layer (SEAL)
In-house SEAL-style testing for enterprise alignment, safety, and accuracy.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        UnifiedAI Platform                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  Unified Data    │  │     Model        │  │   Agentic     │ │
│  │     Engine       │─▶│  Orchestrator    │─▶│   Workspace   │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
│           │                     │                      │         │
│           └─────────────────────┴──────────────────────┘         │
│                                │                                 │
│                    ┌───────────▼───────────┐                    │
│                    │  Evaluation Layer     │                    │
│                    │  (SEAL)               │                    │
│                    └───────────────────────┘                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed documentation.

---

## 🚀 Quick Deploy to Free Hosting (5 Minutes)

Deploy UnifiedAI to the cloud for FREE:

```bash
bash deploy.sh
```

**Free hosting includes:**
- ✅ Vercel (Frontend) - Unlimited bandwidth
- ✅ Railway (Backend) - $5/month credit, no CC required
- ✅ Supabase (Database) - 500MB PostgreSQL

**Total Cost: $0/month**

📖 **[Full Deployment Guide](docs/QUICK_DEPLOY.md)** | 📚 **[Detailed Instructions](docs/FREE_DEPLOYMENT_GUIDE.md)**

---

## 💻 Run Locally

### Prerequisites

- Node.js 18+
- npm or yarn

### Option 1: Quick Start (Recommended)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# 3. Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Option 2: Full Stack with Docker

```bash
# Start all services (PostgreSQL, Redis, Elasticsearch, etc.)
cd infrastructure/docker
docker-compose up -d

# Access services:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000
# - Airflow: http://localhost:8080
# - Grafana: http://localhost:3001
```

### Option 3: Individual Services

**Frontend:**
```bash
npm install
npm run dev
```

**Backend:**
```bash
cd services/backend
npm install
npm run dev
```

**Unified Platform (All Four Pillars):**
```bash
cd services/unified-platform
npm install
npm run dev
```

---

## Project Structure

```
43v3rAI-6/
├── components/              # React UI components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── KpiCard.tsx
│   ├── Architecture.tsx
│   └── ...
├── services/
│   ├── data-engine/        # Pillar 1: Data ingestion & quality
│   ├── model-orchestrator/ # Pillar 2: AI model routing
│   ├── agentic-workspace/  # Pillar 3: AI agents
│   ├── evaluation-layer/   # Pillar 4: Safety & evaluation
│   ├── unified-platform/   # Integration layer
│   └── backend/           # Legacy API server
├── docs/
│   ├── IMPLEMENTATION_GUIDE.md
│   └── SCALE_AI_COMPARISON.md
├── ARCHITECTURE.md         # Complete architecture documentation
├── App.tsx                # Main application component
└── README.md              # This file
```

---

## Features

### Current Implementation

- Modern React dashboard with real-time KPIs
- AI-powered chat interface with Gemini
- Data source connector management
- Workflow automation definitions
- Architecture visualization
- Settings and user management UI

### New Architecture (v2.0)

- **Unified Data Engine:** Ingest from 1000+ sources
- **Model Orchestrator:** Route to optimal AI models
- **Agentic Workspace:** Pre-built AI agents (Data Analyst, Workflow Automation, etc.)
- **Evaluation Layer:** Real-time quality and safety checks
- **Unified Platform API:** Single endpoint for all AI operations

---

## Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete architecture overview
- **[IMPLEMENTATION_GUIDE.md](docs/IMPLEMENTATION_GUIDE.md)** - How to use the four pillars
- **[SCALE_AI_COMPARISON.md](docs/SCALE_AI_COMPARISON.md)** - How we compare to Scale AI
- **[Services README](services/README.md)** - Backend services documentation

---

## Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript 5
- **Build:** Vite 6
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **AI:** Google Generative AI

### Backend (New Architecture)
- **Data Engine:** TypeScript, Kafka, PostgreSQL
- **Model Orchestrator:** TypeScript, LangChain
- **Agentic Workspace:** TypeScript, LangGraph
- **Evaluation Layer:** TypeScript, Custom metrics
- **Integration:** Fastify, REST APIs

### Infrastructure
- **Database:** PostgreSQL, Redis
- **Search:** Elasticsearch
- **Vector DB:** Milvus
- **Storage:** MinIO (S3-compatible)
- **Deployment:** Docker, Kubernetes

---

## Roadmap

### Phase 1: MVP (0-6 months) ✅
- ✅ Basic UI and dashboard
- ✅ Gemini AI integration
- ✅ Four pillar architecture design
- ✅ Core service implementations
- 🔄 10 data connectors
- 🔄 Basic evaluation metrics

### Phase 2: Enterprise Ready (6-12 months)
- Multi-agent system
- Advanced workflow automation
- Custom fine-tuning pipeline
- SEAL evaluation framework
- Enterprise security features

### Phase 3: Scale (12-18 months)
- 100+ connectors
- Marketplace for integrations
- AutoML capabilities
- Multi-tenant architecture
- Global deployment

### Phase 4: AI Backbone (18-24 months)
- Federated learning
- Edge deployment
- Industry-specific solutions
- Open ecosystem

---

## Environment Variables

Create a `.env.local` file with:

```env
# AI Model APIs
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Database
DATABASE_URL=postgresql://localhost:5432/unifiedai
REDIS_URL=redis://localhost:6379

# Backend
BACKEND_PORT=8000
API_PORT=8080

# Frontend
VITE_BACKEND_URL=http://localhost:8000
```

---

## API Usage

### Query the Platform

```typescript
import { unifiedPlatform } from './services/unified-platform/src';

await unifiedPlatform.initialize();

const response = await unifiedPlatform.query({
  query: 'What were our sales last quarter?',
  agentRole: 'data-analyst',
  options: {
    maxCost: 0.05,
    maxLatency: 3000,
  },
});

console.log(response.response);
```

See [IMPLEMENTATION_GUIDE.md](docs/IMPLEMENTATION_GUIDE.md) for complete API documentation.

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## License

MIT License - see [LICENSE](LICENSE) for details

---

## Support

For questions or issues:
- GitHub Issues: [Create an issue](https://github.com/yourusername/unifiedai/issues)
- Documentation: See `/docs` directory
- Email: support@unifiedai.com

---

**Built with inspiration from Scale AI's proven architecture**

**Last Updated:** 2025-10-24
