# Production deployment

PixelUtils targets Cloudflare Workers through `@opennextjs/cloudflare`. The
application is static-first: Cloudflare serves the Next.js application, while
ordinary tool input and processing stay in the browser. No database, object
storage, authentication service, paid API, or paid Cloudflare feature is
required.

## Configuration

Copy `.env.example` for local builds. Cloudflare production builds require:

- `SITE_URL`: the final HTTPS origin with no path, query, or trailing route,
  for example `https://tools.example.com`.

Optional build variables are:

- `CONTACT_EMAIL`: enables the contact page's `mailto:` link. If omitted, the
  page truthfully reports that contact is not configured.
- `NEXT_PUBLIC_ANALYTICS_ENABLED` and `NEXT_PUBLIC_ANALYTICS_PROVIDER`: inert
  unless a reviewed analytics adapter has also been registered. These values
  are public by design.
- `ADS_ENABLED`, `ADS_PROVIDER`, and `AD_SLOT_*`: server-side advertising
  configuration. Ads render nothing unless configuration is complete.
- `ENABLE_BROWSER_SOURCE_MAPS`: defaults to `false`. Setting it to `true`
  deliberately publishes browser source maps and should be limited to a
  reviewed debugging release.

Never put secrets in a `NEXT_PUBLIC_*` variable. PixelUtils has no runtime
secret requirement by default. Cloudflare account IDs and API tokens belong in
the deployment platform or CI secret store, not `.env` files or Wrangler
`vars`.

## Cloudflare setup

1. Connect the repository to Cloudflare Workers Builds, or authenticate
   Wrangler locally/within CI.
2. Select Node.js 22 and run `npm ci`.
3. Configure `SITE_URL` as a production build variable. Preview deployments
   should use their own stable HTTPS origin if canonical metadata is to be
   tested; otherwise prevent preview URLs from being indexed at the platform
   layer.
4. Build with `npm run build:production`.
5. Deploy the generated `.open-next/worker.js` and `.open-next/assets` using
   `npx wrangler deploy`. `npm run deploy:cloudflare` combines the build and
   deploy steps for an authenticated environment.
6. Do not add an R2 cache binding unless the application later adopts dynamic
   caching and the cost/privacy tradeoff is reviewed.

`wrangler.jsonc` uses `nodejs_compat` as required by OpenNext. Hashed Next.js
assets receive a one-year immutable cache policy through `public/_headers`;
Next.js controls caching for route responses and already emits hashed immutable
asset names. Security headers are generated centrally by
`lib/deployment/security-headers.ts` and applied through `next.config.ts`.
The production build uses Next.js's supported Webpack mode to avoid a known
Windows symlink limitation in OpenNext's Turbopack trace transformation.

## Pre-deployment checklist

- [ ] `SITE_URL` is the exact final HTTPS origin and contains no path/query.
- [ ] `CONTACT_EMAIL` is monitored, or intentionally omitted.
- [ ] Analytics and advertising remain disabled unless their providers,
      consent behavior, CSP origins, and privacy copy have been reviewed.
- [ ] No secret uses a `NEXT_PUBLIC_*` name or appears in `wrangler.jsonc`.
- [ ] `ENABLE_BROWSER_SOURCE_MAPS` is absent or `false` for a normal release.
- [ ] `npm ci` completes without a lockfile change.
- [ ] `npm run validate` passes, including the Cloudflare production build.
- [ ] Build-output validation confirms server-only environment names are absent
      from browser chunks.
- [ ] Wrangler reports a compressed Worker size within the current free-tier
      limit.
- [ ] The production branch and Cloudflare environment contain no database,
      R2, queue, or paid API binding that the application does not use.

## Post-deployment verification checklist

- [ ] Open the homepage, a category, and several tool routes on mobile and
      desktop; use copy/download actions without network uploads.
- [ ] Confirm an unknown category/tool route returns the custom 404.
- [ ] Confirm `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`,
      `/catalog-index.json`, `/ads.txt`, and `/icon.svg` return correct MIME
      types and expected content.
- [ ] Inspect canonical, Open Graph, and Twitter metadata against `SITE_URL`.
- [ ] Confirm `Content-Security-Policy`, `Strict-Transport-Security`,
      `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, and
      `X-Content-Type-Options: nosniff` are present on HTML responses.
- [ ] Confirm `/_next/static/*` responses use
      `public,max-age=31536000,immutable` and HTML is not cached as an
      immutable asset.
- [ ] Verify no `.map` URL is published unless deliberately enabled.
- [ ] Check browser developer tools for CSP violations and unexpected external
      requests in both light and dark themes.
- [ ] Verify analytics and ad requests are absent under the default
      configuration.
- [ ] Exercise the error and offline/network-failure experience without
      exposing tool contents in logs or URLs.

## Rollback

Use Cloudflare's deployment history to roll back to the previous healthy
Worker version. Because PixelUtils stores no server-side user data, rollback
does not require a database migration or data-restoration step.

References: [Cloudflare's Next.js Workers guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/),
[OpenNext Cloudflare setup](https://opennext.js.org/cloudflare/get-started), and
[Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/).
