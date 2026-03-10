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

## info

npm install succeeded.
npm run build succeeded.
npx ng build --configuration development succeeded (same build target used by ng serve development).

## Advanced Angular

A modern Angular 21 application (late 2025/2026 era) should be built with a signal-first approach to stay fast, lightweight, and maintainable while removing legacy dependencies like Zone.js.

### 1. Core Paradigms

- Signals (fine-grained reactivity): use `signal()`, `computed()`, and `effect()` for local state and UI updates; replace `BehaviorSubject` in most component-level cases.
- Zoneless change detection: design the app for explicit reactive updates without global Zone.js patching.
- Standalone components: build with `standalone: true` components, directives, and pipes instead of `NgModule`.
- OnPush strategy by default: apply `ChangeDetectionStrategy.OnPush` across components for predictable high performance in zoneless apps.

### 2. Must-Have APIs and Tooling

- Signal Forms: move from RxJS-heavy forms to a lighter signal-based forms model.
- Signal-based inputs/outputs: prefer `input()` and `output()` over `@Input()` and `@Output()`.
- New control flow syntax: use `@if`, `@for` (with `track`), and `@switch` instead of `*ngIf` and `*ngFor`.
- Deferrable views: use `@defer` for lazy-loading UI blocks and improving initial load times.
- Signals/resources for data fetching: model loading, success, and error states declaratively.
- SSR and hydration: optimize for SEO and runtime performance with hydration-safe, signal-based templates.
- Vitest: replace Karma/Jasmine with a faster and modern test runner.
- Tailwind CSS: keep utility-first styling as the default rapid UI workflow.

### 3. Architecture and Best Practices

- HttpClient by default: streamlined HTTP setup with modern provider patterns.
- Accessibility (ARIA): use Angular ARIA directives and accessible headless component patterns.
- AI-powered CLI and MCP workflows: leverage CLI support for AI-assisted generation and refactoring.
- Feature-based architecture: organize by business features instead of technical layers.
- Security baseline: enforce Content Security Policy (CSP) and proactive XSS prevention.

### 2026 Migration Snapshot

| Legacy Approach | Angular 21 Recommended |
| --- | --- |
| `NgModule` | Standalone components |
| Zone.js | Zoneless + signals |
| `*ngIf`, `*ngFor` | `@if`, `@for` |
| `@Input()`, `@Output()` | `input()`, `output()` |
| Reactive Forms (RxJS-first) | Signal Forms |
| Karma/Jasmine | Vitest |

In short: Angular 21 apps should be zoneless, signal-first, standalone, and SSR-friendly.

## Relevant Links

- https://dev.to/kafeel-ahmad/deploying-angular-in-2026-an-architects-guide-to-build-once-run-everywhere-34eh
- https://dev.to/cristiansifuentes/13-angular-concepts-you-must-master-before-your-next-interview-2026-edition-5b74
- https://medium.com/@sanikapatil0213/folder-structures-that-scale-angular-architecture-for-big-teams-decb717e1f94
- https://medium.com/@flaviusson/angular-20-to-21-transition-guide-breaking-changes-best-practices-and-migration-paths-2026-9a66338ac33e
- https://khizaruddins.medium.com/modern-angular-enterprise-architecture-2026-beff3d0b928f
