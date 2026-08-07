# PixelUtils

PixelUtils is a static-first collection of fast, private browser tools. The application uses the Next.js App Router, strict TypeScript, Tailwind CSS, and small internal components. Tool input is intended to remain in the browser whenever technically possible.

This repository currently contains the production application scaffold and catalog architecture. Individual tools are added only when their logic, tests, UI, privacy notes, and editorial content are complete; unfinished utilities are not exposed as published pages.

## Requirements

- Node.js 20.9 or newer (Node.js 22 LTS is recommended for local development and CI)
- npm 10 or newer

## Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

On macOS or Linux, replace the `copy` command with `cp .env.example .env.local`.

Open [http://localhost:3000](http://localhost:3000). The application does not require a database, authentication provider, or external API.

## Environment variables

| Variable                         | Required    | Purpose                                                                 |
| -------------------------------- | ----------- | ----------------------------------------------------------------------- |
| `SITE_URL`                       | Production  | Absolute canonical origin, for example `https://www.example.com`        |
| `CONTACT_EMAIL`                  | Recommended | Address used by the contact page's `mailto:` link                       |
| `NEXT_PUBLIC_ANALYTICS_ENABLED`  | No          | Enables the analytics boundary only in production; defaults to `false`  |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | No          | Public identifier that must match an explicitly registered adapter      |
| `ADS_ENABLED`                    | No          | Allows completely configured ad slots to render; defaults to `false`    |
| `ADS_PROVIDER`                   | No          | Server-side provider identifier; no provider is included by default     |
| `AD_SLOT_*`                      | No          | Verified placement identifiers supplied by a future advertising partner |

Do not place secrets in `NEXT_PUBLIC_*` variables because Next.js includes them in browser-accessible output. Site and contact configuration remain server-side.

## Commands

```bash
npm run dev        # Start the local development server
npm run lint       # Run ESLint
npm run typecheck  # Run strict TypeScript checks
npm run test       # Run Vitest once
npm run test:watch # Run Vitest in watch mode
npm run validate:registry # Run catalog, route, workspace, and SEO integrity tests
npm run build      # Create a production build
npm run start      # Serve a production build locally
npm run validate   # Run lint, types, tests, and the production build
```

## Architecture

- `app/` contains App Router pages, metadata routes, loading states, and the global design system.
- `components/` contains small shared layout, catalog, SEO, advertising, tool-action, input/output, and tool-shell components.
- `lib/catalog/` contains the strongly typed tool/category registry, framework-free search helpers, derived selectors, and build-time validation.
- `lib/analytics/` contains the allow-listed event schema, inert dispatcher, and provider registration contract.
- `lib/ads/` contains server-only advertising configuration and placement identifiers.
- `lib/storage/` contains bounded, versioned adapters for local-only recents, favorites, committed search history, and content-free activity history.
- `hooks/` contains small client adapters for subscribing to defensive local preferences without duplicating hydration logic.
- `tools/` is reserved for isolated tool logic, focused tests, and lazily loaded workspaces.
- `docs/` contains the product, architecture, roadmap, SEO, and UI decisions used by the project.

The registry is the source of truth for published routes. Category and tool pages are statically generated, and sitemap entries include only categories with published tools and tools whose status is `published`.

## Adding a tool

1. Read `AGENTS.md` and the documents in `docs/`.
2. Create a tool folder containing pure TypeScript logic, focused tests, and a client workspace.
3. Add complete editorial and SEO content to the typed registry.
4. Register the workspace with a direct dynamic import in `tools/workspace-registry.ts`; its exhaustive `ToolSlug` map fails type checking for missing or extra implementations.
5. Add and validate related-tool relationships.
6. Confirm processing and privacy claims match the implementation.
7. Run `npm run validate` before changing the tool status to `published`.

Do not put React, browser globals, storage, telemetry, or network calls in deterministic tool logic.

## Deployment

### Vercel

1. Import the repository into Vercel.
2. Use the detected Next.js framework settings.
3. Set `SITE_URL` to the final HTTPS origin.
4. Set `CONTACT_EMAIL` to the monitored contact address.
5. Leave analytics and advertising variables disabled unless audited adapters and policies have been added.
6. Deploy, then verify the homepage, category pages, privacy page, `robots.txt`, `sitemap.xml`, and `manifest.webmanifest`.

The ordinary tool architecture does not require Vercel Functions, a database, or paid services.

### Cloudflare

Use Cloudflare's current supported Next.js deployment adapter and verify its handling of App Router metadata routes and response headers. The application avoids platform-specific APIs in core product code, but Cloudflare compatibility should be revalidated against the current adapter before launch.

## Continuous integration

The GitHub Actions workflow installs the lockfile and runs ESLint, strict type checking, Vitest, and the production build for pushes to `main` and pull requests.

## Analytics, privacy, and advertising

- No analytics or advertising provider is installed. The application makes no analytics or advertising requests under default configuration.
- Analytics is production-only, requires complete public configuration and an explicitly registered adapter, and accepts only the categorical events documented in `docs/analytics-advertising.md`.
- `AdSlot` requires advertising to be enabled, a provider identifier, and a placement identifier. Otherwise it returns `null` and reserves no space.
- `public` advertising authorization is represented by `/ads.txt`, which currently states that no sellers are authorized and contains no invented publisher ID.
- Theme preference, recent/favorite tool slugs, committed catalog searches, and optional content-free tool activity are stored locally. Search history is bounded and clearable; sensitive-tool history is disabled by default.
- Telemetry must never include search text, tool input, uploaded files or filenames, output, passwords, tokens, hashes, clipboard content, or full URLs.
