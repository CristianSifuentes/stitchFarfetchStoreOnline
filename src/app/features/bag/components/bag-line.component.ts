import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BagEntry, MAX_QUANTITY } from '../../../core/bag/bag.model';
import { sizedImage, sizesFor } from '../../../core/catalog';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { PriceTagComponent } from '../../../shared/ui/price-tag/price-tag.component';

// One piece in the bag, laid out like Farfetch's basket: photo, brand, name,
// item ID, price and "Import duties included", then Size and Quantity that
// can be changed in place, "Move to wishlist" and a remove button. Sold-out
// pieces are shown dimmed, without the selects.
@Component({
  selector: 'app-bag-line',
  imports: [RouterLink, PriceTagComponent, PricePipe],
  template: `
    @let item = entry().item;
    <article class="grid grid-cols-[6.5rem_1fr] gap-5 py-8 sm:grid-cols-[9rem_1fr] sm:gap-8">
      <a [routerLink]="['/product', item.id]" class="block aspect-[3/4] overflow-hidden bg-surface">
        <img [src]="image()" [alt]="item.brand + ' ' + item.title" class="h-full w-full object-cover" [class.opacity-50]="unavailable()" [class.grayscale]="unavailable()" loading="lazy" />
      </a>

      <div class="flex min-w-0 flex-col">
        <div class="flex items-start justify-between gap-4">
          <a [routerLink]="['/product', item.id]" class="min-w-0">
            <p class="label-caps">{{ item.brand }}</p>
            <h3 class="mt-1 text-sm text-muted">{{ item.title }}</h3>
            <p class="mt-1 text-xs text-muted">Item ID: {{ item.id.toUpperCase() }}</p>
          </a>
          <button
            type="button"
            class="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center transition-colors hover:text-muted"
            [attr.aria-label]="'Remove ' + item.brand + ' ' + item.title + ' from bag'"
            (click)="remove.emit()"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <div class="mt-4">
          <app-price-tag [item]="item" />
          @if (!unavailable()) {
            <p class="mt-1 text-xs text-muted">Import duties included</p>
          }
        </div>

        @if (unavailable()) {
          <p class="mt-4 text-xs text-muted">This piece sold out after you added it. It won't be charged.</p>
        } @else {
          <div class="mt-5 grid grid-cols-2 gap-4 sm:max-w-sm">
            <label class="block">
              <span class="label-caps block text-muted">Size</span>
              @if (sizes().length) {
                <select
                  class="select-line mt-2 w-full border-b py-2"
                  [class.border-line]="entry().line.size || !flagMissing()"
                  [class.border-error]="!entry().line.size && flagMissing()"
                  (change)="size.emit($any($event.target).value)"
                >
                  @if (!entry().line.size) {
                    <option value="" disabled selected>Select size</option>
                  }
                  @for (option of sizes(); track option) {
                    <option [value]="option" [selected]="entry().line.size === option">{{ option }}</option>
                  }
                </select>
              } @else {
                <span class="mt-2 block py-2 text-xs font-semibold uppercase tracking-[0.12em]">One size</span>
              }
            </label>
            <label class="block">
              <span class="label-caps block text-muted">Quantity</span>
              <select class="select-line mt-2 w-full border-b border-line py-2" (change)="quantity.emit(+$any($event.target).value)">
                @for (n of quantities; track n) {
                  <option [value]="n" [selected]="entry().line.quantity === n">{{ n }}</option>
                }
              </select>
            </label>
          </div>
          @if (!entry().line.size && sizes().length && flagMissing()) {
            <p class="mt-2 text-xs text-error" role="alert">Choose a size to continue.</p>
          }
        }

        <div class="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
          <button type="button" class="text-xs underline underline-offset-4 transition-colors hover:text-muted" (click)="moveToWishlist.emit()">Move to wishlist</button>
          @if (!unavailable() && entry().line.quantity > 1) {
            <p class="text-sm">{{ entry().lineTotal | price }}</p>
          }
        </div>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BagLineComponent {
  readonly entry = input.required<BagEntry>();
  // Highlights a missing size (after "Continue" was tried).
  readonly flagMissing = input(false);

  readonly size = output<string>();
  readonly quantity = output<number>();
  readonly moveToWishlist = output();
  readonly remove = output();

  protected readonly quantities = Array.from({ length: MAX_QUANTITY }, (_, i) => i + 1);
  protected readonly image = computed(() => sizedImage(this.entry().item.image, 400));
  protected readonly sizes = computed(() => sizesFor(this.entry().item));
  protected readonly unavailable = computed(() => !!this.entry().item.soldOut);
}
