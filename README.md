# EnergyMart (em-solar)

Public **storefront** + **shop admin** (same Next.js app, same Supabase DB as em-tools).

## Ports

- Dev: http://localhost:3001

## Who logs in where

| Role | After login |
|------|-------------|
| Customer | `/profile` |
| Admin | `/admin` — products, orders, blogs, etc. |
| Salesman | Use **em-tools** (http://localhost:3000) |

## Shop admin routes

`/admin` · `/admin/products` · `/admin/product-categories` · `/admin/orders` · `/admin/customers` · `/admin/blogs` · `/admin/settings` · `/admin/profile`

## CRM (leads / quotes)

Managed in **[`../em-tools`](../em-tools)** — not in this app.

## Setup

## Deploy (Vercel)

This app is **Next.js** (not Vite). In the Vercel project:

1. **Framework Preset:** Next.js  
2. **Root Directory:** `.` (repo root of `em-solar`)  
3. **Build Command:** `npm run build` (default)  
4. **Output Directory:** leave **empty** (do not use `dist`)  
5. **Install Command:** `npm install`  
6. **Node.js:** 20.x  
7. Redeploy with **Clear cache and redeploy** (important after migrating from Vite)

Add the env vars from `.env.example` (especially `DATABASE_URL` on pooler port `6543` and JWT secrets).

```bash
cp .env.example .env.local
# Same DATABASE_URL + JWT_* as em-tools
npm install
npm run dev
```
