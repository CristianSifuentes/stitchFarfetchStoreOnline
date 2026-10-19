import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { categoryLabel, departmentInfo, galleryFor, sizesFor } from '../../../core/catalog';
import { CartService } from '../../../core/services/cart.service';
import { CatalogStore } from '../../../core/services/catalog.store';
import { WishlistService } from '../../../core/services/wishlist.service';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { BreadcrumbComponent, Crumb } from '../../../shared/ui/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';
import { SectionHeaderComponent } from '../../../shared/ui/section-header/section-header.component';

const RELATED_COUNT = 4;

// The product page, the same for every department. What varies (the size
// run, the breadcrumb, the recommendations) is derived from the product.
@Component({
  selector: 'app-product-page',
  imports: [RouterLink, PricePipe, BreadcrumbComponent, ProductCardComponent, SectionHeaderComponent],
  template: `
    <div class="page-container">
      @if (product(); as item) {
        <app-breadcrumb [items]="breadcrumb()" />

        <section class="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div class="flex flex-col gap-3 lg:col-span-7 lg:flex-row-reverse">
            <div class="aspect-[3/4] flex-1 overflow-hidden bg-surface">
              <img class="h-full w-full object-cover" [src]="gallery()[activeImage()].src" [alt]="item.brand + ' ' + item.title + ', ' + gallery()[activeImage()].label" loading="eager" />
            </div>
            @if (gallery().length > 1) {
              <div class="no-scrollbar flex gap-3 overflow-x-auto lg:w-20 lg:flex-col" role="group" aria-label="Product images">
                @for (image of gallery(); track image.src; let i = $index) {
                  <button
                    type="button"
                    class="aspect-[3/4] w-20 shrink-0 overflow-hidden border bg-surface transition-colors"
                    [class.border-ink]="activeImage() === i"
                    [class.border-transparent]="activeImage() !== i"
                    [attr.aria-pressed]="activeImage() === i"
                    [attr.aria-label]="image.label"
                    (click)="activeImage.set(i)"
                  >
                    <img class="h-full w-full object-cover" [src]="image.src" alt="" loading="lazy" />
                  </button>
                }
              </div>
            }
          </div>

          <div class="space-y-8 lg:col-span-5 lg:sticky lg:top-40 lg:self-start">
            <header>
              @if (item.badge) {
                <p class="label-caps mb-3 text-muted">{{ item.badge }}</p>
              }
              <h1>
                <a class="text-title uppercase tracking-[0.04em] hover:text-muted" [routerLink]="departmentPath() + '/items'" [queryParams]="{ designer: item.brand }">{{ item.brand }}</a>
                <span class="mt-2 block text-base text-muted">{{ item.title }}</span>
              </h1>
              <p class="mt-6 text-xl">{{ item.price | price }}</p>
              <p class="mt-1 text-xs text-muted">Import duties included</p>
            </header>

            @if (sizes().length) {
              <fieldset class="space-y-4">
                <div class="flex items-center justify-between">
                  <legend class="label-caps">Select size</legend>
                  <a href="#" class="link-cta">Size guide</a>
                </div>
                <div class="grid grid-cols-5 gap-2">
                  @for (size of sizes(); track size) {
                    <button
                      type="button"
                      class="border py-3 text-xs transition-colors"
                      [class.border-ink]="selectedSize() === size"
                      [class.bg-ink]="selectedSize() === size"
                      [class.text-canvas]="selectedSize() === size"
                      [class.border-line]="selectedSize() !== size"
                      [attr.aria-pressed]="selectedSize() === size"
                      (click)="selectedSize.set(size)"
                    >{{ size }}</button>
                  }
                </div>
              </fieldset>
            } @else {
              <p class="label-caps text-muted">One size</p>
            }

            <div class="space-y-3">
              <button type="button" class="btn btn-primary w-full" (click)="addToBag()">
                {{ added() ? 'Added to bag' : 'Add to bag' }}
              </button>
              @if (needsSize()) {
                <p class="text-xs text-error" role="alert">Please select a size.</p>
              }
              <button type="button" class="btn btn-secondary w-full" [attr.aria-pressed]="saved()" (click)="wishlist.toggle(item.id)">
                <svg class="h-4 w-4" viewBox="0 0 24 24" [attr.fill]="saved() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {{ saved() ? 'Saved to wishlist' : 'Add to wishlist' }}
              </button>
              <p class="pt-2 text-center text-xs text-muted">Estimated delivery: 2–4 business days</p>
            </div>

            <div class="border-t border-line">
              @for (section of details(); track section.title; let first = $first) {
                <details class="group border-b border-line py-5" [open]="first">
                  <summary class="label-caps flex cursor-pointer list-none items-center justify-between">
                    {{ section.title }}
                    <svg class="h-4 w-4 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                  </summary>
                  <div class="mt-4 space-y-2 text-sm leading-relaxed text-muted">
                    @for (line of section.lines; track line) {
                      <p>{{ line }}</p>
                    }
                  </div>
                </details>
              }
            </div>
          </div>
        </section>

        @if (related().length) {
          <section class="section-y" aria-labelledby="related-heading">
            <app-section-header
              eyebrow="Complete the look"
              title="You may also like"
              [actionLabel]="'Shop ' + item.brand"
              [actionLink]="departmentPath() + '/items'"
              [actionQuery]="{ designer: item.brand }"
            />
            <div class="product-grid">
              @for (suggestion of related(); track suggestion.id) {
                <app-product-card [item]="suggestion" />
              }
            </div>
          </section>
        }
      } @else if (catalog.loading()) {
        <div class="grid gap-10 py-16 lg:grid-cols-12" aria-hidden="true">
          <div class="aspect-[3/4] animate-pulse bg-surface lg:col-span-7"></div>
          <div class="space-y-4 lg:col-span-5"><div class="h-6 w-1/2 bg-surface"></div><div class="h-4 w-3/4 bg-surface"></div></div>
        </div>
      } @else {
        <div class="py-32 text-center">
          <p class="label-caps text-muted">Error 404</p>
          <h1 class="text-headline mt-4">This piece is no longer available</h1>
          <p class="mt-3 text-sm text-muted">It may have sold out or moved. Discover what's new instead.</p>
          <a routerLink="/search" class="btn btn-primary mt-8">Shop all products</a>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPageComponent {
  protected readonly catalog = inject(CatalogStore);
  protected readonly wishlist = inject(WishlistService);
  private readonly cart = inject(CartService);

  // The :id route param (withComponentInputBinding), so moving from one
  // product to a recommended one updates the page.
  readonly id = input.required<string>();

  protected readonly product = computed(() => this.catalog.find(this.id()) ?? null);
  protected readonly sizes = computed(() => {
    const item = this.product();
    return item ? sizesFor(item) : [];
  });

  protected readonly gallery = computed(() => {
    const item = this.product();
    return item ? galleryFor(item.image) : [];
  });

  // Reset whenever the product changes.
  protected readonly selectedSize = linkedSignal<string | null, string | null>({ source: this.id, computation: () => null });
  protected readonly added = linkedSignal({ source: this.id, computation: () => false });
  protected readonly activeImage = linkedSignal({ source: this.id, computation: () => 0 });
  protected readonly needsSize = linkedSignal({ source: this.id, computation: () => false });

  protected readonly saved = computed(() => this.wishlist.has(this.id()));
  protected readonly departmentPath = computed(() => {
    const item = this.product();
    return item ? departmentInfo(item.department).path : '/';
  });

  protected readonly breadcrumb = computed<Crumb[]>(() => {
    const item = this.product();
    if (!item) {
      return [];
    }
    const department = departmentInfo(item.department);
    return [
      { label: 'Home', link: '/' },
      { label: department.label, link: department.path },
      { label: categoryLabel(item.category), link: `${department.path}/items`, queryParams: { category: item.category } },
      { label: item.title }
    ];
  });

  // Same department; same category first, then the rest, newest first.
  protected readonly related = computed(() => {
    const item = this.product();
    if (!item) {
      return [];
    }
    const others = this.catalog.byDepartment(item.department).filter((other) => other.id !== item.id);
    const sameCategory = others.filter((other) => other.category === item.category);
    const rest = others.filter((other) => other.category !== item.category);
    return [...sameCategory, ...rest].slice(0, RELATED_COUNT);
  });

  protected readonly details = computed(() => {
    const item = this.product();
    if (!item) {
      return [];
    }
    return [
      { title: 'The details', lines: [item.description, `${item.brand} · ${categoryLabel(item.category)}`, `Item ID: ${item.id.toUpperCase()}`] },
      {
        title: 'Size & fit',
        lines: this.sizes().length
          ? ['Fits true to size. If you are between sizes, we recommend taking the larger one.', 'See the size guide for exact measurements.']
          : ['One size.']
      },
      {
        title: 'Shipping & returns',
        lines: ['Standard delivery in 2–4 business days; express delivery available at checkout.', 'Free returns within 14 days of delivery.']
      }
    ];
  });

  protected addToBag(): void {
    const item = this.product();
    if (!item) {
      return;
    }
    if (this.sizes().length && !this.selectedSize()) {
      this.needsSize.set(true);
      return;
    }
    this.needsSize.set(false);
    this.cart.add(item.id);
    this.added.set(true);
  }
}
