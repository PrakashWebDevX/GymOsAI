# GYMOS AI - Architecture Documentation

## 1. Architecture Overview

GYMOS AI is built as a modern SaaS application using **Clean Architecture** principles:

### Layers

**Presentation Layer (Frontend)**
- React components for UI rendering
- Zustand stores for client-side state
- API service layer for backend communication

**Application Layer (Backend Controllers)**
- HTTP request/response handling
- Input validation via Joi schemas
- Authentication middleware

**Domain Layer (Backend Services)**
- Business logic and rules
- AI orchestration
- Cross-cutting concerns (streaks, achievements)

**Infrastructure Layer (Repositories)**
- Supabase data access
- External API calls (Gemini)
- Database queries

### Data Flow

```
User Action → React Component → Zustand Store → API Client
    → Express Route → Controller → Service → Repository → Supabase
    → Response flows back up the chain
```

---

## 2. Database Schema

15 tables with full relational integrity:

| Table | Purpose |
|-------|---------|
| `users` | Core user accounts |
| `profiles` | Extended user profiles |
| `social_links` | User social media links |
| `fitness_goals` | User fitness targets |
| `body_metrics` | Body composition data |
| `workout_plans` | AI-generated workouts |
| `nutrition_plans` | AI-generated meal plans |
| `daily_tasks` | Daily fitness tasks |
| `completed_tasks` | Task completion records |
| `supplements` | Supplement recommendations |
| `progress_logs` | Weight/measurement logs |
| `progress_photos` | Progress photo uploads |
| `achievements` | Earned achievements |
| `streaks` | Activity streaks |
| `notifications` | User notifications |

All tables include Row Level Security (RLS) policies.

Schema file: `backend/src/database/schema.sql`

---

## 3. Security Implementation

| Feature | Implementation |
|---------|---------------|
| JWT | Custom JWT tokens with configurable expiry |
| Rate Limiting | Global (100/15min), Auth (10/15min), AI (20/hr) |
| Validation | Joi schemas on all POST/PUT endpoints |
| Sanitization | HTML stripping on all request bodies |
| Helmet | Security headers (XSS, CSP, etc.) |
| CORS | Configured origin whitelist |
| RLS | Supabase row-level security policies |

---

## 4. AI Integration (Gemini)

Located in `backend/src/ai/geminiService.js`:

| Function | Purpose |
|----------|---------|
| `generateWorkoutPlan` | Personalized workout with exercises |
| `generateNutritionPlan` | Daily meal plan with macros |
| `analyzeBodyMetrics` | BMI, BMR, TDEE calculations |
| `generateComprehensivePlan` | Multi-week fitness program |
| `recommendFoods` | Goal-based food suggestions |
| `getSupplementAdvice` | Evidence-based supplement guidance |
| `generateWeeklyReport` | AI progress summary |

All AI responses are parsed as structured JSON for consistent frontend rendering.

---

## 5. Authentication Flow

### Email/Password
1. User submits credentials → Backend validates with Supabase Auth
2. Backend creates/fetches user record → Generates JWT
3. Frontend stores token → Includes in all API requests

### Google OAuth
1. Frontend initiates Supabase OAuth flow
2. Callback receives session → Sends token to backend
3. Backend verifies and creates user if new → Returns JWT

---

## 6. PWA Setup

| Feature | File |
|---------|------|
| Web Manifest | `frontend/public/manifest.json` |
| Service Worker | `frontend/public/sw.js` |
| Offline Page | `frontend/public/offline.html` |
| Install Banner | `frontend/src/pwa/InstallBanner.jsx` |
| Push Notifications | Service worker push event handler |

---

## 7. SEO

| Feature | Location |
|---------|----------|
| Meta Tags | `frontend/index.html` |
| Open Graph | `frontend/index.html` |
| Twitter Cards | `frontend/index.html` |
| Structured Data | JSON-LD in `index.html` |
| Sitemap | `frontend/public/sitemap.xml` |
| Robots | `frontend/public/robots.txt` |

---

## 8. Responsive Design

Mobile-first CSS with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1023px
- **Laptop**: 1024px - 1439px
- **Desktop**: 1440px - 2559px
- **Ultra-wide**: 2560px+

CSS custom properties enable theme switching without re-renders.

---

## 9. Deployment Steps

### Step 1: Supabase Setup
```sql
-- Run in Supabase SQL Editor
-- Copy contents of backend/src/database/schema.sql
```

Enable Google OAuth:
- Authentication → Providers → Google → Enable
- Add redirect URL: `https://your-app.vercel.app/auth/callback`

### Step 2: Backend (Render)
1. Create Web Service on render.com
2. Connect GitHub repository
3. Set root directory: `backend`
4. Build: `npm install` | Start: `npm start`
5. Add environment variables from `.env.example`
6. Deploy and note the URL

### Step 3: Frontend (Vercel)
1. Import project on vercel.com
2. Set root directory: `frontend`
3. Framework: Vite
4. Add environment variables:
   - `VITE_API_URL=https://your-backend.onrender.com/api`
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
5. Deploy

### Step 4: Post-Deploy
- Update `FRONTEND_URL` in backend env to Vercel URL
- Update CORS if needed
- Test all API endpoints
- Verify Google OAuth redirect URLs

---

## 10. Development Commands

```bash
npm run install:all    # Install all dependencies
npm run dev            # Start both frontend & backend
npm run dev:frontend   # Frontend only (port 5173)
npm run dev:backend    # Backend only (port 5000)
npm test               # Run all tests
npm run build          # Build frontend for production
```
