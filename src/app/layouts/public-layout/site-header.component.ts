import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Params, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthDialogService, AuthService } from '../../core/auth';
import { AGE_GROUPS, CATEGORIES, DEPARTMENTS, Department, isDepartment } from '../../core/catalog';
import { CartService } from '../../core/services/cart.service';
import { CatalogStore } from '../../core/services/catalog.store';
import { WishlistService } from '../../core/services/wishlist.service';

interface NavLink {
  readonly label: string;
  readonly link: string;
  readonly queryParams?: Params;
  readonly sale?: boolean;
}

// Farfetch's header: departments on the left, the wordmark centered, search
// and the account/wishlist/bag icons on the right; under it, the category
// row of the department you're in (Women by default).
@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <p class="label-caps bg-ink px-4 py-2.5 text-center text-canvas">Free shipping on orders over $200</p>

    <header class="sticky top-0 z-50 border-b border-line bg-canvas">
      <div class="page-container grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-5">
        <div class="flex items-center gap-6">
          <button type="button" class="lg:hidden" aria-label="Menu" [attr.aria-expanded]="menuOpen()" (click)="menuOpen.set(!menuOpen())">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              @if (menuOpen()) {
                <path d="M6 6l12 12M18 6 6 18" />
              } @else {
                <path d="M3 6h18M3 12h18M3 18h18" />
              }
            </svg>
          </button>
          <nav class="hidden items-center gap-6 lg:flex" aria-label="Departments">
            @for (department of departments; track department.id) {
              <a
                class="label-caps border-b pb-1 transition-colors hover:border-ink"
                [class.border-ink]="department.id === activeDepartment()"
                [class.border-transparent]="department.id !== activeDepartment()"
                [attr.aria-current]="department.id === activeDepartment() ? 'page' : null"
                [routerLink]="department.path"
              >{{ department.label }}</a>
            }
          </nav>
        </div>

        <a routerLink="/" class="select-none text-2xl font-light uppercase tracking-[0.08em] md:text-4xl" aria-label="Vestra home">Vestra</a>

        <div class="flex items-center justify-end gap-5">
          <form class="relative hidden md:block" role="search" (submit)="search($event, query.value)">
            <svg class="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input #query class="input-line w-40 py-1.5 pl-6 text-xs lg:w-48" type="search" name="q" placeholder="Search" aria-label="Search products" [value]="searchTerm()" />
          </form>
          <a routerLink="/search" class="md:hidden" aria-label="Search">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          </a>
          <button type="button" class="relative" [attr.aria-label]="'Wishlist, ' + wishlist.count() + ' items'">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            @if (wishlist.count()) {
              <span class="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-semibold text-canvas" aria-hidden="true">{{ wishlist.count() }}</span>
            }
          </button>
          <button type="button" class="relative" [attr.aria-label]="'Shopping bag, ' + cart.total() + ' items'">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
            @if (cart.total()) {
              <span class="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-semibold text-canvas" aria-live="polite">{{ cart.total() }}</span>
            }
          </button>
          <div #accountMenu class="relative hidden md:block">
            @if (auth.account(); as account) {
              <button
                type="button"
                class="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-canvas"
                [attr.aria-label]="'Account, ' + account.name"
                aria-haspopup="menu"
                [attr.aria-expanded]="accountOpen()"
                (click)="accountOpen.set(!accountOpen())"
              >{{ initial() }}</button>
              @if (accountOpen()) {
                <div class="absolute right-0 top-full z-50 mt-4 w-72 border border-line bg-canvas p-6 motion-safe:animate-fade-in" role="menu">
                  <p class="label-caps text-muted">Signed in as</p>
                  <p class="mt-2 text-sm">{{ account.name }}</p>
                  <p class="truncate text-xs text-muted">{{ account.email }}</p>
                  <div class="my-5 h-px bg-line"></div>
                  <p class="text-xs text-muted">{{ wishlist.count() }} {{ wishlist.count() === 1 ? 'piece' : 'pieces' }} in your wishlist · {{ cart.total() }} in your bag</p>
                  <button type="button" role="menuitem" class="btn btn-secondary mt-5 w-full" (click)="signOut()">Sign out</button>
                </div>
              }
            } @else {
              <button type="button" class="block" aria-label="Sign in or register" (click)="authDialog.open('sign-in')">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </button>
            }
          </div>
        </div>
      </div>

      <nav class="hidden border-t border-line lg:block" [attr.aria-label]="activeInfo().label + ' categories'">
        <ul class="page-container flex justify-center gap-8 py-3.5 text-sm">
          @for (item of navLinks(); track item.label) {
            <li>
              <a
                [routerLink]="item.link"
                [queryParams]="item.queryParams"
                routerLinkActive="font-semibold"
                [routerLinkActiveOptions]="{ paths: 'exact', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored' }"
                class="transition-colors hover:text-muted"
                [class.text-error]="item.sale"
              >{{ item.label }}</a>
            </li>
          }
        </ul>
      </nav>

      @if (menuOpen()) {
        <nav class="border-t border-line bg-canvas lg:hidden" aria-label="Menu" (click)="menuOpen.set(false)">
          <div class="page-container grid gap-8 py-8">
            <ul class="flex gap-6">
              @for (department of departments; track department.id) {
                <li><a class="label-caps" [class.underline]="department.id === activeDepartment()" [routerLink]="department.path">{{ department.label }}</a></li>
              }
            </ul>
            <ul class="grid gap-4 text-base">
              @for (item of navLinks(); track item.label) {
                <li><a [routerLink]="item.link" [queryParams]="item.queryParams" [class.text-error]="item.sale">{{ item.label }}</a></li>
              }
            </ul>
            <div class="border-t border-line pt-6">
              @if (auth.account(); as account) {
                <p class="text-sm">{{ account.name }} <span class="text-muted">· {{ account.email }}</span></p>
                <button type="button" class="link-cta mt-4" (click)="signOut()">Sign out</button>
              } @else {
                <button type="button" class="btn btn-primary w-full" (click)="authDialog.open('sign-in')">Sign in or register</button>
              }
            </div>
          </div>
        </nav>
      }
    </header>
  `,
  host: {
    '(document:click)': 'closeAccountMenu($event)',
    '(document:keydown.escape)': 'accountOpen.set(false)'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteHeaderComponent {
  private readonly router = inject(Router);
  private readonly catalog = inject(CatalogStore);
  protected readonly cart = inject(CartService);
  protected readonly wishlist = inject(WishlistService);
  protected readonly auth = inject(AuthService);
  protected readonly authDialog = inject(AuthDialogService);

  protected readonly departments = DEPARTMENTS;
  protected readonly categories = CATEGORIES;
  protected readonly menuOpen = signal(false);
  protected readonly accountOpen = signal(false);
  private readonly accountMenu = viewChild<ElementRef<HTMLElement>>('accountMenu');

  protected readonly initial = computed(() => this.auth.account()?.name.trim().charAt(0).toUpperCase() ?? '');

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  // The department you're browsing: from the URL, or from the product
  // you're looking at. Null on pages that belong to no department.
  protected readonly activeDepartment = computed<Department | null>(() => {
    const [first, second] = this.url().split(/[?#]/)[0].split('/').filter(Boolean);
    if (isDepartment(first)) {
      return first;
    }
    if (first === 'product' && second) {
      return this.catalog.find(second)?.department ?? null;
    }
    return null;
  });

  // Whose categories the second row lists — Women when there's no context.
  protected readonly activeInfo = computed(
    () => DEPARTMENTS.find((department) => department.id === this.activeDepartment()) ?? DEPARTMENTS[0]
  );

  // Keeps the term in the box while you're on its results.
  protected readonly searchTerm = computed(() => {
    const url = this.url();
    return url.startsWith('/search') ? new URLSearchParams(url.split('?')[1] ?? '').get('q') ?? '' : '';
  });

  // Farfetch's category bar for the active department.
  protected readonly navLinks = computed<NavLink[]>(() => {
    const path = this.activeInfo().path;
    const items = `${path}/items`;
    return [
      { label: this.activeInfo().id === 'kids' ? 'Gifts' : 'Gifts & Party', link: items, queryParams: { edit: 'gifts' } },
      { label: 'New In', link: items, queryParams: { sort: 'newest' } },
      { label: 'Brands', link: `${path}/brands` },
      // Kidswear is browsed by age (Farfetch: Baby, Kids, Teens); the other
      // departments by category.
      ...(this.activeInfo().id === 'kids'
        ? AGE_GROUPS.map((group) => ({ label: `${group.label} (${group.range})`, link: items, queryParams: { age: group.id } }))
        : this.categories.map((category) => ({ label: category.label, link: items, queryParams: { category: category.id } }))),
      { label: 'Sale', link: items, queryParams: { sale: 'true' }, sale: true }
    ];
  });

  protected signOut(): void {
    this.accountOpen.set(false);
    this.auth.signOut();
  }

  // Clicks outside the account menu close it.
  protected closeAccountMenu(event: Event): void {
    if (this.accountOpen() && !this.accountMenu()?.nativeElement.contains(event.target as Node)) {
      this.accountOpen.set(false);
    }
  }

  protected search(event: Event, query: string): void {
    event.preventDefault();
    this.router.navigate(['/search'], { queryParams: { q: query.trim() || null } });
  }
}
