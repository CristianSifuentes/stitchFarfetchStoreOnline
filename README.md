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

https://dev.to/kafeel-ahmad/deploying-angular-in-2026-an-architects-guide-to-build-once-run-everywhere-34eh
https://dev.to/cristiansifuentes/13-angular-concepts-you-must-master-before-your-next-interview-2026-edition-5b74
https://medium.com/@sanikapatil0213/folder-structures-that-scale-angular-architecture-for-big-teams-decb717e1f94
https://medium.com/@flaviusson/angular-20-to-21-transition-guide-breaking-changes-best-practices-and-migration-paths-2026-9a66338ac33e
https://khizaruddins.medium.com/modern-angular-enterprise-architecture-2026-beff3d0b928f

Una aplicación moderna de Angular 21 (lanzado a finales de 2025/2026) debe construirse bajo el paradigma de "señales primero" (signal-first), siendo más rápida, ligera y fácil de mantener al eliminar dependencias antiguas como Zone.js. 
Aquí tienes los conceptos, tecnologías y temas imprescindibles para Angular 21:
1. Paradigmas y Conceptos Fundamentales
Signals (Reactividad Fina): Es la base. Se debe usar signal(), computed() y effect() para manejar el estado local y la UI, reemplazando a BehaviorSubject en la mayoría de los casos de componentes.
Zoneless Change Detection (Sin Zone.js): Angular 21 activa por defecto la detección de cambios sin Zone.js, lo que mejora drásticamente el rendimiento. La app debe diseñarse para no depender de la detección de cambios global.
Standalone Components (Componentes Independientes): Los módulos (NgModule) ya no son necesarios. Todo debe construirse con componentes, directivas y pipes standalone: true.
OnPush Change Detection Strategy: Obligatorio en todos los componentes para maximizar el rendimiento en arquitecturas zoneless. 
Medium
Medium
 +6
2. Tecnologías y APIs "Must-Have"
Signal Forms: Las "Signal Forms" reemplazan el enfoque antiguo basado en RxJS para formularios, ofreciendo una API más ligera y reactiva.
Signal-based Inputs/Outputs: Usar input() y output() en lugar de decoradores @Input() y @Output() para mejorar la tipificación y reactividad.
Nueva sintaxis de control de flujo: Uso obligatorio de @if, @for (con track) y @switch en los templates, sustituyendo a *ngIf y *ngFor.
Deferrable Views (@defer): Uso de @defer para lazy loading de componentes en la vista, crucial para mejorar los tiempos de carga inicial.
Angular Signals/Resources (Data Fetching): Uso de la nueva API para manejar peticiones HTTP y estados de carga/error de forma declarativa.
SSR y Hidratación (Hydration): La aplicación debe estar optimizada para Server-Side Rendering (SSR) e hidratación para SEO y rendimiento, usando la sintaxis de señales para evitar errores de hidratación.
Vitest: Reemplazo de Karma/Jasmine por Vitest como el ejecutor de pruebas por defecto, más rápido y moderno.
Tailwind CSS: Integrado por defecto en la creación de nuevos proyectos para estilos rápidos. 
Angular Blog
Angular Blog
 +8
3. Temas de Arquitectura y Buenas Prácticas
HttpClient por defecto: HttpClient se inyecta automáticamente, simplificando la configuración.
Accesibilidad (ARIA): Uso de las nuevas directivas Angular Aria para crear componentes accesibles (headless).
AI-Powered CLI (MCP Server): Uso de la nueva CLI con soporte para asistentes de IA para generación de código y refactorización.
Arquitectura basada en características: Estructurar la app por módulos funcionales y no por capas técnicas.
Seguridad: Implementación de Content Security Policy (CSP) y prevención de XSS, ya que Angular 21 trae mejores herramientas de sanidad. 
Angular Blog
Angular Blog
 +4
Resumen de la "Nueva Era" (2026)
Enfoque Antiguo 	Enfoque Angular 21 (Recomendado)
NgModule	Standalone Components
Zone.js	Zoneless (Signals)
*ngIf, *ngFor	@if, @for
@Input(), @Output()	input(), output()
Reactive Forms (RxJS)	Signal Forms
Karma/Jasmine	Vitest
En conclusión: Una app en Angular 21 debe ser zoneless, signal-first, standalone y SSR-friendly. 
