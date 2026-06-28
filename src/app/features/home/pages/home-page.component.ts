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

    <!-- ─── Department Selector ─────────────────────────────────────────────── -->
    <section class="py-10">
      <h2 class="text-center text-xs font-bold uppercase tracking-[0.28em] text-zinc-400 mb-8">Choose a department</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <a routerLink="/womenswear" class="group relative aspect-[3/4] overflow-hidden block cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=720&q=80"
            alt="Womenswear"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
          <div class="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-300"></div>
          <div class="absolute bottom-8 left-0 right-0 flex justify-center">
            <span class="bg-white text-black px-8 py-3 text-[11px] font-bold uppercase tracking-widest shadow-lg">Womenswear</span>
          </div>
        </a>

        <a routerLink="/menswear" class="group relative aspect-[3/4] overflow-hidden block cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=720&q=80"
            alt="Menswear"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
          <div class="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-300"></div>
          <div class="absolute bottom-8 left-0 right-0 flex justify-center">
            <span class="bg-white text-black px-8 py-3 text-[11px] font-bold uppercase tracking-widest shadow-lg">Menswear</span>
          </div>
        </a>

        <a routerLink="/kids" class="group relative aspect-[3/4] overflow-hidden block cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=720&q=80"
            alt="Kidswear"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
          <div class="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-300"></div>
          <div class="absolute bottom-8 left-0 right-0 flex justify-center">
            <span class="bg-white text-black px-8 py-3 text-[11px] font-bold uppercase tracking-widest shadow-lg">Kidswear</span>
          </div>
        </a>

      </div>
    </section>

    <!-- ─── Featured Editorial ────────────────────────────────────────────────── -->
    <section class="grid grid-cols-1 lg:grid-cols-2 items-center bg-white">
      <div class="p-8 md:p-16 space-y-6">
        <span class="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-400">The Modern Muse</span>
        <h3 class="text-4xl md:text-5xl font-extrabold leading-tight">{{ store.heroTitle() }}</h3>
        <p class="text-zinc-500 max-w-md leading-relaxed">Curated pieces from the world's most iconic designers, blending timeless craftsmanship with contemporary silhouettes.</p>
        <div class="pt-2 flex flex-wrap gap-3">
          <a routerLink="/womenswear" class="bg-black text-white px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">Shop Now</a>
          <a routerLink="/menswear" class="border border-black px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors">View All</a>
        </div>
      </div>
      <div class="aspect-square overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80"
          alt="Editorial fashion"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </section>

    <!-- ─── Editors' Picks ────────────────────────────────────────────────────── -->
    <section class="py-16">
      <div class="flex items-center justify-between mb-10">
        <h2 class="text-xl font-bold uppercase tracking-[0.1em]">Editors' Picks</h2>
        <a routerLink="/womenswear" class="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-colors">View All</a>
      </div>
      <div class="grid gap-8 md:gap-10 grid-cols-2 md:grid-cols-3">
        @for (item of store.catalog(); track item.id) {
          <app-product-card [item]="item" (addToBag)="addToBag($event)" />
        }
      </div>
    </section>

    <!-- ─── Newsletter ─────────────────────────────────────────────────────────── -->
    @defer (on viewport) {
      <section class="border-t border-zinc-200 py-24">
        <div class="max-w-2xl mx-auto text-center space-y-5">
          <h3 class="text-2xl md:text-3xl font-extrabold uppercase tracking-[0.28em]">The Farfetch Editorial</h3>
          <p class="text-zinc-500 max-w-md mx-auto leading-relaxed text-sm">Curated trends, exclusive interviews, and the latest from the world's most iconic designers.</p>
          <form class="mt-6 flex flex-col md:flex-row gap-2" (submit)="$event.preventDefault()">
            <input
              class="flex-1 bg-transparent border-0 border-b border-zinc-300 rounded-none focus:ring-0 focus:border-black px-0 py-3 text-sm placeholder:text-zinc-400 outline-none"
              type="email"
              aria-label="Email address"
              [value]="email()"
              (input)="onEmailInput($event)"
              placeholder="Enter your email address"
            />
            <button
              class="bg-black text-white px-12 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 hover:tracking-[0.26em] transition-all duration-300 disabled:opacity-40 whitespace-nowrap"
              [disabled]="!isEmailValid()"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    } @placeholder {
      <div class="mt-12 h-36 animate-pulse bg-zinc-200"></div>
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

  protected onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement | null)?.value ?? '');
  }
}
