# PixelUtils

Free browser tools for everyday developer, text, design, security, date, and calculation tasks.

PixelUtils is built to be fast, private, and simple: no account is needed, and ordinary tool processing stays in the browser whenever possible.

## Run locally

Requirements: Node.js 20.9+ and npm 10+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app does not need a database, account provider, or external API for normal tool use. Copy `.env.example` to `.env.local` only when you need to set optional local configuration.

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start development mode |
| `npm run lint` | Check code style and accessibility rules |
| `npm run typecheck` | Run strict TypeScript checks |
| `npm run test` | Run the test suite |
| `npm run validate` | Run all checks and a clean Cloudflare production build |
| `npm run build:production` | Clean, build, and validate OpenNext output |
| `npm run preview:cloudflare` | Build and run the Worker locally |
| `npm run deploy:cloudflare` | Clean, build, validate, and deploy to Cloudflare |

## Deploy to Cloudflare Workers

The production command is intentionally a single pipeline:

```bash
npm run deploy:cloudflare
```

It removes old `.next` and `.open-next` output, creates a new Next/OpenNext build, verifies that the Worker assets match that build, then deploys it. Do not deploy `.open-next` manually.

Set the final HTTPS site URL in `wrangler.jsonc` before deployment. For a local Worker check, run:

```bash
npm run preview:cloudflare
```

Stop a local preview before starting another production build, because Wrangler keeps the generated Worker assets open while it is running. OpenNext works on Windows, but Linux or WSL is the more reliable environment for release builds.

## Project map

- `app/` - routes, pages, metadata routes, and global styles
- `components/` - shared layout, catalogue, tool, SEO, and content UI
- `lib/catalog/` - typed tool and category registry
- `lib/guides/` - typed guides, static routes, and guide validation
- `tools/` - isolated tool logic, tests, and lazy-loaded workspaces
- `scripts/` - production build and output-validation scripts
- `docs/` - detailed product, design, SEO, media, and deployment decisions

## Add a tool or guide

Tools are registry-driven. A published tool needs its logic, tests, workspace, SEO content, category, and related-tool links together. Guides are also typed, statically generated content and must link to a real relevant tool.

Before publishing either, run:

```bash
npm run validate
```

Read [AGENTS.md](./AGENTS.md) before making product changes. It contains the privacy, accessibility, SEO, testing, and architecture rules for this repository.

## Privacy

- Tool inputs and outputs are not sent to analytics.
- Sensitive values such as passwords, JWTs, and hash sources are not stored in local history.
- Analytics and ads are disabled by default.
- Any future exception to local processing must be explicit on the relevant tool page.

For the detailed policies, see [docs/product-requirements.md](./docs/product-requirements.md), [docs/seo-strategy.md](./docs/seo-strategy.md), and [DEPLOYMENT.md](./DEPLOYMENT.md).
