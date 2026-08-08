# PixelUtils release checklist

Audit date: 8 August 2026

## Release status

The repository is release-ready once the production environment values and
Cloudflare custom domain are configured. The checks below were completed from
a clean dependency install. They do not claim that a local audit can replace
verification against the deployed Cloudflare Worker.

## Completed checks

- [x] Installed the locked dependency graph with `npm ci --no-audit --no-fund`.
- [x] Ran `npm audit`; npm reported zero known vulnerabilities.
- [x] Ran ESLint, strict TypeScript checking, all unit tests, registry
      validation, metadata validation, deployment validation, the Next.js
      production build, the OpenNext Cloudflare build, and build-output
      validation.
- [x] Crawled all 34 sitemap routes and all 39 rendered internal links. No
      route or link returned an unexpected status.
- [x] Confirmed unknown tool, category, and general routes return HTTP 404.
- [x] Confirmed all 20 published tools and all 9 categories are reachable by
      normal links and are represented in the registry-generated sitemap.
- [x] Validated unique titles/descriptions, canonical paths, category pages,
      related-tool references, orphan detection, publication states, and
      workspace mappings.
- [x] Checked `robots.txt`, sitemap generation, canonical metadata, Open Graph,
      Twitter cards, breadcrumbs, WebApplication, FAQ, and CollectionPage
      structured data through automated tests.
- [x] Checked the homepage, navigation, mobile menu, search dialog, a category
      page, representative tool pages, privacy, terms, and contact at 320 px,
      768 px, and 1440 px widths in Chromium.
- [x] Checked light and dark themes, visible focus, skip navigation, mobile-menu
      Escape handling/focus return, and the search dialog's focus and fixed
      viewport-centred dimensions.
- [x] Fixed grouped search so visual result order and arrow-key selection order
      cannot diverge.
- [x] Exercised empty and invalid JSON errors, sample actions, local transforms,
      cryptographic generation, copy, clear, swap, and browser download actions.
- [x] Exercised the dynamically loaded QR generator and confirmed it produces a
      local image preview and enables download without an upload request.
- [x] Confirmed the tested layouts have no horizontal document overflow.
- [x] Confirmed application code contains no debug logging, `debugger`
      statements, TODO experiments, fake testimonials, fake usage statistics,
      or fake trust logos.
- [x] Removed an unused catalog barrel and unused registry/type helpers while
      retaining intentionally reusable platform primitives.
- [x] Confirmed runtime dependencies are used and heavy formatting, Markdown,
      sanitisation, and QR libraries remain route/workspace loaded.
- [x] Confirmed tool inputs/outputs are not written to URLs, analytics, or local
      storage; sensitive password, JWT, and hash tools do not record history.
- [x] Confirmed analytics emits no tracking code or requests without production
      configuration and a registered adapter.
- [x] Confirmed disabled advertising renders no controls, content, or reserved
      layout space, and `ads.txt` authorises no seller.
- [x] Reviewed privacy and terms copy against the implementation. Both clearly
      state that analytics and advertising providers are currently absent and
      that the hosting platform still handles ordinary request metadata.
- [x] Confirmed production output exposes no browser source maps by default and
      contains no server-only environment variable names in client chunks.
- [x] Confirmed CSP, referrer, permissions, frame, MIME-sniffing, HSTS, and
      static-asset caching policies are covered by deployment tests.

## Remaining non-blocking issues

- The local contact page intentionally has no `mailto:` link when
  `CONTACT_EMAIL` is absent. Configure a monitored address before launch; the
  fallback text is accurate and does not invent an address.
- OpenNext emits a Windows-only best-effort dependency-patching warning during
  local builds. The generated Worker and validation still complete; the
  production build environment should use Linux/Cloudflare Builds.
- The clean install reports deprecation notices from transitive Cloudflare
  adapter dependencies (`glob@9.3.5` and `node-domexception@1.0.0`). They are
  not direct dependencies, `npm audit` reports zero vulnerabilities, and they
  should be revisited when the maintained adapter updates its graph.
- npm marks three platform-specific WASM optional packages as extraneous after
  a clean Windows install. They do not enter application bundles or production
  output; recheck this when npm or the Cloudflare adapter is upgraded.
- Browser interaction coverage was completed in Chromium. Safari/WebKit and
  Firefox smoke tests remain desirable after deployment, especially for
  clipboard, downloads, date inputs, and SubtleCrypto.
- Real Core Web Vitals, CSP enforcement at the edge, Cloudflare cache headers,
  and Search Console indexing cannot be verified until the production origin
  exists.

## Exact Cloudflare deployment steps

1. Create a Cloudflare Workers project connected to the production repository,
   or authenticate Wrangler locally with the target Cloudflare account.
2. Use Node.js 22 in the Linux build environment.
3. Set `SITE_URL` to the exact public HTTPS origin, with no path, query, or
   trailing slash (for example, `https://tools.example.com`).
4. Set `CONTACT_EMAIL` to a monitored public support address.
5. Leave `NEXT_PUBLIC_ANALYTICS_ENABLED=false`, `ADS_ENABLED=false`, provider
   names/slot IDs empty, and `ENABLE_BROWSER_SOURCE_MAPS=false` unless each has
   received a separate privacy, consent, CSP, and disclosure review.
6. Do not place account tokens, secrets, or private IDs in `NEXT_PUBLIC_*`
   variables, `wrangler.jsonc`, or committed `.env` files.
7. From a clean checkout, run:

   ```powershell
   npm ci --no-audit --no-fund
   $env:SITE_URL = "https://tools.example.com"
   $env:CONTACT_EMAIL = "support@example.com"
   npm run validate
   npm run build:production
   npx wrangler deploy
   ```

8. Attach the intended custom domain to the Worker and wait for Cloudflare's
   HTTPS certificate to become active.
9. Run every item in the immediate post-launch section before announcing the
   release. If a blocking check fails, use Cloudflare deployment history to
   roll back to the previous healthy Worker version.

## Exact Google Search Console setup steps

1. Sign in to [Google Search Console](https://search.google.com/search-console/)
   with the account that will own the site.
2. Open the property selector, choose **Add property**, select **Domain**, and
   enter only the domain (for example, `example.com`). A Domain property covers
   HTTP/HTTPS and all subdomains.
3. Copy the generated `google-site-verification=...` TXT value. In Cloudflare
   DNS, add a TXT record at the root (`@`) with that exact value and the default
   TTL. Return to Search Console and choose **Verify**. DNS propagation can take
   time; leave the TXT record in place after verification. Follow Google's
   [official ownership-verification instructions](https://support.google.com/webmasters/answer/9008080?hl=en)
   if the domain is managed elsewhere.
4. Open `https://YOUR_DOMAIN/robots.txt` and
   `https://YOUR_DOMAIN/sitemap.xml` in a private browser window. Both must
   return HTTP 200 and must reference the exact production origin.
5. In Search Console, open **Sitemaps**, enter `sitemap.xml`, and choose
   **Submit**. Wait for a successful fetch in the
   [Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=en).
6. Open **URL inspection** and inspect the full production URL for the homepage,
   one category, and one representative tool. Choose **Test live URL** and
   confirm that the page can be fetched, indexing is allowed, and the declared
   canonical is the same production URL. Use **Request indexing** for these
   small launch samples; use the sitemap, not repeated manual requests, for the
   full catalog. See Google's [URL Inspection guidance](https://support.google.com/webmasters/answer/12482179?hl=en).
7. Over the first days and weeks, review **Page indexing**, **Sitemaps**,
   **Core Web Vitals**, **Security issues**, and **Performance**. Investigate
   unexpected exclusions or canonical selections; no setup step guarantees a
   ranking or indexing schedule.

## Immediate post-launch checks

- [ ] Homepage, all category links, and representative tools return HTTP 200 on
      the canonical HTTPS host; unknown category/tool URLs return the custom
      HTTP 404.
- [ ] `robots.txt`, `sitemap.xml`, `manifest.webmanifest`,
      `catalog-index.json`, `ads.txt`, and `icon.svg` return HTTP 200 with the
      expected MIME type and production URLs.
- [ ] Page source contains the expected unique title, description, canonical,
      Open Graph/Twitter tags, and valid page-specific JSON-LD.
- [ ] The configured contact button is a `mailto:` link to the monitored
      address and does not expose a placeholder address.
- [ ] Response headers include Content Security Policy, HSTS, Referrer Policy,
      Permissions Policy, frame protection, and `X-Content-Type-Options:
      nosniff`.
- [ ] Hashed `/_next/static/` assets are immutable for one year; HTML responses
      are not incorrectly cached as immutable.
- [ ] Browser developer tools show no CSP violation, hydration error, console
      error, missing chunk, failed HMR request, or unexpected third-party
      request.
- [ ] Search opens with `Ctrl/Cmd+K`, traps focus, supports arrows/Home/End,
      opens the selected tool, closes with Escape, and works on mobile.
- [ ] Sample, clear, copy, swap, and download actions work on representative
      text, calculator, security, and QR tools in light and dark themes.
- [ ] Network inspection confirms tool contents and filenames are not uploaded
      and analytics/advertising requests are absent under default configuration.
- [ ] Mobile pages at 320 px have no horizontal scrolling, hidden controls, or
      obstructive ad regions; desktop and tablet layouts remain stable.
- [ ] No public `.map` response is available unless source maps were deliberately
      enabled for this release.
- [ ] Cloudflare Worker size and request usage remain within the selected free
      tier, and no unexpected database, R2, queue, or paid-service binding is
      attached.
