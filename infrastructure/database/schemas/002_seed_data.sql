-- UnifiedAI Seed Data
-- Initial data for testing and development

-- Set search path
SET search_path TO unifiedai, public;

-- ============================================================================
-- INSERT TEST ORGANIZATION
-- ============================================================================

INSERT INTO unifiedai.organizations (id, name, slug, plan, max_users, max_data_sources, is_active)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Forever Technology', 'forever-tech', 'enterprise', 50, 20, true),
  ('660e8400-e29b-41d4-a716-446655440001', 'Demo Organization', 'demo-org', 'growth', 10, 10, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- INSERT TEST USERS
-- ============================================================================

INSERT INTO unifiedai.users (id, email, name, role, organization_id, email_verified, password_hash)
VALUES
  -- Admin user for Forever Technology
  ('770e8400-e29b-41d4-a716-446655440000',
   'admin@forever-tech.com',
   'Admin User',
   'admin',
   '550e8400-e29b-41d4-a716-446655440000',
   true,
   '$2b$10$YourHashedPasswordHere'), -- In production, use proper bcrypt hash

  -- Regular user for Forever Technology
  ('770e8400-e29b-41d4-a716-446655440001',
   'user@forever-tech.com',
   'Regular User',
   'user',
   '550e8400-e29b-41d4-a716-446655440000',
   true,
   '$2b$10$YourHashedPasswordHere'),

  -- Demo user
  ('770e8400-e29b-41d4-a716-446655440002',
   'demo@demo-org.com',
   'Demo User',
   'user',
   '660e8400-e29b-41d4-a716-446655440001',
   true,
   '$2b$10$YourHashedPasswordHere')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- INSERT SAMPLE DATA SOURCES
-- ============================================================================

INSERT INTO unifiedai.data_sources (id, name, type, connector_type, status, organization_id, created_by, config)
VALUES
  ('880e8400-e29b-41d4-a716-446655440000',
   'Production Database',
   'database',
   'postgresql',
   'connected',
   '550e8400-e29b-41d4-a716-446655440000',
   '770e8400-e29b-41d4-a716-446655440000',
   '{"host": "localhost", "port": 5432, "database": "production"}'),

  ('880e8400-e29b-41d4-a716-446655440001',
   'Sales CRM (HubSpot)',
   'saas',
   'hubspot',
   'connected',
   '550e8400-e29b-41d4-a716-446655440000',
   '770e8400-e29b-41d4-a716-446655440000',
   '{"api_key": "test_key"}'),

  ('880e8400-e29b-41d4-a716-446655440002',
   'Marketing Analytics',
   'saas',
   'google_analytics',
   'connected',
   '550e8400-e29b-41d4-a716-446655440000',
   '770e8400-e29b-41d4-a716-446655440000',
   '{"property_id": "12345"}'),

  ('880e8400-e29b-41d4-a716-446655440003',
   'Internal Metrics Tracker',
   'database',
   'internal',
   'connected',
   '550e8400-e29b-41d4-a716-446655440000',
   '770e8400-e29b-41d4-a716-446655440000',
   '{"type": "internal_metrics"}')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERT SAMPLE METRICS DATA
-- ============================================================================

INSERT INTO unifiedai.data_records (source_id, entity_type, entity_id, data, quality_score, metadata)
VALUES
  -- Revenue metric
  ('880e8400-e29b-41d4-a716-446655440003',
   'metric',
   'revenue_mrr',
   jsonb_build_object(
     'value', 4200000,
     'currency', 'USD',
     'period', '2025-01',
     'growth_rate', 12.5,
     'previous_value', 3733333,
     'chart_data', jsonb_build_array(
       jsonb_build_object('month', 'Aug', 'revenue', 3500000),
       jsonb_build_object('month', 'Sep', 'revenue', 3650000),
       jsonb_build_object('month', 'Oct', 'revenue', 3800000),
       jsonb_build_object('month', 'Nov', 'revenue', 4000000),
       jsonb_build_object('month', 'Dec', 'revenue', 4100000),
       jsonb_build_object('month', 'Jan', 'revenue', 4200000)
     )
   ),
   0.95,
   '{"source": "internal", "verified": true}'::jsonb),

  -- Customers metric
  ('880e8400-e29b-41d4-a716-446655440003',
   'metric',
   'customers_total',
   jsonb_build_object(
     'value', 12458,
     'new_this_month', 1027,
     'growth_rate', 8.3,
     'retention_rate', 94.2,
     'churn_rate', 5.8,
     'previous_value', 11501,
     'chart_data', jsonb_build_array(
       jsonb_build_object('month', 'Aug', 'customers', 10200),
       jsonb_build_object('month', 'Sep', 'customers', 10800),
       jsonb_build_object('month', 'Oct', 'customers', 11200),
       jsonb_build_object('month', 'Nov', 'customers', 11500),
       jsonb_build_object('month', 'Dec', 'customers', 12000),
       jsonb_build_object('month', 'Jan', 'customers', 12458)
     )
   ),
   0.98,
   '{"source": "crm", "verified": true}'::jsonb),

  -- API Calls metric
  ('880e8400-e29b-41d4-a716-446655440003',
   'metric',
   'api_calls_total',
   jsonb_build_object(
     'value', 1247890,
     'change_percent', 15.7,
     'average_latency_ms', 142,
     'error_rate_percent', 0.3,
     'previous_value', 1078234
   ),
   0.92,
   '{"source": "api_gateway", "verified": true}'::jsonb),

  -- System Uptime metric
  ('880e8400-e29b-41d4-a716-446655440003',
   'metric',
   'system_uptime',
   jsonb_build_object(
     'value', 99.8,
     'unit', 'percent',
     'change_percent', 0.2,
     'incidents_count', 1,
     'mttr_minutes', 12,
     'previous_value', 99.6
   ),
   0.99,
   '{"source": "monitoring", "verified": true}'::jsonb),

  -- Marketing Qualified Leads
  ('880e8400-e29b-41d4-a716-446655440003',
   'metric',
   'mqls_count',
   jsonb_build_object(
     'value', 850,
     'channels', jsonb_build_object(
       'organic', 320,
       'paid', 280,
       'referral', 150,
       'email', 100
     ),
     'change_percent', -1.8,
     'conversion_rate', 12.5,
     'previous_value', 866
   ),
   0.92,
   '{"source": "marketing_automation", "verified": true}'::jsonb),

  -- Active Users metric
  ('880e8400-e29b-41d4-a716-446655440003',
   'metric',
   'active_users',
   jsonb_build_object(
     'daily_active', 3240,
     'monthly_active', 12458,
     'dau_mau_ratio', 0.26,
     'engagement_score', 7.8,
     'change_percent', 5.2
   ),
   0.90,
   '{"source": "analytics", "verified": true}'::jsonb),

  -- Revenue by Product
  ('880e8400-e29b-41d4-a716-446655440003',
   'metric',
   'revenue_by_product',
   jsonb_build_object(
     'products', jsonb_build_array(
       jsonb_build_object('name', 'Enterprise Plan', 'revenue', 2500000, 'percentage', 59.5),
       jsonb_build_object('name', 'Growth Plan', 'revenue', 1200000, 'percentage', 28.6),
       jsonb_build_object('name', 'Starter Plan', 'revenue', 500000, 'percentage', 11.9)
     )
   ),
   0.94,
   '{"source': "billing", "verified": true}'::jsonb)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERT SAMPLE QUERIES (AI Chat History)
-- ============================================================================

INSERT INTO unifiedai.queries (user_id, query_text, response_text, model_used, tokens_used, latency_ms, status)
VALUES
  ('770e8400-e29b-41d4-a716-446655440000',
   'What is our current monthly revenue?',
   'Based on the latest data, your current monthly recurring revenue (MRR) is $4.2M, which represents a 12.5% growth rate compared to the previous period. This is a strong performance!',
   'gemini-2.0-flash',
   145,
   856,
   'completed'),

  ('770e8400-e29b-41d4-a716-446655440000',
   'How many new customers did we acquire this month?',
   'You acquired 1,027 new customers this month. Your total customer base is now 12,458, representing an 8.3% growth rate. Additionally, your retention rate is 94.2%, which is excellent!',
   'gemini-2.0-flash',
   168,
   923,
   'completed'),

  ('770e8400-e29b-41d4-a716-446655440000',
   'What are the top performing marketing channels?',
   'Based on the MQL data, your top performing marketing channels are:\n1. Organic - 320 MQLs (37.6%)\n2. Paid - 280 MQLs (32.9%)\n3. Referral - 150 MQLs (17.6%)\n4. Email - 100 MQLs (11.8%)\n\nOrganic and paid channels are performing best, though there''s been a slight -1.8% decrease in overall MQLs.',
   'gemini-2.0-flash',
   198,
   1042,
   'completed')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERT SAMPLE WORKFLOWS
-- ============================================================================

INSERT INTO unifiedai.workflows (name, description, triggers, steps, enabled, organization_id, created_by)
VALUES
  ('Daily Sales Report',
   'Automatically generate and email daily sales reports to the leadership team',
   jsonb_build_object(
     'type', 'schedule',
     'schedule', '0 9 * * *',
     'timezone', 'America/New_York'
   ),
   jsonb_build_array(
     jsonb_build_object('action', 'query_metrics', 'metric', 'revenue_mrr'),
     jsonb_build_object('action', 'query_metrics', 'metric', 'customers_total'),
     jsonb_build_object('action', 'generate_report', 'template', 'daily_sales'),
     jsonb_build_object('action', 'send_email', 'recipients', jsonb_build_array('admin@forever-tech.com'))
   ),
   true,
   '550e8400-e29b-41d4-a716-446655440000',
   '770e8400-e29b-41d4-a716-446655440000'),

  ('Customer Onboarding Automation',
   'Automatically onboard new customers when they sign up',
   jsonb_build_object(
     'type', 'webhook',
     'event', 'customer.created'
   ),
   jsonb_build_array(
     jsonb_build_object('action', 'send_welcome_email'),
     jsonb_build_object('action', 'create_support_ticket'),
     jsonb_build_object('action', 'notify_account_manager'),
     jsonb_build_object('action', 'log_to_crm')
   ),
   true,
   '550e8400-e29b-41d4-a716-446655440000',
   '770e8400-e29b-41d4-a716-446655440000'),

  ('Data Quality Check',
   'Run data quality checks every hour and alert on issues',
   jsonb_build_object(
     'type', 'schedule',
     'schedule', '0 * * * *'
   ),
   jsonb_build_array(
     jsonb_build_object('action', 'check_data_quality'),
     jsonb_build_object('action', 'generate_quality_report'),
     jsonb_build_object('action', 'alert_if_threshold_exceeded', 'threshold', 0.85)
   ),
   true,
   '550e8400-e29b-41d4-a716-446655440000',
   '770e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERT SAMPLE SYNC JOBS
-- ============================================================================

INSERT INTO unifiedai.sync_jobs (source_id, status, records_processed, records_failed, started_at, completed_at)
VALUES
  ('880e8400-e29b-41d4-a716-446655440000', 'completed', 15420, 0, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour 55 minutes'),
  ('880e8400-e29b-41d4-a716-446655440001', 'completed', 3240, 12, CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '55 minutes'),
  ('880e8400-e29b-41d4-a716-446655440002', 'completed', 8920, 5, CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '25 minutes'),
  ('880e8400-e29b-41d4-a716-446655440003', 'completed', 45, 0, CURRENT_TIMESTAMP - INTERVAL '10 minutes', CURRENT_TIMESTAMP - INTERVAL '9 minutes')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- CREATE SAMPLE VIEWS FOR ANALYTICS
-- ============================================================================

-- View for latest metrics
CREATE OR REPLACE VIEW unifiedai.latest_metrics AS
SELECT DISTINCT ON (entity_id)
  entity_id,
  data,
  quality_score,
  created_at
FROM unifiedai.data_records
WHERE entity_type = 'metric'
ORDER BY entity_id, created_at DESC;

-- View for active data sources
CREATE OR REPLACE VIEW unifiedai.active_data_sources AS
SELECT
  ds.id,
  ds.name,
  ds.type,
  ds.connector_type,
  ds.status,
  ds.last_sync_at,
  o.name as organization_name,
  COUNT(dr.id) as total_records
FROM unifiedai.data_sources ds
LEFT JOIN unifiedai.organizations o ON ds.organization_id = o.id
LEFT JOIN unifiedai.data_records dr ON ds.id = dr.source_id
WHERE ds.status = 'connected'
GROUP BY ds.id, ds.name, ds.type, ds.connector_type, ds.status, ds.last_sync_at, o.name;

-- View for user activity
CREATE OR REPLACE VIEW unifiedai.user_activity AS
SELECT
  u.id,
  u.email,
  u.name,
  u.role,
  o.name as organization_name,
  COUNT(DISTINCT q.id) as total_queries,
  MAX(q.created_at) as last_query_at,
  u.last_login_at
FROM unifiedai.users u
LEFT JOIN unifiedai.organizations o ON u.organization_id = o.id
LEFT JOIN unifiedai.queries q ON u.id = q.user_id
GROUP BY u.id, u.email, u.name, u.role, o.name, u.last_login_at;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Seed data inserted successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Test Accounts:';
  RAISE NOTICE '  - admin@forever-tech.com (Admin)';
  RAISE NOTICE '  - user@forever-tech.com (User)';
  RAISE NOTICE '  - demo@demo-org.com (Demo User)';
  RAISE NOTICE '';
  RAISE NOTICE 'Sample Data:';
  RAISE NOTICE '  - 2 Organizations';
  RAISE NOTICE '  - 3 Users';
  RAISE NOTICE '  - 4 Data Sources';
  RAISE NOTICE '  - 7 Metrics';
  RAISE NOTICE '  - 3 Sample Queries';
  RAISE NOTICE '  - 3 Workflows';
  RAISE NOTICE '';
  RAISE NOTICE 'You can now:';
  RAISE NOTICE '  1. Connect your frontend to the backend API';
  RAISE NOTICE '  2. Test AI chat with real data context';
  RAISE NOTICE '  3. View metrics on the dashboard';
  RAISE NOTICE '';
END $$;
