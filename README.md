# GYMOS AI

Enterprise-grade AI-powered fitness and nutrition SaaS platform.

## Architecture Overview

GYMOS AI follows **Clean Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)               │
│  Pages → Components → Stores (Zustand) → API Services   │
└──────────────────────────┬──────────────────────────────┘
                           │ REST API
┌──────────────────────────▼──────────────────────────────┐
│                  BACKEND (Node.js + Express)             │
│  Routes → Controllers → Services → Repositories → DB    │
│                          ↓                               │
│                    AI Layer (Gemini)                     │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│              DATABASE (Supabase PostgreSQL)              │
│              AUTH (Supabase Auth + Google)               │
└─────────────────────────────────────────────────────────┘
```

### Key Principles
- **Layered architecture**: Each layer depends only on layers below it
- **Repository pattern**: Data access abstracted from business logic
- **Service layer**: Business logic isolated from HTTP concerns
- **Validation at boundaries**: Joi schemas on all API inputs
- **Security first**: JWT, Helmet, CORS, rate limiting, sanitization

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit both .env files with your Supabase and Gemini keys

# Run database schema in Supabase SQL Editor
# File: backend/src/database/schema.sql

# Start development servers
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

## Folder Structure

```
GymOs/
├── frontend/                    # React + Vite SPA
│   ├── public/                  # Static assets, PWA, SEO
│   └── src/
│       ├── api/                 # Axios API client & endpoints
│       ├── components/          # Reusable UI components
│       │   ├── common/          # Button, Input, Card, Modal, etc.
│       │   ├── dashboard/
│       │   ├── forms/
│       │   ├── nutrition/
│       │   ├── workout/
│       │   ├── progress/
│       │   ├── achievements/
│       │   └── profile/
│       ├── constants/           # App constants & config
│       ├── context/             # React context (if needed)
│       ├── hooks/               # Custom React hooks
│       ├── layouts/             # Page layouts
│       ├── pages/               # Route pages
│       ├── pwa/                 # PWA install banner
│       ├── routes/              # Route definitions
│       ├── services/            # Supabase client
│       ├── store/               # Zustand stores
│       ├── styles/              # Global CSS
│       ├── test/                # Frontend tests
│       └── utils/               # Helper functions
│
├── backend/                     # Node.js + Express API
│   └── src/
│       ├── ai/                  # Gemini AI integration
│       ├── config/              # App configuration
│       ├── constants/           # Backend constants
│       ├── controllers/         # HTTP request handlers
│       ├── database/            # SQL schema
│       ├── middleware/          # Auth, rate limit, errors
│       ├── repositories/        # Data access layer
│       ├── routes/              # API route definitions
│       ├── services/            # Business logic
│       ├── utils/               # JWT, sanitize, errors
│       ├── validators/          # Joi validation schemas
│       ├── app.js               # Express app setup
│       └── server.js            # Server entry point
│
└── package.json                 # Root workspace scripts
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Email/password login |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile/update` | Update profile |
| PUT | `/api/profile/social-links` | Update social links |
| POST | `/api/workout/generate` | AI workout generation |
| GET | `/api/workout/history` | Workout history |
| PUT | `/api/workout/update` | Update workout plan |
| POST | `/api/nutrition/generate` | AI meal plan |
| GET | `/api/nutrition/history` | Nutrition history |
| GET | `/api/nutrition/meal-plan` | Active meal plan |
| POST | `/api/ai/analyze-body` | Body metrics analysis |
| POST | `/api/ai/generate-plan` | Comprehensive plan |
| POST | `/api/ai/recommend-foods` | Food recommendations |
| POST | `/api/ai/supplement-advice` | Supplement advice |
| GET | `/api/progress` | Get progress data |
| POST | `/api/progress` | Log progress |
| POST | `/api/progress/photos` | Upload progress photo |
| GET | `/api/progress/weekly-report` | AI weekly report |
| GET | `/api/achievements` | User achievements |
| GET | `/api/streaks` | User streaks |

## State Management (Zustand)

| Store | Purpose |
|-------|---------|
| `authStore` | Authentication, token, user session |
| `userStore` | Profile data and updates |
| `workoutStore` | Workout plans and history |
| `nutritionStore` | Meal plans and nutrition data |
| `progressStore` | Progress logs and photos |
| `themeStore` | Dark/light theme, sidebar state |

## Testing

```bash
# Run all tests
npm test

# Backend only
cd backend && npm test

# Frontend only
cd frontend && npm test
```

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel, set root to `frontend/`
3. Add environment variables from `.env.example`
4. Deploy

### Backend (Render)
1. Connect GitHub repo in Render
2. Use `backend/render.yaml` or set:
   - Build: `npm install`
   - Start: `npm start`
   - Root: `backend/`
3. Add all environment variables
4. Deploy

### Database (Supabase)
1. Create project at supabase.com
2. Run `backend/src/database/schema.sql` in SQL Editor
3. Enable Google OAuth in Authentication → Providers
4. Copy URL and keys to `.env` files

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key |
| `JWT_SECRET` | JWT signing secret (32+ chars) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `FRONTEND_URL` | Frontend URL for CORS |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

## Tech Stack

- **Frontend**: React 18, Vite 6, Zustand, React Router 7, Chart.js, Framer Motion
- **Backend**: Node.js, Express 4, Joi, Helmet, JWT
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + Google OAuth
- **AI**: Google Gemini 1.5 Flash
- **PWA**: Service Worker, Web App Manifest
- **Deploy**: Vercel (frontend), Render (backend)

## License

Private - All rights reserved.
