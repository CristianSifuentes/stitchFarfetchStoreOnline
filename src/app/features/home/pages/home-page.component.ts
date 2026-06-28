import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';
import { HomeStore } from '../store/home.store';
import { CartService } from '../../../core/services/cart.service';

interface HomeDesignerCard {
  readonly eyebrow: string;
  readonly name: string;
  readonly subtitle: string;
  readonly image: string;
}

interface HomeQuickLink {
  readonly label: string;
  readonly link: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  template: `

    <!-- ─── Department Selector ─────────────────────────────────────────────── -->
    <section class="pt-12 pb-10">
      <p class="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">SS24 Collection</p>
      <h2 class="text-center text-3xl font-light tracking-tight text-zinc-900 mb-10">Choose Your World</h2>
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

    <!-- ─── Brand Marquee (woman6) ────────────────────────────────────────────── -->
    <!-- Prestigious brand names in varied typographic treatments -->
    <section class="py-10 bg-zinc-100">
      <div class="grid grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center">
        @for (brand of marqueeBrands; track brand.name) {
          <span class="text-zinc-400 select-none" [class]="brand.cls">{{ brand.name }}</span>
        }
      </div>
    </section>

    <!-- ─── Category Quick-Links (woman6 + woman8) ───────────────────────────── -->
    <!-- Horizontal category nav that mirrors the women's section tab bar -->
    <section class="py-5 bg-white border-b border-zinc-200">
      <div class="flex overflow-x-auto no-scrollbar justify-center gap-8 md:gap-12 px-4">
        @for (cat of quickLinks; track cat.label) {
          <a
            [routerLink]="cat.link"
            class="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest text-zinc-400 pb-1 border-b-2 border-transparent hover:text-black hover:border-black transition-colors duration-200"
          >
            {{ cat.label }}
          </a>
        }
      </div>
    </section>

    <!-- ─── Featured Editorial ────────────────────────────────────────────────── -->
    <!-- Typography refined to font-light tracking-tight (woman6 editorial style) -->
    <section class="grid grid-cols-1 lg:grid-cols-2 items-center bg-white">
      <div class="p-8 md:p-16 space-y-6">
        <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">The Modern Muse</span>
        <h3 class="text-4xl md:text-6xl font-light tracking-tight leading-[1.08]">{{ store.heroTitle() }}</h3>
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

    <!-- ─── This Season's Designers (woman6 Designer Spotlight adapted for home) -->
    @defer (on viewport) {
      <section class="py-20">
        <div class="flex items-end justify-between mb-3">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">Curated for You</p>
            <h2 class="text-3xl font-light tracking-tight">This Season's Designers</h2>
          </div>
          <a routerLink="/womenswear" class="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-colors">View All Brands</a>
        </div>
        <p class="text-zinc-500 text-sm mb-10 max-w-xl">A curated selection from our most celebrated houses this season.</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          @for (card of designerCards; track card.name) {
            <a routerLink="/womenswear" class="group block">
              <div class="relative aspect-[3/4] overflow-hidden bg-zinc-100 mb-4">
                <img
                  [src]="card.image"
                  [alt]="card.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <!-- Subtle gradient on hover, editorial effect from woman6 -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <!-- Hover wishlist circle (woman1/2 pattern) -->
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
              <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{{ card.eyebrow }}</p>
              <h3 class="text-sm font-bold uppercase tracking-tight">{{ card.name }}</h3>
              <p class="text-xs font-light text-zinc-600 mt-0.5 line-clamp-1">{{ card.subtitle }}</p>
            </a>
          }
        </div>
      </section>
    } @placeholder {
      <div class="py-20">
        <div class="h-6 w-48 bg-zinc-200 animate-pulse mb-8 rounded"></div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          @for (n of [1,2,3,4]; track n) {
            <div class="aspect-[3/4] bg-zinc-100 animate-pulse rounded"></div>
          }
        </div>
      </div>
    }

    <!-- ─── Editors' Picks ────────────────────────────────────────────────────── -->
    <!-- Refined header treatment: eyebrow + font-light heading + subtitle (woman6) -->
    <section class="py-16">
      <div class="flex items-end justify-between mb-3">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">Handpicked</p>
          <h2 class="text-3xl font-light tracking-tight">Editors' Picks</h2>
        </div>
        <a routerLink="/womenswear" class="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-colors">View All</a>
      </div>
      <p class="text-zinc-500 text-sm mb-10 max-w-xl">The season's most coveted pieces, selected by our editorial team across every category.</p>
      <div class="grid gap-8 md:gap-10 grid-cols-2 md:grid-cols-3">
        @for (item of store.catalog(); track item.id) {
          <app-product-card [item]="item" (addToBag)="addToBag($event)" />
        }
      </div>
    </section>

    <!-- ─── Newsletter (woman6 "Stay Inspired" treatment) ────────────────────── -->
    @defer (on viewport) {
      <section class="border-t border-zinc-200 py-24">
        <div class="max-w-2xl mx-auto text-center">
          <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">Stay Inspired</p>
          <h3 class="text-3xl font-light tracking-tight mb-8">Receive early access to sales<br class="hidden md:block"/> and exclusive fashion news.</h3>
          <div class="flex flex-col sm:flex-row gap-0 border-b border-zinc-900">
            <input
              class="flex-1 bg-transparent border-none focus:ring-0 px-0 py-4 text-sm placeholder:text-zinc-400 outline-none"
              type="email"
              aria-label="Email address"
              [value]="email()"
              (input)="onEmailInput($event)"
              placeholder="Your email address"
            />
            <button
              class="bg-black text-white px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-40 whitespace-nowrap"
              [disabled]="!isEmailValid()"
            >
              Sign Up
            </button>
          </div>
          <p class="text-[10px] text-zinc-400 mt-6 leading-relaxed">
            By signing up, you agree to our Terms &amp; Conditions and Privacy Policy. You can unsubscribe at any time.
          </p>
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

  // Brand marquee with varied typographic treatments (woman6 pattern)
  protected readonly marqueeBrands: ReadonlyArray<{ name: string; cls: string }> = [
    { name: 'BALENCIAGA', cls: 'text-sm font-bold tracking-tighter italic' },
    { name: 'CHANEL',     cls: 'text-sm font-bold tracking-[0.25em]' },
    { name: 'VALENTINO',  cls: 'text-sm font-light tracking-tight' },
    { name: 'VERSACE',    cls: 'text-sm font-bold tracking-tighter italic' },
    { name: 'LOEWE',      cls: 'text-sm font-bold tracking-[0.25em]' },
    { name: 'GIVENCHY',   cls: 'text-sm font-light tracking-tight' },
  ] as const;

  // Category quick-links bar (woman6 + woman8 pattern)
  protected readonly quickLinks: ReadonlyArray<HomeQuickLink> = [
    { label: 'Dresses',     link: '/womenswear' },
    { label: 'Bags',        link: '/womenswear' },
    { label: 'Shoes',       link: '/womenswear' },
    { label: 'Accessories', link: '/womenswear' },
    { label: 'Jewelry',     link: '/womenswear' },
    { label: 'New In',      link: '/womenswear' },
    { label: 'Menswear',    link: '/menswear' },
  ] as const;

  // Designer spotlight cards — images from the tested women's catalog set
  protected readonly designerCards: ReadonlyArray<HomeDesignerCard> = [
    {
      eyebrow: 'New Season',
      name: 'Bottega Veneta',
      subtitle: 'Small Hop leather tote bag',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCK9tvZb8DIlZZ596qgNZr6j2If5tPRSbNNv-BHtnHfJWCGlA_GpebK7NuKE2Bta5ygKYUU9eVzB321r6wjbxliV27Dx5tQpvZZIa3rhBM4RcR4m8sr5RjDrDLizQTqXh_YReyUXWrzR4H1uzOzUV0Y-kLGuop3EyfPtNXHOUtQypim3lui4ViEWdh4ra_SgUtA-hse2geLF7BxQmrwBTd-csoUravNYKoc1R0KdNgKPhTwuRR_0utd4HStznN0nvGUAXWpRb43ur-z'
    },
    {
      eyebrow: 'Editorial Pick',
      name: 'Loewe',
      subtitle: 'Flamenco Clutch Mini',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDJmyBaanlSSnxDZEU56wIX087pj3AXJVdwlN5zgXEzXbu4qeZJHNqdksrm-dOQuMNcs9GOky-bxHRKR2VsICmCNTJfte5Sz86cDYl67jfZIUStSX2kzUmPhOUuL2W2iOqboYQN08C1FSgxbDQS_ZJk0OMYPsmwuvnm9gNnPDWwo8Cv64B6DN0l_a_7hjLlnY8KaPkqFDRZHYBTUqEAtk8PCAlamaNamIc1Vs8tb_Dl8h_VoJc81pehq4Mi2VO2WPhxCFScqw4f4cWr'
    },
    {
      eyebrow: 'The Draped Edit',
      name: 'Jacquemus',
      subtitle: 'La Robe Bahia draped dress',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuArpgiGPzZWNJJJRsORSS_hcMLKNLZV2jPP7FEhk39fS5jWr75M-ihVlLL8rZeD_ZSxPJVKi64QC4F5sdoz_Es0YVNdiSGlROOo2pyiq56Ug_v68RKy-4Xqj88M0oqHQ-t7KQvjWpHEKHplkEcQKHteyYsnZVK4jlnlW5CkxWSXXkZK6eP2qkB-LBzrIFYDp5VDVGqie1nC3hWj5lM9b2FRXM1a9LwNCC5QQzMiaEGRuVFJ1cXA7kAK8i8wHMDvJAV24JwmG0wkTjpQ'
    },
    {
      eyebrow: 'Investment Piece',
      name: 'Max Mara',
      subtitle: 'Ludmilla double-faced cashmere coat',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCtoF3ACq2N1z_klje9nL5W31z6hRfTB2Z-tl3IT-1TGLRrML6od0hNX1170ljwhj1m0YgvQ5ECnkYUIJDJmla-Vcw4subv71_Ha3qkLb9AvY_p4RE2ThTfI88K9Df-d8xQ3UIqDkudYPXWNS8DnOvkKo7YEqSOtfzVnR-YVvm3R31eG48Uz0gxkWIh1UBwI9m7kQHtmI8cgCzCDehW1GIhct5T1RFGBFZs6LnU_j5Nk6UeFnN8MjVIftTam9qBbvs3-NymPwOp6-3D'
    },
  ] as const;

  protected addToBag(id: string): void {
    this.cart.add(id);
  }

  protected onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement | null)?.value ?? '');
  }
}
