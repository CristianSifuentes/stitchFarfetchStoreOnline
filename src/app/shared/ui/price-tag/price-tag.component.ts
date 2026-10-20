import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CatalogItem, discountPercent } from '../../../core/catalog/catalog.model';
import { PricePipe } from '../../pipes/price.pipe';

// A product's price. On sale: the sale price in red, the original struck
// through and the discount, the way Farfetch shows markdowns. Sold-out
// pieces show "Sold out" instead of a price.
@Component({
  selector: 'app-price-tag',
  imports: [PricePipe],
  template: `
    @if (item().soldOut) {
      <p class="text-muted" [class.text-sm]="size() === 'sm'" [class.text-xl]="size() === 'lg'">Sold out</p>
    } @else if (item().salePrice; as sale) {
      <p class="flex flex-wrap items-baseline gap-x-2" [class.text-sm]="size() === 'sm'" [class.text-xl]="size() === 'lg'">
        <span class="text-error">{{ sale | price }}</span>
        <s class="text-muted"><span class="sr-only">Was </span>{{ item().price | price }}</s>
        <span class="text-xs text-error">-{{ discount() }}%</span>
      </p>
    } @else {
      <p [class.text-sm]="size() === 'sm'" [class.text-xl]="size() === 'lg'">{{ item().price | price }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceTagComponent {
  readonly item = input.required<Pick<CatalogItem, 'price' | 'salePrice' | 'soldOut'>>();
  readonly size = input<'sm' | 'lg'>('sm');

  protected readonly discount = computed(() => discountPercent(this.item()));
}
