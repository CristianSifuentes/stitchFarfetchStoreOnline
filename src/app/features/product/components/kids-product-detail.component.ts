import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CatalogItem } from '../../../core/models/catalog-item.model';

interface KidsGalleryImage {
  readonly src: string;
  readonly alt: string;
}

interface KidsCompleteLookItem {
  readonly brand: string;
  readonly title: string;
  readonly price: number;
  readonly image: string;
  readonly alt: string;
}

const KIDS_GALLERY: ReadonlyArray<KidsGalleryImage> = [
  {
    src: 'https://images.unsplash.com/photo-1519238359922-989348752efb?auto=format&fit=crop&w=1200&q=80',
    alt: 'Kids trench coat front view'
  },
  {
    src: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=1200&q=80',
    alt: 'Kids trench coat back view'
  },
  {
    src: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1200&q=80',
    alt: 'Kids outfit editorial look'
  }
];

const KIDS_COMPLETE_LOOK: ReadonlyArray<KidsCompleteLookItem> = [
  {
    brand: 'Burberry Kids',
    title: 'Check Cotton Shirt',
    price: 290,
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80',
    alt: 'Kids check cotton shirt'
  },
  {
    brand: 'Burberry Kids',
    title: 'Stretch Cotton Trousers',
    price: 240,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',
    alt: 'Kids luxury trousers'
  },
  {
    brand: 'Burberry Kids',
    title: 'Vintage Check Sneakers',
    price: 380,
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80',
    alt: 'Kids premium sneakers'
  },
  {
    brand: 'Burberry Kids',
    title: 'Check Cashmere Scarf',
    price: 420,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=900&q=80',
    alt: 'Kids luxury check scarf'
  }
];

const KIDS_SIZES = ['3Y', '4Y', '5Y', '6Y', '7Y'] as const;

@Component({
  selector: 'app-kids-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <article class="space-y-12 rounded-xl bg-zinc-100/70 p-4 md:p-8">
      <nav class="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        <span>Home</span>
        <span>/</span>
        <span>Kids</span>
        <span>/</span>
        <span>Clothing</span>
        <span>/</span>
        <span class="font-bold text-zinc-900">Coats & Jackets</span>
      </nav>

      <section class="grid gap-8 lg:grid-cols-12">
        <div class="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          <div class="overflow-hidden bg-white sm:col-span-2">
            <img class="aspect-[3/4] h-full w-full object-cover" [src]="item().image" [alt]="item().title" />
          </div>
          @for (image of gallery; track image.src) {
            <div class="overflow-hidden bg-white">
              <img class="aspect-[4/5] h-full w-full object-cover" [src]="image.src" [alt]="image.alt" />
            </div>
          }
        </div>

        <div class="space-y-6 lg:col-span-4">
          <section>
            <p class="text-xs uppercase tracking-[0.28em] text-zinc-500">Burberry Kids</p>
            <h1 class="mt-2 text-4xl font-light tracking-tight">{{ item().title }}</h1>
            <p class="mt-4 text-3xl font-semibold">{{ item().price | currency }}</p>
          </section>

          <section class="space-y-4">
            <div class="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em]">
              <span>Select size (age)</span>
              <span class="underline underline-offset-4">Size guide</span>
            </div>
            <select
              class="w-full border border-zinc-300 bg-transparent px-4 py-4 text-sm outline-none"
              [value]="selectedSize()"
              (change)="onSizeChange($event)"
            >
              <option value="">Choose a size</option>
              @for (size of sizes; track size) {
                <option [value]="size">{{ size }}</option>
              }
            </select>
            <div class="flex gap-2">
              <button
                type="button"
                class="flex-1 bg-black px-4 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90"
                (click)="addToBag()"
              >
                Add to Bag
              </button>
              <button
                type="button"
                class="w-12 border border-zinc-300 text-lg transition-colors hover:bg-zinc-100"
                (click)="toggleWishlist()"
                [attr.aria-label]="wishlist() ? 'Remove from wishlist' : 'Add to wishlist'"
              >
                {{ wishlist() ? 'Saved' : 'Save' }}
              </button>
            </div>
          </section>

          <section class="space-y-4 border-t border-zinc-300 pt-6">
            <details class="group" open>
              <summary class="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.2em]">
                <span>Product Details</span>
                <span class="transition-transform group-open:rotate-180">v</span>
              </summary>
              <div class="mt-4 space-y-3 text-sm leading-relaxed text-zinc-600">
                <p>{{ item().description }}</p>
                <ul class="list-disc space-y-1 pl-5">
                  <li>Double-breasted closure</li>
                  <li>Signature check lining</li>
                  <li>Button-through welt pockets</li>
                  <li>Cotton gabardine shell and belt</li>
                  <li>Dry clean only</li>
                </ul>
              </div>
            </details>
            <details class="group border-t border-zinc-300 pt-4">
              <summary class="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.2em]">
                <span>Shipping & Returns</span>
                <span class="transition-transform group-open:rotate-180">v</span>
              </summary>
              <div class="mt-4 text-sm text-zinc-600">
                <p>Standard shipping: 3-5 business days. Free returns within 14 days.</p>
              </div>
            </details>
          </section>
        </div>
      </section>

      <section class="border-t border-zinc-300 pt-10">
        <h3 class="text-center text-xs font-semibold uppercase tracking-[0.32em]">Complete the Look</h3>
        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (item of completeLook; track item.title) {
            <article>
              <div class="mb-3 overflow-hidden bg-white">
                <img class="aspect-[3/4] h-full w-full object-cover" [src]="item.image" [alt]="item.alt" />
              </div>
              <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700">{{ item.brand }}</p>
              <p class="mt-1 text-sm text-zinc-600">{{ item.title }}</p>
              <p class="mt-1 text-sm font-semibold">{{ item.price | currency }}</p>
            </article>
          }
        </div>
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KidsProductDetailComponent {
  readonly item = input.required<CatalogItem>();
  private readonly cart = inject(CartService);

  protected readonly gallery = KIDS_GALLERY;
  protected readonly completeLook = KIDS_COMPLETE_LOOK;
  protected readonly sizes = KIDS_SIZES;

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
