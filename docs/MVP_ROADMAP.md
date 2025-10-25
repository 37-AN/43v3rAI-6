# UnifiedAI MVP Architecture and Roadmap

## Executive Summary

This document outlines the detailed MVP architecture and phased implementation roadmap for UnifiedAI - a modular, scalable platform that ingests, unifies, and analyzes any type of company data while maintaining security, performance, and AI adaptability.

---

## 1. System Architecture Overview

**Objective:** Create a modular, scalable architecture that can ingest, unify, and analyze any type of company data while maintaining security, performance, and AI adaptability.

### Core Components

#### 1. Data Ingestion Layer

**Purpose:** Universal data intake from any source

**Components:**
- **SaaS Connectors:** Pre-built integrations for enterprise tools
  - Salesforce (CRM data)
  - Slack (communication data)
  - HubSpot (marketing data)
  - Google Drive (documents)
  - Microsoft 365 (email, files)
  - Jira (project management)

- **API & Webhook Endpoints:**
  - REST API for programmatic data ingestion
  - Webhook receivers for real-time data push
  - GraphQL API for flexible queries

- **File Upload System:**
  - CSV, Excel, JSON support
  - Drag-and-drop interface
  - Batch processing for large files

- **Scheduled Sync Service:**
  - Apache Airflow-based orchestration
  - Configurable sync intervals (real-time, hourly, daily)
  - Error handling and retry logic
  - Progress monitoring and alerting

**Implementation:** `/services/data-engine/src/connectors/`

---

#### 2. Data Processing & ETL Engine

**Purpose:** Clean, normalize, and unify data from disparate sources

**Features:**
- **Auto-Schema Detection:**
  - Intelligent field type inference
  - Automatic relationship detection
  - Schema versioning and evolution

- **Normalization & Deduplication:**
  - Fuzzy matching for entity resolution
  - Duplicate detection and merging
  - Conflict resolution strategies

- **Entity Resolution:**
  - Cross-system entity linking (people, accounts, products)
  - Probabilistic matching algorithms
  - Master data management (MDM)

- **Real-time Data Cleaning:**
  - Pandas for structured data
  - PySpark for large-scale processing
  - Data quality scoring and validation

**Technology Stack:**
- Python (Pandas, PySpark)
- Apache Airflow for orchestration
- dbt for transformations
- Great Expectations for data quality

**Implementation:** `/services/data-engine/src/etl/`

---

#### 3. AI Knowledge Engine

**Purpose:** Convert raw data into searchable, queryable knowledge

**Components:**
- **Data Embedding Generation:**
  - OpenAI text-embedding-3 for semantic search
  - Custom transformer models for domain-specific embeddings
  - Batch and streaming embedding generation

- **Knowledge Graph Creation:**
  - Entity-relationship mapping
  - Graph database (Neo4j optional)
  - Relationship inference using AI

- **Contextual Search & Summarization:**
  - LangChain-based RAG (Retrieval-Augmented Generation)
  - Vector similarity search
  - Multi-document summarization

- **Model Fine-tuning:**
  - Customer-specific model adaptation
  - Domain adaptation using company data
  - Continuous learning from feedback

**Technology Stack:**
- LangChain for orchestration
- Milvus/Pinecone for vector storage
- HuggingFace Transformers
- OpenAI/Anthropic APIs

**Implementation:** `/services/model-orchestrator/` + `/services/agentic-workspace/`

---

#### 4. Unified Data Store

**Purpose:** Multi-modal storage optimized for different data types

**Storage Layers:**
- **PostgreSQL:**
  - Structured metadata
  - User accounts and permissions
  - Configuration and settings
  - Audit logs

- **Elasticsearch:**
  - Full-text search
  - Semantic search with vector plugin
  - Log aggregation
  - Real-time analytics

- **Object Storage (AWS S3 / MinIO):**
  - Raw data files
  - Document storage
  - Backup and archival
  - Data lake for analytics

- **Redis:**
  - Session management
  - Query result caching
  - Rate limiting
  - Real-time leaderboards

**Architecture:**
```
┌─────────────────────────────────────────┐
│         Application Layer               │
└───────────┬─────────────────────────────┘
            │
    ┌───────┼───────┬───────────┬─────────┐
    │       │       │           │         │
┌───▼──┐ ┌──▼───┐ ┌▼─────────┐ ┌▼───────┐
│Postgre││Elastic││  S3/MinIO││ Redis  │
│SQL   ││search ││          ││        │
└──────┘ └──────┘ └──────────┘ └────────┘
```

**Implementation:** Database schemas in `/services/data-engine/src/storage/`

---

#### 5. AI Query & Insights Layer

**Purpose:** Natural language interface for data analysis

**Features:**
- **Natural Language Interface:**
  - Chat-style conversational UI
  - Multi-turn conversations with context
  - Voice input support (future)

- **Auto-Report Generation:**
  - Template-based reports
  - Dynamic visualization selection
  - Scheduled report delivery

- **Predictive Analytics:**
  - Demand forecasting
  - Churn prediction
  - Revenue forecasting
  - Anomaly detection

- **BI Tool Integration:**
  - Looker connector
  - Power BI connector
  - Tableau connector
  - Custom JDBC/ODBC drivers

**Technology Stack:**
- LangChain for NLP
- Plotly/Recharts for visualizations
- Prophet/scikit-learn for forecasting
- Custom REST APIs for BI tools

**Implementation:** `/services/agentic-workspace/src/agents/`

---

#### 6. Frontend Application

**Purpose:** User interface for data exploration and insights

**Stack:**
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS 3
- **State Management:** Zustand / TanStack Query
- **Charts:** Recharts + D3.js
- **Forms:** React Hook Form + Zod

**Key Pages:**
1. **Dashboard:**
   - Unified data overview
   - Key metrics and KPIs
   - Recent activity feed
   - Quick actions

2. **Data Sources:**
   - Connector management
   - Sync status and logs
   - Connection testing
   - Data quality metrics

3. **AI Assistant:**
   - Chat interface
   - Query history
   - Saved queries
   - Export results

4. **Insights:**
   - Automated insights
   - Custom reports
   - Predictive analytics
   - Anomaly alerts

5. **Settings:**
   - User management
   - API keys
   - Security settings
   - Billing and usage

**Implementation:** `/components/` (existing) + new pages

---

#### 7. Security & Governance

**Purpose:** Enterprise-grade security and compliance

**Security Features:**
- **Authentication:**
  - OAuth2 / OIDC support
  - SSO integration (Okta, Azure AD, Google Workspace)
  - Multi-factor authentication (MFA)
  - API key management with rotation

- **Authorization:**
  - Role-Based Access Control (RBAC)
  - Attribute-Based Access Control (ABAC)
  - Resource-level permissions
  - Team and workspace isolation

- **Encryption:**
  - AES-256 encryption at rest
  - TLS 1.3 for data in transit
  - Field-level encryption for PII
  - Key management with AWS KMS / HashiCorp Vault

- **Compliance:**
  - Audit logs (immutable)
  - Data retention policies
  - Right to deletion (GDPR)
  - Compliance reports (SOC 2, ISO 27001)

**Architecture:**
```
┌────────────────────────────────────┐
│        API Gateway Layer           │
│  - Authentication                  │
│  - Authorization                   │
│  - Rate Limiting                   │
└────────────┬───────────────────────┘
             │
     ┌───────┼───────┐
     │       │       │
┌────▼──┐ ┌──▼───┐ ┌▼────────┐
│OAuth2 │ │RBAC  │ │Audit Log│
└───────┘ └──────┘ └─────────┘
```

**Implementation:** `/services/security/` (to be created)

---

#### 8. Infrastructure & Deployment

**Purpose:** Scalable, reliable, observable infrastructure

**Components:**
- **Containerization:**
  - Docker for all services
  - Docker Compose for local development
  - Multi-stage builds for optimization

- **Orchestration:**
  - Kubernetes (AWS EKS / GKE)
  - Helm charts for deployment
  - Horizontal Pod Autoscaling (HPA)

- **CI/CD:**
  - GitHub Actions for automation
  - Automated testing (unit, integration, e2e)
  - Blue-green deployments
  - Rollback capabilities

- **Monitoring:**
  - Prometheus for metrics
  - Grafana for dashboards
  - Alertmanager for notifications
  - Custom SLIs and SLOs

- **Logging:**
  - ELK Stack (Elasticsearch, Logstash, Kibana)
  - Structured logging
  - Log aggregation and search
  - Log retention policies

**Cloud Providers:**
- Primary: AWS (ECS, RDS, S3, CloudFront)
- Secondary: GCP (alternative deployment)
- Hybrid: On-premises for enterprise customers

**Implementation:** `/infrastructure/` and `/k8s/` directories

---

## 2. MVP Roadmap

### **Phase 1: Foundation (0–3 Months)** 🎯 CURRENT FOCUS

**Goals:** Build minimal but functional system for pilot customers

**Key Objectives:**
1. Set up core architecture (backend + frontend)
2. Develop connectors for Google Drive, SQL, Slack, and HubSpot
3. Implement data ingestion, schema mapping, and basic dashboard
4. Launch basic AI query interface with OpenAI API

**Deliverables:**
- ✅ MVP Platform (Web App)
- 🔄 Working integrations (min. 4 data sources)
- 🔄 Basic security (OAuth + RBAC)
- 📋 Private beta for 2–3 pilot companies

**Technical Milestones:**

**Month 1: Infrastructure & Core Services**
- Week 1-2:
  - ✅ Set up development environment
  - ✅ Implement four-pillar architecture
  - 🔄 Configure databases (PostgreSQL, Redis, Elasticsearch)
  - 🔄 Set up Docker Compose for local dev

- Week 3-4:
  - 🔄 Build authentication system (OAuth2)
  - 🔄 Implement basic RBAC
  - 🔄 Create API gateway with Fastify
  - 🔄 Set up monitoring (Prometheus + Grafana)

**Month 2: Data Engine & Connectors**
- Week 1-2:
  - 🔄 Implement Google Drive connector
  - 🔄 Implement PostgreSQL/MySQL connector
  - 🔄 Build CSV/Excel file upload
  - 🔄 Create data quality scoring system

- Week 3-4:
  - 🔄 Implement Slack connector
  - 🔄 Implement HubSpot connector
  - 🔄 Build ETL pipeline with Airflow
  - 🔄 Implement auto-schema detection

**Month 3: AI & Frontend**
- Week 1-2:
  - 🔄 Integrate OpenAI for embeddings
  - 🔄 Build vector search with Milvus
  - 🔄 Implement AI chat interface
  - 🔄 Create unified dashboard

- Week 3-4:
  - 🔄 Implement basic analytics
  - 🔄 Build connector management UI
  - 🔄 User acceptance testing
  - 🔄 Deploy to staging environment

**Success Metrics:**
- 4 working data connectors
- < 5 minute setup time for new data source
- < 2 second query response time
- 99% uptime on staging
- 2-3 pilot customers onboarded

---

### **Phase 2: Intelligence Expansion (3–6 Months)**

**Goals:** Introduce AI-driven insights and automation

**Key Objectives:**
1. AI knowledge graph & summarization engine
2. Data cleansing & transformation automation
3. Role-based dashboards & anomaly detection
4. Start of predictive analytics module (LTV, churn, revenue forecast)

**Deliverables:**
- Advanced NLP interface (Chat your data)
- Data quality reports
- Integration API for external tools
- 10+ data source connectors
- Anomaly detection system

**Technical Milestones:**

**Month 4:**
- Build knowledge graph engine
- Implement entity resolution across sources
- Create automated data quality reports
- Add 3 new connectors (Salesforce, Jira, Zendesk)

**Month 5:**
- Develop multi-turn conversation system
- Implement context-aware query understanding
- Build custom metric creation UI
- Add predictive analytics (churn, LTV)

**Month 6:**
- Create role-based dashboard templates
- Implement anomaly detection algorithms
- Build public API for third-party integrations
- Launch beta marketplace for connectors

**Success Metrics:**
- 10+ active customers
- 50+ data sources connected
- < 1 second average query response
- 95%+ query accuracy
- $50K MRR

---

### **Phase 3: Automation & Ecosystem (6–12 Months)**

**Goals:** Enable intelligent automation and scalability

**Key Objectives:**
1. Workflow automation engine (trigger-based AI agents)
2. Marketplace for third-party connectors
3. API for developers to add custom integrations
4. Scaling infrastructure to support 100+ companies

**Deliverables:**
- AI-driven workflow builder
- Integration marketplace MVP
- Enhanced data governance system
- Self-service onboarding
- 50+ connectors

**Technical Milestones:**

**Month 7-8:**
- Build workflow automation engine
- Implement trigger system (event-driven)
- Create action library for workflows
- Launch developer API beta

**Month 9-10:**
- Build connector SDK
- Create marketplace platform
- Implement revenue sharing for partners
- Add advanced governance features

**Month 11-12:**
- Scale to 100+ concurrent customers
- Implement multi-tenancy
- Build self-service onboarding
- Launch enterprise tier

**Success Metrics:**
- 100+ customers
- 1000+ active workflows
- 50+ marketplace connectors
- $500K MRR
- 95%+ customer retention

---

### **Phase 4: Enterprise Growth (12–18 Months)**

**Goals:** Enterprise onboarding and global scalability

**Key Objectives:**
1. Private LLM deployment (for enterprise clients)
2. Custom AI model training per organization
3. SOC2, ISO 27001, and GDPR compliance certification
4. Partnerships with cloud providers and SIs (AWS, Microsoft, Deloitte)

**Deliverables:**
- Enterprise deployment package
- Security certifications (SOC 2 Type II, ISO 27001)
- Strategic global partnerships
- Multi-region deployment
- 100+ connectors

**Technical Milestones:**

**Month 13-14:**
- Complete SOC 2 Type II audit
- Obtain ISO 27001 certification
- Build private LLM hosting option
- Implement federated learning

**Month 15-16:**
- Launch custom model training service
- Build enterprise deployment automation
- Implement multi-region architecture
- Partner with AWS/Azure/GCP

**Month 17-18:**
- Launch in EMEA and APAC regions
- Partner with system integrators
- Build white-label offering
- IPO preparation (optional)

**Success Metrics:**
- 500+ customers
- 50+ enterprise customers (>$100K/year)
- $5M+ ARR
- 99.9% uptime SLA
- Global presence in 3+ regions

---

## 3. Technical Architecture Diagram

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│                      (Next.js + React)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Dashboard │  │AI Chat   │  │ Insights │  │ Settings │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS / WebSocket
┌─────────────────────────▼───────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
│            (Fastify / FastAPI + Authentication)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐          │
│  │ Rate Limit   │  │  OAuth2/SSO  │  │   RBAC      │          │
│  └──────────────┘  └──────────────┘  └─────────────┘          │
└───────────┬─────────────────────────────────────────────────────┘
            │
    ┌───────┼───────┬───────────┬───────────┬───────────┐
    │       │       │           │           │           │
┌───▼───┐ ┌─▼────┐ ┌▼────────┐ ┌▼────────┐ ┌▼────────┐
│Data   │ │Model │ │Agentic  │ │Eval     │ │Security │
│Engine │ │Orch. │ │Workspace│ │Layer    │ │Service  │
└───┬───┘ └──┬───┘ └────┬────┘ └────┬────┘ └────┬────┘
    │        │          │           │           │
    └────────┼──────────┼───────────┼───────────┘
             │          │           │
    ┌────────▼──────────▼───────────▼────────┐
    │         DATA STORAGE LAYER              │
    │  ┌──────────┐ ┌───────────┐ ┌────────┐│
    │  │PostgreSQL│ │Elasticsearch│ │Redis  ││
    │  └──────────┘ └───────────┘ └────────┘│
    │  ┌──────────┐ ┌───────────┐           │
    │  │  Milvus  │ │S3/MinIO   │           │
    │  │ (Vector) │ │ (Objects) │           │
    │  └──────────┘ └───────────┘           │
    └─────────────────┬──────────────────────┘
                      │
    ┌─────────────────▼──────────────────────┐
    │     EXTERNAL INTEGRATIONS              │
    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
    │  │G.Drv │ │Slack │ │Sforce│ │HubSpt│ │
    │  └──────┘ └──────┘ └──────┘ └──────┘ │
    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
    │  │Jira  │ │SQL DB│ │Excel │ │APIs  │ │
    │  └──────┘ └──────┘ └──────┘ └──────┘ │
    └────────────────────────────────────────┘
```

### Data Flow Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    DATA FLOW                             │
│                                                          │
│  1. INGESTION                                            │
│     External Source → Connector → Validation → Queue    │
│                                                          │
│  2. PROCESSING                                           │
│     Queue → ETL Pipeline → Quality Check → Transform    │
│                                                          │
│  3. STORAGE                                              │
│     Transform → PostgreSQL (metadata)                    │
│              → Elasticsearch (search)                    │
│              → Milvus (embeddings)                       │
│              → S3 (raw data)                             │
│                                                          │
│  4. QUERY                                                │
│     User Input → AI Agent → Knowledge Graph → Response  │
│                                                          │
│  5. EVALUATION                                           │
│     Response → Safety Check → Quality Score → User      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Implementation Priorities

### Phase 1 Priorities (Next 3 Months)

#### Priority 1: Core Data Connectors ⭐⭐⭐
**Target:** 4 working connectors by end of Month 2

1. **Google Drive Connector**
   - OAuth2 authentication
   - File listing and metadata extraction
   - Document content extraction
   - Change detection for sync

2. **PostgreSQL/MySQL Connector**
   - Connection pooling
   - Schema introspection
   - Incremental sync
   - Query optimization

3. **Slack Connector**
   - OAuth2 authentication
   - Channel message extraction
   - File attachments
   - User directory sync

4. **CSV/Excel Upload**
   - Drag-and-drop interface
   - Schema auto-detection
   - Large file handling (streaming)
   - Error reporting

#### Priority 2: AI Query Interface ⭐⭐⭐
**Target:** Working chat interface by end of Month 3

1. **Chat UI**
   - Message history
   - Markdown rendering
   - Code syntax highlighting
   - Export conversations

2. **Query Processing**
   - Intent classification
   - Entity extraction
   - Context management
   - Response generation

3. **Knowledge Retrieval**
   - Vector search
   - Semantic ranking
   - Source attribution
   - Confidence scoring

#### Priority 3: Basic Dashboard ⭐⭐
**Target:** Functional dashboard by end of Month 3

1. **Overview Page**
   - Data source status
   - Recent queries
   - System health
   - Quick actions

2. **Data Sources Page**
   - Add/edit/delete connectors
   - Sync status and logs
   - Data quality metrics
   - Connection testing

#### Priority 4: Security Foundation ⭐⭐
**Target:** OAuth + basic RBAC by end of Month 1

1. **Authentication**
   - OAuth2 implementation
   - Session management
   - Token refresh
   - Logout

2. **Authorization**
   - User roles (Admin, User, Viewer)
   - Resource permissions
   - API key management
   - Audit logging

---

## 5. Success Criteria

### Phase 1 Success Metrics

**Technical:**
- ✅ 4 working data connectors
- ✅ < 5 minute connector setup time
- ✅ < 2 second query response time (P95)
- ✅ 99% uptime on staging
- ✅ < 0.1% data loss rate

**Business:**
- 📋 2-3 pilot customers signed
- 📋 10+ hours of usage per customer per month
- 📋 > 4.0/5 user satisfaction rating
- 📋 < 10% churn rate
- 📋 $10K+ MRR pipeline

**Product:**
- 📋 Natural language query accuracy > 90%
- 📋 Data quality score > 85%
- 📋 Time-to-insight < 30 seconds
- 📋 User onboarding < 15 minutes
- 📋 Support ticket resolution < 24 hours

---

## 6. Risk Mitigation

### Technical Risks

**Risk 1: Data Connector Reliability**
- **Impact:** High
- **Probability:** Medium
- **Mitigation:**
  - Comprehensive error handling
  - Automatic retry with exponential backoff
  - Fallback to manual upload
  - Real-time monitoring and alerting

**Risk 2: Query Accuracy**
- **Impact:** High
- **Probability:** Medium
- **Mitigation:**
  - Implement evaluation layer (SEAL)
  - Human-in-the-loop for critical queries
  - Confidence scoring
  - User feedback loop

**Risk 3: Scalability Bottlenecks**
- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:**
  - Horizontal scaling architecture
  - Database sharding strategy
  - Caching layer with Redis
  - Load testing before Phase 2

**Risk 4: Security Vulnerabilities**
- **Impact:** Critical
- **Probability:** Low
- **Mitigation:**
  - Regular security audits
  - Penetration testing
  - Bug bounty program
  - Compliance-first approach

### Business Risks

**Risk 1: Slow Customer Adoption**
- **Impact:** High
- **Probability:** Medium
- **Mitigation:**
  - Freemium tier for easy onboarding
  - Extensive documentation
  - Hands-on onboarding support
  - Case studies and testimonials

**Risk 2: Competitive Pressure**
- **Impact:** Medium
- **Probability:** High
- **Mitigation:**
  - Focus on unique value proposition
  - Fast iteration based on feedback
  - Build moats (network effects, data advantages)
  - Strategic partnerships

---

## 7. Next Steps

### Immediate Actions (This Week)

1. **Infrastructure Setup**
   - [ ] Provision AWS/GCP accounts
   - [ ] Set up CI/CD pipeline
   - [ ] Configure staging environment
   - [ ] Set up monitoring dashboards

2. **Development Kickoff**
   - [ ] Create GitHub project board
   - [ ] Assign Phase 1 tasks
   - [ ] Set up daily standups
   - [ ] Define sprint goals

3. **Pilot Customer Outreach**
   - [ ] Identify 5 potential pilot customers
   - [ ] Schedule discovery calls
   - [ ] Prepare demo materials
   - [ ] Draft pilot agreements

### This Month (Weeks 1-4)

- **Week 1:** Infrastructure + Database setup
- **Week 2:** Authentication + API Gateway
- **Week 3:** First connector (Google Drive)
- **Week 4:** Second connector (PostgreSQL)

### Next Month (Weeks 5-8)

- **Week 5:** Third connector (Slack)
- **Week 6:** Fourth connector (CSV Upload)
- **Week 7:** ETL Pipeline + Data Quality
- **Week 8:** Testing + Bug Fixes

### Month 3 (Weeks 9-12)

- **Week 9:** AI Chat Interface
- **Week 10:** Dashboard UI
- **Week 11:** Integration Testing
- **Week 12:** Pilot Customer Onboarding

---

## 8. Resource Requirements

### Team Structure (Phase 1)

**Core Team (5-7 people):**
1. **Tech Lead / Architect** (1)
   - System architecture
   - Technical decision-making
   - Code review

2. **Backend Engineers** (2)
   - Data engine development
   - Connector implementation
   - API development

3. **Frontend Engineer** (1)
   - Dashboard UI
   - Chat interface
   - UX optimization

4. **AI/ML Engineer** (1)
   - Model integration
   - Vector search
   - Prompt engineering

5. **DevOps Engineer** (1)
   - Infrastructure setup
   - CI/CD
   - Monitoring

**Extended Team:**
- Product Manager (0.5 FTE)
- UI/UX Designer (0.5 FTE)
- QA Engineer (0.5 FTE)

### Budget (Phase 1 - 3 Months)

**Personnel:** $150K - $200K
- Salaries (5-7 engineers)
- Contractor/freelancer costs

**Infrastructure:** $5K - $10K
- AWS/GCP credits
- Third-party APIs (OpenAI, etc.)
- Development tools

**Software/Services:** $5K - $10K
- SaaS subscriptions
- Design tools
- Project management

**Total Phase 1 Budget:** $160K - $220K

---

## Appendix

### A. Technology Decision Matrix

| Component | Option 1 | Option 2 | Choice | Reason |
|-----------|----------|----------|--------|--------|
| Backend Framework | FastAPI | Node.js + Fastify | Both | FastAPI for AI, Fastify for API Gateway |
| Frontend Framework | Next.js | Vue/Nuxt | Next.js | Better ecosystem, SEO, performance |
| Database | PostgreSQL | MongoDB | PostgreSQL | ACID compliance, better for structured data |
| Vector DB | Milvus | Pinecone | Milvus | Self-hosted, cost-effective |
| Message Queue | Kafka | RabbitMQ | Kafka | Better for high-throughput |
| Orchestration | Airflow | Prefect | Airflow | More mature, larger community |

### B. API Endpoint Structure

```
/api/v1/
  ├── /auth
  │   ├── POST /login
  │   ├── POST /logout
  │   └── POST /refresh
  │
  ├── /data-sources
  │   ├── GET /
  │   ├── POST /
  │   ├── GET /{id}
  │   ├── PUT /{id}
  │   ├── DELETE /{id}
  │   └── POST /{id}/sync
  │
  ├── /query
  │   ├── POST /chat
  │   ├── GET /history
  │   └── POST /sql
  │
  ├── /insights
  │   ├── GET /
  │   ├── POST /
  │   └── GET /{id}
  │
  └── /admin
      ├── /users
      ├── /audit-logs
      └── /settings
```

### C. Database Schema (Core Tables)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Data Sources
CREATE TABLE data_sources (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50),
  config JSONB,
  status VARCHAR(50),
  last_sync_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP
);

-- Data Records
CREATE TABLE data_records (
  id UUID PRIMARY KEY,
  source_id UUID REFERENCES data_sources(id),
  entity_type VARCHAR(100),
  data JSONB,
  metadata JSONB,
  quality_score DECIMAL,
  created_at TIMESTAMP
);

-- Queries
CREATE TABLE queries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  query_text TEXT,
  response TEXT,
  metadata JSONB,
  created_at TIMESTAMP
);
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-24
**Owner:** UnifiedAI Product & Engineering Teams
