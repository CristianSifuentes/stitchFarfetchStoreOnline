import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CatalogItem } from '../../../core/models/catalog-item.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <article class="group" [attr.aria-label]="item().title">

      <a [routerLink]="['/product', item().id]" class="block">
        <div class="aspect-[3/4] overflow-hidden bg-zinc-100 relative">
          <img
            [src]="item().image"
            [alt]="item().title"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div class="space-y-1.5 pt-4">
          <p class="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{{ item().brand }}</p>
          <h3 class="text-sm font-semibold leading-snug">{{ item().title }}</h3>
          <p class="text-sm font-medium">{{ item().price | currency }}</p>
        </div>
      </a>

      <button
        type="button"
        class="mt-4 w-full border border-black py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-200"
        (click)="addToBag.emit(item().id)"
        [attr.aria-label]="'Add ' + item().title + ' to bag'"
      >
        Add to Bag
      </button>

    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  readonly item = input.required<CatalogItem>();
  readonly addToBag = output<string>();
}
