import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { HomeStore } from '../../home/store/home.store';

@Component({
  selector: 'app-product-page',
  standalone: true,
  template: `
    @if (product(); as item) {
      <article class="grid gap-8 rounded-xl bg-white p-8 md:grid-cols-2">
        <img [src]="item.image" [alt]="item.title" class="w-full rounded object-cover" />
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-zinc-500">{{ item.brand }}</p>
          <h1 class="text-3xl font-bold">{{ item.title }}</h1>
          <p class="mt-2 text-zinc-600">{{ item.description }}</p>
          <p class="mt-4 text-2xl font-bold">{{ item.price | currency }}</p>
        </div>
      </article>
    } @else {
      <p>Product not found.</p>
    }
  `,
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(HomeStore);

  protected readonly product = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.store.catalog().find((x) => x.id === id) ?? null;
  });
}
