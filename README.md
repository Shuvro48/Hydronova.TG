# 🌊 Hydronova — Bangladesh's National Flood Intelligence Platform

> Not a warning app. A full flood intelligence ecosystem.

**Founder:** Abuhena Shuvro

---

## ⚡ Quick Start

```bash
npm install
cp .env.example .env.local   # fill in Supabase keys (see DEPLOY.md)
npm run dev                   # → http://localhost:3000
```

The app works immediately without any environment variables — Supabase auth gracefully falls back, and FloodGPT uses smart built-in responses. Add keys later for full auth + live AI.

---

## 🧩 What's Inside

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Animated hero, live risk gauge, feature grid |
| Auth | `/auth` | Sign in / sign up / reset password — Starry Night background |
| Dashboard | `/dashboard` | District risk chart, AI risk engine, predictions, digital twin |
| Map | `/map` | Full-screen hyperlocal flood map with layer toggles |
| FloodGPT | `/floodgpt` | Bilingual AI flood safety assistant |
| Community | `/community` | Citizen flood reports with photo upload |
| Family | `/family` | Family safety circles with live status |
| Emergency | `/emergency` | One-tap SOS, contacts, shelters, checklist |

---

## 🛠️ Tech Stack — 100% Free Tier

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animation
- **Zustand** for state (persisted language + mode)
- **Supabase** — free-tier auth + Postgres database
- **Leaflet** (via CDN, not npm) + **OpenStreetMap** tiles — free maps
- **Open-Meteo API** — free weather data, no API key required
- **Recharts** for dashboard charts

No paid APIs. No vendor lock-in beyond Supabase's generous free tier.

---

## 📁 Project Structure

```
hydronova/
├── src/
│   ├── app/                  # Next.js pages (App Router)
│   │   ├── page.tsx           → Homepage
│   │   ├── auth/page.tsx      → Sign in / up / reset
│   │   ├── dashboard/page.tsx → Live dashboard
│   │   ├── map/page.tsx       → Full-screen map
│   │   ├── floodgpt/page.tsx  → AI chat
│   │   ├── community/page.tsx → Citizen reports
│   │   ├── family/page.tsx    → Family circles
│   │   ├── emergency/page.tsx → SOS page
│   │   └── api/               → flood / floodgpt / community routes
│   ├── components/
│   │   ├── NavShell.tsx       → Nav, sidebar, bottom nav
│   │   └── map/FloodMap.tsx   → Leaflet map (CDN-based)
│   ├── lib/
│   │   ├── i18n/translations.ts
│   │   └── auth/supabase.ts   → Graceful-fallback Supabase client
│   └── store/hydronova.ts     → Zustand global state
├── database/schema.sql        → Run in Supabase SQL Editor
└── public/manifest.json       → PWA manifest
```

---

## 📖 Full Deployment Guide

See **DEPLOY.md** for complete step-by-step instructions covering Supabase setup, GitHub, and Vercel deployment.

---

## 📄 License

MIT License.
