# UnifiedAI Infrastructure

This directory contains all infrastructure-as-code (IaC) configurations for deploying UnifiedAI.

## Directory Structure

```
infrastructure/
├── terraform/          # Terraform configurations for AWS
├── kubernetes/         # Kubernetes manifests
├── docker/            # Docker Compose for local development
├── database/          # Database schemas and migrations
└── README.md          # This file
```

---

## Quick Start

### Local Development

1. **Start all services locally:**
   ```bash
   cd infrastructure/docker
   docker-compose up -d
   ```

2. **Access services:**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379
   - Elasticsearch: http://localhost:9200
   - Milvus: localhost:19530
   - Kafka: localhost:9092
   - Airflow: http://localhost:8080 (admin/admin)
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3001 (admin/admin)

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

---

## AWS Deployment

### Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform >= 1.6.0
- kubectl
- Helm 3

### Setup

1. **Initialize Terraform:**
   ```bash
   cd infrastructure/terraform
   terraform init
   ```

2. **Review the plan:**
   ```bash
   terraform plan -var="environment=prod"
   ```

3. **Deploy infrastructure:**
   ```bash
   terraform apply -var="environment=prod"
   ```

4. **Configure kubectl:**
   ```bash
   aws eks update-kubeconfig --name unifiedai-prod-eks --region us-east-1
   ```

5. **Verify connection:**
   ```bash
   kubectl get nodes
   ```

---

## Terraform Configuration

### Variables

Create a `terraform.tfvars` file:

```hcl
aws_region             = "us-east-1"
environment           = "prod"
vpc_cidr              = "10.0.0.0/16"
rds_instance_class    = "db.r5.xlarge"
redis_node_type       = "cache.r5.large"
kafka_instance_type   = "kafka.m5.large"
opensearch_instance_type = "r5.large.search"
```

### Environments

- **dev:** Single AZ, minimal resources
- **staging:** Multi-AZ, moderate resources
- **prod:** Multi-AZ, high availability, auto-scaling

### State Management

Terraform state is stored in S3:
- Bucket: `unifiedai-terraform-state`
- Key: `{environment}/terraform.tfstate`
- Region: `us-east-1`
- Encryption: Enabled
- Locking: DynamoDB table `terraform-state-lock`

---

## Database Schemas

### Initial Schema

The initial database schema is located in:
```
database/schemas/001_initial_schema.sql
```

### Applying Migrations

**Local (Docker):**
```bash
docker exec -i unifiedai-postgres psql -U unifiedai_admin -d unifiedai < database/schemas/001_initial_schema.sql
```

**AWS RDS:**
```bash
psql -h <rds-endpoint> -U unifiedai_admin -d unifiedai < database/schemas/001_initial_schema.sql
```

### Schema Overview

- **users** - User accounts and authentication
- **organizations** - Multi-tenant organizations
- **data_sources** - Connected data source configurations
- **data_records** - Unified data from all sources
- **queries** - AI query history
- **workflows** - Automation definitions
- **workflow_runs** - Workflow execution history
- **audit_logs** - Security audit trail
- **sync_jobs** - Data synchronization jobs
- **embeddings** - Vector embeddings reference

---

## Kubernetes Deployment

### Helm Charts

Install required Helm charts:

```bash
# Prometheus + Grafana
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack

# NGINX Ingress
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx

# Cert-Manager (for SSL)
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager --set installCRDs=true
```

### Deploy Services

```bash
cd infrastructure/kubernetes
kubectl apply -f namespace.yaml
kubectl apply -f secrets.yaml
kubectl apply -f services/
kubectl apply -f ingress.yaml
```

---

## Monitoring & Logging

### Prometheus Metrics

Access Prometheus at: http://localhost:9090 (local) or via LoadBalancer (prod)

**Key Metrics:**
- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request latency
- `data_sync_duration_seconds` - Data sync duration
- `query_accuracy_score` - AI query accuracy
- `system_cpu_usage` - CPU utilization
- `system_memory_usage` - Memory utilization

### Grafana Dashboards

Access Grafana at: http://localhost:3001 (local) or via LoadBalancer (prod)

**Pre-configured Dashboards:**
- System Overview
- API Performance
- Data Engine Metrics
- AI Query Analytics
- Infrastructure Health

### ELK Stack (Logging)

All application logs are sent to Elasticsearch and visualized in Kibana.

---

## Backup & Recovery

### Database Backups

**Automated (RDS):**
- Daily automated snapshots
- 30-day retention period
- Point-in-time recovery available

**Manual Backup:**
```bash
pg_dump -h <rds-endpoint> -U unifiedai_admin unifiedai > backup_$(date +%Y%m%d).sql
```

**Restore:**
```bash
psql -h <rds-endpoint> -U unifiedai_admin unifiedai < backup_20240101.sql
```

### S3 Data Lake Backup

Versioning is enabled on all S3 buckets. Deleted objects are retained for 90 days.

---

## Security

### Secrets Management

- **Local:** Environment variables in `.env` files
- **AWS:** AWS Secrets Manager or Parameter Store
- **Kubernetes:** Sealed Secrets or External Secrets Operator

### Network Security

- Private subnets for all services
- Security groups restrict access
- Network ACLs for defense in depth
- VPC peering for inter-region connectivity

### Access Control

- IAM roles with least privilege
- RBAC in Kubernetes
- API key rotation every 90 days
- MFA required for production access

---

## Scaling

### Horizontal Scaling

**EKS Node Groups:**
- Auto-scaling groups per workload type
- Cluster Autoscaler installed
- Scales based on CPU/memory utilization

**Database:**
- Read replicas for PostgreSQL
- ElastiCache cluster mode for Redis
- MSK brokers scaled independently

### Vertical Scaling

Adjust instance types in `terraform.tfvars`:

```hcl
# For more capacity
rds_instance_class = "db.r5.2xlarge"
redis_node_type    = "cache.r5.xlarge"
```

---

## Cost Optimization

### Development Environment

Use smaller instance types:
```hcl
environment = "dev"
rds_instance_class = "db.t3.medium"
redis_node_type    = "cache.t3.medium"
```

### Production Environment

- Use Reserved Instances for 1-year commitment (40% savings)
- Use Spot Instances for non-critical workloads
- Enable S3 Intelligent-Tiering
- Right-size instances based on CloudWatch metrics

### Monitoring Costs

```bash
# AWS Cost Explorer
aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY --metrics BlendedCost
```

---

## Troubleshooting

### Common Issues

**Issue: Cannot connect to RDS**
```bash
# Check security groups
aws ec2 describe-security-groups --group-ids <sg-id>

# Test connection
psql -h <rds-endpoint> -U unifiedai_admin -d unifiedai
```

**Issue: EKS nodes not joining cluster**
```bash
# Check node IAM role
kubectl get nodes
kubectl describe node <node-name>
```

**Issue: High database CPU**
```bash
# Check slow queries
SELECT * FROM pg_stat_activity WHERE state = 'active';

# Enable query logging
ALTER DATABASE unifiedai SET log_min_duration_statement = 1000;
```

---

## Maintenance

### Regular Tasks

**Weekly:**
- Review CloudWatch alarms
- Check backup success
- Review security group changes

**Monthly:**
- Update Terraform modules
- Review cost reports
- Rotate API keys
- Update Docker base images

**Quarterly:**
- SOC 2 compliance review
- Penetration testing
- Disaster recovery drill
- Infrastructure capacity planning

---

## CI/CD Integration

### GitHub Actions

Deployment is automated via GitHub Actions:

```yaml
# .github/workflows/deploy.yml
- Lint and test code
- Build Docker images
- Push to ECR
- Update Kubernetes deployments
- Run smoke tests
- Notify team
```

### Manual Deployment

```bash
# Build and push
docker build -t unifiedai:latest .
docker tag unifiedai:latest <ecr-repo>:latest
docker push <ecr-repo>:latest

# Deploy to Kubernetes
kubectl set image deployment/api-gateway api-gateway=<ecr-repo>:latest
kubectl rollout status deployment/api-gateway
```

---

## Support

For infrastructure issues:
- Check `docs/TECHNICAL_ARCHITECTURE.md`
- Review CloudWatch logs
- Contact DevOps team
- Open GitHub issue

---

**Last Updated:** 2025-10-24
**Maintainer:** UnifiedAI DevOps Team
