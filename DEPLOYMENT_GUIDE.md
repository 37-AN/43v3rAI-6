# 🚀 43v3rAI Deployment Guide

## Quick Deploy (Free Hosting)

This guide will deploy your application to **100% free hosting**:
- **Frontend**: Vercel (Unlimited bandwidth)
- **Backend**: Railway ($5 credit/month, no credit card required initially)

---

## Prerequisites

1. **GitHub Account** (for deploying from repository)
2. **Vercel Account** (sign up at https://vercel.com)
3. **Railway Account** (sign up at https://railway.app)

---

## Step 1: Test Local Build

Before deploying, let's ensure everything builds correctly.

### Test Frontend Build

```bash
# Build frontend
npm run build

# Preview the build
npm run preview

# Should open at http://localhost:4173
```

### Test Backend Build

```bash
cd services/backend

# Build TypeScript
npm run build

# Test the production build
npm run start

# Should start on port 4000
```

If both builds work, you're ready to deploy! 🎉

---

## Step 2: Prepare for Deployment

### A. Update Environment Variables

Create `.env.production` in the root:

```env
# Frontend Production Environment
VITE_BACKEND_URL=https://your-backend.railway.app
VITE_GEMINI_API_KEY=AIzaSyCQ3zhC9tW8pXV4P4VIMkov5rizAC5mlQk
```

### B. Commit Your Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "feat: production-ready deployment"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/43v3rai.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Railway

### Option A: Deploy via Railway CLI (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend directory
cd services/backend

# Initialize Railway project
railway init

# Set environment variables
railway variables set GEMINI_API_KEY=AIzaSyCQ3zhC9tW8pXV4P4VIMkov5rizAC5mlQk
railway variables set JWT_SECRET=BCxpk13XZ+CDODFi54K8OZtpnbqPGRskEbcJSbWMvdk=
railway variables set SESSION_SECRET=kEaZeYMRm/O9hBqCA6QCKTpLbw/Gmn5EI4a05s9x/ds=
railway variables set ENCRYPTION_KEY=296bc4c9d44d07b100882142816e2e096a60fb846a69a3a85f086abc484bf119
railway variables set NODE_ENV=production
railway variables set PORT=4000

# Deploy
railway up

# Get the deployment URL
railway domain
```

### Option B: Deploy via Railway Dashboard

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Select `services/backend` as the root directory
5. Add environment variables:
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `SESSION_SECRET`
   - `ENCRYPTION_KEY`
   - `NODE_ENV=production`
   - `PORT=4000`
6. Click "Deploy"

**Copy your Railway backend URL** (e.g., `https://your-app.railway.app`)

---

## Step 4: Deploy Frontend to Vercel

### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from root directory)
vercel

# Follow prompts:
# - Project name: 43v3rai
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist

# Set environment variables
vercel env add VITE_BACKEND_URL production
# Enter: https://your-backend.railway.app

vercel env add VITE_GEMINI_API_KEY production
# Enter: AIzaSyCQ3zhC9tW8pXV4P4VIMkov5rizAC5mlQk

# Deploy to production
vercel --prod
```

### Option B: Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variables**:
   - `VITE_BACKEND_URL` = `https://your-backend.railway.app`
   - `VITE_GEMINI_API_KEY` = `AIzaSyCQ3zhC9tW8pXV4P4VIMkov5rizAC5mlQk`
6. Click "Deploy"

**Copy your Vercel frontend URL** (e.g., `https://43v3rai.vercel.app`)

---

## Step 5: Update Backend CORS

After deploying frontend, update backend to allow your frontend domain.

### Update `.env` on Railway:

```env
CORS_ORIGIN=https://your-frontend.vercel.app,http://localhost:3000
```

Or via Railway CLI:

```bash
railway variables set CORS_ORIGIN=https://your-frontend.vercel.app,http://localhost:3000
```

---

## Step 6: Verify Deployment

### Test Backend

```bash
# Health check
curl https://your-backend.railway.app/api/health

# Expected response:
# {"status":"ok","timestamp":...}

# Test metrics
curl https://your-backend.railway.app/api/v1/metrics/dashboard
```

### Test Frontend

1. Open your Vercel URL: `https://your-frontend.vercel.app`
2. You should see:
   - ✅ Dashboard loads
   - ✅ Metrics displayed
   - ✅ AI chat works
   - ✅ No console errors

### Test Integration

1. Open browser console (F12)
2. Go to Network tab
3. Reload page
4. Check that API calls go to your Railway backend
5. Verify responses are successful (200 OK)

---

## Troubleshooting

### Frontend can't connect to backend

**Problem**: API calls failing with CORS errors

**Solution**:
1. Verify `VITE_BACKEND_URL` is set correctly on Vercel
2. Update `CORS_ORIGIN` on Railway to include your Vercel URL
3. Redeploy backend after changing CORS

```bash
# Railway CLI
railway variables set CORS_ORIGIN=https://your-frontend.vercel.app

# Redeploy
railway up
```

### Backend deployment fails

**Problem**: Build errors or crashes

**Solution**:
1. Check Railway logs: `railway logs`
2. Verify all environment variables are set
3. Ensure `package.json` has correct `start` script
4. Check TypeScript builds locally: `npm run build`

### Environment variables not loading

**Problem**: Backend returns errors about missing API keys

**Solution**:
1. Verify variables in Railway dashboard
2. Restart the deployment
3. Check variable names match exactly (case-sensitive)

### Build succeeds but app doesn't work

**Problem**: White screen or errors in production

**Solution**:
1. Check browser console for errors
2. Verify environment variables in Vercel
3. Test build locally: `npm run build && npm run preview`
4. Check that `VITE_BACKEND_URL` includes `https://`

---

## Production Checklist

Before going live, verify:

- [ ] Backend deployed to Railway
- [ ] Backend health check returns OK
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads without errors
- [ ] API calls reach backend successfully
- [ ] AI chat works
- [ ] Metrics display correctly
- [ ] CORS configured correctly
- [ ] All environment variables set
- [ ] No console errors in browser
- [ ] Mobile responsive design works

---

## Continuous Deployment

Both Vercel and Railway support automatic deployments:

### Auto-deploy from GitHub

1. **Vercel**: Automatically deploys on push to `main` branch
2. **Railway**: Configure GitHub integration for auto-deploy

**Workflow**:
```bash
# Make changes locally
git add .
git commit -m "feat: new feature"
git push

# Vercel and Railway auto-deploy!
# ✅ Frontend updates in ~2 minutes
# ✅ Backend updates in ~3 minutes
```

---

## Monitoring & Logs

### View Backend Logs (Railway)

```bash
# CLI
railway logs

# Or view in Railway dashboard → Deployments → Logs
```

### View Frontend Logs (Vercel)

```bash
# CLI
vercel logs

# Or view in Vercel dashboard → Deployments → Logs
```

### Set Up Monitoring

**Free Options**:
1. **Sentry** (5K errors/month free) - Error tracking
2. **PostHog** (1M events/month free) - Analytics
3. **UptimeRobot** (50 monitors free) - Uptime monitoring

---

## Scaling

### When to Upgrade

**Backend (Railway)**:
- Free tier: $5 credit/month (~500 hours)
- Upgrade when: Traffic exceeds free hours
- Cost: ~$10-20/month for 10K users

**Frontend (Vercel)**:
- Free tier: Unlimited bandwidth
- Upgrade when: Need team features or more builds
- Cost: $20/month for Pro plan

**Database**:
- Currently: Mock data (free)
- Upgrade to: Supabase ($25/month for 8GB)
- When: Need real database persistence

---

## Quick Commands Reference

```bash
# Deploy backend
cd services/backend
railway up

# Deploy frontend
vercel --prod

# View logs
railway logs          # Backend logs
vercel logs           # Frontend logs

# Update environment variables
railway variables set KEY=VALUE
vercel env add KEY production

# Redeploy
railway up            # Backend
vercel --prod         # Frontend
```

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Issues**: Open an issue on GitHub

---

## Success!

Your application is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`

**Total Cost**: $0-5/month (using free tiers)

---

**Last Updated**: 2025-10-26
**Deployment Status**: Production Ready ✅
