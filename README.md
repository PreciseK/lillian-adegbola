# Lillian Adegbola — Monorepo

This monorepo contains the source code for Lillian Adegbola's web projects, deployed on Vercel.

## Structure

```text
apps/
├── main/    — Empowered Leadership Coaching website (main public site)
└── portal/  — Member portal (private membership area)
```

## Getting Started

```bash
# Install dependencies for an app
cd apps/main && npm install
cd apps/portal && npm install
```

```bash
# Run locally
npm run dev:main
npm run dev:portal
```

## Deployment (Vercel)

Each app is deployed as a separate Vercel project pointing to its own root directory.

| App       | Root Directory | Build Command   | Output Directory |
| --------- | -------------- | --------------- | ---------------- |
| Main site | `apps/main`    | `npm run build` | `dist`           |
| Portal    | `apps/portal`  | `npm run build` | `dist`           |

### Vercel Setup (per app)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import the `PreciseK/lillian-adegbola` repository
3. Set **Root Directory** to `apps/main` (or `apps/portal` for the portal)
4. Framework preset: **Vite**
5. Add environment variables (see `.env` in each app)
6. Deploy

Client-side routing is handled automatically via `vercel.json` in each app.

## Environment Variables

Copy `.env.example` to `.env` in each app directory and fill in the values:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
