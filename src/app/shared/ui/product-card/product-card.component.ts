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
          <!-- Wishlist heart — revealed on hover (decorative, consistent with all prototypes) -->
          <button
            type="button"
            class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            aria-label="Add to wishlist"
            (click)="$event.preventDefault()"
          >
            <span class="flex items-center justify-center w-8 h-8 bg-white/85 backdrop-blur-sm rounded-full shadow-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </span>
          </button>
        </div>
        <div class="space-y-1.5 pt-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{{ item().brand }}</p>
          <h3 class="text-sm font-light text-zinc-700 leading-snug">{{ item().title }}</h3>
          <p class="text-sm font-bold">{{ item().price | currency }}</p>
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
