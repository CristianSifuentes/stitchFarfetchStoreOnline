import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogItem } from '../../../core/catalog/catalog.model';
import { CartService } from '../../../core/services/cart.service';
import { PricePipe } from '../../pipes/price.pipe';
import { WishlistButtonComponent } from '../wishlist-button/wishlist-button.component';

// The one product card (DESIGN.md "Product Cards"): 3:4 image, no border,
// no shadow; brand in label caps, name and price in body text. The heart is
// always available; "Add to bag" is a quiet text action revealed on hover.
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, PricePipe, WishlistButtonComponent],
  template: `
    <article class="group relative">
      <a [routerLink]="['/product', item().id]" class="block">
        <div class="relative aspect-[3/4] overflow-hidden bg-surface">
          <img
            [src]="item().image"
            [alt]="item().brand + ' ' + item().title"
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            [attr.loading]="eager() ? 'eager' : 'lazy'"
            decoding="async"
          />
          @if (item().badge) {
            <span class="absolute left-3 top-3 bg-canvas px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]">{{ item().badge }}</span>
          }
        </div>
        <div class="space-y-1 pt-4">
          <p class="label-caps">{{ item().brand }}</p>
          <h3 class="line-clamp-1 text-sm text-muted">{{ item().title }}</h3>
          <p class="text-sm">{{ item().price | price }}</p>
        </div>
      </a>

      <app-wishlist-button class="absolute right-3 top-3" [productId]="item().id" [label]="item().brand + ' ' + item().title" />

      <button
        type="button"
        class="quick-add link-cta mt-3"
        [attr.aria-label]="'Add ' + item().brand + ' ' + item().title + ' to bag'"
        (click)="cart.add(item().id)"
      >
        Add to bag
      </button>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  protected readonly cart = inject(CartService);

  readonly item = input.required<CatalogItem>();
  // Above-the-fold cards load immediately.
  readonly eager = input(false);
}
