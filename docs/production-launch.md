# MASQANI production launch

## Services you must own

1. A PostgreSQL provider (Supabase Postgres is supported).
2. A Node.js API host that supports HTTPS and environment variables (Render, Railway, Fly.io, or a container platform).
3. A static/Next.js web host (Vercel, Netlify, or Cloudflare Pages).
4. A Cloudinary account for landlord-uploaded property media.
5. A Google Cloud OAuth Web client for Google sign-in.
6. A Safaricom Daraja production application and shortcode for M-Pesa subscriptions.
7. Optional but recommended: Resend for email and Twilio for SMS.

## Release order

1. Create a production database and copy `.env.production.example` into the API host's secret manager. Set `DATABASE_DRIVER=postgres`.
2. Run `npm run db:migrate --workspace apps/api` once with the production environment variables. This creates tables and plans; it deliberately does **not** import local preview listings.
3. Deploy `apps/api` with its Dockerfile or Procfile. Confirm `GET /api/health` is `200` over HTTPS.
4. Create Cloudinary, Google OAuth, M-Pesa, Resend, and Twilio credentials. Store them only in the API host environment variables.
5. Set `site/client-config.js` in the web deployment to `window.MASQANI_API_URL = "https://api.your-domain";` and set the Google OAuth client ID in `site/google-config.js`.
6. Deploy the web site. Add the final website domains to `CORS_ORIGIN`, the OAuth authorized origins, and the M-Pesa callback URL.
7. Create the first administrator directly in Postgres, then use the admin dashboard to approve owner-submitted listings. Do not publish the preview listings as verified inventory.

## Go-live checks

- Use a unique 64+ character `JWT_SECRET` and HTTPS-only CORS origins.
- Confirm database backups, error logging, health monitoring, and a custom domain are enabled.
- Test real Google sign-in, M-Pesa sandbox then production checkout, Cloudinary upload, account registration, OTP, a viewing request, report submission, and admin moderation.
- Do not accept payments until Safaricom production credentials and the callback endpoint are verified.
