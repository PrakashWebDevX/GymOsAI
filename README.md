<div align="center">

# 💪 GYMOS AI

### Your Intelligent Fitness Operating System

**Enterprise-grade AI platform for personalized workouts, smart nutrition, and real-time progress tracking.**

<br />

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-Private-6366f1?style=for-the-badge)](LICENSE)

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square&logo=render)](https://render.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square)](frontend/public/manifest.json)
[![Tests](https://img.shields.io/badge/Tests-Jest_+_Vitest-99424F?style=flat-square&logo=jest)](backend/__tests__)

<br />

[Live Demo](#) · [Documentation](docs/ARCHITECTURE.md) · [Report Bug](https://github.com/PrakashWebDevX/GymOsAI/issues) · [Request Feature](https://github.com/PrakashWebDevX/GymOsAI/issues)

---

</div>

## ✨ Overview

**GYMOS AI** transforms how people train and eat. Built as a modern SaaS product with **Clean Architecture**, it combines a blazing-fast React frontend, a secure Node.js API, Supabase infrastructure, and **Google Gemini** to deliver AI-generated workout plans, meal plans, body analysis, and weekly progress reports — all in one cohesive experience.

<table>
<tr>
<td width="50%">

**🎯 For Users**
- AI workout & meal plan generation
- Progress charts & photo logs
- Achievements & streak tracking
- Dark / light themes · PWA install

</td>
<td width="50%">

**⚙️ For Developers**
- Layered backend (MVC + Repository)
- Zustand state management
- JWT · RLS · Rate limiting
- Production-ready deployment configs

</td>
</tr>
</table>

<br />

---

## 🚀 Features

| Category | Capabilities |
|:---------|:-------------|
| **🤖 AI Engine** | Workout generation · Nutrition plans · Body metrics analysis · Supplement advice · Weekly AI reports |
| **🔐 Auth** | Email/password · Google OAuth · JWT sessions · Protected routes |
| **📊 Dashboard** | Stats overview · Daily goals · Streak widgets · Recent activity |
| **🏋️ Workout** | Strength · Cardio · HIIT · Flexibility · History & completion tracking |
| **🥗 Nutrition** | Keto · Vegan · Paleo · Macro breakdown · Active meal plans |
| **📈 Progress** | Weight trends · Body fat logs · Chart.js visualizations · Progress photos |
| **🏆 Gamification** | Achievements · Multi-type streaks · Milestone tracking |
| **📱 PWA** | Offline page · Install banner · Push notification hooks · Service worker caching |
| **🔒 Security** | Helmet · CORS · Joi validation · HTML sanitization · API rate limits |

<br />

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     CLIENT  ·  React 18  +  Vite 6              │
│         Pages  →  Components  →  Zustand  →  Axios API Client    │
└─────────────────────────────┬────────────────────────────────────┘
                              │  REST  ·  JWT Bearer
┌─────────────────────────────▼────────────────────────────────────┐
│                   SERVER  ·  Node.js  +  Express 4                │
│    Routes  →  Controllers  →  Services  →  Repositories         │
│                              │                                    │
│                    ┌─────────▼─────────┐                         │
│                    │   Gemini AI Layer  │                         │
│                    └─────────┬─────────┘                         │
└─────────────────────────────┼────────────────────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│              SUPABASE  ·  PostgreSQL  +  Auth  +  RLS             │
└──────────────────────────────────────────────────────────────────┘
```

<details>
<summary><strong>📐 Design principles</strong></summary>

<br />

| Principle | Implementation |
|:----------|:---------------|
| **Separation of concerns** | Controllers handle HTTP; services own business logic |
| **Repository pattern** | All database access isolated in `repositories/` |
| **Validation at boundaries** | Joi schemas on every mutating endpoint |
| **Security by default** | Helmet headers, sanitized inputs, scoped JWT claims |
| **Scalable SaaS layout** | Monorepo with independent frontend & backend deploys |

</details>

<br />

---

## 🛠 Tech Stack

<div align="center">

| Layer | Technologies |
|:-----:|:-------------|
| **Frontend** | React 18 · Vite 6 · React Router 7 · Zustand · Chart.js · Framer Motion · React Hot Toast |
| **Backend** | Node.js · Express 4 · Joi · JSON Web Token · Morgan · Helmet |
| **Database** | Supabase (PostgreSQL) · Row Level Security · 15 normalized tables |
| **AI** | Google Gemini 1.5 Flash · Structured JSON responses |
| **Auth** | Supabase Auth · Google OAuth 2.0 |
| **Testing** | Jest · Supertest · Vitest · Testing Library |
| **DevOps** | Vercel (frontend) · Render (backend) · GitHub Actions ready |

</div>

<br />

---

## 📁 Project Structure

```
GymOsAI/
│
├── 🎨 frontend/                    React + Vite application
│   ├── public/                     PWA · SEO · offline assets
│   └── src/
│       ├── api/                    Axios client & endpoint modules
│       ├── components/common/      Button · Card · Modal · Chart · Navbar …
│       ├── layouts/                Auth & dashboard shells
│       ├── pages/                  auth · dashboard · workout · nutrition …
│       ├── routes/                 Protected & lazy-loaded routes
│       ├── store/                  Zustand stores (auth, user, workout …)
│       ├── pwa/                    Install banner component
│       └── styles/                 Global CSS variables & themes
│
├── ⚡ backend/                      Node.js + Express API
│   └── src/
│       ├── ai/                     Gemini service integration
│       ├── controllers/            HTTP handlers
│       ├── services/               Business logic layer
│       ├── repositories/           Supabase data access
│       ├── routes/                 API route definitions
│       ├── middleware/             Auth · rate limit · errors
│       ├── validators/             Joi validation schemas
│       └── database/schema.sql     Full PostgreSQL schema + RLS
│
├── 📚 docs/                        Architecture documentation
└── README.md                       You are here
```

<br />

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Supabase** project ([create free](https://supabase.com))
- **Gemini API key** ([Google AI Studio](https://aistudio.google.com/apikey))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/PrakashWebDevX/GymOsAI.git
cd GymOsAI

# 2. Install all dependencies
npm run install:all

# 3. Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Database setup

1. Open your **Supabase** project → **SQL Editor**
2. Paste and run the contents of `backend/src/database/schema.sql`
3. Enable **Google** under **Authentication → Providers**
4. Add redirect URL: `http://localhost:5173/auth/callback`

### Run locally

```bash
npm run dev
```

| Service | URL |
|:--------|:----|
| 🖥 Frontend | http://localhost:5173 |
| 🔌 Backend API | http://localhost:5000 |
| ❤️ Health check | http://localhost:5000/api/health |

<br />

---

## 🔌 API Reference

<details>
<summary><strong>🔐 Authentication</strong></summary>

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Email & password sign-in |
| `POST` | `/api/auth/google` | Google OAuth token exchange |
| `POST` | `/api/auth/logout` | Invalidate session |

</details>

<details>
<summary><strong>👤 Profile</strong></summary>

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `GET` | `/api/profile` | Fetch user profile |
| `PUT` | `/api/profile/update` | Update profile fields |
| `PUT` | `/api/profile/social-links` | Manage social links |

</details>

<details>
<summary><strong>🏋️ Workout · 🥗 Nutrition · 🤖 AI</strong></summary>

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `POST` | `/api/workout/generate` | AI workout plan |
| `GET` | `/api/workout/history` | Past workouts |
| `POST` | `/api/nutrition/generate` | AI meal plan |
| `GET` | `/api/nutrition/meal-plan` | Active meal plan |
| `POST` | `/api/ai/analyze-body` | BMI · BMR · TDEE analysis |
| `POST` | `/api/ai/generate-plan` | Full fitness program |
| `POST` | `/api/ai/recommend-foods` | Food suggestions |
| `POST` | `/api/ai/supplement-advice` | Supplement guidance |

</details>

<details>
<summary><strong>📈 Progress · 🏆 Achievements</strong></summary>

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `GET` | `/api/progress` | Logs & photos |
| `POST` | `/api/progress` | Log new entry |
| `GET` | `/api/progress/weekly-report` | AI weekly summary |
| `GET` | `/api/achievements` | Earned badges |
| `GET` | `/api/streaks` | Activity streaks |

</details>

<br />

---

## 🗄 Database Schema

15 production tables with indexes, triggers, and **Row Level Security**:

`users` · `profiles` · `social_links` · `fitness_goals` · `body_metrics` · `workout_plans` · `nutrition_plans` · `daily_tasks` · `completed_tasks` · `supplements` · `progress_logs` · `progress_photos` · `achievements` · `streaks` · `notifications`

> Full schema: [`backend/src/database/schema.sql`](backend/src/database/schema.sql)

<br />

---

## 🧠 State Management

| Store | Responsibility |
|:------|:---------------|
| `authStore` | Login · register · Google auth · JWT persistence |
| `userStore` | Profile fetch & update |
| `workoutStore` | AI workouts · history · completion |
| `nutritionStore` | Meal plans · macros · history |
| `progressStore` | Logs · photos · weekly reports |
| `themeStore` | Dark/light mode · sidebar UI |

<br />

---

## 🧪 Testing

```bash
# Run full test suite
npm test

# Backend API tests (Jest + Supertest)
cd backend && npm test

# Frontend component tests (Vitest)
cd frontend && npm test
```

<br />

---

## 🌐 Deployment

<table>
<tr>
<th>Service</th>
<th>Platform</th>
<th>Config</th>
</tr>
<tr>
<td>Frontend</td>
<td><strong>Vercel</strong></td>
<td>Root: <code>frontend/</code> · <a href="frontend/vercel.json">vercel.json</a></td>
</tr>
<tr>
<td>Backend</td>
<td><strong>Render</strong></td>
<td>Root: <code>backend/</code> · <a href="backend/render.yaml">render.yaml</a></td>
</tr>
<tr>
<td>Database</td>
<td><strong>Supabase</strong></td>
<td>Run <code>schema.sql</code> · Enable RLS</td>
</tr>
</table>

### Environment variables

<details>
<summary><strong>Backend <code>.env</code></strong></summary>

```env
PORT=5000
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-32-char-minimum-secret
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=https://your-app.vercel.app
```

</details>

<details>
<summary><strong>Frontend <code>.env</code></strong></summary>

```env
VITE_API_URL=https://your-api.onrender.com/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://your-app.vercel.app
```

</details>

<br />

---

## 📱 PWA & SEO

| Feature | Location |
|:--------|:---------|
| Web App Manifest | `frontend/public/manifest.json` |
| Service Worker | `frontend/public/sw.js` |
| Offline fallback | `frontend/public/offline.html` |
| Sitemap | `frontend/public/sitemap.xml` |
| Robots.txt | `frontend/public/robots.txt` |
| Open Graph & JSON-LD | `frontend/index.html` |

<br />

---

## 🤝 Contributing

Contributions are welcome. Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

<br />

---

## 👨‍💻 Author

**Prakash**

[![GitHub](https://img.shields.io/badge/GitHub-PrakashWebDevX-181717?style=for-the-badge&logo=github)](https://github.com/PrakashWebDevX)
[![Repository](https://img.shields.io/badge/Repo-GymOsAI-6366f1?style=for-the-badge&logo=github)](https://github.com/PrakashWebDevX/GymOsAI)

<br />

---

<div align="center">

### Built with discipline. Powered by AI. Designed for scale.

<br />

**GYMOS AI** © 2026 · All rights reserved

<br />

⭐ **Star this repo** if it helps your fitness journey or your next SaaS build

</div>
