import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeStore } from '../../home/store/home.store';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';
import { CartService } from '../../../core/services/cart.service';

interface KidsStoryTile {
  readonly tag: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
}

@Component({
  selector: 'app-kids-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, ProductCardComponent],
  template: `
    <section class="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm md:p-10">
      <div class="grid items-center gap-8 md:grid-cols-[1.1fr_1fr]">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-orange-600">Kidswear Edit</p>
          <h1 class="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">Mini Icons, Major Style</h1>
          <p class="mt-4 max-w-xl text-zinc-600">
            Discover premium essentials for infants, kids, and juniors with standout silhouettes, premium materials, and playful details.
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <a routerLink="/kids" class="rounded bg-black px-5 py-3 text-sm font-semibold text-white">Shop all kidswear</a>
            <span class="rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">
              {{ sortedKidswear().length }} looks available
            </span>
          </div>
          <dl class="mt-8 grid gap-3 sm:grid-cols-3">
            <div class="rounded-lg bg-zinc-100 p-3">
              <dt class="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Luxury Brands</dt>
              <dd class="mt-1 text-xl font-bold">{{ brandCount() }}</dd>
            </div>
            <div class="rounded-lg bg-zinc-100 p-3">
              <dt class="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Price From</dt>
              <dd class="mt-1 text-xl font-bold">{{ startingPrice() | currency }}</dd>
            </div>
            <div class="rounded-lg bg-zinc-100 p-3">
              <dt class="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Categories</dt>
              <dd class="mt-1 text-xl font-bold">Outerwear, Shoes, Sets</dd>
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
        <h2 class="text-2xl font-bold">Shop by moment</h2>
        <p class="text-sm text-zinc-500">Handpicked outfits for everyday luxury.</p>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        @for (story of storyTiles; track story.title) {
          <article class="overflow-hidden rounded-xl bg-white shadow-sm">
            <img [src]="story.image" [alt]="story.title" class="h-44 w-full object-cover" loading="lazy" />
            <div class="p-4">
              <p class="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{{ story.tag }}</p>
              <h3 class="mt-2 text-base font-semibold">{{ story.title }}</h3>
              <p class="mt-2 text-sm text-zinc-600">{{ story.description }}</p>
            </div>
          </article>
        }
      </div>
    </section>

    <section class="mt-10">
      <div class="mb-4">
        <h2 class="text-2xl font-bold">Complete kidswear catalog</h2>
        <p class="mt-1 text-sm text-zinc-600">Real products with stronger visuals for testing your grid and UX states.</p>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        @for (item of sortedKidswear(); track item.id) {
          <app-product-card [item]="item" (addToBag)="addToBag($event)" />
        } @empty {
          <p class="rounded-xl bg-white p-6 text-sm text-zinc-600">Kids catalog is loading. Please refresh in a moment.</p>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KidsPageComponent {
  protected readonly store = inject(HomeStore);
  private readonly cart = inject(CartService);

  protected readonly sortedKidswear = computed(() => [...this.store.kidswear()].sort((a, b) => a.price - b.price));
  protected readonly brandCount = computed(() => new Set(this.store.kidswear().map((item) => item.brand)).size);
  protected readonly startingPrice = computed(() => {
    const prices = this.store.kidswear().map((item) => item.price);
    return prices.length ? Math.min(...prices) : 0;
  });

  protected readonly lookbookImages = [
    {
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1200&q=80',
      alt: 'Kids fashion lookbook with bright and playful colors'
    },
    {
      image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=900&q=80',
      alt: 'Child wearing premium neutral-toned outfit'
    },
    {
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80',
      alt: 'Kid streetwear fashion portrait with luxury sneakers'
    }
  ] as const;

  protected readonly storyTiles: ReadonlyArray<KidsStoryTile> = [
    {
      tag: 'School Days',
      title: 'Polished uniforms and weather-ready layers',
      description: 'Tailored coats, durable knits, and premium shoes that stay sharp from morning classes to after-school plans.',
      image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=900&q=80'
    },
    {
      tag: 'Weekend Trips',
      title: 'Travel sets designed for comfort and style',
      description: 'Coordinated tracksuits, lightweight puffer jackets, and accessories made for city walks and airport days.',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
    },
    {
      tag: 'Celebration Looks',
      title: 'Statement pieces for birthdays and events',
      description: 'Playful dresses, mini tailoring, and signature sneakers to build standout looks for special occasions.',
      image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80'
    }
  ];

  protected addToBag(id: string): void {
    this.cart.add(id);
  }
}