# Cloudflare D1 form submissions

The contact, session-request, and story/prayer forms are submitted to the Cloudflare Worker and stored in D1. Existing submissions and PocketBase data are not imported or deleted. PocketBase remains available through the existing proxy for any other features that still use it.

## Create and migrate the database

From the repository root:

1. Create a D1 database:

   ```sh
   npx wrangler d1 create christiansinpain
   ```

2. Copy the `database_id` returned by Wrangler into `wrangler.toml`, replacing the all-zero placeholder.
3. Apply the schema to the remote database:

   ```sh
   npx wrangler d1 migrations apply christiansinpain --remote
   ```

## Configure email and rate limiting

The Worker uses the existing mailer API contract. Configure its values as Cloudflare Worker secrets; do not put credentials in the repository or frontend:

```sh
npx wrangler secret put BUILDER_MAILER_API_URL
npx wrangler secret put BUILDER_MAILER_API_KEY
npx wrangler secret put BUILDER_MAILER_SENDER_ADDRESS
npx wrangler secret put RATE_LIMIT_SECRET
```

If PocketBase currently uses the Builder Mailer API, use those same mailer account values. If it uses SMTP instead, configure an HTTP mailer service for the Worker; the Worker cannot read PocketBase's SMTP settings. `RATE_LIMIT_SECRET` should be a newly generated, long random value. It is used to create non-reversible per-IP rate-limit keys; the raw IP address is not stored. Each form endpoint allows five submissions per IP per hour.

After the D1 binding and secrets are configured, deploy from the repository root:

```sh
npx wrangler deploy
```

Do not remove the PocketBase service or its data until you have separately decided what to do with existing records and confirmed that no other application depends on it.

## Test locally

After building the site, run Wrangler in one terminal and the existing development command in another. The `FORMS_WORKER_DEV_URL` setting sends only the two form API paths to the local Worker; other PocketBase routes keep using the current local PocketBase server.

```sh
npm run build --prefix apps/web
npx wrangler d1 migrations apply christiansinpain --local
npx wrangler dev
```

In a second terminal:

```powershell
$env:FORMS_WORKER_DEV_URL = "http://127.0.0.1:8787"
npm run dev
```
