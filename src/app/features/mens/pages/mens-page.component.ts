import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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

interface MensCategory {
  readonly label: string;
  readonly image: string;
}

interface MensDesignerSpot {
  readonly eyebrow: string;
  readonly name: string;
  readonly image: string;
}


@Component({
  selector: 'app-mens-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, ProductCardComponent],
  template: `

    <!-- ─── Breadcrumb ──────────────────────────────────────────────────────── -->
    <nav class="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400 py-5 px-4 md:px-0" aria-label="Breadcrumb">
      <a routerLink="/" class="hover:text-black transition-colors duration-150">Home</a>
      <span class="text-zinc-300">/</span>
      <span class="text-black font-bold">Menswear</span>
    </nav>

    <!-- ─── Cinematic Hero ───────────────────────────────────────────────────── -->
    <section class="relative w-full aspect-[21/9] min-h-[420px] flex items-center overflow-hidden">
      <img
        [src]="lookbookImages[0].image"
        [alt]="lookbookImages[0].alt"
        class="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent"></div>
      <div class="relative z-10 px-6 md:px-20 max-w-2xl text-white">
        <p class="uppercase tracking-[0.3em] text-[10px] font-semibold mb-4 opacity-80">Exclusive Collection</p>
        <h2 class="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">The Modern<br/>Gentleman</h2>
        <p class="text-base md:text-lg font-light mb-8 max-w-md opacity-85 leading-relaxed">
          Discover the season's most coveted styles from world-class designers, curated for the discerning eye.
        </p>
        <div class="flex flex-wrap gap-4">
          <a routerLink="/menswear" class="bg-white text-black px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-colors">Shop New In</a>
          <button class="border border-white/70 text-white px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">Explore Brands</button>
        </div>
        <div class="mt-10 flex items-center gap-8">
          <div>
            <p class="text-3xl font-bold">{{ brandCount() }}</p>
            <p class="text-[10px] uppercase tracking-widest opacity-60 mt-1">Designer Houses</p>
          </div>
          <div class="w-px h-10 bg-white/20"></div>
          <div>
            <p class="text-3xl font-bold">{{ startingPrice() | currency : 'USD' : 'symbol' : '1.0-0' }}</p>
            <p class="text-[10px] uppercase tracking-widest opacity-60 mt-1">Entry Price</p>
          </div>
          <div class="w-px h-10 bg-white/20"></div>
          <div>
            <p class="text-3xl font-bold">{{ sortedMenswear().length }}</p>
            <p class="text-[10px] uppercase tracking-widest opacity-60 mt-1">Products Live</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Category Circles ─────────────────────────────────────────────────── -->
    <section class="py-14 px-4 md:px-10 bg-white">
      <div class="grid grid-cols-5 gap-4 md:gap-8 max-w-xl mx-auto">
        @for (cat of categories; track cat.label) {
          <a href="#" class="group flex flex-col items-center gap-3">
            <div class="w-full aspect-square rounded-full overflow-hidden bg-zinc-100">
              <img [src]="cat.image" [alt]="cat.label" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            </div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-center">{{ cat.label }}</span>
          </a>
        }
      </div>
    </section>

    <!-- ─── Designer Spotlight ───────────────────────────────────────────────── -->
    <section class="py-16 px-4 md:px-10">
      <div class="flex items-end justify-between mb-10 border-b border-zinc-200 pb-4">
        <h3 class="text-3xl font-bold">Designer Spotlight</h3>
        <a href="#" class="text-[10px] font-bold uppercase tracking-widest underline underline-offset-8 hover:text-zinc-400 transition-colors">View All Brands</a>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (spot of designerSpotlight; track spot.name) {
          <div class="relative group cursor-pointer overflow-hidden aspect-[4/5]">
            <img [src]="spot.image" [alt]="spot.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p class="text-[10px] tracking-[0.2em] uppercase mb-2 font-bold opacity-75">{{ spot.eyebrow }}</p>
              <h4 class="text-2xl font-bold tracking-tight">{{ spot.name }}</h4>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- ─── The Menswear Edit ────────────────────────────────────────────────── -->
    <section class="py-16 px-4 md:px-10 bg-white">
      <div class="flex items-end justify-between mb-10 border-b border-zinc-200 pb-4">
        <h3 class="text-3xl font-bold">The Menswear Edit</h3>
        <a href="#" class="text-[10px] font-bold uppercase tracking-widest underline underline-offset-8 hover:text-zinc-400 transition-colors">View All</a>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
        @for (item of sortedMenswear(); track item.id) {
          <app-product-card [item]="item" (addToBag)="addToBag($event)" />
        } @empty {
          <p class="col-span-4 py-12 text-sm text-zinc-400">No menswear items available yet.</p>
        }
      </div>
    </section>

    <!-- ─── Editorial Diptych ────────────────────────────────────────────────── -->
    <section class="py-20 px-4 md:px-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
        @for (story of storyTiles.slice(0, 2); track story.title) {
          <div class="relative group h-[560px] overflow-hidden cursor-pointer">
            <img [src]="story.image" [alt]="story.title" class="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 bg-black/35 flex flex-col justify-end p-10 md:p-12 text-white">
              <p class="text-[10px] tracking-[0.2em] uppercase mb-2 font-bold opacity-75">{{ story.label }}</p>
              <h4 class="text-3xl font-bold mb-4 tracking-tight leading-tight uppercase">{{ story.title }}</h4>
              <p class="mb-8 opacity-85 max-w-sm text-sm leading-relaxed">{{ story.description }}</p>
              <a href="#" class="text-[10px] font-bold uppercase tracking-widest border-b border-white self-start pb-1 hover:opacity-60 transition-opacity">Shop The Edit</a>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- ─── Complete the Look ────────────────────────────────────────────────── -->
    <!-- Top 4 aspirational picks from the real catalog — editorial card style, no CTA -->
    <section class="py-20 px-4 md:px-10 bg-zinc-50">
      <h2 class="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 text-center mb-12">Complete the Look</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        @for (item of completeTheLook(); track item.id; let i = $index) {
          <a [routerLink]="['/product', item.id]" class="group block">
            <div class="relative aspect-[3/4] overflow-hidden bg-zinc-200">
              <img
                [src]="item.image"
                [alt]="item.title"
                class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              @if (i === 0) {
                <span class="absolute top-3 left-3 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">Top Pick</span>
              }
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
            <div class="pt-4 space-y-1.5">
              <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{{ item.brand }}</p>
              <h5 class="text-sm font-light text-zinc-700 leading-snug">{{ item.title }}</h5>
              <p class="text-sm font-bold">{{ item.price | currency }}</p>
            </div>
          </a>
        }
      </div>
    </section>

    <!-- ─── Newsletter ───────────────────────────────────────────────────────── -->
    @defer (on viewport) {
      <section class="bg-zinc-900 py-20 px-4">
        <div class="max-w-2xl mx-auto text-center">
          <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">Stay in the Loop</p>
          <h3 class="text-3xl font-bold text-white mb-4">Menswear, First</h3>
          <p class="text-zinc-400 mb-10 text-sm leading-relaxed max-w-md mx-auto">
            Exclusive early access to sales, new arrivals and styling edits delivered straight to your inbox.
          </p>
          <form class="flex flex-col sm:flex-row gap-0" (submit)="$event.preventDefault()">
            <input
              type="email"
              class="flex-1 bg-transparent border border-white/20 border-r-0 px-6 py-4 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-white/50 transition-colors"
              placeholder="Enter your email address"
              [value]="email()"
              (input)="onEmailInput($event)"
              aria-label="Email address"
            />
            <button
              type="button"
              class="bg-white text-black px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-30 whitespace-nowrap"
              [disabled]="!isEmailValid()"
            >Subscribe</button>
          </form>
        </div>
      </section>
    } @placeholder {
      <div class="h-48 animate-pulse bg-zinc-200"></div>
    }

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MensPageComponent {
  protected readonly store = inject(HomeStore);
  private readonly cart = inject(CartService);

  protected readonly email = signal('');
  protected readonly isEmailValid = computed(() => /.+@.+\..+/.test(this.email()));

  protected onEmailInput(e: Event): void {
    this.email.set((e.target as HTMLInputElement)?.value ?? '');
  }

  protected readonly sortedMenswear = computed(() => [...this.store.menswear()].sort((a, b) => a.price - b.price));
  protected readonly brandCount = computed(() => new Set(this.store.menswear().map((item) => item.brand)).size);
  protected readonly startingPrice = computed(() => {
    const prices = this.store.menswear().map((item) => item.price);
    return prices.length ? Math.min(...prices) : 0;
  });
  // Top 4 most expensive items — aspirational cross-sell picks with guaranteed image URLs
  protected readonly completeTheLook = computed(() =>
    [...this.store.menswear()].sort((a, b) => b.price - a.price).slice(0, 4)
  );

  protected readonly lookbookImages = [
    {
      image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1400&q=80',
      alt: 'Mens luxury lookbook — clean monochrome layering'
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

  protected readonly categories: ReadonlyArray<MensCategory> = [
    { label: 'New In',      image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=200&h=200&q=80' },
    { label: 'Clothing',    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&h=200&q=80' },
    { label: 'Shoes',       image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&h=200&q=80' },
    { label: 'Accessories', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=200&h=200&q=80' },
    { label: 'Brands',      image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=200&h=200&q=80' },
  ];

  protected readonly designerSpotlight: ReadonlyArray<MensDesignerSpot> = [
    { eyebrow: 'New Season',           name: 'Gucci',      image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=720&q=80' },
    { eyebrow: 'Minimalist Aesthetic', name: 'Prada',      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&q=80' },
    { eyebrow: 'The Streetwear Icon',  name: 'Balenciaga', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=720&q=80' },
  ];

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
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80'
    },
    {
      label: 'Travel Ready',
      title: 'Smart sets for terminals and hotel lobbies',
      description: 'Performance layers, soft tailoring, and premium bags to keep style effortless in transit.',
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=900&q=80'
    }
  ];

  protected addToBag(id: string): void {
    this.cart.add(id);
  }
}
