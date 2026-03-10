import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CatalogItem } from '../../../core/models/catalog-item.model';

interface MensGalleryImage {
  readonly src: string;
  readonly alt: string;
}

interface MensLookItem {
  readonly brand: string;
  readonly title: string;
  readonly price: number;
  readonly image: string;
  readonly alt: string;
}

const MENS_GALLERY: ReadonlyArray<MensGalleryImage> = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWHmFb5KhKOmfAcGzeC2wUsam_sBPg7Tg1WZfJQPPhcb7fgNSA8oNQqu-7roYL_DcIYCIQH5qv-hK4DoRVsvYw8Yo0KR0IE-1Ec124eTrYUOhJdgw9ZqgOH0MHiqiP03qWgzKrWeWTznMxUABUAyBxIHr3f8a8lZTUMlTqbd5nwvnYyV9x65zvAKUrxbrNkCxGV8mg227pAS1cIgJLtotO94NMjd0u-SRs_2fNGGR8IOt-g4uW3Uqa3VHfZHqddlO0JM_fCSv4Wxqv',
    alt: 'Model wearing a designer leather jacket from front'
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClukboTECn2FaHd5NoFMomcLbZbLS6cxpqakNJ5U84F29P8kBJEfAmg8fufXw-IVYp3k5BHWlGn03WPAleWzS5l6Waadzh0nsVUPj2Gadox_TqmkTuvpqa1XXVDSvxIISIcImkIe2aWzZeCCgb_no4HX4hdki8Cd3mn2PjCqiRne4z9GwAkefCLUIxzULDNmPMbtOEpSnoQ7E5mSAFYus5X0WZIsJLGzThKLfCBJQfuOUpbiuO-lpTBpZxkWDLU2sXBsls8JQKr3YN',
    alt: 'Detail shot of jacket hardware and texture'
  }
];

const MENS_COMPLETE_LOOK: ReadonlyArray<MensLookItem> = [
  {
    brand: 'Saint Laurent',
    title: 'Slim-fit tailored trousers',
    price: 850,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWBpi7PE5iQGMZK04QSJyCkKpjWy60AAwirVbvgBqrESCnBXazzkQeFjAvCg4-zD8uRr2Nk7Sb-n1-CsaSx5U-SQdYtk0Ab6AXcvX4X3cD5Ufl_24dbhfTKDeNPej3ifkD_wrTJOfkHCix3MyMzLvr0M16_gwAVn_9Z-2HZcYOdECkGFuTOtm2aCIBLV061pE5qK6YrpiUruSW_DWydQjDLRgNQswAyMVKcLyKEKWm_nb0bx42SbWLT1OHe-rfUN2lsEa_1vMb4Cf1',
    alt: 'Model wearing slim fit black trousers'
  },
  {
    brand: 'Saint Laurent',
    title: 'Wyatt chelsea boots',
    price: 1150,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuClNGq8e8Pb91zIwBReUB1JQ2o2R1lTBC458-CauEen97jbjHh-ebni66HkjwRopEQoI8F2mSrtVxxZegZFx3KmNH28WC4NVK79Hd_cnza4TBDfIXQSbpjRQ79Hul8LNyzRLLjfwNRyewg_idbCEHHeV3HPK_a67IGj_g3swq_8BB6ubeoXMLrHS55ZMFFo-wFt0zLaZQ7lPkJyUxWM-I2wzxndA3qX1hWNc-DcTRK-MOSRqVzRJgFaZNeIUlg4bnI_WZ0F8rR88G2I',
    alt: 'Luxury black leather chelsea boots'
  },
  {
    brand: 'Saint Laurent',
    title: 'Classic crew neck t-shirt',
    price: 450,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB9PFZhslMdXHzNF3FVG85tEudF0AOK4L2htnwT_ZhdGPe68c4JxjKZzmMouj586WwcbXNx3Ar1vc31hrkK5MdEoYHbETGk9ZPWVYON3tlsr45t-D6eO3myfXYtKUgr3zLNUlVQFdaxVtQ0IAgn8b67BswiFq3yNfon0Z1y3yCX4w_xLbxFJ_lJjxP3ExWrvmmP7RIHlNdKmcMkqA9_FBr2VBg7bC5BXaMniLBHWQHKhDQLRgpKeXupuaDyvEcVqvCdXTZLGOdsW_pa',
    alt: 'High quality white cotton t-shirt'
  },
  {
    brand: 'Saint Laurent',
    title: 'Engraved silver ring',
    price: 295,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyKnLO4u0Ej4eCLNOqfpuzK5ysfXx450qd2b3XfSodPu4Q68-nfSxQym2X2QOUr6glomGAFKlVEjlxUHIiz7PVpc45xmtkZ3OFNegxw9f0c416go62wVjd2WRK7uhbTn7sOKY2_RkS00wmWUNLNVcPkJWYjjrHsXT1Kwx0VzmpzgZL1fL51x9-yr2QStzUU-THUl6kdXPk15LcBo1lY4vTh-70SxAYDjfmYCENtKyNxtKGDsi0Yf1sARN8MICBY10z6yYGaw0i0VTh',
    alt: 'Designer silver accessory'
  }
];

const MENS_SIZE_OPTIONS = ['44 IT', '46 IT - Last 1 left', '48 IT', '50 IT', '52 IT'] as const;

@Component({
  selector: 'app-mens-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <article class="space-y-12">
      <nav class="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        <span>Home</span>
        <span>/</span>
        <span>Menswear</span>
        <span>/</span>
        <span>Clothing</span>
        <span>/</span>
        <span class="font-bold text-zinc-900">Jackets</span>
      </nav>

      <section class="grid gap-10 lg:grid-cols-12">
        <div class="grid gap-4 lg:col-span-7 lg:grid-cols-2">
          <div class="lg:col-span-2 overflow-hidden bg-zinc-100">
            <img class="aspect-[3/4] h-full w-full object-cover" [src]="item().image" [alt]="item().title" />
          </div>
          @for (image of gallery; track image.src) {
            <div class="overflow-hidden bg-zinc-100">
              <img class="aspect-[3/4] h-full w-full object-cover" [src]="image.src" [alt]="image.alt" />
            </div>
          }
        </div>

        <div class="space-y-8 lg:col-span-5 lg:sticky lg:top-24 lg:h-fit">
          <section>
            <h2 class="text-3xl font-black uppercase tracking-tight">{{ item().brand }}</h2>
            <h1 class="mt-2 text-lg text-zinc-600">{{ item().title }}</h1>
            <p class="mt-4 text-2xl font-bold">{{ item().price | currency }}</p>
            <p class="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">Import duties included</p>
          </section>

          <section class="space-y-4">
            <div class="flex items-center justify-between">
              <label for="mens-size" class="text-xs font-semibold uppercase tracking-[0.2em]">Select Size (IT)</label>
              <span class="text-[10px] font-semibold uppercase tracking-[0.2em] underline underline-offset-4">Size Guide</span>
            </div>
            <select
              id="mens-size"
              class="w-full border border-zinc-300 bg-transparent px-4 py-4 text-sm outline-none"
              [value]="selectedSize()"
              (change)="onSizeChange($event)"
            >
              <option value="">Select size</option>
              @for (size of sizeOptions; track size) {
                <option [value]="size">{{ size }}</option>
              }
            </select>
            <div class="flex gap-4">
              <button
                type="button"
                class="flex-1 bg-black px-4 py-4 text-xs font-bold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90"
                (click)="addToBag()"
              >
                Add to Bag
              </button>
              <button
                type="button"
                class="w-14 border border-zinc-300 text-xl transition-colors hover:bg-zinc-50"
                (click)="toggleWishlist()"
                [attr.aria-label]="wishlist() ? 'Remove from wishlist' : 'Add to wishlist'"
              >
                {{ wishlist() ? 'Saved' : 'Save' }}
              </button>
            </div>
            <p class="text-center text-[10px] uppercase tracking-[0.2em] text-zinc-400">Estimated delivery: 2-4 business days</p>
          </section>

          <section class="space-y-6 border-t border-zinc-200 pt-6">
            <details class="group" open>
              <summary class="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.2em]">
                <span>The Details</span>
                <span class="transition-transform group-open:rotate-180">v</span>
              </summary>
              <div class="mt-4 space-y-4 text-sm leading-relaxed text-zinc-600">
                <p>{{ item().description }}</p>
                <ul class="list-disc space-y-1 pl-5">
                  <li>Black lambskin leather</li>
                  <li>Epaulettes, three zip pockets, snap-fastening flap pocket</li>
                  <li>Zip-fastening cuffs, fully lined</li>
                  <li>Asymmetric zip fastening</li>
                  <li>Made in Italy</li>
                </ul>
              </div>
            </details>
            <details class="group border-t border-zinc-200 pt-6">
              <summary class="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.2em]">
                <span>Composition & Care</span>
                <span class="transition-transform group-open:rotate-180">v</span>
              </summary>
              <div class="mt-4 space-y-2 text-sm text-zinc-600">
                <p><span class="font-semibold">Outer:</span> Lamb Skin 100%</p>
                <p><span class="font-semibold">Lining:</span> Cupro 60%, Cotton 40%</p>
                <p><span class="font-semibold">Washing instructions:</span> Specialist Cleaning</p>
              </div>
            </details>
            <details class="group border-t border-zinc-200 pt-6">
              <summary class="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.2em]">
                <span>About the Brand</span>
                <span class="transition-transform group-open:rotate-180">v</span>
              </summary>
              <p class="mt-4 text-sm italic leading-relaxed text-zinc-600">
                Founded in 1961, Saint Laurent pioneered luxury ready-to-wear and remains a defining house for modern Parisian tailoring.
              </p>
            </details>
          </section>
        </div>
      </section>

      <section class="border-t border-zinc-200 pt-12">
        <h3 class="text-center text-xs font-semibold uppercase tracking-[0.32em]">Complete the Look</h3>
        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (look of completeLook; track look.title) {
            <article class="group">
              <div class="relative mb-3 overflow-hidden bg-zinc-100">
                <img class="aspect-[3/4] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" [src]="look.image" [alt]="look.alt" />
              </div>
              <p class="text-[10px] font-semibold uppercase tracking-[0.18em]">{{ look.brand }}</p>
              <p class="mt-1 text-[11px] uppercase tracking-[0.08em] text-zinc-500">{{ look.title }}</p>
              <p class="mt-1 text-sm font-semibold">{{ look.price | currency }}</p>
            </article>
          }
        </div>
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MensProductDetailComponent {
  readonly item = input.required<CatalogItem>();
  private readonly cart = inject(CartService);

  protected readonly gallery = MENS_GALLERY;
  protected readonly completeLook = MENS_COMPLETE_LOOK;
  protected readonly sizeOptions = MENS_SIZE_OPTIONS;

  protected readonly selectedSize = signal<string>('');
  protected readonly wishlist = signal(false);

  protected onSizeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement | null)?.value ?? '';
    this.selectedSize.set(value);
  }

  protected addToBag(): void {
    this.cart.add(this.item().id);
  }

  protected toggleWishlist(): void {
    this.wishlist.update((value) => !value);
  }
}
