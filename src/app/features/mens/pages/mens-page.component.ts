import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HomeStore } from '../../home/store/home.store';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-mens-page',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <section class="mb-8 rounded-xl bg-white p-8">
      <h1 class="text-4xl font-extrabold">The Menswear Edit</h1>
      <p class="mt-2 text-zinc-600">Signals-first catalog with OnPush standalone pages.</p>
    </section>

    <div class="grid gap-4 md:grid-cols-3">
      @for (item of store.menswear(); track item.id) {
        <app-product-card [item]="item" (addToBag)="cart.add($event)" />
      } @empty {
        <p>No menswear items available.</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MensPageComponent {
  protected readonly store = inject(HomeStore);
  protected readonly cart = inject(CartService);
}
