import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogItem, badgeLabel } from '../../../core/catalog/catalog.model';
import { sizedImage } from '../../../core/catalog/images';
import { BagService } from '../../../core/bag/bag.service';
import { PriceTagComponent } from '../price-tag/price-tag.component';
import { WishlistButtonComponent } from '../wishlist-button/wishlist-button.component';

// The one product card (DESIGN.md "Product Cards"): 3:4 image, no border,
// no shadow; brand in label caps, name and price in body text. The heart is
// always available; "Add to bag" is a quiet text action revealed on hover.
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, PriceTagComponent, WishlistButtonComponent],
  template: `
    <article class="group relative">
      <a [routerLink]="['/product', item().id]" class="block">
        <div class="relative aspect-[3/4] overflow-hidden bg-surface">
          <img
            [src]="image()"
            [alt]="item().brand + ' ' + item().title"
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            [attr.loading]="eager() ? 'eager' : 'lazy'"
            decoding="async"
          />
          @if (item().badge) {
            <span class="absolute left-3 top-3 bg-canvas px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]">{{ badgeLabel(item().badge) }}</span>
          }
        </div>
        <div class="space-y-1 pt-4">
          <p class="label-caps">{{ item().brand }}</p>
          <h3 class="line-clamp-1 text-sm text-muted">{{ item().title }}</h3>
          <app-price-tag [item]="item()" />
        </div>
      </a>

      <app-wishlist-button class="absolute right-3 top-3" [productId]="item().id" [label]="item().brand + ' ' + item().title" />

      @if (!item().soldOut) {
        <button
          type="button"
          class="quick-add link-cta mt-3"
          [attr.aria-label]="addLabel()"
          (click)="bag.add(item().id)"
          i18n="@@product.addToBag"
        >Add to bag</button>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  protected readonly bag = inject(BagService);
  protected readonly badgeLabel = badgeLabel;

  readonly item = input.required<CatalogItem>();
  // Above-the-fold cards load immediately.
  readonly eager = input(false);

  // Cards render at most ~360px wide; 600px covers 2x screens.
  protected readonly image = computed(() => sizedImage(this.item().image, 600));
  protected readonly addLabel = computed(
    () => $localize`:@@product.addNamed:Add ${this.item().brand}:INTERPOLATION: ${this.item().title}:INTERPOLATION_1: to bag`
  );
}
