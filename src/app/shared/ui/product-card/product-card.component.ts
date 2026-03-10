import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CatalogItem } from '../../../core/models/catalog-item.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <article class="group cursor-pointer" [attr.aria-label]="item().title">
      <a [routerLink]="['/product', item().id]" class="block rounded bg-white p-3 shadow-sm">
        <img [src]="item().image" [alt]="item().title" class="aspect-[3/4] w-full rounded object-cover" loading="lazy" />
        <p class="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{{ item().brand }}</p>
        <h3 class="text-sm font-semibold">{{ item().title }}</h3>
        <p class="text-sm">{{ item().price | currency }}</p>
      </a>
      <a [routerLink]="['/product', item().id]" class="mt-2 inline-block text-xs underline" [attr.aria-label]="'View details for ' + item().title">
        View details
      </a>
      <button
        type="button"
        class="mt-2 ml-3 text-xs underline"
        (click)="addToBag.emit(item().id)"
        [attr.aria-label]="'Add ' + item().title + ' to bag'"
      >
        Add to bag
      </button>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  readonly item = input.required<CatalogItem>();
  readonly addToBag = output<string>();
}
