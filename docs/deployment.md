# Deployment Guide

## Vercel Frontend

1. Create a Vercel project with root directory `apps/web`.
2. Set `NEXT_PUBLIC_API_URL` to the deployed API URL.
3. Set `NEXT_PUBLIC_APP_URL` to the Vercel app URL.
4. Deploy from the main branch.

## Supabase Database

1. Create a Supabase project.
2. Open SQL Editor and run `packages/database/schema.sql`.
3. Run `packages/database/seed.sql`.
4. Copy the pooled connection string into `DATABASE_URL` on the API host.

## Express API

1. Deploy `apps/api` to a Node.js host.
2. Configure all environment variables from `.env.example`.
3. Set `CORS_ORIGIN` to the Vercel domain.
4. Ensure the API host enforces HTTPS.
5. Configure payment webhook URLs:
   - `POST /api/payments/mpesa/callback`
   - `POST /api/payments/card/webhook`
   - `POST /api/payments/bank/webhook`
   - `POST /api/payments/mobile-money/webhook`

## Cloudinary

1. Create an unsigned-disabled upload preset for MASQANI if using client upload widgets.
2. Prefer `POST /api/uploads/signature`, which returns a short-lived signed upload payload.
3. Lock upload folder to `masqani` and validate file type/size on both client and API.

## Production Checklist

- Rotate `JWT_SECRET`.
- Set secure, same-site cookies.
- Use provider webhook signature verification.
- Configure SMS/Email/Push providers.
- Enable database backups and monitoring.
- Add uptime checks for `/api/health`.
- Run migrations through CI before API deploys.
