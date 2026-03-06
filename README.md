# Stitch Farfetch Store Online (Angular 21-style Architecture)

A modern Angular luxury-fashion storefront inspired by Farfetch, designed for **enterprise-scale teams** and aligned with 2026 paradigms:

- Signals-first thinking
- Zoneless by default
- SSR + hydration first-class
- Lean, explicit change detection
- Feature-first architecture for team scalability

## Tech Stack

- Angular (standalone, SSR-ready)
- Signals, computed state, signal inputs/outputs
- OnPush change detection
- Zoneless bootstrap (`provideExperimentalZonelessChangeDetection`)
- HttpClient with `withFetch()`
- Tailwind CSS
- Vitest
- Express SSR entry

## Architecture (Scalable Team Structure)

```text
src/app
  core/        # singletons, guards, configs, app-wide services
  shared/      # reusable stateless building blocks
  features/    # isolated business verticals
  layouts/     # structural shells
src/assets
src/environments
```

### Feature Boundaries

- `features/home` — homepage composition + local store
- `features/mens` — menswear vertical
- `features/kids` — kidswear vertical
- `features/product` — PDP route

Each feature is intentionally isolated to keep ownership clear and future micro-frontend extraction feasible.

## Implemented Paradigms Checklist

- ✅ Signals (fine-grained state in `HomeStore`, cart, and newsletter form)
- ✅ Zoneless change detection setup
- ✅ Standalone components throughout
- ✅ OnPush strategy in pages and shared components
- ✅ Signal-based inputs/outputs (`input()`, `output()` in product card)
- ✅ New control flow syntax (`@if`, `@for`)
- ✅ Deferrable views (`@defer` newsletter block)
- ✅ SSR + hydration (`main.server.ts`, `server.ts`, `provideClientHydration`)
- ✅ Vitest config and sample test
- ✅ Tailwind CSS setup
- ✅ Default HttpClient architecture with fetch backend
- ✅ Accessibility basics (ARIA labels, semantic landmarks, live cart count)
- ✅ Feature-based architecture and barrel exports
- ✅ CSP + XSS prevention baseline (CSP meta + safe Angular binding)

## Security Notes

- CSP declared in `src/index.html`.
- No direct unsafe HTML injection.
- Product data is rendered through Angular template bindings.
- SSR server sets hardening headers (`X-Content-Type-Options`, `X-Frame-Options`).

## AI-Powered CLI / MCP Readiness

This project is organized to work well with AI-assisted workflows (including MCP-based tooling) by maintaining:

- strict folder conventions,
- small reusable components,
- clear ownership boundaries,
- predictable route + feature segmentation.

## Getting Started

```bash
npm install
npm run start
```

## Build / SSR

```bash
npm run build
npm run build:ssr
npm run serve:ssr
```

## Tests

```bash
npm run test
```

## Disclaimer

This project is an educational architecture demonstration inspired by Farfetch’s marketplace domain and UI patterns.
