# Quick Deployment Script for UnifiedAI
# Deploys to Vercel (frontend) + Railway (backend) + Supabase (database)

#!/bin/bash

set -e

echo "🚀 UnifiedAI - Free Hosting Deployment Script"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_dependencies() {
    echo "📋 Checking dependencies..."

    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi

    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ git is not installed${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ All dependencies installed${NC}"
    echo ""
}

# Install CLI tools
install_cli_tools() {
    echo "📦 Installing deployment CLI tools..."

    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi

    if ! command -v railway &> /dev/null; then
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
    fi

    echo -e "${GREEN}✅ CLI tools installed${NC}"
    echo ""
}

# Prompt for environment variables
setup_environment() {
    echo "🔐 Setting up environment variables..."
    echo ""

    # Supabase
    read -p "Enter your Supabase DATABASE_URL: " DATABASE_URL

    # Gemini API Key
    read -p "Enter your GEMINI_API_KEY: " GEMINI_API_KEY

    # API Key for backend
    read -p "Enter a secure API_KEY (or press enter to generate): " API_KEY
    if [ -z "$API_KEY" ]; then
        API_KEY=$(openssl rand -hex 32)
        echo "Generated API_KEY: $API_KEY"
    fi

    echo ""
    echo -e "${GREEN}✅ Environment variables configured${NC}"
    echo ""
}

# Deploy backend to Railway
deploy_backend() {
    echo "🚂 Deploying backend to Railway..."
    echo ""

    # Login to Railway
    railway login

    # Initialize project if not exists
    if [ ! -f "railway.toml" ]; then
        railway init
    fi

    # Set environment variables
    railway variables set PORT=8000
    railway variables set NODE_ENV=production
    railway variables set DATABASE_URL="$DATABASE_URL"
    railway variables set GEMINI_API_KEY="$GEMINI_API_KEY"
    railway variables set API_KEY="$API_KEY"

    # Deploy
    railway up

    # Get the backend URL
    BACKEND_URL=$(railway domain)

    echo ""
    echo -e "${GREEN}✅ Backend deployed to Railway${NC}"
    echo -e "${YELLOW}Backend URL: $BACKEND_URL${NC}"
    echo ""

    # Save for frontend
    export VITE_BACKEND_URL="https://$BACKEND_URL"
}

# Deploy frontend to Vercel
deploy_frontend() {
    echo "▲ Deploying frontend to Vercel..."
    echo ""

    # Login to Vercel
    vercel login

    # Set environment variables
    cat > .env.production << EOF
VITE_BACKEND_URL=$VITE_BACKEND_URL
VITE_GEMINI_API_KEY=$GEMINI_API_KEY
EOF

    # Deploy to production
    vercel --prod \
        -e VITE_BACKEND_URL="$VITE_BACKEND_URL" \
        -e VITE_GEMINI_API_KEY="$GEMINI_API_KEY"

    echo ""
    echo -e "${GREEN}✅ Frontend deployed to Vercel${NC}"
    echo ""
}

# Update backend CORS
update_cors() {
    echo "🔒 Updating CORS configuration..."

    VERCEL_URL=$(vercel inspect --prod | grep "URL:" | awk '{print $2}')

    railway variables set CORS_ORIGIN="$VERCEL_URL"
    railway up

    echo -e "${GREEN}✅ CORS updated${NC}"
    echo ""
}

# Main deployment flow
main() {
    echo "Starting deployment process..."
    echo ""

    check_dependencies
    install_cli_tools
    setup_environment
    deploy_backend
    deploy_frontend
    update_cors

    echo ""
    echo "=============================================="
    echo -e "${GREEN}🎉 Deployment Complete!${NC}"
    echo "=============================================="
    echo ""
    echo -e "Frontend URL: ${YELLOW}$(vercel inspect --prod | grep "URL:" | awk '{print $2}')${NC}"
    echo -e "Backend URL:  ${YELLOW}$VITE_BACKEND_URL${NC}"
    echo ""
    echo "📝 Next steps:"
    echo "1. Visit your frontend URL to test the app"
    echo "2. Check Railway logs for backend health"
    echo "3. Initialize database schema in Supabase"
    echo "4. Configure monitoring and alerts"
    echo ""
    echo "For more details, see docs/FREE_DEPLOYMENT_GUIDE.md"
}

# Run main function
main
