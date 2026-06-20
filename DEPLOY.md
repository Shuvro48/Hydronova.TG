# 🚀 Hydronova — Complete Deployment Guide

A step-by-step guide for getting Hydronova fully live — even if you've never deployed an app before.

---

## Step 1 — Install and run locally

```bash
npm install
npm run dev
```

Open **http://localhost:3000** — Hydronova will already work! Auth and FloodGPT use safe fallbacks until you connect Supabase (Step 2) and add an optional AI key (Step 3).

---

## Step 2 — Set up Supabase (free database + auth)

1. Go to **https://supabase.com** → sign up free → **New Project**
2. Choose a name (e.g. `hydronova`), set a database password, pick the **Singapore** region (closest to Bangladesh), click **Create**
3. Wait ~2 minutes for it to provision
4. In the left sidebar, go to **SQL Editor** → **New Query**
5. Open `database/schema.sql` from this project, copy **all of it**, paste into the SQL editor, click **Run**
   - You should see "Success. No rows returned" — this means all tables and seed data were created
6. Go to **Settings → API** in the left sidebar
7. Copy your **Project URL** and **anon public** key

Create a file called `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-anon-key...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Restart your dev server (`Ctrl+C` then `npm run dev`). Sign up / sign in on `/auth` now fully works.

---

## Step 3 — (Optional) Enable live FloodGPT AI

Without this step, FloodGPT already works using smart pre-written responses for common questions (risk, shelters, preparation, routes). To enable a live AI model that can answer absolutely anything:

1. Get a key from your preferred AI provider (the app is written against the Anthropic Messages API format)
2. Add to `.env.local`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-...your-key...
   ```
3. Restart the dev server

If the key is missing, invalid, or the request fails for any reason, FloodGPT automatically uses its fallback responses — the app never breaks.

---

## Step 4 — Push to GitHub

```bash
git init
git add .
git commit -m "🌊 Hydronova — initial commit"
git branch -M main
git remote add origin https://github.com/Shuvro48/Hyydronova.git
git push -u origin main
```

If GitHub asks for a password and rejects it: GitHub no longer accepts account passwords for git operations. You need a **Personal Access Token**:
1. GitHub.com → click your profile picture → **Settings**
2. Scroll down → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token** → check the **repo** scope → **Generate token**
4. Copy the token (you only see it once!)
5. When git asks for a password, paste this token instead

---

## Step 5 — Deploy to Vercel (free)

1. Go to **https://vercel.com** → sign up with your GitHub account
2. Click **Add New → Project**
3. Find and **Import** `Shuvro48/Hyydronova`
4. Vercel auto-detects Next.js — leave all build settings as default
5. Before clicking Deploy, expand **Environment Variables** and add:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
   | `NEXT_PUBLIC_APP_URL` | `https://hyydronova.vercel.app` |
   | `ANTHROPIC_API_KEY` | (optional) your AI key |

6. Click **Deploy**
7. Wait ~2 minutes → your app is live at `https://hyydronova.vercel.app`

---

## Step 6 — Update Supabase Auth URLs

Now that you have your real Vercel URL:

1. Supabase dashboard → **Authentication → URL Configuration**
2. Set **Site URL** to `https://hyydronova.vercel.app`
3. Under **Redirect URLs**, add `https://hyydronova.vercel.app/**`
4. Save

This makes password reset emails and auth redirects work correctly on the live site.

---

## Step 7 — Push future updates

Every time you make changes:

```bash
git add .
git commit -m "describe your change"
git push
```

Vercel automatically rebuilds and redeploys within ~1-2 minutes. No manual redeploy needed.

---

## Step 8 — Install as an app (PWA)

**On iPhone (Safari):**
Open the site → tap the Share icon → **Add to Home Screen**

**On Android (Chrome):**
Open the site → tap the ⋮ menu → **Install app** (or **Add to Home Screen**)

**On Desktop (Chrome/Edge):**
Open the site → click the install icon (⊕) in the address bar → **Install**

Hydronova will now open full-screen like a native app, with its own icon.

---

## 🆘 Troubleshooting

**Build fails on Vercel:**
- Check the build log for the exact error. Most common cause: a typo in an environment variable name. Variable names must match exactly (case-sensitive).

**Auth doesn't work after deploying:**
- Make sure you completed Step 6 (Auth URL Configuration in Supabase) — this is the #1 cause of auth issues after deployment.

**Map doesn't load:**
- The map uses Leaflet loaded from a CDN (`unpkg.com`). If your network blocks unpkg.com, the map will retry every 200ms until it loads. Check your browser console for network errors.

**FloodGPT gives generic answers:**
- This is expected without `ANTHROPIC_API_KEY` set — it's using the built-in fallback system, which is designed to still be genuinely useful for the most common questions.

---

Built for Bangladesh. Free forever where it matters most.
