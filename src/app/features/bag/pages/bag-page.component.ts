import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthDialogService, AuthService } from '../../../core/auth';
import { BagEntry, BagLine, BagSummary, DELIVERY_OPTIONS, DeliveryOption, summarizeBag } from '../../../core/bag/bag.model';
import { BagService } from '../../../core/bag/bag.service';
import { DEPARTMENTS, sizedImage, sizesFor } from '../../../core/catalog';
import { LocaleService } from '../../../core/locale';
import { CatalogStore } from '../../../core/services/catalog.store';
import { RecentlyViewedService } from '../../../core/services/recently-viewed.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';
import { ProductCarouselComponent } from '../../../shared/ui/product-carousel/product-carousel.component';
import { BagLineComponent } from '../components/bag-line.component';
import { BagSummaryComponent } from '../components/bag-summary.component';

const UNDO_MS = 6000;
const PLACING_MS = 1400;
const WISHLIST_PREVIEW = 5;
const RECOMMENDED_COUNT = 12;

interface PlacedOrder {
  readonly number: string;
  readonly email: string;
  readonly entries: readonly BagEntry[];
  readonly summary: BagSummary;
  readonly eta: string;
}

// Farfetch's basket (/checkout/basket.aspx): the pieces with size and
// quantity editable in place, a summary with delivery and Continue, then
// the reassurances, your wishlist, recommendations and recently viewed.
// Continue asks guests to sign in and places a simulated order (no payment).
@Component({
  selector: 'app-bag-page',
  imports: [RouterLink, PricePipe, BagLineComponent, BagSummaryComponent, ProductCardComponent, ProductCarouselComponent],
  template: `
    <p class="border-b border-line py-3 text-center text-xs">
      <span class="font-semibold">Free returns for 30 days</span> <span class="text-muted">· We collect from your home</span>
    </p>

    <div class="page-container">
      @if (order(); as placed) {
        <section class="mx-auto max-w-2xl py-16 text-center motion-safe:animate-fade-in" aria-labelledby="order-heading" role="status">
          <svg class="mx-auto h-16 w-16 -rotate-90" viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" aria-hidden="true">
            <circle cx="26" cy="26" r="25" pathLength="1" class="[stroke-dasharray:1] motion-safe:animate-draw motion-safe:[stroke-dashoffset:1]" />
            <path d="m16 27 7 7 13-15" transform="rotate(90 26 26)" pathLength="1" class="[stroke-dasharray:1] motion-safe:animate-draw motion-safe:[animation-delay:0.45s] motion-safe:[stroke-dashoffset:1]" />
          </svg>
          <p class="label-caps mt-8 text-muted">Order {{ placed.number }}</p>
          <h1 id="order-heading" class="text-headline mt-3">Thank you, your order is placed</h1>
          <p class="mt-3 text-sm text-muted">A confirmation is on its way to {{ placed.email }}. Estimated delivery: {{ placed.eta }}.</p>

          <ul class="mt-10 divide-y divide-line border-y border-line text-left">
            @for (entry of placed.entries; track entry.index) {
              <li class="flex items-center gap-4 py-4">
                <img [src]="thumb(entry.item.image)" alt="" class="h-20 w-16 object-cover" />
                <div class="min-w-0 flex-1">
                  <p class="label-caps">{{ entry.item.brand }}</p>
                  <p class="truncate text-sm text-muted">{{ entry.item.title }}</p>
                  <p class="text-xs text-muted">{{ entry.line.size ?? 'One size' }} · Qty {{ entry.line.quantity }}</p>
                </div>
                <p class="text-sm">{{ entry.lineTotal | price }}</p>
              </li>
            }
          </ul>
          <dl class="mt-6 space-y-2 text-sm">
            <div class="flex justify-between"><dt class="text-muted">Subtotal</dt><dd>{{ placed.summary.subtotal | price }}</dd></div>
            <div class="flex justify-between"><dt class="text-muted">Delivery</dt><dd>{{ placed.summary.delivery ? (placed.summary.delivery | price) : 'Free' }}</dd></div>
            <div class="flex justify-between border-t border-line pt-3 text-base"><dt>Total</dt><dd><span class="mr-1 text-xs text-muted">{{ locale.region().currency }}</span>{{ placed.summary.total | price }}</dd></div>
          </dl>
          <p class="mt-6 bg-surface px-4 py-3 text-xs text-muted">Demo store: no payment was taken and nothing will ship.</p>
          <div class="mt-10 flex flex-wrap justify-center gap-3">
            <a routerLink="/" class="btn btn-primary">Continue shopping</a>
            <a routerLink="/wishlist" class="btn btn-secondary">Go to wishlist</a>
          </div>
        </section>
      } @else {
        <header class="flex flex-wrap items-end justify-between gap-4 pb-6 pt-10">
          <div>
            <h1 class="text-headline">Shopping bag</h1>
            <p class="mt-2 text-sm text-muted" aria-live="polite">{{ summary().count }} {{ summary().count === 1 ? 'item' : 'items' }}</p>
          </div>
          <a routerLink="/" class="link-cta">Continue shopping</a>
        </header>

        @if (removed(); as last) {
          <div class="mb-6 flex items-center justify-between gap-4 bg-ink px-5 py-4 text-sm text-canvas motion-safe:animate-fade-in" role="status">
            <span>{{ last.message }}</span>
            <button type="button" class="label-caps underline underline-offset-4" (click)="undo()">Undo</button>
          </div>
        }

        @if (catalog.loading()) {
          <div class="h-64 animate-pulse bg-surface" aria-hidden="true"></div>
        } @else if (summary().available.length || summary().unavailable.length) {
          <div class="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div class="lg:col-span-8">
              <ul class="divide-y divide-line border-y border-line">
                @for (entry of summary().available; track entry.line.id + entry.line.size) {
                  <li class="motion-safe:animate-fade-in">
                    <app-bag-line
                      [entry]="entry"
                      [flagMissing]="tried()"
                      (size)="bag.setSize(entry.index, $event)"
                      (quantity)="bag.setQuantity(entry.index, $event)"
                      (moveToWishlist)="moveToWishlist(entry)"
                      (remove)="remove(entry)"
                    />
                  </li>
                }
              </ul>

              @if (summary().unavailable.length) {
                <details class="group mt-10 border-y border-line" open>
                  <summary class="label-caps flex cursor-pointer list-none items-center justify-between py-5">
                    Unavailable items ({{ summary().unavailable.length }})
                    <svg class="h-4 w-4 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                  </summary>
                  <ul class="divide-y divide-line border-t border-line">
                    @for (entry of summary().unavailable; track entry.line.id + entry.line.size) {
                      <li>
                        <app-bag-line [entry]="entry" (moveToWishlist)="moveToWishlist(entry)" (remove)="remove(entry)" />
                      </li>
                    }
                  </ul>
                </details>
              }

              <p class="mt-6 text-xs text-muted">Import duties are included in every price.</p>
            </div>

            <div class="lg:col-span-4">
              <div class="lg:sticky lg:top-40">
                <app-bag-summary
                  [summary]="summary()"
                  [delivery]="delivery()"
                  [placing]="placing()"
                  [problem]="problem()"
                  (deliveryChange)="delivery.set($event)"
                  (checkout)="checkout()"
                />
              </div>
            </div>
          </div>
        } @else {
          <section class="flex flex-col items-center border-y border-line py-20 text-center" aria-labelledby="empty-heading">
            <svg class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2 id="empty-heading" class="text-headline mt-8">Your shopping bag is empty</h2>
            <p class="mt-3 max-w-sm text-sm leading-relaxed text-muted">Pieces you add to your bag will appear here. Start with the newest arrivals.</p>
            <div class="mt-10 flex flex-wrap justify-center gap-3">
              @for (department of departments; track department.id) {
                <a class="btn btn-secondary" [routerLink]="department.path + '/items'" [queryParams]="{ sort: 'newest' }">Shop {{ department.label }}</a>
              }
            </div>
          </section>
        }
      }

      <section class="section-y grid gap-10 border-b border-line lg:grid-cols-2 lg:items-center" aria-labelledby="returns-heading">
        <div>
          <p class="label-caps text-muted">Free returns for 30 days</p>
          <h2 id="returns-heading" class="text-display mt-4">Buy now, decide at your pace</h2>
          <p class="mt-6 max-w-md text-sm leading-relaxed text-muted">
            The perfect fit is one try-on away. Enjoy 30 days of free international returns, and we'll collect them from your home.
          </p>
          <a href="#" class="link-cta mt-8">Learn more</a>
        </div>
        <ul class="grid gap-px bg-line sm:grid-cols-3 lg:grid-cols-1">
          @for (benefit of benefits; track benefit.title) {
            <li class="flex items-start gap-4 bg-canvas p-6">
              <svg class="mt-0.5 h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                @switch (benefit.icon) {
                  @case ('returns') { <path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /> }
                  @case ('access') { <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8-4.3-4.1 5.9-.9z" /> }
                  @case ('delivery') { <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.5" /><circle cx="17" cy="17.5" r="1.5" /> }
                }
              </svg>
              <span>
                <span class="label-caps block">{{ benefit.title }}</span>
                <span class="mt-1 block text-sm text-muted">{{ benefit.text }}</span>
              </span>
            </li>
          }
        </ul>
      </section>

      @if (fromWishlist().length) {
        <section class="section-y border-b border-line" aria-labelledby="wishlist-heading">
          <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="label-caps text-muted">From your wishlist</p>
              <h2 id="wishlist-heading" class="text-headline mt-2">There's more waiting for you</h2>
            </div>
            <a routerLink="/wishlist" class="link-cta">Go to wishlist</a>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
            @for (item of fromWishlist(); track item.id) {
              <app-product-card [item]="item" />
            }
          </div>
        </section>
      }

      @if (recommended().length) {
        <div class="section-y">
          <app-product-carousel eyebrow="Recommendations" title="You may also like" [items]="recommended()" actionLink="/search" [actionQuery]="{ sort: 'newest' }" />
        </div>
      }

      @if (recent().length) {
        <div class="pb-16 md:pb-24">
          <app-product-carousel eyebrow="Recently viewed" title="Pick up where you left off" [items]="recent()" />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BagPageComponent {
  protected readonly catalog = inject(CatalogStore);
  protected readonly bag = inject(BagService);
  protected readonly locale = inject(LocaleService);
  private readonly wishlist = inject(WishlistService);
  private readonly recentlyViewed = inject(RecentlyViewedService);
  private readonly auth = inject(AuthService);
  private readonly authDialog = inject(AuthDialogService);

  protected readonly departments = DEPARTMENTS;
  protected readonly benefits = [
    { icon: 'returns', title: '30 days of free returns', text: 'More time to decide, and we collect from your door.' },
    { icon: 'access', title: 'Grow your Access benefits', text: 'Every order brings you closer to exclusive rewards.' },
    { icon: 'delivery', title: 'Fast delivery', text: 'Express in 1–2 business days, straight to your door.' }
  ] as const;

  protected readonly delivery = signal<DeliveryOption>('standard');
  // Continue was tried: flag the pieces still missing a size.
  protected readonly tried = signal(false);
  protected readonly placing = signal(false);
  protected readonly problem = signal('');
  protected readonly order = signal<PlacedOrder | null>(null);
  protected readonly removed = signal<{
    readonly line: BagLine;
    readonly index: number;
    readonly message: string;
    // Set when the piece was moved to the wishlist by this action.
    readonly wishlisted: string | null;
  } | null>(null);

  protected readonly summary = computed(() =>
    summarizeBag(this.bag.lines(), (id) => this.catalog.find(id), sizesFor, this.delivery())
  );

  private readonly inBag = computed(() => new Set(this.bag.lines().map((line) => line.id)));

  protected readonly fromWishlist = computed(() =>
    this.wishlist
      .items()
      .flatMap((id) => {
        const item = this.catalog.find(id);
        return item && !this.inBag().has(id) ? [item] : [];
      })
      .slice(0, WISHLIST_PREVIEW)
  );

  // Newest in-stock pieces from the departments in the bag.
  protected readonly recommended = computed(() => {
    const departments = new Set(this.summary().available.map((entry) => entry.item.department));
    return this.catalog
      .newest()
      .filter((item) => !this.inBag().has(item.id) && !item.soldOut && (!departments.size || departments.has(item.department)))
      .slice(0, RECOMMENDED_COUNT);
  });

  protected readonly recent = computed(() =>
    this.recentlyViewed.ids().flatMap((id) => {
      const item = this.catalog.find(id);
      return item ? [item] : [];
    })
  );

  private undoTimer?: ReturnType<typeof setTimeout>;
  private placeTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.undoTimer);
      clearTimeout(this.placeTimer);
    });
  }

  protected remove(entry: BagEntry): void {
    this.bag.remove(entry.index);
    this.offerUndo(entry, `Removed ${entry.item.brand} ${entry.item.title}`);
  }

  protected moveToWishlist(entry: BagEntry): void {
    const added = !this.wishlist.has(entry.item.id);
    if (added) {
      this.wishlist.toggle(entry.item.id);
    }
    this.bag.remove(entry.index);
    this.offerUndo(entry, `Moved ${entry.item.brand} ${entry.item.title} to your wishlist`, added ? entry.item.id : null);
  }

  protected undo(): void {
    const last = this.removed();
    if (last) {
      this.bag.restore(last.line, last.index);
      if (last.wishlisted) {
        this.wishlist.remove(last.wishlisted);
      }
      this.removed.set(null);
    }
  }

  protected checkout(): void {
    this.tried.set(true);
    const summary = this.summary();
    if (summary.missingSizes) {
      this.problem.set(`Choose a size for ${summary.missingSizes === 1 ? '1 piece' : summary.missingSizes + ' pieces'} to continue.`);
      return;
    }
    const account = this.auth.account();
    if (!account) {
      this.problem.set('Sign in or register to check out. Your bag comes with you.');
      this.authDialog.open('sign-in');
      return;
    }
    this.problem.set('');
    this.placing.set(true);
    this.placeTimer = setTimeout(() => {
      const eta = DELIVERY_OPTIONS.find((option) => option.id === this.delivery())?.eta ?? '';
      this.order.set({ number: orderNumber(), email: account.email, entries: summary.available, summary, eta });
      // What can't be bought (sold out) stays in the bag.
      summary.available
        .map((entry) => entry.index)
        .sort((a, b) => b - a)
        .forEach((index) => this.bag.remove(index));
      this.placing.set(false);
      this.tried.set(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, PLACING_MS);
  }

  protected thumb(url: string): string {
    return sizedImage(url, 200);
  }

  private offerUndo(entry: BagEntry, message: string, wishlisted: string | null = null): void {
    this.removed.set({ line: entry.line, index: entry.index, message, wishlisted });
    clearTimeout(this.undoTimer);
    this.undoTimer = setTimeout(() => this.removed.set(null), UNDO_MS);
  }
}

function orderNumber(): string {
  return `VS-${String(crypto.getRandomValues(new Uint32Array(1))[0] % 100_000_000).padStart(8, '0')}`;
}

