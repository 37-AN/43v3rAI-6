# Deploying UnifiedAI to Free Hosting

This guide walks you through deploying UnifiedAI to free hosting platforms.

## Architecture Overview

For free hosting, we'll use:
- **Frontend:** Vercel (free tier - unlimited bandwidth)
- **Backend API:** Railway (free tier - $5 credit/month, no CC required)
- **Database:** Supabase (free tier - 500MB PostgreSQL)
- **File Storage:** Cloudinary (free tier - 25 credits/month)

**Total Cost:** $0/month (within free tier limits)

---

## Prerequisites

1. **GitHub Account** - for deployments
2. **Vercel Account** - Sign up at https://vercel.com
3. **Railway Account** - Sign up at https://railway.app
4. **Supabase Account** - Sign up at https://supabase.com

---

## Part 1: Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Create a new organization (if needed)
4. Click "New Project"
5. Fill in:
   - **Name:** unifiedai-db
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free

6. Wait 2-3 minutes for provisioning

### Step 2: Get Database Connection String

1. In your Supabase project, go to **Settings** → **Database**
2. Scroll to **Connection String** → **URI**
3. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual password
5. Save this for later

### Step 3: Initialize Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New query**
3. Copy the contents of `/infrastructure/database/schemas/001_initial_schema.sql`
4. Paste into the query editor
5. Click **Run**
6. You should see "Success" message

---

## Part 2: Backend Deployment (Railway)

### Step 1: Prepare Backend for Railway

1. Make sure you're in the project root:
   ```bash
   cd /home/user/43v3rAI-6
   ```

2. Ensure `railway.json` exists (already created)

### Step 2: Deploy to Railway

**Option A: Using Railway CLI (Recommended)**

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize project:
   ```bash
   railway init
   ```
   - Select "Empty Project"
   - Name it "unifiedai-backend"

4. Link to your GitHub repo (optional):
   ```bash
   railway link
   ```

5. Add environment variables:
   ```bash
   railway variables set PORT=8000
   railway variables set NODE_ENV=production
   railway variables set DATABASE_URL="your-supabase-connection-string"
   railway variables set GEMINI_API_KEY="your-gemini-api-key"
   ```

6. Deploy:
   ```bash
   railway up
   ```

**Option B: Using Railway Dashboard**

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Authorize Railway to access your GitHub
4. Select your repository
5. Railway will auto-detect Node.js project

6. Add environment variables:
   - Click on your service
   - Go to **Variables** tab
   - Add:
     ```
     PORT=8000
     NODE_ENV=production
     DATABASE_URL=your-supabase-connection-string
     GEMINI_API_KEY=your-gemini-api-key
     API_KEY=your-secure-api-key
     ```

7. Click **Deploy**

### Step 3: Get Backend URL

1. Once deployed, click on your service
2. Go to **Settings** tab
3. Under **Domains**, click "Generate Domain"
4. Copy the domain (e.g., `unifiedai-backend.railway.app`)
5. Save this for frontend configuration

---

## Part 3: Frontend Deployment (Vercel)

### Step 1: Update Environment Variables

1. Create `.env.production` file:
   ```bash
   cat > .env.production << 'EOF'
   VITE_BACKEND_URL=https://your-backend.railway.app
   VITE_GEMINI_API_KEY=your-gemini-api-key
   EOF
   ```

2. Replace `your-backend.railway.app` with your actual Railway domain

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```
   - Select "yes" to set up and deploy
   - Project name: unifiedai
   - Directory: ./
   - Override settings: No

4. For production deployment:
   ```bash
   vercel --prod
   ```

**Option B: Using Vercel Dashboard**

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure project:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. Add environment variables:
   - Click "Environment Variables"
   - Add:
     ```
     VITE_BACKEND_URL=https://your-backend.railway.app
     VITE_GEMINI_API_KEY=your-gemini-api-key
     ```

5. Click **Deploy**

### Step 3: Update Backend CORS

1. Go back to Railway dashboard
2. Add environment variable:
   ```bash
   railway variables set CORS_ORIGIN="https://your-app.vercel.app"
   ```

3. Redeploy:
   ```bash
   railway up
   ```

---

## Part 4: Testing Your Deployment

### Step 1: Access Your App

1. Open your Vercel URL: `https://your-app.vercel.app`
2. You should see the UnifiedAI dashboard
3. Try logging in with default credentials:
   - Email: `admin@unifiedai.com`
   - Password: `changeme`

### Step 2: Test API Connection

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try using the AI chat
4. Check that API calls go to your Railway backend

### Step 3: Verify Database

1. Go to Supabase dashboard
2. Click **Table Editor**
3. Check that `users`, `data_sources`, etc. tables exist

---

## Free Tier Limitations

### Vercel Free Tier
- ✅ Unlimited bandwidth
- ✅ Unlimited deployments
- ✅ 100 GB-hours serverless function execution
- ❌ No custom domain (use .vercel.app)

### Railway Free Tier
- ✅ $5 credit/month
- ✅ 500 hours of usage
- ❌ Apps sleep after 30 min inactivity
- ❌ Limited to 512MB RAM

### Supabase Free Tier
- ✅ 500MB database
- ✅ 50,000 monthly active users
- ✅ 2GB file storage
- ❌ 1GB bandwidth/month
- ❌ Pauses after 1 week inactivity

---

## Cost Optimization Tips

1. **Use Railway efficiently:**
   - Deploy only essential services
   - Use Vercel serverless functions for light backend tasks

2. **Database optimization:**
   - Clean up old data regularly
   - Use indexes efficiently
   - Limit query results

3. **File storage:**
   - Use Cloudinary for images
   - Store large files externally

4. **Upgrade when needed:**
   - Vercel Pro: $20/month (custom domains, analytics)
   - Railway Pro: $20/month (8GB RAM, always on)
   - Supabase Pro: $25/month (8GB database)

---

## Alternative Free Hosting Options

### Frontend Alternatives
- **Netlify** - Similar to Vercel, 100GB bandwidth/month
- **Cloudflare Pages** - Unlimited bandwidth
- **GitHub Pages** - Static sites only

### Backend Alternatives
- **Render** - 750 hours/month free
- **Fly.io** - 3 shared VMs free
- **Cyclic** - Serverless, free tier available

### Database Alternatives
- **Neon** - Serverless PostgreSQL, 0.5GB free
- **PlanetScale** - MySQL, 5GB storage free
- **MongoDB Atlas** - 512MB free

---

## Troubleshooting

### Issue: "Build failed" on Vercel

**Solution:**
```bash
# Ensure package.json has correct build command
npm run build

# Check for TypeScript errors
npm run lint
```

### Issue: Backend not connecting to database

**Solution:**
1. Check Railway logs:
   ```bash
   railway logs
   ```
2. Verify `DATABASE_URL` environment variable
3. Check Supabase firewall settings

### Issue: CORS errors

**Solution:**
1. Update backend CORS configuration
2. Add Vercel URL to `CORS_ORIGIN`
3. Redeploy backend

### Issue: Railway app sleeping

**Solution:**
1. Use a free uptime monitor (e.g., UptimeRobot)
2. Ping your backend every 10 minutes
3. Or upgrade to Railway Pro ($20/mo)

---

## Monitoring Your Deployment

### Vercel Analytics
1. Go to your Vercel project
2. Click **Analytics** tab
3. View real-time traffic and performance

### Railway Metrics
1. Go to your Railway project
2. Click **Metrics** tab
3. View CPU, memory, network usage

### Supabase Monitoring
1. Go to your Supabase project
2. Click **Reports** tab
3. View database performance

---

## Next Steps

Once deployed on free tier:

1. **Custom Domain (Optional)**
   - Purchase domain ($12/year)
   - Add to Vercel project
   - Configure DNS

2. **Set Up Monitoring**
   - UptimeRobot (free)
   - Sentry for error tracking (free tier)

3. **Enable Analytics**
   - Google Analytics (free)
   - Vercel Analytics (included)

4. **Backup Database**
   - Supabase auto-backups (7 days)
   - Manual exports weekly

5. **Plan for Scaling**
   - Monitor usage
   - Upgrade when hitting limits
   - Consider paid tiers at ~100 users

---

## Deployment Checklist

- [ ] Create Supabase account
- [ ] Initialize database schema
- [ ] Get database connection string
- [ ] Create Railway account
- [ ] Deploy backend to Railway
- [ ] Add environment variables
- [ ] Get Railway backend URL
- [ ] Create Vercel account
- [ ] Deploy frontend to Vercel
- [ ] Add frontend environment variables
- [ ] Update CORS settings
- [ ] Test deployment
- [ ] Set up monitoring
- [ ] Configure custom domain (optional)

---

## Support

If you encounter issues:
1. Check Railway/Vercel logs
2. Review Supabase query performance
3. Open GitHub issue
4. Contact support:
   - Railway: https://help.railway.app
   - Vercel: https://vercel.com/support
   - Supabase: https://supabase.com/support

---

**Congratulations! Your UnifiedAI platform is now live on free hosting!** 🎉

Access your app at: `https://your-app.vercel.app`

---

**Last Updated:** 2025-10-24
**Version:** 1.0
