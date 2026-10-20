import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogItem, sizedImage, sizesFor } from '../../../core/catalog';
import { CartService } from '../../../core/services/cart.service';
import { PriceTagComponent } from '../../../shared/ui/price-tag/price-tag.component';

// A saved piece, the way Farfetch's wishlist shows it: the photo with a
// remove button, brand, name and price (or "Sold out"), and, when it can be
// bought, a size select and "Add to bag" right on the card.
@Component({
  selector: 'app-wishlist-card',
  imports: [RouterLink, PriceTagComponent],
  template: `
    <article class="group flex h-full flex-col">
      <div class="relative">
        <a [routerLink]="['/product', item().id]" class="block aspect-[3/4] overflow-hidden bg-surface">
          <img
            [src]="image()"
            [alt]="item().brand + ' ' + item().title"
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            [class.opacity-50]="item().soldOut"
            [class.grayscale]="item().soldOut"
            loading="lazy"
            decoding="async"
          />
        </a>
        @if (item().soldOut) {
          <span class="absolute left-3 top-3 bg-canvas px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]">Sold out</span>
        }
        <button
          type="button"
          class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-canvas/90 transition-colors hover:bg-ink hover:text-canvas"
          [attr.aria-label]="'Remove ' + item().brand + ' ' + item().title + ' from wishlist'"
          (click)="remove.emit()"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <a [routerLink]="['/product', item().id]" class="block space-y-1 pt-4">
        <p class="label-caps">{{ item().brand }}</p>
        <h3 class="line-clamp-1 text-sm text-muted">{{ item().title }}</h3>
        <app-price-tag [item]="item()" />
      </a>

      @if (!item().soldOut) {
        <div class="mt-auto space-y-3 pt-5">
          @if (sizes().length) {
            <label class="block">
              <span class="sr-only">Select size for {{ item().title }}</span>
              <select
                class="select-line w-full border-b py-2"
                [class.border-line]="!needsSize()"
                [class.border-error]="needsSize()"
                [value]="size() ?? ''"
                (change)="pick($any($event.target).value)"
              >
                <option value="">Select size</option>
                @for (option of sizes(); track option) {
                  <option [value]="option">{{ option }}</option>
                }
              </select>
            </label>
            @if (needsSize()) {
              <p class="text-xs text-error" role="alert">Select a size first.</p>
            }
          } @else {
            <p class="label-caps py-2 text-muted">One size</p>
          }
          <button type="button" class="btn btn-secondary w-full px-4" (click)="addToBag()">
            @if (added()) {
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
              Added to bag
            } @else {
              Add to bag
            }
          </button>
        </div>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistCardComponent {
  private readonly cart = inject(CartService);

  readonly item = input.required<CatalogItem>();
  readonly remove = output();

  protected readonly image = computed(() => sizedImage(this.item().image, 600));
  protected readonly sizes = computed(() => sizesFor(this.item()));
  protected readonly size = signal<string | null>(null);
  protected readonly needsSize = signal(false);
  protected readonly added = signal(false);

  protected pick(value: string): void {
    this.size.set(value || null);
    this.needsSize.set(false);
    this.added.set(false);
  }

  protected addToBag(): void {
    if (this.sizes().length && !this.size()) {
      this.needsSize.set(true);
      return;
    }
    this.cart.add(this.item().id);
    this.added.set(true);
  }
}
