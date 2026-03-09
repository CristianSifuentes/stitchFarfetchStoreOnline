import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { WomenStore } from '../store/women.store';

@Component({
  selector: 'app-women-page',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <section aria-label="Breadcrumb" class="mb-8 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
      <span>Home</span> · <span class="text-zinc-800">Women</span>
    </section>

    <section class="relative mb-16 overflow-hidden rounded bg-zinc-200">
      <img
        class="h-[420px] w-full object-cover"
        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1800&q=80"
        alt="Editorial high fashion photography of a woman in luxury couture"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent"></div>
      <div class="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center p-10 text-white">
        <p class="mb-4 text-xs font-bold uppercase tracking-[0.3em]">SS24 Collection</p>
        <h1 class="text-5xl font-light leading-tight md:text-6xl">The Modern Icon</h1>
        <p class="mt-6 text-zinc-100">Experience the definitive edit of the season's most coveted pieces.</p>
        <div class="mt-8 flex gap-3">
          <button type="button" class="bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black">Shop New In</button>
          <button type="button" class="border border-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em]">Trending Now</button>
        </div>
      </div>
    </section>

    <section class="mb-16 border-b pb-6">
      <div class="flex flex-wrap items-center justify-center gap-8">
        @for (category of store.categories(); track category) {
          <button
            type="button"
            class="text-xs font-bold uppercase tracking-[0.2em]"
            [class.text-zinc-900]="category === store.activeCategory()"
            [class.text-zinc-400]="category !== store.activeCategory()"
            [class.border-b-2]="category === store.activeCategory()"
            [class.border-black]="category === store.activeCategory()"
            (click)="store.setCategory(category)"
            [attr.aria-pressed]="category === store.activeCategory()"
          >
            {{ category }}
          </button>
        }
      </div>
    </section>

    <section class="mb-16">
      <div class="mb-8 flex items-end justify-between">
        <div>
          <h2 class="text-3xl font-light">Designer Spotlight</h2>
          <p class="text-sm text-zinc-500">A curated selection from our favorite luxury houses.</p>
        </div>
        <a href="#" class="text-xs font-bold uppercase tracking-[0.2em] underline">View all brands</a>
      </div>
      <div class="grid gap-6 md:grid-cols-4">
        @for (item of store.spotlight(); track item.id) {
          <article class="group">
            <img [src]="item.image" [alt]="item.title" class="aspect-[3/4] w-full rounded object-cover" loading="lazy" />
            <p class="mt-3 text-[10px] font-bold uppercase tracking-[0.2em]">{{ item.brand }}</p>
            <p class="text-sm text-zinc-600">{{ item.title }}</p>
            <p class="mt-1 text-sm font-medium">{{ item.price | currency }}</p>
          </article>
        }
      </div>
    </section>

    @defer (on viewport) {
      <section class="mb-16 bg-zinc-100 px-6 py-10">
        <div class="grid grid-cols-2 gap-6 text-center md:grid-cols-6">
          @for (brand of brands; track brand) {
            <p class="text-lg opacity-70">{{ brand }}</p>
          }
        </div>
      </section>
    } @placeholder {
      <div class="mb-16 h-24 animate-pulse rounded bg-zinc-200"></div>
    }

    <section class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <h2 class="text-3xl font-light">New Season Arrivals</h2>
      <div class="flex items-center gap-4">
        <span class="text-[10px] font-bold uppercase tracking-[0.2em]">Sort by: newest first</span>
        <button class="bg-black px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white" type="button">Filter</button>
      </div>
    </section>

    <section class="mb-20 grid grid-cols-2 gap-6 lg:grid-cols-4">
      @for (item of store.sortedArrivals(); track item.id) {
        <article class="group">
          <div class="relative overflow-hidden rounded bg-zinc-100">
            <img [src]="item.image" [alt]="item.title" class="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105" />
            @if (item.badge) {
              <span class="absolute left-3 top-3 bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-[0.2em]">{{ item.badge }}</span>
            }
            <button
              type="button"
              class="absolute right-3 top-3 rounded-full bg-white p-1 text-xs"
              [attr.aria-label]="'Add ' + item.title + ' to bag'"
              (click)="addToBag(item.id)"
            >
              ❤
            </button>
          </div>
          <p class="mt-3 text-[10px] font-bold uppercase tracking-[0.2em]">{{ item.brand }}</p>
          <p class="text-xs text-zinc-600">{{ item.title }}</p>
          <p class="text-sm font-medium">{{ item.price | currency }}</p>
        </article>
      }
    </section>

    <section class="mx-auto mb-20 max-w-3xl border-t pt-16 text-center">
      <h3 class="text-xs font-bold uppercase tracking-[0.3em]">Stay Inspired</h3>
      <p class="mx-auto mt-5 max-w-xl text-3xl font-light">Receive early access to sales and exclusive fashion news.</p>
      <form class="mx-auto mt-8 flex max-w-xl border-b border-black" (submit)="$event.preventDefault()">
        <input
          [value]="email()"
          (input)="email.set(($event.target as HTMLInputElement).value)"
          type="email"
          placeholder="Your email address"
          aria-label="Your email address"
          class="w-full bg-transparent py-3 text-sm outline-none"
        />
        <button type="submit" [disabled]="!validEmail()" class="bg-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50">Sign Up</button>
      </form>
      <p class="mt-4 text-[10px] text-zinc-400">By signing up, you agree to our Terms & Conditions and Privacy Policy.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WomenPageComponent {
  protected readonly store = inject(WomenStore);
  private readonly cart = inject(CartService);

  protected readonly brands = ['BALENCIAGA', 'CHANEL', 'VALENTINO', 'VERSACE', 'LOEWE', 'GIVENCHY'];
  protected readonly email = signal('');
  protected readonly validEmail = computed(() => /.+@.+\..+/.test(this.email()));

  protected addToBag(id: string): void {
    this.cart.add(id);
  }
}
