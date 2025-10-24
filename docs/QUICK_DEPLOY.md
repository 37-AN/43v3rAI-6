# Quick Deployment Guide - 5 Minutes

Deploy UnifiedAI to free hosting in under 5 minutes!

## 🚀 One-Command Deployment

```bash
bash deploy.sh
```

The script will automatically:
- ✅ Install Vercel and Railway CLIs
- ✅ Deploy backend to Railway
- ✅ Deploy frontend to Vercel
- ✅ Configure environment variables
- ✅ Set up CORS

---

## 📋 Prerequisites (2 minutes)

### 1. Get Free Accounts

Create free accounts (no credit card required):
- [Vercel](https://vercel.com/signup) - Frontend hosting
- [Railway](https://railway.app) - Backend hosting
- [Supabase](https://supabase.com) - Database

### 2. Get API Keys

- **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 3. Set Up Database

1. Create Supabase project: https://supabase.com/dashboard
2. Copy your database URL from **Settings** → **Database** → **Connection string** → **URI**
3. In **SQL Editor**, run this:
   ```sql
   -- Copy from infrastructure/database/schemas/001_initial_schema.sql
   ```

---

## 🎯 Manual Deployment (Alternative)

### Option 1: Deploy via Vercel Dashboard

**Frontend:**
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Set environment variables:
   ```
   VITE_BACKEND_URL=https://your-backend.railway.app
   VITE_GEMINI_API_KEY=your_key_here
   ```
4. Click **Deploy**

**Backend:**
1. Go to https://railway.app/new
2. Select "Deploy from GitHub repo"
3. Choose your repo
4. Add environment variables:
   ```
   PORT=8000
   NODE_ENV=production
   DATABASE_URL=your_supabase_url
   GEMINI_API_KEY=your_key
   CORS_ORIGIN=https://your-app.vercel.app
   ```
5. Deploy

### Option 2: Deploy via CLI

**Install CLIs:**
```bash
npm install -g vercel @railway/cli
```

**Deploy Backend:**
```bash
railway login
railway init
railway variables set PORT=8000
railway variables set DATABASE_URL="your_supabase_url"
railway variables set GEMINI_API_KEY="your_key"
railway up
```

**Deploy Frontend:**
```bash
vercel login
vercel --prod \
  -e VITE_BACKEND_URL="https://your-backend.railway.app" \
  -e VITE_GEMINI_API_KEY="your_key"
```

---

## ✅ Post-Deployment Checklist

- [ ] Frontend is accessible at `https://your-app.vercel.app`
- [ ] Backend is running at `https://your-backend.railway.app/api/health`
- [ ] Database tables are created in Supabase
- [ ] Can log in with `admin@unifiedai.com` / `changeme`
- [ ] AI chat works
- [ ] Data sources page loads

---

## 🔧 Environment Variables Reference

### Frontend (Vercel)
```env
VITE_BACKEND_URL=https://your-backend.railway.app
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Backend (Railway)
```env
PORT=8000
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@host:5432/postgres
GEMINI_API_KEY=your_gemini_api_key
API_KEY=your_random_secure_key
CORS_ORIGIN=https://your-app.vercel.app
```

---

## 🐛 Troubleshooting

**Issue: "Cannot connect to backend"**
- Check Railway logs: `railway logs`
- Verify `VITE_BACKEND_URL` in Vercel
- Ensure CORS_ORIGIN is set correctly

**Issue: "Database connection failed"**
- Check `DATABASE_URL` is correct in Railway
- Verify Supabase project is active
- Test connection from SQL Editor

**Issue: "Build failed on Vercel"**
- Run `npm install && npm run build` locally
- Check for TypeScript errors
- Review Vercel build logs

---

## 📊 Free Tier Limits

| Service | Free Tier | Limits |
|---------|-----------|---------|
| Vercel | ✅ Forever free | 100GB bandwidth, serverless |
| Railway | ✅ $5/month credit | 500 hours, 512MB RAM |
| Supabase | ✅ Forever free | 500MB DB, 2GB storage |

**Total Cost: $0/month** (within limits)

---

## 🎉 You're Live!

Your UnifiedAI platform is now running on:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.railway.app`
- **Database:** Supabase

### Next Steps:
1. Change default password
2. Connect your first data source
3. Try the AI chat
4. Invite team members
5. Set up custom domain (optional)

---

## 📚 More Resources

- [Full Deployment Guide](./FREE_DEPLOYMENT_GUIDE.md)
- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md)
- [MVP Roadmap](./MVP_ROADMAP.md)

---

**Need Help?** Open an issue on GitHub or check the troubleshooting section.
