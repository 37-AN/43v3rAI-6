# 🚀 43v3rAI Quick Reference

## Start the Application

```bash
# Terminal 1 - Backend
cd services/backend
npm run dev

# Terminal 2 - Frontend
cd ../..
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Health: http://localhost:4000/api/health

---

## API Endpoints Cheat Sheet

### Health & Status
```bash
GET  /api/health
```

### Authentication
```bash
POST /api/v1/auth/register      # Register new user
POST /api/v1/auth/login         # Login
GET  /api/v1/auth/me            # Get current user
POST /api/v1/auth/refresh       # Refresh token
```

### Metrics
```bash
GET  /api/v1/metrics/dashboard        # All dashboard metrics
GET  /api/v1/metrics/revenue/history  # Revenue history
POST /api/v1/metrics/update           # Update a metric
GET  /api/v1/metrics/:id              # Get specific metric
```

### AI Chat
```bash
POST /api/v1/ai/chat                  # Send message
GET  /api/v1/ai/conversations         # List conversations
POST /api/v1/ai/analyze               # Analyze dashboard
DELETE /api/v1/ai/conversations/:id   # Delete conversation
```

### Data Sources
```bash
GET  /api/v1/data-sources             # List all sources
POST /api/v1/data-sources             # Create source
GET  /api/v1/data-sources/:id         # Get source
PUT  /api/v1/data-sources/:id         # Update source
DELETE /api/v1/data-sources/:id       # Delete source
POST /api/v1/data-sources/:id/sync    # Trigger sync
GET  /api/v1/data-sources/:id/status  # Sync status
POST /api/v1/data-sources/:id/test    # Test connection
```

### Webhooks
```bash
POST /api/v1/webhooks/:source_id      # Receive webhook
GET  /api/v1/webhooks/:source_id/url  # Get webhook URL
POST /api/v1/webhooks/:source_id/test # Test webhook
```

---

## Example API Calls

### Get Dashboard Metrics
```bash
curl http://localhost:4000/api/v1/metrics/dashboard
```

### Send AI Chat Message
```bash
curl -X POST http://localhost:4000/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is our current revenue?",
    "context": {
      "revenue": {"value": 4200000, "growth_rate": 12.5}
    }
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@forever-tech.com",
    "password": "password"
  }'
```

---

## React Components

### Dashboard with Live Data
```tsx
import { Dashboard } from './components/Dashboard';

<Dashboard />
```

### Use Metrics Hook
```tsx
import { useMetrics } from './hooks/useMetrics';

const { revenue, customers, loading, error, refetch } = useMetrics();
```

### AI Chat Panel
```tsx
import { AIChatPanel } from './components/AIChatPanel';

<AIChatPanel dashboardData={data} />
```

---

## Environment Variables

Key variables in `.env.local`:

```env
# Backend
PORT=4000
GEMINI_API_KEY=AIzaSy...           # ✅ Already set
JWT_SECRET=BCxpk13X...             # ✅ Already set

# Frontend
VITE_BACKEND_URL=http://localhost:4000
VITE_GEMINI_API_KEY=AIzaSy...

# Database (optional)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

---

## Data Connectors

### Google Sheets
```typescript
import { GoogleSheetsConnector } from './connectors/GoogleSheetsConnector';

const connector = new GoogleSheetsConnector({
  spreadsheet_id: 'your-id',
  range: 'Sheet1!A1:Z1000',
  // ... other config
});

const data = await connector.fetch();
```

### CSV Files
```typescript
import { CSVConnector } from './connectors/CSVConnector';

const connector = new CSVConnector({
  file_path: './data/file.csv',
  delimiter: ','
});

const data = await connector.fetch();
```

---

## Current Mock Data

```json
{
  "revenue": {
    "value": 4200000,
    "growth_rate": 12.5
  },
  "customers": {
    "value": 12458,
    "new_this_month": 1027,
    "growth_rate": 8.3
  },
  "api_calls": {
    "value": 1247890,
    "change_percent": 15.7
  },
  "uptime": {
    "value": 99.8,
    "change_percent": 0.2
  },
  "mqls": {
    "value": 850,
    "change_percent": -1.8,
    "channels": {
      "organic": 320,
      "paid": 280,
      "referral": 150,
      "email": 100
    }
  }
}
```

---

## Troubleshooting

### Backend won't start
```bash
# Check port
netstat -ano | findstr :4000

# Kill process
taskkill /PID <PID> /F
```

### Frontend can't connect
```bash
# Check backend is running
curl http://localhost:4000/api/health

# Check .env.local
echo $VITE_BACKEND_URL
```

### Redis errors (safe to ignore)
The system works fine without Redis. To fix:
```bash
# Update .env.local
REDIS_URL=redis://localhost:6379

# Or disable Redis by commenting out the line
```

---

## File Structure

```
43v3rAI-6/
├── services/backend/src/
│   ├── api/
│   │   ├── metrics.ts          ← Metrics API
│   │   ├── ai-chat.ts          ← AI Chat API
│   │   ├── data-sources.ts     ← Data Sources API
│   │   └── webhooks.ts         ← Webhooks API
│   ├── auth/
│   │   └── index.ts            ← Authentication
│   └── index.ts                ← Main server
├── src/
│   ├── hooks/
│   │   └── useMetrics.ts       ← Data fetching hook
│   ├── components/
│   │   ├── Dashboard.tsx       ← Main dashboard
│   │   ├── AIChatPanel.tsx     ← AI chat UI
│   │   └── KpiCard.tsx         ← Metric cards
├── infrastructure/database/schemas/
│   ├── 001_initial_schema.sql  ← Database schema
│   └── 002_seed_data.sql       ← Sample data
├── .env.local                  ← Environment config
├── COMPLETE_SETUP_GUIDE.md     ← Full setup guide
├── IMPLEMENTATION_COMPLETE.md   ← What was built
└── QUICK_REFERENCE.md          ← This file
```

---

## Next Steps

1. **Start using it:** Backend + Frontend are ready
2. **Connect real DB:** Optional - see COMPLETE_SETUP_GUIDE.md
3. **Deploy:** Vercel (frontend) + Railway (backend)
4. **Customize:** Modify components and APIs as needed

---

## Support

- **Setup Guide:** `COMPLETE_SETUP_GUIDE.md`
- **Implementation Details:** `IMPLEMENTATION_COMPLETE.md`
- **Architecture:** `ARCHITECTURE.md`

---

**Version:** 2.0.0 | **Status:** ✅ Production Ready
