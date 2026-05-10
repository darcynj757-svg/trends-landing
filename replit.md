# Trends Landing

Investment landing page for the Trends Telegram Mini App — a Reels-style video feed built inside Telegram.

## Run & Operate

- `pnpm --filter @workspace/trends-landing run dev` — run the landing page (port 22520)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4 + shadcn/ui + framer-motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/trends-landing/src/pages/Landing.tsx` — main landing page (hero, sections, FAQ, roadmap)
- `artifacts/trends-landing/src/pages/Cabinet.tsx` — investor personal cabinet
- `artifacts/trends-landing/src/pages/not-found.tsx` — 404 page
- `artifacts/trends-landing/src/components/InvestmentModal.tsx` — investment package modal
- `artifacts/trends-landing/src/components/SceneBackground.tsx` — animated background
- `artifacts/trends-landing/src/index.css` — CSS variables, themes, styles
- `attached_assets/` — images (logo, app screenshots)

## Architecture decisions

- Presentation-first landing page — no backend API calls needed, all content is static
- Images imported via `@assets` alias → resolves to `attached_assets/`
- Primary color: cyan `#00D4FF`, secondary: purple `#7B5EFF`
- Framer Motion used for scroll-triggered animations throughout

## Product

Trends is described as "the first Reels inside Telegram" — an algorithmic video feed for Telegram's 1 billion users. The landing page targets Pre-Seed investors with a $1M target raise. Investment packages: Starter $100, Genesis $1000, Growth $10000, Whale $50000.

## GitHub

- Repo: https://github.com/darcynj757-svg/trends-landing
- Remote name: `github` (configured in .git/config)
- After changes: `git add -A && git commit -m "edit: description" && git push github main`
- Railway auto-deploys on push to main

## User preferences

- Редактировать только `artifacts/trends-landing/src/` и `attached_assets/`
- Не трогать `.replit-artifact/artifact.toml`
- После каждого изменения — git push в main
- Цвета: primary cyan `#00D4FF`, secondary purple `#7B5EFF`

## Gotchas

- `@assets` alias in vite.config.ts resolves to `/home/runner/workspace/attached_assets/`
- Git remote to GitHub is named `github` (not `origin`)
- Railway config in `vite.config.railway.ts` is for production builds
