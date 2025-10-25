#!/bin/bash

# UnifiedAI Local Development Setup Script
# This script sets up everything needed for local development

set -e

echo "🚀 UnifiedAI - Local Development Setup"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js version
check_node() {
    echo "📋 Checking Node.js version..."

    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        echo "Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js version must be 18 or higher${NC}"
        echo "Current version: $(node -v)"
        exit 1
    fi

    echo -e "${GREEN}✅ Node.js $(node -v) installed${NC}"
}

# Check if Docker is installed
check_docker() {
    echo "📋 Checking Docker..."

    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}⚠️  Docker is not installed${NC}"
        echo "Docker is optional but recommended for full-stack development"
        echo "Install from: https://docs.docker.com/get-docker/"
        return 1
    fi

    if ! docker info &> /dev/null; then
        echo -e "${YELLOW}⚠️  Docker is not running${NC}"
        echo "Please start Docker Desktop"
        return 1
    fi

    echo -e "${GREEN}✅ Docker is installed and running${NC}"
    return 0
}

# Setup environment variables
setup_env() {
    echo ""
    echo "🔐 Setting up environment variables..."

    if [ -f .env.local ]; then
        echo -e "${YELLOW}⚠️  .env.local already exists${NC}"
        read -p "Overwrite? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Skipping environment setup"
            return
        fi
    fi

    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"

    echo ""
    echo "📝 Please edit .env.local and add your API keys:"
    echo "   - GEMINI_API_KEY (required)"
    echo "   - OPENAI_API_KEY (optional)"
    echo "   - ANTHROPIC_API_KEY (optional)"
    echo ""

    read -p "Open .env.local now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} .env.local
    fi
}

# Install dependencies
install_deps() {
    echo ""
    echo "📦 Installing dependencies..."

    # Root dependencies
    echo "Installing root dependencies..."
    npm install

    # Backend dependencies
    if [ -d "services/backend" ]; then
        echo "Installing backend dependencies..."
        cd services/backend && npm install && cd ../..
    fi

    # Service dependencies
    for service in services/*/; do
        if [ -f "$service/package.json" ]; then
            echo "Installing dependencies for $(basename $service)..."
            cd "$service" && npm install && cd ../..
        fi
    done

    echo -e "${GREEN}✅ All dependencies installed${NC}"
}

# Start Docker services
start_docker() {
    echo ""
    echo "🐳 Starting Docker services..."

    cd infrastructure/docker

    # Check if services are already running
    if docker-compose ps | grep -q "Up"; then
        echo -e "${YELLOW}⚠️  Some services are already running${NC}"
        read -p "Restart all services? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down
        else
            cd ../..
            return
        fi
    fi

    # Start services
    docker-compose up -d

    echo ""
    echo "⏳ Waiting for services to be ready..."
    sleep 10

    # Check service health
    echo ""
    echo "Checking service health..."
    docker-compose ps

    cd ../..
    echo -e "${GREEN}✅ Docker services started${NC}"
}

# Initialize database
init_database() {
    echo ""
    echo "🗄️  Initializing database..."

    # Wait for PostgreSQL to be ready
    echo "Waiting for PostgreSQL..."
    until docker exec unifiedai-postgres pg_isready -U unifiedai_admin &> /dev/null; do
        sleep 1
    done

    # Run migrations
    echo "Running database migrations..."
    docker exec -i unifiedai-postgres psql -U unifiedai_admin -d unifiedai < infrastructure/database/schemas/001_initial_schema.sql

    echo -e "${GREEN}✅ Database initialized${NC}"
}

# Display service URLs
show_services() {
    echo ""
    echo "======================================"
    echo "🎉 Setup Complete!"
    echo "======================================"
    echo ""
    echo "📍 Service URLs:"
    echo "   Frontend:      http://localhost:3000"
    echo "   Backend API:   http://localhost:8000"
    echo "   PostgreSQL:    localhost:5432"
    echo "   Redis:         localhost:6379"
    echo "   Elasticsearch: http://localhost:9200"
    echo "   Milvus:        localhost:19530"
    echo "   Kafka:         localhost:9092"
    echo "   Airflow:       http://localhost:8080 (admin/admin)"
    echo "   Prometheus:    http://localhost:9090"
    echo "   Grafana:       http://localhost:3001 (admin/admin)"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Start frontend:  npm run dev"
    echo "   2. Start backend:   cd services/backend && npm run dev"
    echo "   3. Open browser:    http://localhost:3000"
    echo ""
    echo "📚 Documentation:"
    echo "   - Architecture:     docs/ARCHITECTURE.md"
    echo "   - Implementation:   docs/IMPLEMENTATION_GUIDE.md"
    echo "   - Claude.md:        Claude.md"
    echo ""
    echo "💡 Useful commands:"
    echo "   - View logs:        cd infrastructure/docker && docker-compose logs -f"
    echo "   - Stop services:    cd infrastructure/docker && docker-compose down"
    echo "   - Restart services: cd infrastructure/docker && docker-compose restart"
    echo ""
}

# Main setup flow
main() {
    check_node

    local use_docker=false
    if check_docker; then
        use_docker=true
    fi

    setup_env
    install_deps

    if $use_docker; then
        read -p "Start Docker services? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            start_docker
            init_database
        fi
    else
        echo ""
        echo -e "${YELLOW}⚠️  Docker not available${NC}"
        echo "You can still develop the frontend without Docker"
        echo "Backend services will need to be configured manually"
    fi

    show_services
}

# Run main function
main
