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

```bash
cp .env.example .env.local
# Same DATABASE_URL + JWT_* as em-tools
npm install
npm run dev
```
