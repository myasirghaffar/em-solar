# EnergyMart storefront (em-solar)

## Why local works but live can break

| Local (`npm run dev` + API on `:8787`)                                                        | Production                                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser talks to a **known** API URL; CORS on the API already allows `http://localhost:5173`. | The API is on **another origin** (`em-solar-backend…`). Cross-origin `fetch` needs correct CORS—and **any 302** (for example **Cloudflare Access** login) breaks the browser flow and often shows as a **CORS error**. |

**This project’s fix for production:** the **em-solar** Worker serves the SPA and **proxies** `https://<frontend>/api/*` → `API_BASE_URL` (the real API). The browser only calls **same-origin** `/api/...`, so normal CORS between two `workers.dev` hosts is avoided. The **real** HTTP call to `em-solar-backend…` happens **inside Cloudflare** from your Worker, not from the browser. You still must ensure the **API is reachable without a browser Access login** (see below).

`wrangler.jsonc` sets **`assets.run_worker_first: true`** so `/api/*` is handled by the Worker. Without it, static **SPA routing** can return **`index.html` with 200** for `/api/store/products`, which breaks JSON parsing and shows an empty shop.

## Final steps to fix live API issues (checklist)

Do these in order; skip a step only if you are sure it is already done.

### 1. Backend Worker (`em-solar-api` / `em-solar-backend`)

1. **Secrets** (Worker → Settings → Variables, type _Secret_, or `wrangler secret put`):  
   `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`.
2. **Plaintext** `ALLOWED_ORIGINS`: comma-separated, **no trailing slash**. Must include **exactly** your live storefront origin, e.g. `https://em-solar.ghaffaryasir28.workers.dev`. If you set this only in the dashboard, it overrides `wrangler.toml`—include every frontend URL that calls the API.
3. **Cloudflare Zero Trust (Access):** if `curl -sI "https://<your-backend-host>/store/products"` shows **`Location: …cloudflareaccess.com`**, Access is blocking **all** clients (including the storefront Worker’s server-side `fetch`). Either **remove** that Access application for the API host, or add a **Bypass** policy above “require login” for public API paths. Until this is fixed, live will not load products.

### 2. Frontend Worker (`em-solar` / this app)

1. From this directory: **`npm run deploy`** (builds Vite + deploys Worker + assets).
2. **Plaintext** variable **`API_BASE_URL`** on the **em-solar** Worker: full URL of the API, e.g. `https://em-solar-backend.ghaffaryasir28.workers.dev` — **no** trailing slash, **no** `/api` suffix.
3. In the browser **Network** tab, successful calls should hit **`…/api/store/products`** on the **same host as the page**, not a direct request to `em-solar-backend…` from the browser.

### 3. Verify

- Incognito: open the shop → products should load (**200**, JSON).
- If you see **502** from `/api/...`, the frontend Worker cannot reach `API_BASE_URL` (wrong URL, API down, or Access blocking the Worker’s request).

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
