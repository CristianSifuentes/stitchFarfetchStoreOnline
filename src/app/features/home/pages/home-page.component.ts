import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';
import { HomeStore } from '../store/home.store';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  template: `
    <section class="rounded-2xl bg-black text-white">
      <div class="grid gap-6 p-10 md:grid-cols-2">
        <div>
          <p class="mb-3 text-xs uppercase tracking-[0.2em] text-orange-300">New arrivals</p>
          <h1 class="text-5xl font-extrabold">{{ store.heroTitle() }}</h1>
          <p class="mt-4 text-zinc-200">Luxury fashion marketplace serving clients in 190+ countries.</p>
          <div class="mt-8 flex gap-3">
            <a routerLink="/menswear" class="rounded bg-orange-500 px-5 py-3 text-sm font-semibold">Shop Men</a>
            <a routerLink="/kids" class="rounded bg-white px-5 py-3 text-sm font-semibold text-black">Shop Kids</a>
          </div>
        </div>
        <img class="h-80 w-full rounded-xl object-cover" alt="hero" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80" />
      </div>
    </section>

    <section class="mt-12">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold">Editors' Picks</h2>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        @for (item of store.catalog(); track item.id) {
          <app-product-card [item]="item" (addToBag)="addToBag($event)" />
        }
      </div>
    </section>

    @defer (on viewport) {
      <section class="mt-12 rounded-xl bg-white p-8">
        <h3 class="text-2xl font-bold">Stay ahead of the curve</h3>
        <p class="mt-2 text-sm text-zinc-600">Signal-form newsletter with zoneless reactive validation.</p>
        <form class="mt-4 flex flex-col gap-3 md:flex-row" (submit)="$event.preventDefault()">
          <input
            class="rounded border px-4 py-3"
            type="email"
            aria-label="Email address"
            [value]="email()"
            (input)="email.set(($event.target as HTMLInputElement).value)"
            placeholder="Enter your email address"
          />
          <button class="rounded bg-black px-6 py-3 text-white disabled:opacity-50" [disabled]="!isEmailValid()">Subscribe</button>
        </form>
      </section>
    } @placeholder {
      <div class="mt-12 h-36 animate-pulse rounded-xl bg-zinc-200"></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  protected readonly store = inject(HomeStore);
  private readonly cart = inject(CartService);

  protected readonly email = signal('');
  protected readonly isEmailValid = computed(() => /.+@.+\..+/.test(this.email()));

  protected addToBag(id: string): void {
    this.cart.add(id);
  }
}
