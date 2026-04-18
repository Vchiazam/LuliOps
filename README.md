# LuliOps Frontend

Production-grade Next.js frontend for LuliOps monitoring.

## Stack

- Next.js App Router + TypeScript strict
- Tailwind CSS with dark-first palette (`#1a0026`, `#5e1d7b`, white)
- TanStack Query v5
- Axios with auth/refresh interceptors
- React Hook Form + Zod
- Zustand auth state
- Sonner toasts

## Setup

1. Copy `.env.example` to `.env.local`
2. Install dependencies:
   - `npm install`
3. Run dev server:
   - `npm run dev`

## Routes

- Auth: `/login`, `/register`, `/verify-email-otp`, `/password-reset/request`, `/password-reset/validate`, `/password-reset/done`, `/google-callback`
- Dashboard: `/dashboard`, `/monitors`, `/monitors/[uuid]`, `/history`, `/telegram`, `/profile`
- Backoffice: `/backoffice`, `/backoffice/users`, `/backoffice/users/[uuid]`, `/backoffice/settings`

## API

All OpenAPI endpoints are implemented in `lib/api.ts`, including:

- full auth flow + Google callback + password reset
- monitors CRUD + history
- telegram connect + webhook
- user profile
- backoffice users + settings
