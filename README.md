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

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production | Absolute canonical origin, for example `https://www.example.com` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Recommended | Address used by the contact page's `mailto:` link |
| `NEXT_PUBLIC_ADS_ENABLED` | No | Reserved for future advertising; keep `false` until a provider and policies are configured |

Do not place secrets in `NEXT_PUBLIC_*` variables because Next.js includes them in browser-accessible output.

## Commands

```bash
npm run dev        # Start the local development server
npm run lint       # Run ESLint
npm run typecheck  # Run strict TypeScript checks
npm run test       # Run Vitest once
npm run test:watch # Run Vitest in watch mode
npm run build      # Create a production build
npm run start      # Serve a production build locally
npm run validate   # Run lint, types, tests, and the production build
```

## Architecture

- `app/` contains App Router pages, metadata routes, loading states, and the global design system.
- `components/` contains small shared layout, catalog, SEO, advertising, and tool-shell components.
- `lib/catalog/` contains the strongly typed tool/category registry and framework-free search helpers.
- `tools/` is reserved for isolated tool logic, focused tests, and lazily loaded workspaces.
- `docs/` contains the product, architecture, roadmap, SEO, and UI decisions used by the project.

The registry is the source of truth for published routes. Category and tool pages are statically generated, and sitemap entries include only categories with published tools and tools whose status is `published`.

## Adding a tool

1. Read `AGENTS.md` and the documents in `docs/`.
2. Create a tool folder containing pure TypeScript logic, focused tests, and a client workspace.
3. Add complete editorial and SEO content to the typed registry.
4. Add and validate related-tool relationships.
5. Confirm processing and privacy claims match the implementation.
6. Run `npm run validate` before changing the tool status to `published`.

Do not put React, browser globals, storage, telemetry, or network calls in deterministic tool logic.

## Deployment

### Vercel

1. Import the repository into Vercel.
2. Use the detected Next.js framework settings.
3. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
4. Set `NEXT_PUBLIC_CONTACT_EMAIL` to the monitored contact address.
5. Leave `NEXT_PUBLIC_ADS_ENABLED=false`.
6. Deploy, then verify the homepage, category pages, privacy page, `robots.txt`, `sitemap.xml`, and `manifest.webmanifest`.

The ordinary tool architecture does not require Vercel Functions, a database, or paid services.

### Cloudflare

Use Cloudflare's current supported Next.js deployment adapter and verify its handling of App Router metadata routes and response headers. The application avoids platform-specific APIs in core product code, but Cloudflare compatibility should be revalidated against the current adapter before launch.

## Continuous integration

The GitHub Actions workflow installs the lockfile and runs ESLint, strict type checking, Vitest, and the production build for pushes to `main` and pull requests.

## Privacy and advertising

- The scaffold makes no external API calls and includes no analytics provider.
- The `AdSlot` component renders nothing and contains no provider script.
- Theme preference is the only current browser storage use.
- Future telemetry must never include tool input, uploaded files, output, passwords, tokens, hashes, or clipboard content.
