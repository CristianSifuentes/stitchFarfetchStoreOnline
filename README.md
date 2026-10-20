<div align="center">

# VESTRA

#### Luxury Fashion Store Online

### A luxury-fashion storefront, hand-built with Angular 21: standalone, zoneless and signal-first

*VESTRA, from the Latin* vestis *(garment): a minimal name for a minimal, monochrome store, modelled on Farfetch.*

*Three departments (Women, Men, Kids), 82 products from 65 designers, curated edits, sale prices, age groups for kidswear, a shared wishlist, a bag and a sign-in dialog. Every page follows Farfetch's own structure and one strict design system, "Monochrome Absolute".*

[![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.2-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?logo=reactivex&logoColor=white)](https://rxjs.dev/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest%204-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![SSR](https://img.shields.io/badge/SSR-Express%20%2B%20Angular%20SSR-000000?logo=express&logoColor=white)](https://angular.dev/guide/ssr)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue)](LICENSE)

</div>

---

## Table of Contents

1. [What This Project Is](#1-what-this-project-is)
2. [A Tour of the App](#2-a-tour-of-the-app)
3. [Tech Stack](#3-tech-stack)
4. [Architecture](#4-architecture)
   - [4.1 Guiding principles](#41-guiding-principles)
   - [4.2 Layer map](#42-layer-map)
   - [4.3 Route table](#43-route-table)
   - [4.4 Data flow](#44-data-flow)
   - [4.5 Bootstrapping, step by step](#45-bootstrapping-step-by-step)
5. [Project Structure](#5-project-structure)
6. [Core: Catalog, Taxonomy and State](#6-core-catalog-taxonomy-and-state)
7. [Shared: The UI Kit](#7-shared-the-ui-kit)
8. [Layout: The Storefront Shell](#8-layout-the-storefront-shell)
   - [8.1 Sign in & register](#81-sign-in--register)
   - [8.2 Language & region](#82-language--region)
9. [Pages: Every Feature in Depth](#9-pages-every-feature-in-depth)
10. [The Catalog Data](#10-the-catalog-data)
11. [Product Photography](#11-product-photography)
12. [The Design System](#12-the-design-system)
13. [URL State: The Listing Query](#13-url-state-the-listing-query)
14. [State Management with Signals](#14-state-management-with-signals)
15. [Accessibility](#15-accessibility)
16. [SSR, Hydration & Security](#16-ssr-hydration--security)
17. [Testing](#17-testing)
18. [Configuration & Tooling](#18-configuration--tooling)
19. [Concept Index: Where to Learn What](#19-concept-index-where-to-learn-what)
20. [Project History: How It Grew](#20-project-history-how-it-grew)
21. [Design Decisions & Trade-offs](#21-design-decisions--trade-offs)
22. [Getting Started](#22-getting-started)
23. [Scaling the Project](#23-scaling-the-project)
24. [Roadmap & Known Gaps](#24-roadmap--known-gaps)
25. [Contributing, License & Credits](#25-contributing-license--credits)

---

## 1. What This Project Is

A study of how a real luxury marketplace is put together, rebuilt in modern Angular. The reference is
[farfetch.com](https://www.farfetch.com/): its department hubs (`/shopping/women/items.aspx`), its listing pages,
its product pages and its navigation. The visual language comes from the Stitch prototypes in `prototypes/`,
in particular `prototypes/woman_/woman8` and its `DESIGN.md`, **"Monochrome Absolute"**.

Three ideas run through every file:

| Idea | In practice |
| ---- | ----------- |
| **One source of truth** | One catalog (`CatalogStore`), one taxonomy (`taxonomy.ts`), one query function (`queryCatalog`), one product card, one heart, one price tag, one set of design tokens. |
| **Structure is code, content is data** | The three departments share **one** hub template, **one** listing and **one** product page. What differs between Women, Men and Kids lives in data (`DEPARTMENT_CONTENT`, `catalog.json`). |
| **The URL is the state** | Every listing view (`?age=baby&category=shoes&sale=true&sort=price-asc`) can be shared, bookmarked and restored with the back button. |

---

## 2. A Tour of the App

| Route | Page | What you can do |
| ----- | ---- | --------------- |
| `/` | **Home** | Choose a department ("Choose your world"), read the editorial, browse house names, featured designers and the newest arrivals across the store. |
| `/womenswear`, `/menswear`, `/kids` | **Department hub** | Farfetch's hub, in its order: seasonal campaign, *New in daily*, *Trending now*, an editorial story with its pieces, **Shop by age** (Kids only), *Shop by category*, *Trending brands* and *More to explore*. |
| `/<department>/items` | **Listing** | Farfetch's `items.aspx`: filter by age (Kids), category, designer and sale; sort by newest or price; load more. Title, description and breadcrumb name exactly what you selected. |
| `/<department>/brands` | **Brands** | Trending houses as large tiles, then every designer in the department from A to Z with its piece count. |
| `/bag` | **Shopping bag** | Farfetch's basket: change size and quantity in place, move to wishlist, remove with Undo, unavailable (sold-out) items apart, a summary with Standard / Express delivery and the total in your currency, then **Continue** to a simulated order. Below: free returns, your wishlist, recommendations and recently viewed. |
| `/wishlist` | **Wishlist** | Everything you saved, most recent first: remove with **Undo**, filter *All · Available · On sale · Sold out*, pick a size and **Add to bag** right from the card, and *You may also like*. Signed in it shows your name and VESTRA Access tier (**Bronze**); signed out, a prompt to sign in and keep it. |
| `/search?q=` | **Search** | The same listing across all departments. Search is accent-insensitive (`chloe` finds *Chloé*). |
| `/product/:id` | **Product** | Gallery (full view + two detail crops), size picker with the right size run, add to bag, wishlist, details, size & fit, shipping, and *You may also like*. |
| `/anything-else` | **404** | A way back to the store. |
| *any page* → globe icon | **Language & region** | Farfetch's selector as a drawer: pick a language and a region; prices switch to the region's currency (MXN, EUR, GBP, JPY…) everywhere, at once. |
| *any page* → account icon | **Sign in dialog** | Farfetch's pop-up: sign in, register, continue with a one-time code, reset a password, or continue with Google, Apple or Facebook. |

**The header changes with the department you're in:**

| Department | Category bar |
| ---------- | ------------ |
| Women, Men | Gifts & Party · New In · Brands · Clothing · Shoes · Bags · Accessories · Jewelry · <span>Sale</span> |
| Kids | Gifts · New In · Brands · Baby (0–36 months) · Kids (2–12 years) · Teens (13–16 years) · <span>Sale</span> |

Small touches, everywhere:

- **Wishlist:** every heart in the app reads and writes the same store; the header heart (with its live count)
  opens `/wishlist`. Each account keeps its own list, and what you saved as a guest joins your account when you
  sign in.
- **Sold out:** some pieces can't be bought right now: "Sold out" replaces the price, the PDP disables the sizes and
  the bag button, and they can still be saved.
- **Sale:** marked-down pieces show the sale price in red, the original struck through and the discount
  (`$225 $325 -31%`), and sorting uses the price actually paid.
- **Sizes that make sense:** a bodysuit offers `3M–24M`, a teen's sneaker `36–40 EU`, a womenswear coat `38–46 IT`;
  bags, accessories and jewelry are one size and skip the picker.
- **Quick add:** "Add to bag" appears on hover on desktop and is always visible on touch screens.
- **Breadcrumbs everywhere:** `Home / Kids / Baby / Clothing / Teddy knit hooded romper`.
- **A real bag:** sizes and quantities you can change in place, sold-out pieces set apart, free standard delivery
  from $200, and a (simulated) order placed with an order number. It follows the session like the wishlist.
- **Your currency:** the globe in the header (`US · EN`) and the footer open *Language & region*; choose Mexico and every price reads `$9,568` in pesos, choose Germany and it reads `468 €`.
- **An account:** the header's person icon opens the sign-in dialog; once signed in it becomes your initial, with a menu to sign out. The session survives a reload.

---

## 3. Tech Stack

| Layer | Technology | Version | How it's used |
| ----- | ---------- | ------- | ------------- |
| Framework | **Angular** | 21.2 | Standalone components, signals, `linkedSignal`, `input()`, control flow, `withComponentInputBinding`, lazy `loadComponent` |
| i18n | **@angular/localize** | 21.2 | `i18n` / `$localize` with custom IDs, ICU plurals, one build per language (en-US, es-419, de, fr, ru, zh-Hans) |
| Dialogs | Native `<dialog>` | platform | `showModal()`: top layer, focus trap, Esc, inert page |
| Change detection | **Zoneless** | built-in | `provideZonelessChangeDetection()`; every component is `OnPush` |
| Language | **TypeScript** | 5.9 | `strict`, `strictTemplates`, `noImplicitOverride`, `noImplicitReturns`, `noPropertyAccessFromIndexSignature`, `noFallthroughCasesInSwitch` |
| Async | **RxJS** | 7.8 | HTTP + `toSignal`; router events → URL signal in the header |
| HTTP | `HttpClient` + `withFetch()` | built-in | Loads `assets/data/catalog.json` once |
| Styling | **Tailwind CSS v4** | 4.2 | `@theme` tokens and `@utility` classes in `src/styles.css`, via `@tailwindcss/postcss` |
| Font | **Inter** | Google Fonts | 300/400/500/600 |
| Build | **@angular/build** (esbuild + Vite) | 21 | `application` builder with SSR entry |
| SSR | **@angular/ssr** + **Express** | 21 / 4.22 | `AngularNodeAppEngine`, server routes (`RenderMode.Server`), hydration, hardening headers |
| Unit tests | **Vitest** | 4.0 | Node environment, pure-function specs |
| Images | **Unsplash (imgix)** | CDN | Resized and focal-point-cropped per context |

**Not used, on purpose:** no UI kit, no component library, no state library (NgRx etc.), no animation package, no
runtime translation library (ngx-translate, Transloco): Angular's own i18n compiles each language in.
Everything is Angular, Tailwind and the web platform.

---

## 4. Architecture

### 4.1 Guiding principles

1. **Feature-first, fully lazy.** Every routed page is a standalone component under `features/<name>/pages/`,
   loaded with `loadComponent`. Each page ships as its own JavaScript chunk.
2. **Products come only from `CatalogStore`.** Pages derive what they show with `computed()`. No page keeps
   its own product array or fetches data itself.
3. **Features don't import each other's internals.** What two features need lives in `core/` (data and state)
   or `shared/` (UI). The single, deliberate exception is `listing.query.ts`, a **pure** module the department
   page reuses to picture its tiles.
4. **One template per kind of page.** Women, Men and Kids are the same hub, the same listing and the same PDP.
   Departments differ through data (`DEPARTMENT_CONTENT`, the catalog), never through copied templates.
5. **Images follow the catalog.** Category, age, designer, trend and brand tiles are pictured by the newest
   product their link leads to, so a picture always matches what the user finds after clicking.
6. **The design system can't drift.** Tailwind's radius and shadow scales are removed, so `rounded-lg` or
   `shadow-md` simply don't exist. Components use the shared utilities (`btn-primary`, `label-caps`, …)
   instead of restyling.
7. **Signals for state, RxJS at the edges.** Component and service state are signals; RxJS appears only where
   Angular hands you an Observable (HTTP, router events), converted with `toSignal`.

### 4.2 Layer map

```mermaid
flowchart TD
    main["main.ts<br/>bootstrapApplication(AppComponent, appConfig)"] --> App["AppComponent<br/>&lt;router-outlet /&gt;"]
    App --> Layout

    subgraph Layout["layouts/public-layout (eager)"]
      Header["SiteHeader"]
      Outlet["&lt;main&gt; router-outlet"]
      Below["ServiceLinks · NewsletterBand · SiteFooter"]
      Auth["@defer AuthDialog · LocalePicker<br/>(own chunks)"]
    end

    Outlet -->|loadComponent| Home["features/home"]
    Outlet -->|"loadComponent ×3 departments"| Dept["features/department"]
    Outlet -->|"loadComponent ×3 + /search"| Listing["features/listing"]
    Outlet -->|"loadComponent ×3"| Brands["features/brands"]
    Outlet -->|loadComponent| Product["features/product"]
    Outlet -->|loadComponent| Bag["features/bag"]
    Outlet -->|loadComponent| Wish["features/wishlist"]
    Outlet -->|"loadComponent (last)"| NotFound["features/not-found"]

    Shared["shared/ui · pipes · utils<br/>13 components · price pipe"]
    Core["core/catalog · core/services · core/auth · core/locale · core/theme<br/>model · taxonomy · sizing · images · designers<br/>CatalogStore · WishlistService · BagService · RecentlyViewed<br/>AuthService · AuthDialogService · LocaleService · ThemeService"]

    Home --> Shared
    Dept --> Shared
    Listing --> Shared
    Brands --> Shared
    Product --> Shared
    Shared --> Core
    Dept --> Core
    Listing --> Core
    Product --> Core
    Header --> Core
```

All services are `providedIn: 'root'`: tree-shakable singletons that need no registration.

### 4.3 Route table

```ts
// src/app/app.routes.ts
function departmentRoutes(path: string, id: Department): Routes {
  return [
    { path,                  loadComponent: department, data: { department: id }, title: titleFor(id) },
    { path: `${path}/items`, loadComponent: listing,    data: { department: id }, title: `${titleFor(id)} · Shop all` },
    { path: `${path}/brands`,loadComponent: brands,     data: { department: id }, title: `${titleFor(id)} · Brands` }
  ];
}

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,           // header + footer around every page
    children: [
      { path: '', loadComponent: home },
      ...departmentRoutes('womenswear', 'womenswear'),
      ...departmentRoutes('menswear', 'menswear'),
      ...departmentRoutes('kids', 'kids'),
      { path: 'search',      loadComponent: listing, data: { department: null } },
      { path: 'product/:id', loadComponent: product },
      { path: '**',          loadComponent: notFound }      // ← always last
    ]
  }
];
```

The router is configured with:

```ts
provideRouter(
  routes,
  withComponentInputBinding(),   // data.department and :id arrive as input() signals
  withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
)
```

Because of `withComponentInputBinding`, pages never inject `ActivatedRoute` to read their department or id:

```ts
readonly department = input.required<Department>();   // from route data
readonly id = input.required<string>();               // from /product/:id
```

Adding a department is **one line** here (`...departmentRoutes('beauty', 'beauty')`) plus its data.

### 4.4 Data flow

```mermaid
flowchart LR
    JSON[("assets/data/catalog.json<br/>82 products")] -->|"HttpClient (once)"| Store["CatalogStore<br/>toSignal → all · newest · find · byDepartment"]
    CDN[("Unsplash / imgix")] -->|"sizedImage · galleryFor"| Img["Product photos<br/>600px cards · 1200px PDP"]

    Store --> Hub["Department hub<br/>tiles, carousels, stats"]
    Store --> List["Listing<br/>queryCatalog(items, query)"]
    Store --> PDP["Product page<br/>find(id) · related"]
    Store --> Home["Home<br/>newest · featureDesigner"]
    Store --> Hdr["Header<br/>department of the product you view"]

    URL[("URL query params<br/>?age ?category ?designer ?edit ?sale ?sort ?q")] <--> List
    Wish[("localStorage<br/>vestra.wishlist.v1")] <--> WS["WishlistService"]
    WS --> Hearts["Every heart + header badge"]
    Sess[("localStorage<br/>vestra.session.v1 · vestra.accounts.v1")] <--> AS["AuthService"]
    AS --> Hdr2["Header account menu"]
    AS --> Dlg["Sign-in dialog"]
    Loc[("localStorage<br/>vestra.locale.v1")] <--> LS["LocaleService<br/>region → currency"]
    LS --> Prices["price pipe · every price"]
    Thm[("localStorage<br/>vestra.theme.v1")] <--> TS["ThemeService<br/>light · dark · system"]
    TS --> Html["&lt;html data-theme&gt; · every token"]
```

### 4.5 Bootstrapping, step by step

1. `main.ts` calls `bootstrapApplication(AppComponent, appConfig)`.
2. `appConfig` provides zoneless change detection, the router, `HttpClient` with the Fetch backend, client
   hydration and a `GlobalErrorHandler`.
3. The root route renders `PublicLayoutComponent`: header, `<main>`, service links, newsletter band and footer.
4. The first component that injects `CatalogStore` triggers the single `GET /assets/data/catalog.json`. Until it
   resolves, `loading()` is `true` and pages show skeletons.
5. The matching page chunk loads lazily, receives its route data as inputs and derives its view with `computed()`.
6. On the server, `main.server.ts` bootstraps the same app with `provideServerRendering(withRoutes(serverRoutes))`
   merged in; `server.ts` hands each request to `AngularNodeAppEngine`, which renders it and returns the HTML.
   In the browser, hydration takes over the server DOM.

---

## 5. Project Structure

```text
vestra/
├── ARCHITECTURE.md                 Short rulebook: pages, folders, rules, tokens, components
├── README.md                       This document
├── prototypes/                     Stitch prototypes used as visual reference
│   ├── home_/  (home1–home3)
│   ├── men_/   (men_home, men1–men6)
│   └── woman_/ (womahome_, woman1–woman8 · woman8/DESIGN.md = "Monochrome Absolute")
├── src/
│   ├── index.html                  CSP meta, theme-init script, Inter font, <app-root>
│   ├── locale/                     messages.xlf (extracted source) + messages.<lang>.xlf per language
│   ├── test-setup.ts               Installs $localize for the specs
├── scripts/dev-i18n.mjs            npm start: every language, watch build + SSR server
│   ├── main.ts                     Browser bootstrap
│   ├── main.server.ts              Server bootstrap
│   ├── server.ts                   Express + AngularNodeAppEngine SSR server
│   ├── styles.css                  Tailwind v4: @theme tokens + @utility classes
│   ├── environments/               apiUrl ('/assets/data')
│   ├── assets/data/catalog.json    The catalog: 82 products
│   └── app/
│       ├── app.component.ts        <router-outlet />
│       ├── app.config.ts           Zoneless, router, HttpClient, hydration, ErrorHandler
│       ├── app.config.server.ts    + provideServerRendering(withRoutes(serverRoutes))
│       ├── app.routes.server.ts    Server render mode per route (all: RenderMode.Server)
│       ├── app.routes.ts           departmentRoutes() + search, product, 404
│       ├── core/
│       │   ├── bag/
│       │   │   ├── bag.model.ts          BagLine, add/size/quantity/merge, summarizeBag, delivery (+ spec)
│       │   │   ├── bag.service.ts        The shopping bag, one per account
│       │   │   └── index.ts
│       │   ├── auth/
│       │   │   ├── auth.model.ts         Account, AuthProvider, AuthResult, AuthView
│       │   │   ├── auth.validation.ts    Email and password rules, strength, names (+ spec)
│       │   │   ├── auth.service.ts       The session: sign in, register, one-time code, social, reset (+ spec)
│       │   │   ├── auth-dialog.service.ts Which dialog screen is open, and the email typed so far
│       │   │   └── index.ts
│       │   ├── locale/
│       │   │   ├── locale.model.ts       LANGUAGES, REGIONS (currency, locale, rate), formatMoney, languagePath (+ spec)
│       │   │   ├── locale.service.ts     The build's language, the visitor's region; opens the selector
│       │   │   └── index.ts
│       │   ├── theme/
│       │   │   ├── theme.model.ts        Theme, ThemePreference, resolveTheme, storage key (+ spec)
│       │   │   ├── theme.service.ts      Light or dark: data-theme on <html>, remembered, follows the system
│       │   │   └── index.ts
│       │   ├── catalog/
│       │   │   ├── catalog.model.ts      CatalogItem, Department, ProductCategory, ProductEdit, AgeGroup, prices
│       │   │   ├── taxonomy.ts           DEPARTMENTS, CATEGORIES, EDITS, AGE_GROUPS + lookups/guards
│       │   │   ├── sizing.ts             sizesFor(): size runs per department, category and age
│       │   │   ├── images.ts             sizedImage(), galleryFor() (imgix)
│       │   │   ├── designers.ts          featureDesigner(): a house's signature piece
│       │   │   ├── index.ts              Barrel
│       │   │   └── *.spec.ts
│       │   └── services/
│       │       ├── catalog.store.ts      CatalogStore, byNewest
│       │       ├── wishlist.service.ts   Persisted wishlist
│       │       ├── recently-viewed.service.ts  Product pages you opened (+ spec)
│       │       └── global-error-handler.service.ts
│       ├── shared/
│       │   ├── ui/                 14 presentational components (see §7)
│       │   ├── data/payment-methods.ts   Payment marks (Simple Icons, CC0): footer and bag
│       │   ├── i18n/plurals.ts           itemCount / pieceCount: plurals where an ICU can't go (+ spec)
│       │   ├── pipes/price.pipe.ts
│       │   └── utils/price.util.ts (+ spec)
│       ├── layouts/public-layout/
│       │   ├── auth/
│       │   │   ├── auth-dialog.component.ts     The <dialog>: photo, tabs, screens, welcome
│       │   │   ├── sign-in-form.component.ts
│       │   │   ├── register-form.component.ts
│       │   │   ├── code-form.component.ts       One-time code: 6 boxes, paste, resend
│       │   │   ├── forgot-form.component.ts
│       │   │   └── social-sign-in.component.ts  Google · Apple · Facebook
│       │   ├── locale/
│       │   │   └── locale-picker.component.ts   Language | Region drawer
│       │   ├── public-layout.component.ts
│       │   ├── site-header.component.ts
│       │   ├── service-links.component.ts
│       │   ├── newsletter-band.component.ts
│       │   └── site-footer.component.ts
│       └── features/
│           ├── home/pages/home-page.component.ts
│           ├── department/
│           │   ├── data/department-content.ts    Campaign, trends, editorial, brands per department
│           │   └── pages/department-page.component.ts
│           ├── listing/
│           │   ├── listing.query.ts              queryCatalog(), designersIn(), sorts (+ spec)
│           │   └── pages/product-listing-page.component.ts
│           ├── brands/pages/brands-page.component.ts
│           ├── product/pages/product-page.component.ts
│           ├── bag/
│           │   ├── components/bag-line.component.ts      A piece: size, quantity, move to wishlist, remove
│           │   ├── components/bag-summary.component.ts   Subtotal, delivery choice, total, Continue
│           │   └── pages/bag-page.component.ts           The bag, checkout and order confirmation
│           ├── wishlist/
│           │   ├── components/wishlist-card.component.ts   Saved piece: remove, size, Add to bag
│           │   └── pages/wishlist-page.component.ts
│           └── not-found/pages/not-found-page.component.ts
├── angular.json · tsconfig*.json · vitest.config.ts · postcss.config.json
└── LICENSE                         Apache 2.0
```

**Naming:** files are kebab-case with a role suffix (`*.component.ts`, `*.service.ts`, `*.store.ts`,
`*.pipe.ts`, `*.util.ts`, `*.spec.ts`); selectors use the `app-` prefix; folders named after what they contain.

---

## 6. Core: Catalog, Taxonomy and State

### `catalog.model.ts`: the shape of a product

```ts
type Department      = 'womenswear' | 'menswear' | 'kids';
type ProductCategory = 'clothing' | 'shoes' | 'bags' | 'accessories' | 'jewelry';
type ProductEdit     = 'gifts' | 'party' | 'winter' | 'heritage';
type AgeGroup        = 'baby' | 'kids' | 'teens';

interface CatalogItem {
  id: string;            // 'ww-12', 'ms-3', 'kj-4'
  title: string;
  brand: string;
  price: number;         // original price, whole dollars
  image: string;         // one Unsplash photo
  department: Department;
  category: ProductCategory;
  description: string;
  addedAt: string;       // ISO date: "Newest first", "New In"
  badge?: string;        // "New Season"
  edits: ProductEdit[];  // curated edits, across categories
  ageGroup?: AgeGroup;   // kids only
  salePrice?: number;    // present when on sale
  soldOut?: boolean;     // can't be bought; can still be saved
}
```

Two helpers keep sale logic in one place: `effectivePrice(item)` (what the customer pays) and
`discountPercent(item)` (`31` for `$225` off `$325`).

### `taxonomy.ts`: the vocabulary

Every label the UI shows comes from here, never from a template string:

| Constant | Values | Used by |
| -------- | ------ | ------- |
| `DEPARTMENTS` | Women, Men, Kids (+ possessive "Women's", path) | Header, breadcrumbs, titles, routes |
| `CATEGORIES` | Clothing, Shoes, Bags, Accessories, Jewelry (Farfetch's order) | Header, filters, tiles |
| `EDITS` | Gifts, Party Looks, The Winter Edit, Modern Heritage (+ description) | Listing titles, hub campaigns |
| `AGE_GROUPS` | Baby (0–36 months), Kids (2–12 years), Teens (13–16 years) (+ description) | Kids header, Age filter, Shop by age, PDP breadcrumb |

Each comes with a lookup (`departmentInfo`, `categoryLabel`, `editInfo`, `ageGroupInfo`) and a **type guard**
(`isDepartment`, `isCategory`, `isEdit`, `isAgeGroup`). The guards are how untrusted URL params become typed
values: `?age=adults` is simply ignored.

### `sizing.ts`: size runs

`sizesFor(item)` returns the run for a department, category and, for kids, age group:

| | Clothing | Shoes |
| - | -------- | ----- |
| Women | 38–46 IT | 36–40 EU |
| Men | 46–54 IT | 40–44 EU |
| Kids · Baby | 3M–24M | 17–21 EU |
| Kids · Kids | 4Y–12Y | 28–34 EU |
| Kids · Teens | 13Y–16Y | 36–40 EU |

Bags, accessories and jewelry return `[]`, and the product page hides the size picker.

### `images.ts` and `designers.ts`

See [§11 Product Photography](#11-product-photography).

### `CatalogStore`: the only product source

```ts
@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly items = toSignal(
    inject(HttpClient).get<CatalogItem[]>(`${environment.apiUrl}/catalog.json`)
      .pipe(catchError(() => of([] as CatalogItem[]))),
    { initialValue: null }
  );

  readonly loading = computed(() => this.items() === null);
  readonly all     = computed(() => this.items() ?? []);
  readonly newest  = computed(() => [...this.all()].sort(byNewest));

  byDepartment(department: Department): CatalogItem[] { … }
  find(id: string): CatalogItem | undefined { … }
}
```

- **One request, ever.** The HTTP Observable is turned into a signal at construction.
- **`null` means loading**, `[]` means loaded-but-empty (or failed), so pages can tell skeletons from
  "no results".
- Swapping the JSON for a real API is a change to this one class.

### `WishlistService`

An ordered list of product ids with `has()`, `toggle()`, `remove()`, `restore(id, index)` (Undo), `count` and
`items` (most recent first). **It follows the session**: a `linkedSignal` whose source is the signed-in email
re-reads the right list whenever the account changes:

| Session | Storage key |
| ------- | ----------- |
| Guest | `vestra.wishlist.v1` |
| Signed in | `vestra.wishlist.v1:<email>` |

At the moment of signing in, the guest's pieces are merged into the account's (`mergeWishlists`: the account's
first, then the guest's new ones) and the guest list is cleared, the way Farfetch keeps what you saved before
logging in. Storage is read defensively (non-arrays, non-strings and duplicates dropped; invalid JSON yields an
empty list) and guarded for SSR and private browsing.

### `BagService`: the shopping bag

Lines of `{ id, size, quantity }` (size is `null` after a quick "Add to bag" from a card, and asked for before
checkout). Like the wishlist it **follows the session** through a `linkedSignal`: `vestra.bag.v1` for guests,
`vestra.bag.v1:<email>` per account, and the guest's bag joins the account's at sign-in (`mergeBags`).

| Method | Behaviour |
| ------ | --------- |
| `add(id, size?, quantity?)` | Same piece in the same size raises the quantity (max 10) |
| `setSize(index, size)` | Changing to a size already in the bag merges the two lines |
| `setQuantity(index, n)` | Clamped to 1–10 |
| `remove(index)` / `restore(line, index)` | Remove, and the page's *Undo* |
| `clear()` | Empties it |
| `count` | Pieces counting quantities: the header badge |

The arithmetic lives in **`bag.model.ts`**, pure and tested: `addLine`, `changeSize`, `changeQuantity`, `mergeBags`
and `summarizeBag(lines, find, sizesFor, delivery)`, which returns the available and unavailable (sold-out)
entries, the item count, subtotal at the prices actually paid, delivery (Standard $20, free from $200 like the
promo bar; Express $35), total and how many lines still need a size.

### `RecentlyViewedService`

The last 12 product pages opened, newest first, under `vestra.recent.v1`. The product page records each visit
in an `effect`, wrapping the write in `untracked()` so reading the list doesn't re-run the effect.

### `AuthService`: the session

The customer's account, as signals: `account()` (or `null`) and `signedIn()`. There is **no backend**: accounts
live in this browser's `localStorage` and every call waits ~700 ms, like a request would. Every method returns
an `AuthResult` (`{ ok: true, account }` or `{ ok: false, error }`), so the dialog never needs to know how the
answer was produced and a real API can replace the class without touching the UI.

| Method | Behaviour |
| ------ | --------- |
| `signIn(email, password)` | Case-insensitive email; distinct messages for an unknown email, a wrong password and a passwordless account |
| `register(name, email, password)` | Re-validates on the "server" side; refuses duplicates |
| `requestCode(email)` / `verifyCode(code)` | A random 6-digit code valid for 10 minutes and usable once; creates a passwordless account for new emails |
| `continueWith('google' \| 'apple' \| 'facebook')` | Stands in for the OAuth redirect: returns the provider's profile after a pause |
| `requestPasswordReset(email)` | Always succeeds, so the form never reveals which emails have accounts |
| `signOut()` | Ends the session |

- **Demo account:** `demo@vestra.com` / `Vestra2026`, always available (the dialog offers to fill it in).
- **Storage:** `vestra.session.v1` (the signed-in account) and `vestra.accounts.v1` (name + SHA-256 hash per
  email, never the password). Both are validated on read and guarded for SSR and blocked storage.
- **Demo-grade on purpose:** real password hashing belongs on a server, with a slow algorithm (Argon2, bcrypt)
  and a random salt; codes would be emailed, not returned.

### `AuthDialogService`

`view()` is the open screen (`'sign-in' | 'register' | 'code' | 'forgot' | 'welcome'`) or `null` when closed;
`open(view)` and `close()` change it from anywhere. It also holds the `email` typed so far, so moving from
*Sign in* to *Forgot your password?* or *one-time code* keeps it.

### `auth.validation.ts`

`emailError`, `passwordChecks` (8+ characters, a letter, a number), `isValidPassword`, `passwordStrength`
(0–4: Weak, Fair, Good, Strong), `nameFromEmail` (`alex.morgan@…` → "Alex") and `firstName`. Shared by the forms
and the service, so the UI and the "server" never disagree.

### `LocaleService`: language and region

Farfetch's *Language | Region* choice. The two work differently:

- **Region** (12, from Brazil to the United States) carries a currency, a number locale and an indicative rate
  per US dollar. `format(usd)` converts a catalog price and writes it the local way through `Intl.NumberFormat`:
  `$3,250` (US) · `$59,800` (MXN) · `£2,503` · `2.925 €` (Germany) · `2 925 €` (France) · `￥481,000`. Whole units,
  like every luxury price. Formatters are cached per region.
  The region is a signal remembered under `vestra.locale.v1` and applies at once, in any language.
- **Language** (Русский, Español (latinoamericano), Deutsch, 中文（简体）, Français, English (American)) is the
  **build being served**: `toLanguage(inject(LOCALE_ID))`. Each language is compiled separately (§16) and lives under
  its own prefix: English at `/`, the others at `/es-419/…`, `/de/…`. `setLanguage(id)` loads the same page from that
  build (`languagePath(id) + router.url`, so `/womenswear/items?category=bags` → `/es-419/womenswear/items?category=bags`);
  the region, bag and wishlist stay, since they live in `localStorage`.
- `pickerOpen()` / `openPicker()` / `closePicker()` drive the selector from the header, the mobile menu and the
  footer.

The `price` pipe is **impure** and reads `LocaleService`: because the region is a signal, every view showing a
price re-renders the moment it changes, with no event bus and no reload.

### `ThemeService`: light and dark

The store's two looks, as a `data-theme` attribute on `<html>`:

- **Preference** is `light`, `dark` or `system` (the default). `resolveTheme()` (pure, in `theme.model.ts`) turns
  it into the `theme()` shown, reading `prefers-color-scheme` through `matchMedia`; while nothing is saved, a
  change of the system theme shows at once.
- **`toggle()`** saves the opposite of what's showing under `vestra.theme.v1`; an `effect` writes the attribute.
  Only in the browser: on the server the visitor's choice is unknown.
- **No flash:** `src/assets/theme-init.js`, loaded in `<head>` before any CSS paints, reads the same key (or the
  system theme) and sets `data-theme` first. It's a file, not an inline script, because the CSP allows only
  `'self'` scripts.
- **No per-component dark styles:** `styles.css` redefines the color tokens under `:root[data-theme="dark"]`
  (§12.1), so every `text-ink`, `bg-canvas` and `border-line` switches by itself.

### `GlobalErrorHandler`

Registered as Angular's `ErrorHandler`; the single place to plug in error reporting.

---

## 7. Shared: The UI Kit

Every component is standalone, `OnPush`, and takes signal `input()`s. Rule: **one component per need**.

| Need | Component | Inputs (main) | Notes |
| ---- | --------- | ------------- | ----- |
| A product in a grid | `<app-product-card>` | `item`, `eager` | 3:4 image, heart, badge, brand in label caps, title, price, quick add. 600px images; `eager` for above-the-fold cards |
| A heart | `<app-wishlist-button>` | `productId`, `label` | Reads/writes `WishlistService`; `aria-pressed` |
| Any price | `<app-price-tag>` | `item`, `size` | Sale price in red, original struck through, `-31%` |
| A section title | `<app-section-header>` | `title`, `eyebrow`, `description`, `actionLabel`, `actionLink` | Opens every section |
| A breadcrumb | `<app-breadcrumb>` | `items: Crumb[]` | Last crumb is the current page (`aria-current`) |
| A department hero | `<app-page-hero>` | `image`, `alt`, `eyebrow`, `title`, `text`, `primary`, `secondary`, `stats` | Full-bleed photo, scrim, up to two actions and stats |
| A rail of products | `<app-product-carousel>` | `title`, `items`, `eyebrow`, `actionLabel`, `actionLink` | Scroll-snap; arrow buttons appear only when there's more to see |
| "Trending now" | `<app-edit-tiles>` | `tiles`, `title` | Four doorway tiles into edits or designers |
| An editorial story | `<app-editorial-story>` | `eyebrow`, `title`, `text`, `image`, `alt`, `link` | Projects a carousel of the story's pieces (`<ng-content>`) |
| "Trending brands" | `<app-brand-tiles>` | `brands`, `title`, `actionLink` | House name over the photo with a scrim |
| A designer tile | `<app-designer-card>` | `name`, `eyebrow`, `image`, `from`, `link` | "From $X" entry price |
| A row of house names | `<app-brand-strip>` | `brands` | Quiet divider between sections |
| Closing link lists | `<app-link-directory>` | `columns`, `label` | Gifts / Party Season / Holiday Styles |
| A form field | `<app-text-field>` | `label`, `[(value)]`, `type`, `autocomplete`, `error`, `revealable`, `autofocus` | Floating label that rises into label caps; Show/Hide for passwords; error in red with `aria-invalid` / `aria-describedby`. Two-way binding through `model()` |

Plus:

- **`price` pipe** → `formatPrice()`: `$2,950`, always whole dollars.
- **`shared/ui/index.ts`**: a barrel for the kit.

---

## 8. Layout: The Storefront Shell

`PublicLayoutComponent` wraps every page:

```html
<app-site-header />
<main id="main"><router-outlet /></main>
<app-service-links />      <!-- How to shop · FAQs · Need help? -->
<app-newsletter-band />    <!-- "Never miss a thing": Email / SMS -->
<app-site-footer />        <!-- Farfetch's footer: link columns, social, payments, legal -->
@defer (when authDialog.view(); prefetch on idle) {
  <app-auth-dialog />      <!-- sign in / register, in its own chunk -->
}
```

### `SiteHeader`

- **Promo bar** ("Free shipping on orders over $200"), then a sticky header: departments on the left, the
  VESTRA wordmark centered, search, wishlist, bag and account on the right.
- **The active department** is derived from the URL (`/kids/items` → Kids). On a product page it is the
  product's department (`/product/kj-4` → Kids), looked up in `CatalogStore`.
- **The category bar** (`navLinks`, a `computed`) lists the active department's ways in: categories for Women
  and Men, **age groups** for Kids. The active link is bold through `routerLinkActive` with
  `queryParams: 'subset'`, so `Baby (0–36 months)` stays active on `?age=baby&category=shoes`.
- **Search** submits to `/search?q=…` and keeps the term in the box while you're on its results.
- **Theme:** a moon (light) or sun (dark) button next to the globe toggles `ThemeService`; the mobile menu and the
  footer have the same switch. Both icons are rendered and `dark:hidden` / `dark:block` pick one, so the
  server-rendered header is right before hydration.
- **Mobile:** a menu button opens the departments and the same category links; the badges show wishlist and
  bag counts (`aria-live` on the bag).

- **Account:** signed out, the person icon opens the sign-in dialog; signed in, it becomes the customer's initial
  and opens a menu (name, email, wishlist and bag counts, *Sign out*) that closes on an outside click or Esc.
  The mobile menu has the same entry.

### `SiteFooter`

Farfetch's footer, in its order:

| Block | Content |
| ----- | ------- |
| Customer Service | Help & Contact Us, FAQs, Orders & Delivery, Import Limits, Returns & Refunds, Payments & Pricing, Crypto Payments, Promotion Terms & Conditions, VESTRA Customer Promise |
| About VESTRA | About Us, Press, VESTRA Partners, Careers, Modern Slavery Statement, VESTRA Advertising, Sitemap |
| Discounts & Membership | Affiliate Program, Refer a Friend, Loyalty Program, Student Beans & Graduates, Student & Youth Discount |
| Content & Services · Follow us | Fashion Feed; Instagram, Facebook, X, TikTok, YouTube (monochrome glyphs, labelled "VESTRA on …") |
| Payment methods | Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, Crypto: outlined tiles with each brand's monochrome mark (from [Simple Icons](https://simpleicons.org/), CC0, in `payment-methods.ts`) and its name |
| Legal line | Privacy Policy, Terms & Conditions, Accessibility, Intellectual Property Protection; the city (`<address>`), the trademark notice and `© Copyright <current year> VESTRA` |

Each column is a `<nav>` labelled with its title. The links are placeholders (`href="#"`) until those pages exist.

- **Language & region:** a globe with `MX · ES` (region code · language) next to the search box; the mobile
  menu and the footer show the full choice ("Mexico · MXN · Español (latinoamericano)") and open the same drawer.

### `NewsletterBand`

A channel choice (Email / SMS) and an input validated for the chosen channel, all with signals
(`channel`, `contact`, `subscribed`, `valid`).

### 8.1 Sign in & register

Farfetch's sign-in pop-up, rebuilt on the design system.

```text
┌──────────────────────────┬─────────────────────────────────┐
│ VESTRA                   │                               ✕ │
│                          │ Welcome to VESTRA               │
│     (editorial photo,    │  SIGN IN  │  REGISTER           │
│      slow Ken Burns)     │ ───────────                     │
│                          │ Email address                   │
│ MEMBERS                  │ Password                  SHOW  │
│ Your world of luxury,    │ Forgot your password?           │
│ in one place             │ [        SIGN IN        ]       │
│ ✓ Your wishlist, saved…  │ [ CONTINUE WITH A ONE-TIME CODE ]│
│ ✓ Early access to Sale…  │ ──────────── OR ────────────    │
│ ✓ Faster checkout…       │ [ G  CONTINUE WITH GOOGLE   ]   │
│                          │ [   CONTINUE WITH APPLE     ]   │
│                          │ [ f  CONTINUE WITH FACEBOOK ]   │
│                          │ First time on VESTRA? Register  │
└──────────────────────────┴─────────────────────────────────┘
```

| Screen | What it does |
| ------ | ------------ |
| **Sign in** | Email + password (Show/Hide), *Forgot your password?*, *Continue with a one-time code*, the social providers and *Register*. A demo-account hint fills the form in one click. |
| **Register** | Name, email, password with a 4-step strength meter and a live checklist, newsletter opt-in, legal line. |
| **One-time code** | Email → *Send code* → six boxes that advance as you type, go back on Backspace, move with the arrows, accept a pasted code, verify themselves when full and shake on a wrong code. *Resend* unlocks after a 30 s countdown. In demo mode the code is shown (and fills the boxes on click). |
| **Forgot password** | Email → *Check your inbox*, worded so it never confirms whether an account exists. |
| **Welcome** | A check mark drawn stroke by stroke, "Welcome, Cristian", the email and *Continue shopping*; it closes itself after ~2.6 s. |

How it is built:

- **Native `<dialog>` + `showModal()`:** top layer, `::backdrop`, focus trapped inside, Esc closes, the page
  behind becomes inert, and `autofocus` lands on the first field. A click on the backdrop closes it too.
  `html:has(dialog[open])` stops the page from scrolling.
- **State drives the element:** `AuthDialogService.view()` is the truth; an `afterRenderEffect` calls
  `showModal()` / `close()` to follow it (browser-only, so SSR never touches the DOM API). The native `close`
  event writes back, so Esc and the ✕ button stay in sync.
- **Lazy:** the dialog and its forms are a separate chunk (~8 kB gzipped), prefetched when the browser is idle
  and created the first time someone opens it (`@defer (when …; prefetch on idle)`).
- **Responsive:** a full-screen sheet on phones, a centered card from `sm`, and the photo panel from `lg`. The
  panel's eyebrow, title and three benefits change with the screen (members, joining, passwordless, help).
- **One component per screen** (`SignInForm`, `RegisterForm`, `CodeForm`, `ForgotForm`, `SocialSignIn`), each
  with its own signals: values, `submitted`, `pending`, `failure`. Field errors appear after the first submit and
  then follow the typing; server errors show in a red-ruled `role="alert"` line.
- **Monochrome providers:** Google, Apple and Facebook glyphs are single-color SVGs on outlined buttons, so they
  sit inside the design system.
- **Motion** (all behind `motion-safe:`): `animate-dialog-in`, `animate-fade-in` between screens,
  `animate-shake` on errors, `animate-draw` for the welcome check, `animate-ken-burns` on the photo.

### 8.2 Language & region

```text
                               ┌──────────────────────────────────┐
                               │ LANGUAGE & REGION              ✕ │
                               │   LANGUAGE   │   REGION          │
   (the store, dimmed;         │ ────────────                     │
    prices change behind       │ Русский                          │
    the drawer as you pick)    │ Russian                          │
                               │ Español (latinoamericano)      ✓ │
                               │ Spanish (Latin American)         │
                               │ Deutsch · 中文（简体） · Français · │
                               │ English (American)               │
                               │──────────────────────────────────│
                               │ Mexico · MXN · Español     DONE  │
                               └──────────────────────────────────┘
```

- **A drawer from the right** on the native `<dialog>` (`animate-drawer-in`), full screen on phones. Same pattern as
  the sign-in dialog: `LocaleService.pickerOpen()` is the truth and an `afterRenderEffect` calls `showModal()` /
  `close()`; Esc, the ✕, *Done* and a backdrop click all close it. Deferred into its own chunk (~2.5 kB gzipped).
- **Language tab:** each language in its own script with its name in the current language underneath (`lang` set
  per row, so screen readers pronounce it right); a check marks the current one. Choosing one reloads the page in
  that language; the note under the list says so.
- **Region tab:** a search box (country or currency: "eur" lists France, Germany, Italy, Spain), then each region
  with its currency code and symbol and a **sample price** in that currency, so you see what you'll get before
  choosing.
- **Region applies at once;** the footer of the drawer always shows the current combination. Regions are sorted
  with `Intl.Collator` in the reader's language ("Alemania, Brasil, Canadá…" in Spanish).
- Both lists are `role="radiogroup"` with `role="radio"` / `aria-checked` rows.

---

## 9. Pages: Every Feature in Depth

### 9.1 Home: `/`

The department chooser (three 3:4 photos), an editorial block, a brand strip, *This season's designers*
(each pictured with `featureDesigner()`) and *New In* across the store, with skeletons while the catalog loads.

### 9.2 Department hub: `/womenswear`, `/menswear`, `/kids`

**One component for all three**, receiving `department` from route data. In Farfetch's order:

| Section | Source |
| ------- | ------ |
| Campaign hero + stats (designers, "prices from", pieces) | `DEPARTMENT_CONTENT[dept].campaign` + catalog |
| *New in daily from the best brands* (carousel of 12) | Catalog, newest first |
| *Trending now* (4 tiles) | `content.trends`: each tile is a set of listing filters, pictured with the first matching piece via `queryCatalog`, never repeating a photo |
| Editorial story + its pieces | `content.editorial`, items in its edit |
| **Shop by age** (Kids only) | `AGE_GROUPS`; tile = newest piece of the group not already used in *Trending now*, with piece count |
| *Shop by category* | One tile per category the department actually stocks; responsive column count from the number of tiles |
| *Trending brands* | `content.brands` + `featureDesigner()` |
| *More to explore* | Generated link columns (gifts, party, holiday styles), each a filtered listing |

### 9.3 Listing: `/<department>/items` and `/search`

The heart of the store. Everything is read from the URL and derived with signals:

```text
URL params ──► age, category, designer, edit, sale, search, sort   (typed via guards)
                      │
pool    = queryCatalog(all, { department, age, edit, sale, search })   → what the filters may offer
results = queryCatalog(pool, { category, designer, sort })              → what the grid shows
limit   = linkedSignal(results → PAGE_SIZE)                              → "Load more" resets on new results
visible = results.slice(0, limit)
```

- **Filters:** Age (only when the department's items carry an age group), Category, Designer, Sale only,
  Clear all, Sort by. Options come from the *pool*, so a filter never offers a choice that leads to an empty page.
- **Title precedence:** edit / sale → age group ("Baby Clothing", "Teens (13–16 years)") → category
  ("Women's Bags") → "New In". The description follows the same logic.
- **Breadcrumb:** `Home / Kids / Teens / Shoes`; the middle crumb links back when a category narrows it.
- **States:** skeleton grid while loading, the grid, a progress line with "Load more", or "No items match your
  selection" with a Clear all button.
- **Accessibility:** the result count is `aria-live`.

### 9.4 Brands: `/<department>/brands`

The houses with the most pieces as tiles, then every designer in the department grouped by initial (A–Z), each
with its piece count and a link to its filtered listing.

### 9.5 Product: `/product/:id`

- `id` arrives as an input, so following a recommendation re-derives the whole page.
- **Gallery** from `galleryFor()`: full view + two focal-point crops, thumbnails with `aria-pressed`.
- **Sizes** from `sizesFor()`; "Add to bag" asks for a size first when the product has a run.
- **Per-product UI state** (`selectedSize`, `added`, `activeImage`, `needsSize`) uses `linkedSignal` with the
  id as source, so it resets automatically when you move to another product.
- **Breadcrumb:** `Home / Women / Clothing / …`; for kids, `Home / Kids / Baby / Clothing / …`.
- **Details / Size & fit / Shipping & returns** as native `<details>` accordions.
- **You may also like:** same department, same category first, newest first.

### 9.6 Wishlist: `/wishlist`

Farfetch's wishlist page.

| Part | Behaviour |
| ---- | --------- |
| Header | Breadcrumb, *your name* + **Bronze** tier badge (signed in), "Wishlist", the live item count, and filter tabs with counts (*All · Available · On sale · Sold out*; empty ones are disabled) |
| Signed out | A band: "Keep your wishlist on every device" with *Sign in* / *Register* (opens the dialog) |
| Cards (`WishlistCard`) | Photo with a ✕ remove button, brand, name, price or *Sold out* (photo dimmed and greyscale). Buyable pieces get a size `<select>` (or "One size") and **Add to bag**, which asks for a size first and confirms with a check |
| Undo | Removing shows a black bar "Removed AMIRI Distressed slim-fit jeans · **Undo**" for 6 s; Undo puts the piece back in its place |
| Empty | A heart, "Your wishlist is empty" and *Shop Women / Men / Kids* |
| You may also like | Newest in-stock pieces from the departments you save from (the store's newest when empty) |

### 9.7 Shopping bag: `/bag`

Farfetch's basket (`/checkout/basket.aspx`), top to bottom:

| Part | Behaviour |
| ---- | --------- |
| Returns line | "Free returns for 30 days · We collect from your home" |
| Header | "Shopping bag", the live item count and *Continue shopping* |
| Lines (`BagLine`) | Photo, brand, name, **Item ID**, price (sale in red) and "Import duties included"; **Size** and **Quantity** selects that change the bag in place; *Move to wishlist*; ✕ remove. A line total appears when the quantity is above one |
| Undo | Removing or moving to the wishlist shows a black bar with **Undo** for 6 s (moving is undone on both sides) |
| Unavailable items (n) | Sold-out pieces in a `<details>`: dimmed, never charged, still movable to the wishlist |
| Summary (`BagSummary`, sticky) | Subtotal, delivery, a Standard / Express choice, "Add $X more for free standard delivery" with a progress line, **Total** with the currency code (`MXN $…`), "Import duties included", **Continue** and the payment marks |
| Continue | Flags lines without a size ("Choose a size to continue"); asks guests to sign in (opens the dialog; the bag comes with them); signed in, places a **simulated order** after a short pause |
| Order placed | A drawn check, the order number (`VS-01234567`), the email, the pieces, totals, the delivery estimate, and "Demo store: no payment was taken". Sold-out lines stay in the bag |
| Below | "Buy now, decide at your pace" (free returns) with three benefits (returns, Access, fast delivery), **From your wishlist** (5 pieces), **You may also like**, **Recently viewed** |
| Empty | A bag icon, "Your shopping bag is empty" and *Shop Women / Men / Kids* |

Every amount goes through the `price` pipe, so the bag follows the region chosen in *Language & region*.

### 9.8 Not found: `**`

The last route; a message and a way back.

---

## 10. The Catalog Data

`src/assets/data/catalog.json` holds **82 products** from **65 designers**:

| | Count |
| - | ----- |
| Womenswear / Menswear / Kids | 33 / 25 / 24 |
| Clothing / Shoes / Bags / Accessories / Jewelry | 32 / 14 / 13 / 12 / 11 |
| On sale | 17 |
| Sold out | 7 (Cartier, Tiffany & Co., Loewe, Rick Owens, IWC, John Lobb, Dodo) |
| Edits: Gifts / Party / Winter / Heritage | 28 / 25 / 18 / 11 |
| Kids by age: Baby / Kids / Teens | 5 / 12 / 7 |

Rules for the data:

- Ids are prefixed by department (`ww-`/`wb-` women, `ms-` men, `kj-` kids).
- `price` is always the original; a markdown adds `salePrice` (lower than `price`).
- `ageGroup` only on kids items; `edits` may be empty.
- **No photo is used twice**, and every photo must show the product it names (see below).

---

## 11. Product Photography

All product photos are Unsplash images served through **imgix**, which resizes and crops on the fly:

| Helper | What it does |
| ------ | ------------ |
| `sizedImage(url, width)` | Requests the width the UI needs: 600px for cards, 1200px for the PDP. Non-imgix URLs pass through unchanged. |
| `galleryFor(url)` | Builds a 3-image PDP gallery from **one** photo: the full view plus two `crop=focalpoint` zooms (`fp-y` 0.32 × 2.2 and 0.7 × 2.6), the detail shots a luxury PDP shows. |
| `featureDesigner(items, name)` | Pictures a house by its most representative piece: clothing first, then bags, shoes, accessories, jewelry; newest within that. Also returns its lowest price. |

**Curation rules** (every photo was checked by eye):

1. The photo shows the product named in the title.
2. No visible logos of *other* brands (no Nike swoosh on a Gucci sneaker).
3. No adult model on a kids item.
4. One photo, one product.

---

## 12. The Design System

The reference is `prototypes/woman_/woman8/DESIGN.md`, **"Monochrome Absolute"**: a monochrome palette, sharp
0px corners, no shadows, light display type and uppercase micro-labels. Everything lives in `src/styles.css`
(Tailwind v4 reads CSS, not `tailwind.config.js`).

### 12.1 Tokens (`@theme`)

| Token | Value | Utilities | Use |
| ----- | ----- | --------- | --- |
| `ink` | `#000000` | `text-ink`, `bg-ink`, `border-ink` | Text, primary buttons |
| `canvas` | `#ffffff` | `bg-canvas`, `text-canvas` | Page background, text on photos |
| `surface` | `#f5f5f5` | `bg-surface` | Image placeholders, skeletons |
| `line` | `#e5e5e5` | `border-line` | Dividers |
| `muted` | `#767676` | `text-muted` | Secondary text, breadcrumbs |
| `error` | `#ba1a1a` | `text-error` | Sale prices, Sale link, errors |
| Font | Inter | `font-sans` | Everything |

**Dark theme.** The same tokens, redefined under `:root[data-theme="dark"]` (set by `ThemeService`), with
`color-scheme: dark` for native controls and scrollbars:

| Token | Dark value |
| ----- | ---------- |
| `ink` | `#ffffff` |
| `canvas` | `#000000` |
| `surface` | `#121212` |
| `line` | `#2b2b2b` |
| `muted` | `#9b9b9b` |
| `error` | `#ff8a80` |

Anything on top of photography (hero copy, tiles, `btn-light`, `btn-outline-light`) uses `white` / `black`, which
don't swap. `@custom-variant dark` ties `dark:` to the same attribute, for the rare exception (the promo bar).

```css
--radius-*: initial;   /* rounded-lg doesn't exist */
--shadow-*: initial;   /* shadow-md doesn't exist */
```

`rounded-full` remains only for functional circles (the heart button, count badges).

### 12.2 Utilities (`@utility`)

| Group | Utility | Use for |
| ----- | ------- | ------- |
| Layout | `page-container` | Every page's frame: 1440px max, 20px / 64px margins |
| | `section-y` | Vertical rhythm between sections (4rem → 6rem) |
| | `product-grid` | Every product grid: 2 → 3 → 4 columns |
| Type | `text-display` | Hero headlines (light, large) |
| | `text-headline` | Page and section titles |
| | `text-title` | Sub-titles (brand on the PDP, tile names) |
| | `label-caps` | Brands, nav, eyebrows, small labels (uppercase, tracked) |
| Controls | `btn` + `btn-primary` / `btn-secondary` | Buttons on white (they invert on hover) |
| | `btn` + `btn-light` / `btn-outline-light` | Buttons on photography |
| | `link-cta` | "View all", "Size guide", "Clear all" |
| | `input-line` | Text inputs (bottom border only) |
| | `select-line` | Filter and sort selects |
| | `quick-add` | Card action revealed on hover; always visible where there's no hover |
| | `no-scrollbar` | Carousels and thumbnail rails |

### 12.3 Motion (`@theme` keyframes)

| Utility | Use for |
| ------- | ------- |
| `animate-fade-in` | Content swaps (dialog screens, account menu) |
| `animate-dialog-in` | A dialog rising into place |
| `animate-drawer-in` | A drawer sliding in from the right |
| `animate-shake` | A rejected code or password |
| `animate-draw` | SVG strokes drawn in (`pathLength="1"`, `stroke-dasharray: 1`) |
| `animate-ken-burns` | A slow zoom on editorial photography |

Always used behind `motion-safe:`, so `prefers-reduced-motion` turns every one of them off.

### 12.4 Patterns

- **Photo tiles:** `aspect-[3/4]` (products, ages, departments) or `aspect-square` (categories), `overflow-hidden`,
  `group-hover:scale-105` over 700ms, `bg-surface` while loading.
- **Text on photos:** always over a scrim (`bg-black/35` or a bottom gradient), never directly on the image.
- **Focus:** `:focus-visible` draws a 1px ink outline with a 3px offset on every interactive element.

---

## 13. URL State: The Listing Query

| Param | Values | Effect |
| ----- | ------ | ------ |
| `age` | `baby` · `kids` · `teens` | Kids age group |
| `category` | `clothing` · `shoes` · `bags` · `accessories` · `jewelry` | Category |
| `designer` | a brand name (`Prada`) | Designer |
| `edit` | `gifts` · `party` · `winter` · `heritage` | Curated edit |
| `sale` | `true` | Only marked-down pieces |
| `sort` | `newest` · `price-asc` · `price-desc` | Order (by price actually paid) |
| `q` | free text | Search over brand, title and category, case- and accent-insensitive |

Examples:

```text
/kids/items?age=baby
/kids/items?age=teens&category=shoes
/womenswear/items?edit=gifts&sort=price-asc
/menswear/items?designer=Saint%20Laurent&sale=true
/search?q=chloe
```

The whole filter/sort logic is **one pure function**, `queryCatalog(items, query)`, plus `designersIn(items)`
for the designer options. Pages only parse params, call it and render, which is why it is the most tested
piece of the app.

---

## 14. State Management with Signals

| Kind of state | Where | Tool |
| ------------- | ----- | ---- |
| Server data (catalog) | `CatalogStore` | `toSignal(http.get(…))` |
| App-wide UI state | `WishlistService`, `BagService` | `linkedSignal` per account + `computed` |
| History | `RecentlyViewedService` | `signal`, persisted |
| Persisted state | `WishlistService` | `localStorage`, validated on read |
| Navigation state | URL query params | Router + `computed` from `queryParamMap` |
| Route inputs | `department`, `id` | `input.required()` via `withComponentInputBinding` |
| Derived views | every page | `computed` |
| Local state that resets with a source | listing `limit`, PDP size/image/added | `linkedSignal({ source, computation })` |
| Language & region | `LocaleService` | `signal` + `computed`, persisted; read by the impure `price` pipe |
| Light / dark theme | `ThemeService` | `signal` + `computed` (with `matchMedia`), persisted; an `effect` writes `data-theme` |
| Session | `AuthService` | `signal` + `computed`, persisted in `localStorage` |
| Which dialog screen is open | `AuthDialogService` | `signal` (null = closed) |
| Form fields | auth forms, `TextField` | `signal` + `model()` two-way binding |
| DOM that must follow state | `AuthDialog` | `afterRenderEffect` → `showModal()` / `close()` |
| Local UI state | header menus, newsletter form, code countdown | `signal` |

There is no `effect()` that writes state and no manual subscription: zoneless change detection is driven
entirely by signals and template events. The one effect, `afterRenderEffect` in the dialog, only *reads* state
to drive a DOM API.

---

## 15. Accessibility

- Landmarks: `<header>`, `<nav aria-label="Departments">`, `<nav aria-label="… categories">`, `<main id="main">`,
  `<footer>`; sections labelled with `aria-labelledby`.
- `aria-current="page"` on the active department and the last breadcrumb.
- `aria-pressed` on hearts, sizes and gallery thumbnails; `aria-expanded` on the mobile menu.
- `aria-live` on the result count and the bag badge.
- Every icon-only button has an `aria-label` ("Wishlist, 3 items"); decorative SVGs are `aria-hidden`.
- Real `<select>`, `<input type="checkbox">` and `<details>` elements: keyboard support for free.
- Visible focus ring on every interactive element; quick add appears on `:focus-visible` too.
- **Sign-in dialog:** native modal semantics (`aria-labelledby` its heading, focus trap, Esc), tabs with
  `role="tablist"` / `aria-selected`, real `<label>`s, `autocomplete` (`email`, `current-password`,
  `new-password`, `name`, `one-time-code`), `inputmode="numeric"` on the code boxes (each labelled "Digit n"),
  errors linked with `aria-describedby`, `role="alert"` for failures and `role="status"` for progress and success.

---

## 16. SSR, Hydration & Security

- **SSR:** `angular.json` declares `server: src/main.server.ts`, `ssr.entry: src/server.ts` and
  `outputMode: "server"`, so `ng build` emits `dist/vestra/{browser,server}`.
  `server.ts` serves the hashed files from `browser/` with `maxAge: 1y` and hands every other request to
  `AngularNodeAppEngine`. `app.routes.server.ts` renders all routes per request (`RenderMode.Server`), since the
  listing depends on query params. `ng serve` uses the same server through the exported `reqHandler`.
- **Catalog on the server:** the relative `GET /assets/data/catalog.json` is resolved against the incoming
  request, so server-rendered pages already contain products; the response is transferred to the browser
  with the page (hydration's HTTP transfer cache), so the client doesn't fetch it again.
- **Allowed hosts (SSRF protection):** `security.allowedHosts` in `angular.json` lists the hostnames the server
  will render for (`localhost`, `127.0.0.1`). Add your production domain there before deploying; unknown hosts
  fall back to client-side rendering.
- **Hydration:** `provideClientHydration(withI18nSupport())` reuses the server DOM instead of re-rendering it,
  translated blocks included (without `withI18nSupport` every component with `i18n` would be skipped and re-rendered).
- **Internationalization (`@angular/localize`):**
  - `angular.json` → `i18n.sourceLocale` is `en-US` with `subPath: ""` (English stays at `/`), and `locales` lists
    `es-419`, `de`, `fr`, `ru` and `zh-Hans`, each with `src/locale/messages.<lang>.xlf`. Production sets
    `localize: true`, so `ng build` compiles six apps: `dist/vestra/browser/{,es-419/,de/,…}` and a server bundle per
    language. `AngularNodeAppEngine` picks the one matching the URL prefix; each gets its `<base href>`,
    `<html lang>` and `$localize.locale`.
  - `i18nMissingTranslation: "error"`: a message without a translation fails the build.
  - **Marking text:** templates use `i18n="@@id"` (and `i18n-placeholder`, `i18n-aria-label`, `i18n-title`… on
    static attributes and component inputs); TypeScript uses ``$localize`:@@id:Text` ``, with named placeholders
    (``${name}:department:``) so translators can reorder words. Every message has a **custom ID** grouped by area
    (`auth.*`, `bag.*`, `listing.*`…), so translations survive copy edits.
  - **Plurals:** ICU expressions (`{count, plural, one {…} few {…} many {…} other {…}}`) in templates, with Russian's
    `few`/`many` forms. Two places use `itemCount()` / `pieceCount()` (`Intl.PluralRules` + one message per category)
    instead: bound attributes (an ICU can't go in an attribute) and counts inside `@for` (an ICU in a repeated
    template breaks i18n hydration).
  - **Interpolated ARIA labels** are built in TypeScript with `$localize` and bound with `[attr.aria-label]`:
    Angular applies interpolated i18n attributes as DOM properties, which leaves no `aria-label` attribute.
  - **Composite titles** ("Women's Bags", "Gifts for her") are whole messages with placeholders, never
    concatenations, so Spanish says *Bolsas para mujer* and Chinese *女士包袋*.
  - **Not translated:** product names and descriptions from `catalog.json`, designer names and sizes, like Farfetch.
  - **Workflow:** `npm run extract-i18n` writes `src/locale/messages.xlf`; copy each new `<trans-unit>` into every
    `messages.<lang>.xlf` and add its `<target>`. `npm start` runs every language (`scripts/dev-i18n.mjs`), since
    `ng serve` can only serve one: `ng serve --configuration=es-419` (or `de`, `fr`, `ru`, `zh-Hans`) for one
    language with hot reload, `npm run start:en` for English.
  - The translations were written for this project and should be reviewed by native speakers before real use.
- **SSR-safe code:** browser-only APIs are guarded (`typeof localStorage`), and DOM measurement in the carousel
  runs in `afterNextRender`.
- **Headers:** `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY` on every response.
- **CSP** (in `index.html`): `default-src 'self'`; scripts only from self; images from https; fonts from Google
  Fonts. That is why the production build sets `inlineCritical: false`: critical-CSS inlining loads the full
  stylesheet with an inline `onload` handler, which this CSP blocks, leaving only the critical rules.
- **Auth (demo):** no plaintext passwords stored (SHA-256 of email + password); the reset form doesn't reveal
  which emails exist; one-time codes expire after 10 minutes and work once. A production version would move all
  of this to a server (see §24).
- **XSS:** no `innerHTML` and no `bypassSecurityTrust*`; all content goes through Angular bindings. URL params are
  validated with type guards before use.

---

## 17. Testing

Tests run with **Vitest** in a Node environment (`npm test`): **54 tests across 14 files**, all green. `src/test-setup.ts` installs `$localize` (the source text) first, since
models and services carry translatable strings.

| Spec | What it proves |
| ---- | -------------- |
| `listing.query.spec.ts` (10) | Department, category, designer and search filters; accent-insensitive search; sort by newest/price using the sale price; edits and sale; **age groups**; no input mutation; `designersIn` sorted and unique |
| `images.spec.ts` (4) | `sizedImage` sets the width on imgix and leaves other hosts alone; `galleryFor` builds full + two focal-point crops, one image for non-imgix |
| `designers.spec.ts` (3) | `featureDesigner` prefers clothing, then newest; returns the lowest price; `null` for unknown houses |
| `sizing.spec.ts` (3) | Kids sizes follow the age group (3M… for baby clothing, 36 EU… for teen shoes); adult runs unchanged; one-size categories return `[]` |
| `auth.service.spec.ts` (6) | Demo sign-in; register → sign out → sign in, and the session surviving a new instance (a reload); no plaintext password in storage; duplicates, unknown emails and weak passwords refused; one-time code (wrong code, single use, passwordless account); social sign-in |
| `auth.validation.spec.ts` (4) | Email messages; password rules and strength from Weak to Strong; names from emails |
| `bag.model.spec.ts` (6) | Same piece and size raises the quantity (capped); changing size merges lines; quantity clamped; guest bag merged into the account; sale prices charged, sold-out set apart, missing sizes counted; free standard delivery from $200, never on express |
| `recently-viewed.service.spec.ts` (1) | Newest first, no duplicates, capped at 12, kept across reloads |
| `wishlist.service.spec.ts` (4) | Most recent first; the guest list merged into the account on sign-in, cleared, and lists kept apart per account; Undo restores the original position; `mergeWishlists` order |
| `locale.model.spec.ts` (5) | US dollars untouched; conversion and local formats (MXN, GBP, EUR in Germany, JPY); every region with its symbol; guards for untrusted values and `toLanguage`; `languagePath` (English at the root) |
| `theme.model.spec.ts` (3) | The system theme until the visitor chooses; an explicit choice wins; only `light` and `dark` are themes |
| `plurals.spec.ts` (1) | `itemCount` / `pieceCount` pick the singular and plural |
| `catalog.model.spec.ts` (2) | `effectivePrice` and `discountPercent` |
| `price.util.spec.ts` (2) | `$2,950` formatting and rounding |

**Why the tests target pure functions:** the logic that matters (what a listing shows, which size run, which
photo pictures a designer) lives in plain functions extracted from components. They are tested without
rendering anything, run in ~100ms, and pages stay thin.

**Techniques worth studying:** `Injector.create` with a fake `AuthService` (a plain `signal` for the account)
tests the real `WishlistService`, including its `linkedSignal`, with no TestBed. `vi.stubGlobal('localStorage', new MemoryStorage())` gives each test a clean
storage; a subclass (`InstantAuthService`, `latencyMs = 0`) removes the simulated network delay without fake timers.

**Visual QA:** layout changes are verified with headless Chrome screenshots at 1440px and 390–600px; flows that
need clicks (the sign-in dialog) are driven through the Chrome DevTools Protocol.

---

## 18. Configuration & Tooling

| File | Notable settings |
| ---- | ---------------- |
| `angular.json` | `@angular/build:application`; `outputPath: dist/vestra`; `browser: src/main.ts`, `server: src/main.server.ts`, `ssr.entry: src/server.ts`, `outputMode: server`; `security.allowedHosts`; production `optimization.styles.inlineCritical: false` (CSP, §16) and `localize: true`; `i18n` (source `en-US` at the root, five locales with their `.xlf`), `i18nMissingTranslation: error`, a build and serve configuration per locale; polyfills: only `@angular/localize/init` (zoneless, no `zone.js` installed); styles `src/styles.css`; dev server defaults to `development` |
| `tsconfig.json` | `ES2022`, `moduleResolution: bundler`, `strict`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`; Angular `strictTemplates` |
| `postcss.config.json` | `@tailwindcss/postcss` |
| `vitest.config.ts` | `environment: 'node'`, `setupFiles: src/test-setup.ts` ($localize), `include: src/**/*.spec.ts`, `vite-tsconfig-paths` |
| `src/environments/*` | `apiUrl: '/assets/data'` (the catalog's base URL) |
| `package.json` | Scripts `start`, `build`, `build:ssr`, `serve:ssr`, `test`, `test:watch` |

---

## 19. Concept Index: Where to Learn What

### Angular

| Concept | Where |
| ------- | ----- |
| `bootstrapApplication`, `ApplicationConfig` | `main.ts`, `app.config.ts` |
| Zoneless change detection | `app.config.ts` |
| `mergeApplicationConfig`, SSR bootstrap | `app.config.server.ts`, `main.server.ts`, `server.ts` |
| Server routes and render modes | `app.routes.server.ts` |
| Lazy `loadComponent`, route factories | `app.routes.ts` (`departmentRoutes`) |
| Route `data` / params as inputs | `withComponentInputBinding` + `department-page`, `product-page` |
| `routerLinkActive` with query params | `site-header.component.ts` |
| Router events → signal | `site-header.component.ts` (`toSignal(router.events…)`) |
| `toSignal` over HTTP | `catalog.store.ts` |
| `signal`, `computed` | everywhere |
| `linkedSignal` | `product-listing-page` (`limit`), `product-page` (size, image, added), `wishlist.service.ts` (list per account, merge on sign-in via `previous`) |
| `input()`, `input.required()` | every shared component |
| `viewChild`, `afterNextRender` | `product-carousel.component.ts` |
| Content projection | `editorial-story.component.ts` |
| `model()` two-way binding | `text-field.component.ts`, used as `[(value)]` |
| `afterRenderEffect` (DOM follows state) | `auth-dialog.component.ts` |
| `effect` + `untracked` (record without re-running) | `product-page.component.ts` |
| `@defer (when …; prefetch on idle)` | `public-layout.component.ts` |
| `@let`, `@switch` | `auth-dialog.component.ts` |
| `viewChildren` (focus management) | `code-form.component.ts` |
| `host` listeners (`document:click`, `keydown.escape`) | `site-header.component.ts` |
| `output()` | auth forms (`done`) |
| Subclassing a service in tests | `auth.service.spec.ts` |
| `@if`, `@for … track`, `@else if`, `@empty` | listing, home |
| Impure pipe reading a signal | `price.pipe.ts` |
| Custom `ErrorHandler` | `global-error-handler.service.ts` |

### TypeScript

| Concept | Where |
| ------- | ----- |
| String literal unions as domain types | `catalog.model.ts` |
| User-defined type guards (`value is AgeGroup`) | `taxonomy.ts`, `listing.query.ts` |
| `Pick<>` for narrow function inputs | `sizesFor`, `effectivePrice`, `PriceTag` |
| `Record<Union, …>` lookup tables | `sizing.ts`, `department-content.ts` |
| `ReadonlyArray`, readonly tuples | `taxonomy.ts`, `DepartmentContent.trends` |

### CSS & the platform

| Concept | Where |
| ------- | ----- |
| Tailwind v4 `@theme` / `@utility` | `styles.css` |
| Removing a theme scale (`--radius-*: initial`) | `styles.css` |
| `@media (hover: hover)` | `quick-add` utility |
| Scroll snap | `product-carousel` |
| `aspect-ratio`, `object-fit` | tiles and cards |
| imgix URL API (resize, focal-point crop) | `images.ts` |
| `<details>` accordions | `product-page` |
| `localStorage` with validation | `wishlist.service.ts`, `auth.service.ts` |
| Native `<dialog>`, `showModal()`, `::backdrop` | `auth-dialog.component.ts` |
| `:has()` (`html:has(dialog[open])`) | `styles.css` |
| Web Crypto (`crypto.subtle.digest`, `getRandomValues`) | `auth.service.ts` |
| `Intl.NumberFormat` (currencies, `formatToParts`) | `locale.model.ts` |
| `DOCUMENT` (setting `<html lang>`) | `locale.service.ts` |
| SVG stroke drawing (`pathLength`) | the welcome check |
| `peer-[…]` floating labels | `text-field.component.ts` |

---

## 20. Project History: How It Grew

Work happens on feature branches merged with `--no-ff` into `develop`, then fast-forwarded to `main`.

| Stage | Branch | What was built |
| ----- | ------ | -------------- |
| **Scaffold** | `codex/…` (PR #1) | Angular 21-style storefront: standalone, zoneless, SSR, Tailwind, Vitest |
| **Laboratories** | `features/home-laboratory`, `features/men-laboratory`, `features/woman-laboratory` | Stitch prototypes (`prototypes/`) and first home, menswear, kidswear and womenswear practice components |
| **Coherence** | `features/design-system` | Monochrome Absolute tokens and utilities; one catalog, one taxonomy, a shared wishlist; the UI kit; Farfetch header and single footer; one department template, one listing, one PDP; `ARCHITECTURE.md` |
| **Population** | `features/improvement1` | Kids accessories and jewelry; 82 products with verified photos; sized images and the generated gallery |
| **Farfetch hub** | `features/improvement2` | Edits and sale prices; page hero, carousels, trending tiles, editorial story, brand tiles, link directory; service links and newsletter band; the A–Z brands page |
| **Kids by age** | `features/improvement3` | `AgeGroup`, Kids nav (Baby / Kids / Teens), `?age=` filter, age-based sizes, PDP breadcrumb, *Shop by age* |
| **Documentation & SSR** | `features/improvement4` | This README; working SSR with `AngularNodeAppEngine`, server routes and allowed hosts; `zone.js` removed |
| **Sign in** | `features/improvement6` | Farfetch's sign-in pop-up: `AuthService`, `AuthDialogService`, `TextField`, the dialog with sign in, register, one-time code, forgot password and social providers; header account menu; motion tokens |
| **Footer & name** | `features/improvement7` | Farfetch's full footer (customer service, about, discounts & membership, content, follow us, payment methods with monochrome marks, legal line); the store becomes **VESTRA** |
| **Language & region** | `features/improvement8` | Farfetch's *Language \| Region* selector as a drawer; `LocaleService`; prices converted and formatted per region through the `price` pipe; globe in the header, mobile menu and footer |
| **Wishlist** | `features/improvement9` | Farfetch's `/wishlist`: cards with size and Add to bag, remove with Undo, filters, recommendations; a wishlist per account merged on sign-in; sold-out pieces; Bronze tier in the account menu |
| **Shopping bag** | `features/improvement10` | Farfetch's basket at `/bag`: `BagService` (lines with size and quantity, per account) and pure `bag.model.ts`; summary with delivery options; simulated checkout and order confirmation; recently viewed |
| **Vestra** | `features/improvement11` | The project, package, build output and repository are renamed **vestra** |
| **Dark theme** | `features/improvement12` | `ThemeService` and `theme-init.js`; dark values for the color tokens; theme switch in the header, mobile menu and footer; photography keeps white/black; critical-CSS inlining off so the full stylesheet loads under the CSP |
| **Languages** | `features/improvement13` | Angular i18n (`@angular/localize`): every message marked with a custom ID, ICU plurals, six builds (English at `/`, Spanish, German, French, Russian, Simplified Chinese under their prefix); the language picker loads the same page in another language; region names sorted per language; i18n hydration |

---

## 21. Design Decisions & Trade-offs

| Decision | Why | Trade-off |
| -------- | --- | --------- |
| **Static JSON catalog** | No backend needed; the store is fully explorable and deterministic | No real inventory; changing products means editing JSON |
| **One template per page type** | Three departments can't drift apart; a fix lands everywhere | Department-specific layouts need data flags (e.g. Shop by age appears only when items carry an age group) |
| **URL as listing state** | Shareable, bookmarkable, back-button friendly | Params must be validated (type guards) |
| **Pure `queryCatalog`** | Fully testable, reused by the hub's tiles | Filtering is client-side, fine for hundreds of items, not for millions |
| **Tiles pictured from the catalog** | A tile's image always matches where it leads | Less art direction than hand-picked campaign images |
| **One photo + imgix crops for galleries** | Rich PDPs with a single curated photo per product | Crops are approximations of real detail shots |
| **Removing Tailwind's radius/shadow scales** | The flat, sharp look can't be broken by accident | Needs `rounded-full` as the one explicit exception |
| **Zoneless + OnPush + signals** | Predictable, minimal change detection; no zone.js patching | Every state change must go through a signal or an event |
| **`localStorage` wishlist** | Works without an account | Per device and browser |
| **Simulated auth behind `AuthResult`** | The whole sign-in experience works with no backend, and the UI is already shaped for one | Not real security: accounts are per browser, hashing is demo-grade |
| **Native `<dialog>` instead of a custom overlay** | Focus trap, Esc, inert page and top layer for free, correct for screen readers | Styling `::backdrop` and entry animations needs care |
| **Region converts prices at once; language is a build** | Currency is a signal, so it changes everywhere instantly; each language is compiled ahead of time with Angular i18n, fully server-rendered under its own URL (good for search engines) with no runtime translation cost | Changing language reloads the page; six builds instead of one; new copy must be added to six `.xlf` files |
| **Simulated checkout** | The whole bag journey can be tried end to end, including sign-in at checkout | No address, payment or order history yet |
| **Fixed, indicative exchange rates** | Deterministic prices and tests, no API key | Rates drift from reality; a real store fetches them |
| **Dialog behind `@defer`** | ~8 kB gzipped stays out of the initial bundle | The first open waits for the chunk if it wasn't prefetched yet |

---

## 22. Getting Started

**Prerequisites:** Node.js 20.19+ / 22.12+ (Angular 21's range) and npm.

```bash
git clone https://github.com/CristianSifuentes/vestra.git
cd vestra
npm install
npm start            # → http://localhost:4200, every language (/es-419/, /de/, /fr/, /ru/, /zh-Hans/)
```

| Script | Command | Purpose |
| ------ | ------- | ------- |
| `npm start` | `node scripts/dev-i18n.mjs` | The store in **every language** on port 4200: builds all locales in watch mode and runs the SSR server, restarted after each rebuild (refresh the browser to see changes) |
| `npm run start:en` | `ng serve` | Faster dev server with hot reload, **English only**: the language picker leads to a 404 there |
| `npm run build` | `ng build` | Production build, one app per language → `dist/vestra/{browser,server}` (English at the root, the rest under `es-419/`, `de/`, `fr/`, `ru/`, `zh-Hans/`) |
| `npm run extract-i18n` | `ng extract-i18n --output-path src/locale` | Writes every marked message to `src/locale/messages.xlf` |
| — | `ng serve --configuration=es-419` | Dev server in one language (`de`, `fr`, `ru`, `zh-Hans` too) |
| `npm test` | `vitest run` | Unit tests, single run |
| `npm run test:watch` | `vitest` | Unit tests in watch mode |
| `npm run build:ssr` | `ng build` | Same build (the SSR bundle is always produced) |
| `npm run serve:ssr` | `node dist/…/server/server.mjs` | Serves the server-rendered app on `PORT` (default 4000) |

**Try this tour:**

1. Open **Kids** and use the category bar: *Baby (0–36 months)*.
2. Narrow with **Category → Shoes**, then switch the age to *Teens*. Watch the title and breadcrumb.
3. Open a baby item: the sizes read `3M · 6M · 12M · 18M · 24M`.
4. Heart a few pieces and see the header badge; reload, they're still there.
5. Visit **Women → Sale** and sort *Price: low to high*.
6. Search for `chloe` (no accent).
7. Open **Men → Brands** and pick a house from the A–Z list.
8. Heart a few pieces as a guest, then click the person icon, *Fill in* the demo account and sign in: open the heart
   in the header; your pieces came with you. Remove one and hit *Undo*.
9. Open it again → *Continue with a one-time code*, and click the code shown to sign in.
10. Try *Register* and watch the strength meter while typing a password.
11. Click the globe (`US · EN`) → *Region* → *Mexico*: every price turns into pesos; try *Germany* for euros.
12. Add a piece from its product page (with a size) and one from a card (without), open the bag, choose the
    missing size, switch to Express, and press *Continue* to place the order.

---

## 23. Scaling the Project

### Adding a product

Add an entry to `catalog.json` (unique id and photo, `edits`, `ageGroup` for kids, optional `salePrice`).
It appears in its department hub, listings, search, brands and recommendations automatically.

### Adding a category, edit or age group

1. Extend the union in `catalog.model.ts`.
2. Add it to `CATEGORIES` / `EDITS` / `AGE_GROUPS` in `taxonomy.ts` (label, and description where required).
3. For categories with sizes, add a run in `sizing.ts`.

Header links, filters, titles and tiles pick it up; tiles only appear where products exist.

### Adding a department

1. Add it to `Department` and `DEPARTMENTS`.
2. Add its size runs in `sizing.ts`.
3. Add its campaign, trends, editorial and brands to `DEPARTMENT_CONTENT`.
4. Add `...departmentRoutes('path', 'id')` in `app.routes.ts` (before `**`).

### Adding a page or a shared piece

| Adding a… | Put it in | Then |
| --------- | --------- | ---- |
| Page | `features/<name>/pages/<name>-page.component.ts` | A `loadComponent` route before `**` |
| Component used by 2+ features | `shared/ui/<name>/` | Export it from `shared/ui/index.ts` |
| Value formatter | `shared/pipes/` (+ a util in `shared/utils/`) | Spec for the util |
| App-wide state | `core/services/` with `providedIn: 'root'` | Signals, not Subjects |
| Pure domain logic | `core/catalog/` or next to its feature | A `*.spec.ts` |
| Visual pattern | A `@utility` in `styles.css` | Document it in §12 and `ARCHITECTURE.md` |

---

## 24. Roadmap & Known Gaps

- [ ] A real auth backend behind `AuthService` (sessions in HttpOnly cookies, server-side hashing, emailed codes, OAuth redirects) and an account page.
- [ ] Sync the wishlist to a server account (it is per account, but only in this browser).
- [ ] Real stock per size, and "notify me" for sold-out pieces.
- [ ] A real checkout: address, payment and order history behind the simulated *Continue*.
- [ ] A mini-bag drawer when adding from a card.
- [ ] Wishlist page listing saved pieces.
- [ ] Component tests for the listing and product pages; E2E (Playwright) for filters and the Kids nav.
- [ ] A real API behind `CatalogStore` with server-side filtering and pagination.
- [ ] Translate the UI into the six languages of the selector (Angular i18n or a signal-based dictionary); the language choice is already stored.
- [ ] Live exchange rates, and charging in the chosen currency.
- [ ] Image `srcset` / `NgOptimizedImage` for responsive photo sizes.

---

## 25. Contributing, License & Credits

**Contributing:**

1. Branch from `develop` (`features/<name>`). Features merge into `develop` with `--no-ff`, then into `main`.
2. Follow the structure: pages in `features/`, cross-feature UI in `shared/ui/`, data and state in `core/`.
3. Use the design system: tokens and utilities from `styles.css`, the shared components from §7.
4. Before merging:
   - `npm run build` must be clean.
   - `npm test` must be green, with a spec for new logic.
   - Check new photos against the curation rules in §11.

**License:** [Apache 2.0](LICENSE).

**Credits:**

- Product photography: [Unsplash](https://unsplash.com/) photographers, served through imgix.
- Font: [Inter](https://rsms.me/inter/) via Google Fonts.
- Payment and social marks: [Simple Icons](https://simpleicons.org/) (CC0); brand names and logos belong to their owners.
- Visual prototypes: generated with Stitch (`prototypes/`).

**Disclaimer:** VESTRA is a fictional store: an educational architecture project inspired by Farfetch's marketplace
domain and UI patterns. FARFETCH and the designer names are trademarks of their respective owners; this project is
not affiliated with or endorsed by them. See the original site at <https://www.farfetch.com/>.

### Further reading

- https://dev.to/kafeel-ahmad/deploying-angular-in-2026-an-architects-guide-to-build-once-run-everywhere-34eh
- https://dev.to/cristiansifuentes/13-angular-concepts-you-must-master-before-your-next-interview-2026-edition-5b74
- https://medium.com/@sanikapatil0213/folder-structures-that-scale-angular-architecture-for-big-teams-decb717e1f94
- https://medium.com/@flaviusson/angular-20-to-21-transition-guide-breaking-changes-best-practices-and-migration-paths-2026-9a66338ac33e
- https://khizaruddins.medium.com/modern-angular-enterprise-architecture-2026-beff3d0b928f

### References

[prototypes/woman_/woman1/code.html](prototypes/woman_/woman1/code.html)
https://www.youtube.com/watch?v=aSdAZHansJU
