# MASQANI

MASQANI is a Kenya-focused, mobile-first rental marketplace that connects house hunters with verified landlords and listings. **Find your place.**

## Platform Scope

- Tenant search with advanced filters, saved listings, viewing schedules, applications, reviews, reports, in-app messages, and notifications.
- Landlord onboarding with phone OTP verification, subscription checkout, subscription-gated property publishing, listing management, analytics, and renewal reminders.
- Admin moderation for users, listings, subscriptions, payments, reviews, reports, announcements, and revenue analytics.
- Payments architecture for M-Pesa, cards, bank payments, and mobile money.
- Cloudinary signed upload flow for secure property media uploads.
- Android-first responsive navigation with hamburger menus and mobile bottom navigation.

## Repository Layout

```text
apps/
  api/     Express.js API, controllers, services, middleware, routes
  web/     Next.js App Router frontend with Tailwind CSS and Framer Motion
packages/
  database/PostgreSQL schema and seed data
docs/
  architecture.md and deployment.md
```

The Houselink repository is only the architecture reference for this project. MASQANI is the application name and product identity.

## Local Setup

1. Install Node.js 20+ and npm.
2. The local `.env` is ready for API health checks. Before production, replace its development values and configure the external services below.
3. Install dependencies:

```bash
npm install
```

4. Apply the database schema in Supabase or PostgreSQL when you are ready to persist accounts and listings:

```bash
psql "$DATABASE_URL" -f packages/database/schema.sql
psql "$DATABASE_URL" -f packages/database/seed.sql
```

5. Start development servers:

```bash
npm run dev
```

Static frontend preview: `http://localhost:4173`  
Next.js frontend: `http://localhost:3000`  
API: `http://localhost:4000/api/health`

## Important Scripts

```bash
npm run dev
npm run dev:web
npm run dev:api
npm run build
npm run lint
npm run db:check
```

## Local database and Google login

MASQANI runs locally with PGlite by default, so no separate PostgreSQL or Docker installation is required. The persistent local database is created in `.masqani-data/`; it includes the schema, pricing plans, and nine Kenya-focused preview listings. Run `npm run db:check` to verify it.

Google sign-in is implemented in the interface and API. To make it live, create a Google Web OAuth client, authorize `http://localhost:4173` and `http://localhost:3000`, then add its public client ID to [google-config.js](site/google-config.js) and `GOOGLE_CLIENT_ID` in `.env`. Never add a client secret to the frontend.

For a real deployment, follow [the production launch guide](docs/production-launch.md). It covers PostgreSQL, HTTPS deployment, Cloudinary, Google OAuth, M-Pesa, transactional email/SMS, secrets, and go-live checks.

## Deployment Targets

- Frontend: Vercel from `apps/web`
- Database: Supabase PostgreSQL
- API: any Node.js host that supports long-running Express services
- Media: Cloudinary signed uploads
- Payments: M-Pesa/card/bank/mobile-money providers configured through API environment variables
