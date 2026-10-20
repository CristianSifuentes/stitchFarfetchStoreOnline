import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ACCESS_TIER, AuthDialogService, AuthService } from '../../../core/auth';
import { CatalogItem, DEPARTMENTS } from '../../../core/catalog';
import { CatalogStore } from '../../../core/services/catalog.store';
import { WishlistService } from '../../../core/services/wishlist.service';
import { BreadcrumbComponent } from '../../../shared/ui/breadcrumb/breadcrumb.component';
import { ProductCarouselComponent } from '../../../shared/ui/product-carousel/product-carousel.component';
import { WishlistCardComponent } from '../components/wishlist-card.component';

type WishlistFilter = 'all' | 'available' | 'sale' | 'sold-out';

const FILTERS: ReadonlyArray<{ readonly id: WishlistFilter; readonly label: string; readonly test: (item: CatalogItem) => boolean }> = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'available', label: 'Available', test: (item) => !item.soldOut },
  { id: 'sale', label: 'On sale', test: (item) => !item.soldOut && item.salePrice !== undefined },
  { id: 'sold-out', label: 'Sold out', test: (item) => !!item.soldOut }
];

const UNDO_MS = 6000;
const RECOMMENDED_COUNT = 12;

// Farfetch's /wishlist: everything you saved, most recent first, each piece
// buyable from its card. Signed in, it's your account's list (with your
// VESTRA Access tier); signed out, a prompt to sign in and keep it.
@Component({
  selector: 'app-wishlist-page',
  imports: [RouterLink, BreadcrumbComponent, WishlistCardComponent, ProductCarouselComponent],
  template: `
    <div class="page-container">
      <app-breadcrumb [items]="[{ label: 'Home', link: '/' }, { label: 'Wishlist' }]" />

      <header class="flex flex-wrap items-end justify-between gap-6 pb-10">
        <div>
          @if (auth.account(); as account) {
            <p class="label-caps flex items-center gap-3 text-muted">
              {{ account.name }}
              <span class="border border-ink px-2 py-0.5 text-[9px] text-ink">{{ tier }}</span>
            </p>
          }
          <h1 class="text-headline mt-3">Wishlist</h1>
          <p class="mt-2 text-sm text-muted" aria-live="polite">{{ saved().length }} {{ saved().length === 1 ? 'item' : 'items' }}</p>
        </div>

        @if (saved().length) {
          <div class="flex flex-wrap gap-x-6 gap-y-2" role="group" aria-label="Show">
            @for (option of filters(); track option.id) {
              <button
                type="button"
                class="label-caps border-b pb-1 transition-colors"
                [class.border-ink]="filter() === option.id"
                [class.border-transparent]="filter() !== option.id"
                [class.text-muted]="filter() !== option.id"
                [attr.aria-pressed]="filter() === option.id"
                [disabled]="!option.count"
                [class.opacity-40]="!option.count"
                (click)="filter.set(option.id)"
              >{{ option.label }} ({{ option.count }})</button>
            }
          </div>
        }
      </header>

      @if (!auth.signedIn()) {
        <section class="mb-10 flex flex-col gap-5 border border-line p-6 sm:flex-row sm:items-center sm:justify-between md:p-8" aria-label="Sign in">
          <div>
            <p class="text-title">Keep your wishlist on every device</p>
            <p class="mt-2 text-sm text-muted">Sign in or create an account and the pieces you save here come with you.</p>
          </div>
          <div class="flex shrink-0 flex-wrap gap-3">
            <button type="button" class="btn btn-primary" (click)="authDialog.open('sign-in')">Sign in</button>
            <button type="button" class="btn btn-secondary" (click)="authDialog.open('register')">Register</button>
          </div>
        </section>
      }

      @if (removed(); as last) {
        <div class="mb-8 flex items-center justify-between gap-4 bg-ink px-5 py-4 text-sm text-canvas motion-safe:animate-fade-in" role="status">
          <span>Removed <span class="font-medium">{{ last.item.brand }}</span> {{ last.item.title }}</span>
          <button type="button" class="label-caps underline underline-offset-4" (click)="undo()">Undo</button>
        </div>
      }

      @if (catalog.loading()) {
        <div class="product-grid" aria-hidden="true">
          @for (n of skeletons; track n) {
            <div><div class="aspect-[3/4] animate-pulse bg-surface"></div><div class="mt-4 h-3 w-1/2 bg-surface"></div><div class="mt-2 h-3 w-3/4 bg-surface"></div></div>
          }
        </div>
      } @else if (visible().length) {
        <div class="product-grid">
          @for (item of visible(); track item.id) {
            <app-wishlist-card [item]="item" (remove)="remove(item)" />
          }
        </div>
      } @else if (saved().length) {
        <p class="py-16 text-center text-sm text-muted">Nothing here right now. <button type="button" class="text-ink underline underline-offset-4" (click)="filter.set('all')">Show all</button></p>
      } @else {
        <section class="flex flex-col items-center py-20 text-center" aria-labelledby="empty-heading">
          <svg class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h2 id="empty-heading" class="text-headline mt-8">Your wishlist is empty</h2>
          <p class="mt-3 max-w-sm text-sm leading-relaxed text-muted">Tap the heart on any piece to save it here, and come back to it whenever you like.</p>
          <div class="mt-10 flex flex-wrap justify-center gap-3">
            @for (department of departments; track department.id) {
              <a class="btn btn-secondary" [routerLink]="department.path">Shop {{ department.label }}</a>
            }
          </div>
        </section>
      }

      @if (recommended().length) {
        <div class="section-y">
          <app-product-carousel
            [eyebrow]="saved().length ? 'Based on your wishlist' : 'Just landed'"
            title="You may also like"
            [items]="recommended()"
            actionLink="/search"
            [actionQuery]="{ sort: 'newest' }"
          />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistPageComponent {
  protected readonly catalog = inject(CatalogStore);
  protected readonly auth = inject(AuthService);
  protected readonly authDialog = inject(AuthDialogService);
  private readonly wishlist = inject(WishlistService);

  protected readonly tier = ACCESS_TIER;
  protected readonly departments = DEPARTMENTS;
  protected readonly skeletons = Array.from({ length: 4 }, (_, i) => i);
  protected readonly filter = signal<WishlistFilter>('all');
  protected readonly removed = signal<{ readonly item: CatalogItem; readonly index: number } | null>(null);

  // Saved pieces that still exist in the catalog, most recent first.
  protected readonly saved = computed(() =>
    this.wishlist.items().flatMap((id) => {
      const item = this.catalog.find(id);
      return item ? [item] : [];
    })
  );

  protected readonly filters = computed(() =>
    FILTERS.map((option) => ({ ...option, count: this.saved().filter(option.test).length }))
  );

  protected readonly visible = computed(() => {
    const active = FILTERS.find((option) => option.id === this.filter()) ?? FILTERS[0];
    return this.saved().filter(active.test);
  });

  // Newest pieces from the departments you save from, not already saved
  // and in stock; the newest of the store when the wishlist is empty.
  protected readonly recommended = computed(() => {
    const saved = this.saved();
    const ids = new Set(saved.map((item) => item.id));
    const departments = new Set(saved.map((item) => item.department));
    return this.catalog
      .newest()
      .filter((item) => !ids.has(item.id) && !item.soldOut && (!departments.size || departments.has(item.department)))
      .slice(0, RECOMMENDED_COUNT);
  });

  private undoTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.undoTimer));
  }

  protected remove(item: CatalogItem): void {
    const index = this.wishlist.indexOf(item.id);
    this.wishlist.remove(item.id);
    this.removed.set({ item, index });
    clearTimeout(this.undoTimer);
    this.undoTimer = setTimeout(() => this.removed.set(null), UNDO_MS);
    if (!this.visible().length) {
      this.filter.set('all');
    }
  }

  protected undo(): void {
    const last = this.removed();
    if (last) {
      this.wishlist.restore(last.item.id, last.index);
      this.removed.set(null);
    }
  }
}
