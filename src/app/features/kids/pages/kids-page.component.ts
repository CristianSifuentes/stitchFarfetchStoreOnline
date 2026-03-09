import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HomeStore } from '../../home/store/home.store';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-kids-page',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <section class="mb-8 rounded-xl bg-white p-8">
      <h1 class="text-4xl font-extrabold">Kids Luxury</h1>
      <p class="mt-2 text-zinc-600">Future-ready feature boundary with local state.</p>
    </section>

    <div class="grid gap-4 md:grid-cols-3">
      @for (item of store.kidswear(); track item.id) {
        <app-product-card [item]="item" (addToBag)="cart.add($event)" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KidsPageComponent {
  protected readonly store = inject(HomeStore);
  protected readonly cart = inject(CartService);
}
