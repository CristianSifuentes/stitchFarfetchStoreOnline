import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeStore } from '../../home/store/home.store';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';
import { CartService } from '../../../core/services/cart.service';

interface MensStoryTile {
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
}

@Component({
  selector: 'app-mens-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, ProductCardComponent],
  template: `
    <section class="relative overflow-hidden rounded-2xl bg-black text-white">
      <div class="grid gap-8 p-6 md:grid-cols-[1.15fr_1fr] md:p-10">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">Menswear Collection</p>
          <h1 class="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">Tailoring, Sneakers, and Icon Pieces</h1>
          <p class="mt-4 max-w-xl text-zinc-200">
            Explore elevated menswear from directional designers and legacy luxury houses, curated for daily rotation and statement moments.
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <a routerLink="/menswear" class="rounded bg-white px-5 py-3 text-sm font-semibold text-black">Shop all menswear</a>
            <span class="rounded-full bg-amber-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black">
              {{ sortedMenswear().length }} products live
            </span>
          </div>
          <dl class="mt-8 grid gap-3 sm:grid-cols-3">
            <div class="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
              <dt class="text-[10px] uppercase tracking-[0.2em] text-zinc-300">Designer Houses</dt>
              <dd class="mt-1 text-xl font-bold">{{ brandCount() }}</dd>
            </div>
            <div class="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
              <dt class="text-[10px] uppercase tracking-[0.2em] text-zinc-300">Entry Price</dt>
              <dd class="mt-1 text-xl font-bold">{{ startingPrice() | currency }}</dd>
            </div>
            <div class="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
              <dt class="text-[10px] uppercase tracking-[0.2em] text-zinc-300">Focus</dt>
              <dd class="mt-1 text-xl font-bold">Outerwear, Shoes, Tailoring</dd>
            </div>
          </dl>
        </div>

        <div class="grid grid-cols-2 gap-3">
          @for (look of lookbookImages; track look.image; let index = $index) {
            <figure class="overflow-hidden rounded-xl" [class.col-span-2]="index === 0">
              <img [src]="look.image" [alt]="look.alt" class="h-52 w-full object-cover md:h-full" loading="lazy" />
            </figure>
          }
        </div>
      </div>
    </section>

    <section class="mt-10">
      <div class="mb-4 flex items-end justify-between gap-4">
        <h2 class="text-2xl font-bold">Style by destination</h2>
        <p class="text-sm text-zinc-500">Editorial picks built around how and where you wear them.</p>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        @for (story of storyTiles; track story.title) {
          <article class="overflow-hidden rounded-xl bg-white shadow-sm">
            <img [src]="story.image" [alt]="story.title" class="h-44 w-full object-cover" loading="lazy" />
            <div class="p-4">
              <p class="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{{ story.label }}</p>
              <h3 class="mt-2 text-base font-semibold">{{ story.title }}</h3>
              <p class="mt-2 text-sm text-zinc-600">{{ story.description }}</p>
            </div>
          </article>
        }
      </div>
    </section>

    <section class="mt-10">
      <div class="mb-4">
        <h2 class="text-2xl font-bold">Complete menswear catalog</h2>
        <p class="mt-1 text-sm text-zinc-600">Expanded real-looking data for testing product grids and UX states.</p>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        @for (item of sortedMenswear(); track item.id) {
          <app-product-card [item]="item" (addToBag)="addToBag($event)" />
        } @empty {
          <p class="rounded-xl bg-white p-6 text-sm text-zinc-600">No menswear items available yet.</p>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MensPageComponent {
  protected readonly store = inject(HomeStore);
  private readonly cart = inject(CartService);

  protected readonly sortedMenswear = computed(() => [...this.store.menswear()].sort((a, b) => a.price - b.price));
  protected readonly brandCount = computed(() => new Set(this.store.menswear().map((item) => item.brand)).size);
  protected readonly startingPrice = computed(() => {
    const prices = this.store.menswear().map((item) => item.price);
    return prices.length ? Math.min(...prices) : 0;
  });

  protected readonly lookbookImages = [
    {
      image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80',
      alt: 'Mens luxury lookbook with clean monochrome layering'
    },
    {
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      alt: 'Street style menswear with tailored coat'
    },
    {
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=900&q=80',
      alt: 'Premium men fashion portrait in neutral tones'
    }
  ] as const;

  protected readonly storyTiles: ReadonlyArray<MensStoryTile> = [
    {
      label: 'Office to Evening',
      title: 'Tailored layers that transition seamlessly',
      description: 'Sharp blazers, lightweight knitwear, and versatile footwear built for long city days.',
      image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=900&q=80'
    },
    {
      label: 'Weekend City',
      title: 'Relaxed luxury with technical function',
      description: 'Statement sneakers, utility jackets, and elevated essentials designed for movement.',
      image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=900&q=80'
    },
    {
      label: 'Travel Ready',
      title: 'Smart sets for terminals and hotel lobbies',
      description: 'Performance layers, soft tailoring, and premium bags to keep style effortless in transit.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80'
    }
  ];

  protected addToBag(id: string): void {
    this.cart.add(id);
  }
}
