# Cloudflare D1 form submissions

The contact, session-request, and story/prayer forms are submitted to a Cloudflare Worker and stored directly in D1. These form routes do not require PocketBase or an email-sending service. New submissions are not emailed; review them in the Cloudflare dashboard or with Wrangler. Existing PocketBase records are not imported.

## Database setup

The D1 database `christiansinpain` is linked in the root `wrangler.toml` file using the `DB` binding. Apply the schema to the remote database:

```sh
npx wrangler d1 migrations apply christiansinpain --remote
```

Configure the Worker rate-limit secret. Generate a long random value locally:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npx wrangler secret put RATE_LIMIT_SECRET
```

The rate-limit secret is used to create non-reversible per-IP keys; raw IP addresses are not stored. Each form allows five submissions per IP per hour.

Build the website and deploy the Worker:

```sh
npm run build --prefix apps/web
npx wrangler deploy
```

## Reviewing submissions

The two submission tables are `support_contacts` and `story_submissions`. Query them from the repository root:

```sh
npx wrangler d1 execute christiansinpain --remote --command "SELECT * FROM support_contacts ORDER BY created DESC"
npx wrangler d1 execute christiansinpain --remote --command "SELECT * FROM story_submissions ORDER BY created DESC"
```

These queries contain personal and potentially sensitive stories. Run them only on a trusted device and do not share their output. You can also inspect the tables in the Cloudflare dashboard under **Storage & Databases > D1 SQL Database > christiansinpain**.

## Local development

After building the site, run the Worker locally:

```sh
npm run build --prefix apps/web
npx wrangler d1 migrations apply christiansinpain --local
npx wrangler dev
```

In another terminal, route the form API requests from Vite to the local Worker:

```powershell
$env:FORMS_WORKER_DEV_URL = "http://127.0.0.1:8787"
npm run dev
```

No email will be sent by local or deployed form submissions. To add email notifications later, configure an email provider separately and implement it in the Worker.
