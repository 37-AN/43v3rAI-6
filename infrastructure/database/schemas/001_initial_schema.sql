-- UnifiedAI Database Schema
-- PostgreSQL 15+
-- Version: 1.0.0

-- Create schema
CREATE SCHEMA IF NOT EXISTS unifiedai;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- For encryption

-- Set search path
SET search_path TO unifiedai, public;

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE unifiedai.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
    organization_id UUID,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON unifiedai.users(email);
CREATE INDEX idx_users_organization ON unifiedai.users(organization_id);
CREATE INDEX idx_users_role ON unifiedai.users(role);

-- ============================================================================
-- ORGANIZATIONS
-- ============================================================================

CREATE TABLE unifiedai.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'starter' CHECK (plan IN ('starter', 'growth', 'enterprise')),
    max_users INTEGER DEFAULT 5,
    max_data_sources INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organizations_slug ON unifiedai.organizations(slug);

-- Add foreign key after organizations table exists
ALTER TABLE unifiedai.users
    ADD CONSTRAINT fk_users_organization
    FOREIGN KEY (organization_id) REFERENCES unifiedai.organizations(id) ON DELETE CASCADE;

-- ============================================================================
-- API KEYS
-- ============================================================================

CREATE TABLE unifiedai.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES unifiedai.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    key_prefix VARCHAR(20) NOT NULL,
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_keys_user ON unifiedai.api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON unifiedai.api_keys(key_hash);

-- ============================================================================
-- DATA SOURCES
-- ============================================================================

CREATE TABLE unifiedai.data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('database', 'api', 'file', 'saas', 'stream')),
    connector_type VARCHAR(100) NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'syncing')),
    last_sync_at TIMESTAMP,
    last_error TEXT,
    sync_frequency VARCHAR(50) DEFAULT 'hourly',
    organization_id UUID NOT NULL REFERENCES unifiedai.organizations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES unifiedai.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_data_sources_org ON unifiedai.data_sources(organization_id);
CREATE INDEX idx_data_sources_type ON unifiedai.data_sources(type);
CREATE INDEX idx_data_sources_status ON unifiedai.data_sources(status);

-- ============================================================================
-- DATA RECORDS
-- ============================================================================

CREATE TABLE unifiedai.data_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES unifiedai.data_sources(id) ON DELETE CASCADE,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    data JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    quality_score DECIMAL(3,2) CHECK (quality_score >= 0 AND quality_score <= 1),
    checksum VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_id, entity_id)
);

CREATE INDEX idx_data_records_source ON unifiedai.data_records(source_id);
CREATE INDEX idx_data_records_entity ON unifiedai.data_records(entity_type, entity_id);
CREATE INDEX idx_data_records_quality ON unifiedai.data_records(quality_score);
CREATE INDEX idx_data_records_created ON unifiedai.data_records(created_at DESC);
CREATE INDEX idx_data_records_data_gin ON unifiedai.data_records USING GIN (data);

-- ============================================================================
-- QUERIES & CONVERSATIONS
-- ============================================================================

CREATE TABLE unifiedai.queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES unifiedai.users(id) ON DELETE CASCADE,
    conversation_id UUID,
    query_text TEXT NOT NULL,
    response_text TEXT,
    model_used VARCHAR(100),
    tokens_used INTEGER,
    cost DECIMAL(10,6),
    latency_ms INTEGER,
    evaluation_score DECIMAL(3,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_queries_user ON unifiedai.queries(user_id);
CREATE INDEX idx_queries_conversation ON unifiedai.queries(conversation_id);
CREATE INDEX idx_queries_created ON unifiedai.queries(created_at DESC);

-- ============================================================================
-- WORKFLOWS
-- ============================================================================

CREATE TABLE unifiedai.workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('schedule', 'event', 'webhook', 'manual')),
    trigger_config JSONB NOT NULL DEFAULT '{}',
    steps JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    last_run_at TIMESTAMP,
    next_run_at TIMESTAMP,
    organization_id UUID NOT NULL REFERENCES unifiedai.organizations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES unifiedai.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workflows_org ON unifiedai.workflows(organization_id);
CREATE INDEX idx_workflows_active ON unifiedai.workflows(is_active);
CREATE INDEX idx_workflows_next_run ON unifiedai.workflows(next_run_at) WHERE is_active = true;

-- ============================================================================
-- WORKFLOW RUNS
-- ============================================================================

CREATE TABLE unifiedai.workflow_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES unifiedai.workflows(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    execution_log JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_workflow_runs_workflow ON unifiedai.workflow_runs(workflow_id);
CREATE INDEX idx_workflow_runs_status ON unifiedai.workflow_runs(status);
CREATE INDEX idx_workflow_runs_started ON unifiedai.workflow_runs(started_at DESC);

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================

CREATE TABLE unifiedai.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES unifiedai.users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON unifiedai.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON unifiedai.audit_logs(action);
CREATE INDEX idx_audit_logs_created ON unifiedai.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_resource ON unifiedai.audit_logs(resource_type, resource_id);

-- ============================================================================
-- SYNC JOBS
-- ============================================================================

CREATE TABLE unifiedai.sync_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES unifiedai.data_sources(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    records_processed INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sync_jobs_source ON unifiedai.sync_jobs(source_id);
CREATE INDEX idx_sync_jobs_status ON unifiedai.sync_jobs(status);
CREATE INDEX idx_sync_jobs_created ON unifiedai.sync_jobs(created_at DESC);

-- ============================================================================
-- EMBEDDINGS (for vector search reference)
-- ============================================================================

CREATE TABLE unifiedai.embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID NOT NULL REFERENCES unifiedai.data_records(id) ON DELETE CASCADE,
    embedding_model VARCHAR(100) NOT NULL,
    vector_id VARCHAR(255),  -- Reference to Milvus vector ID
    text_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_embeddings_record ON unifiedai.embeddings(record_id);
CREATE INDEX idx_embeddings_model ON unifiedai.embeddings(embedding_model);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON unifiedai.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON unifiedai.organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_sources_updated_at BEFORE UPDATE ON unifiedai.data_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_records_updated_at BEFORE UPDATE ON unifiedai.data_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON unifiedai.workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to calculate data quality score
CREATE OR REPLACE FUNCTION calculate_quality_score(data JSONB)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    completeness DECIMAL;
    total_fields INTEGER;
    non_null_fields INTEGER;
BEGIN
    total_fields := jsonb_object_keys(data)::INTEGER;

    SELECT COUNT(*) INTO non_null_fields
    FROM jsonb_each(data)
    WHERE value::text != 'null';

    IF total_fields = 0 THEN
        RETURN 0.0;
    END IF;

    completeness := non_null_fields::DECIMAL / total_fields::DECIMAL;

    RETURN ROUND(completeness, 2);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Create default organization
INSERT INTO unifiedai.organizations (name, slug, plan)
VALUES ('Default Organization', 'default', 'starter')
ON CONFLICT DO NOTHING;

-- Create admin user
INSERT INTO unifiedai.users (email, name, role, password_hash, organization_id, email_verified)
SELECT
    'admin@unifiedai.com',
    'Admin User',
    'admin',
    crypt('changeme', gen_salt('bf')),
    id,
    true
FROM unifiedai.organizations
WHERE slug = 'default'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant permissions to application user
GRANT USAGE ON SCHEMA unifiedai TO unifiedai_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA unifiedai TO unifiedai_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA unifiedai TO unifiedai_admin;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON SCHEMA unifiedai IS 'Main schema for UnifiedAI platform';
COMMENT ON TABLE unifiedai.users IS 'User accounts and authentication';
COMMENT ON TABLE unifiedai.organizations IS 'Multi-tenant organizations';
COMMENT ON TABLE unifiedai.data_sources IS 'Connected data source configurations';
COMMENT ON TABLE unifiedai.data_records IS 'Unified data records from all sources';
COMMENT ON TABLE unifiedai.queries IS 'AI query history and responses';
COMMENT ON TABLE unifiedai.workflows IS 'Automation workflow definitions';
COMMENT ON TABLE unifiedai.audit_logs IS 'Security and compliance audit trail';

-- Complete
SELECT 'UnifiedAI database schema initialized successfully!' AS status;
