Deploying this Next.js app to Vercel

Quick steps (recommended):
1. Commit your changes and push to GitHub (or link the repo to Vercel).

2. On Vercel:
   - Create a new project and import the GitHub repo.
   - For the framework, Vercel should detect Next.js automatically.

3. Environment variables (at minimum):
   - DATABASE_URL: e.g. file:./dev.db or a production Postgres/PlanetScale URL
   - NEXTAUTH_URL: https://<your-vercel-domain>
   - NEXTAUTH_SECRET: a long random string
   - EMAIL_* (if you use email provider): SMTP_HOST, SMTP_USER, SMTP_PASS, etc.
   - Any third-party keys used (STRIPE_*, MPESA_*, etc.)

4. Build & Output:
   - Build command: next build
   - Output directory: (leave as default)

Notes and Prisma database migration:
- If you use SQLite (DATABASE_URL=file:./dev.db) you must ensure Vercel can access the file or switch to a hosted DB for production (recommended).
- For a hosted DB (Postgres), run Prisma migrations locally and seed, then point Vercel's DATABASE_URL to the hosted DB.

Local quick test commands (PowerShell):
pnpm install
pnpm dev
pnpm build
pnpm start

If you'd like, I can:
- Create a `vercel.json` with routes and headers (done).
- Add a simple GitHub Actions workflow to deploy to Vercel automatically (requires Vercel token and project settings).
- Convert localStorage-based demo order storage to server-backed endpoints for production.

Tell me which next step you want.
