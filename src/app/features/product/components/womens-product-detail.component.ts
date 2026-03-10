import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CatalogItem } from '../../../core/models/catalog-item.model';

interface WomensGalleryImage {
  readonly src: string;
  readonly alt: string;
}

interface WomensSuggestionItem {
  readonly brand: string;
  readonly title: string;
  readonly price: number;
  readonly image: string;
  readonly alt: string;
}

const WOMENS_GALLERY: ReadonlyArray<WomensGalleryImage> = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB47MBtUIRrT62AQ0B1-ouzK7sbb8t7aqsl1w2HEIIr3tw8zoOM1eLm_MZ9SP1EGx813FG6Hsua5Ztg-17cSOmy98Nlwx6QScO2jljwCV3IDkAlZq1HhjROt9mcPUKu_0higxAgVMLcm_LV5RycTwg6LVQBg_En414FIlDqlxSrEUX7xY1KprqJYhSgeyTiM2Z6IrQg5TgMfvXJ-A1Nwz-IyO-myFsqnLOBGjzkBN__qYVGPLhGwgWm3k_mKcpv-lk-D39D4_OQIxTm',
    alt: 'Luxury silk dress on model'
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVw6Sl9EpWP_EwZJHGjdo0HyaBlc69k6Kh6cozucByRvmBLZ-Oba8YsbynTrhDIn7BuZko9Kp8KvhlXi0I2cMTSMxlxbWDIkgNMueILme-iIHxGxjLvw_oFShpaAioV9zFU3v2hkVao9YY0dQg7MWzs2hqSSVTxL6-vebchYEXI75f5T0A5OFLIvp6iBrOFj5iGwttak0Sn7DPb5D4myZEp-u8JP-QWjVpqcczzxFrKV80ihTmdDZtOzhGxTrzXapSgJq7XhbqNyIQ',
    alt: 'Close up thumbnail of luxury dress'
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB393hoYj3m5c4ZDinQhLCRSTADEI__usbICTQpovV3IbUARCEjXhb-wbfzzBVZ4po2JWfQuWAtHPVDVkoyNv14filMpPxrNoawpNrGElY-8BNQZy2D5Xnr_ghDWmpLgWnum6TqRJ7wpEHCDLrdHtsuzZkhUHNlYeJv2UZIc1hUqblmB98ZKkMckIoH4_8DxY_GwqnLV8RQ7HXPk7Itk0uF6loZJCMvl__mZ0rf1y9P9OSWYsFIOEhEGW-Xge1Rcmt0ZKceQgMpMO99',
    alt: 'Back view of a luxury silk dress'
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC69m23WYKNhJFhaT1oy6hdgEkovObu3-xpAADpa6u2W-eVkiiWlg5PjK1K3Qs9KWKssmIYYcdwoxkZHsH2k3B2D6v0BGwgDPtsreKou01xv_Ame0vgzggaCPTSlq0kghAzv2lvPRCjk_inocx49F-trfRqE29YzmBcSuPiH6W48G78vf1RhZxQv7vuBq7jsUIHCKdva2a6tdUI2AZVmTVn54tWDIoFKOwXy9uHGW3YExzo681Qg4iU9Q8CBCD0NrxVdBwH3rdnTYLy',
    alt: 'Close up detail of fabric texture'
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU6iVQQTlBx7KmhAUFCVEp-0y2VmYSdtvjGOkBZpFcPwyt9tiS5z4f2iHiR1mK2EZu1FBtU5gQdT2a43efM5TzlM8g2YT_VEL5vocc1Iee4B3bYddHnASog2WSK9jxq2fCSO3JIDAbqCDk2auN-WSzNon0sGpKKtNgQhAn8s-D5rVBXPlrZ-mdtzBrx4mV4ZbxVJyB4WxM4nvJa1qMOGnUlL3MHDVtXPX7qLP2VRD9nqo1hlbpbLhSNN3HUvqLCp5W4u85g8FB0EfT',
    alt: 'Editorial lifestyle shot of luxury clothing'
  }
];

const WOMENS_YOU_MAY_LIKE: ReadonlyArray<WomensSuggestionItem> = [
  {
    brand: 'Prada',
    title: 'Triangle-logo leather pumps',
    price: 1150,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDIT7Aj37o7rwQGG8teoug01cjgJmkiOnVwQM7QXZygw1O0WwbOGlUHL938guekUhgYLz-bp1jjZQSiEnU7uYImPIro8e1eyffVGgmoyLLJi_8XaSTxfwL17QloIRFoO3SEWDdKBZ209OUq-xIyGUxD3qj4y8shbNlgZ8oo_PuJaOaPvThl37YtAb_bsYmHkfP2g-f4hSDJefOUWFWI2TN9LPbdq7Vqrr1MK6REvZCnHRv_1TfzeLGNQsJKBvRRGlD0RetvuGfaHG08',
    alt: 'Designer leather heels'
  },
  {
    brand: 'Prada',
    title: 'Cleo leather shoulder bag',
    price: 2850,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAV0-6E3BpF6ix09pIH2KalMHbVnNfOrW5ZYpT1-m9zxI8bk60IrmytR88jH2ze30YXHQ0jNaAFouJiw6xjLZv34Z6XCAMfz0gvfa2BVejBz845h1_mEsukDpcml3Pe4vGXH3F5yUW4fxe0LTdjEBcJRiwZoiy3_3BLaBPBAat3KJGLpQfxa_4kHz2JPJzotVx1m8uo7XCithkmjb90kJkoH0eG8Rdc8CfNNM7eB3htmIqh6aW609VCDGTbhAuA79HRLtleahAfSd3L',
    alt: 'Classic luxury leather handbag'
  },
  {
    brand: 'Prada',
    title: 'Embroidered poplin top',
    price: 950,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKQdRAykaG6XraK9IL07LugAsdK4WRSCiPHMtAgrDGHl3ngtw4Vxt0sqA2k3Y0BHonfJ_zX5hlw-LD2pkzeJZi1mNyje5tWGIYityA3xH4lTvL4NIsTVCLJv9XsMKRYgd1OpOBs66eHzE_QoLsehXHP-eZU9WZ7GBFbr_kzrS514xSCtAt276Ah7licI0m0QFSvoo2fLGH9IgJnIlE4m8dIjFPbNHYnH_lbSvzQqLgODO1RLhuzrbPwBOJoriWg6aFPWAnYsFjmJf5',
    alt: 'Luxury knit top'
  },
  {
    brand: 'Prada',
    title: 'Circled logo silk skirt',
    price: 1800,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC4UMwtJ_RfErKSLq0a6nMEdK1y3q9CPNM6EllWdfmavVm_G6gP4ZSqmaTcTpKvdyyymKTV4inN91I1ovWsRchDWe5po3Am7hQGjuV_J95hPV2VuhgrbOzZsZLS01F1c_aPpbPyTYxGFDKtPD3Qd-PhlNVf7vwn4MXdQmRhhTKcT6HR8RLcHwi2MmZpFy8MdZVLVM6vdH6lUrSX6PQ9bRHOcr7xZxB9Vgb2JUj6e570NT102x5jDkn8MyFIIiKQFhmRpfhZKdmvnZfe',
    alt: 'Silk midi skirt'
  }
];

const WOMENS_SIZES = ['38', '40', '42', '44'] as const;

@Component({
  selector: 'app-womens-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <article class="space-y-16 rounded-xl bg-zinc-100/70 p-4 md:p-8">
      <nav class="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        <span>Home</span>
        <span>/</span>
        <span>Women</span>
        <span>/</span>
        <span>Clothing</span>
        <span>/</span>
        <span>Dresses</span>
      </nav>

      <section class="grid gap-12 lg:grid-cols-12">
        <div class="flex flex-col gap-4 md:flex-row-reverse lg:col-span-7">
          <div class="flex-1 overflow-hidden rounded-lg bg-zinc-200">
            <img class="aspect-[3/4] h-full w-full object-cover" [src]="gallery[activeImage()].src" [alt]="gallery[activeImage()].alt" />
          </div>
          <div class="no-scrollbar flex gap-3 overflow-x-auto md:w-24 md:flex-col">
            @for (image of gallery; track image.src; let index = $index) {
              <button
                type="button"
                class="w-24 flex-shrink-0 overflow-hidden rounded border bg-zinc-200 md:w-full"
                [class.border-zinc-900]="activeImage() === index"
                [class.border-transparent]="activeImage() !== index"
                (click)="setActiveImage(index)"
                [attr.aria-label]="'Show image ' + (index + 1)"
              >
                <img class="aspect-[3/4] h-full w-full object-cover" [src]="image.src" [alt]="image.alt" />
              </button>
            }
          </div>
        </div>

        <div class="space-y-8 lg:col-span-5">
          <section>
            <p class="text-xs uppercase tracking-[0.3em] text-zinc-500">New Season</p>
            <h1 class="mt-2 text-4xl font-black uppercase tracking-tight">{{ item().brand }}</h1>
            <p class="mt-2 text-xl text-zinc-700">{{ item().title }}</p>
            <p class="mt-6 text-3xl font-bold">{{ item().price | currency }}</p>
            <p class="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Import duties included</p>
          </section>

          <section class="space-y-4">
            <div class="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em]">
              <span>Select size (IT)</span>
              <span class="underline underline-offset-4">Size guide</span>
            </div>
            <div class="grid grid-cols-4 gap-2">
              @for (size of sizes; track size) {
                <button
                  type="button"
                  class="border px-2 py-4 text-sm transition-colors"
                  [class.border-zinc-900]="selectedSize() === size"
                  [class.bg-zinc-900]="selectedSize() === size"
                  [class.text-white]="selectedSize() === size"
                  [class.border-zinc-300]="selectedSize() !== size"
                  [class.hover:border-zinc-900]="selectedSize() !== size"
                  (click)="selectedSize.set(size)"
                >
                  {{ size }}
                </button>
              }
            </div>
          </section>

          <section class="space-y-3">
            <button
              type="button"
              class="w-full rounded bg-black px-4 py-5 text-sm font-black uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-90"
              (click)="addToBag()"
            >
              Add to Bag
            </button>
            <button
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded border border-black px-4 py-5 text-sm font-black uppercase tracking-[0.22em] transition-colors hover:bg-black hover:text-white"
              (click)="toggleWishlist()"
            >
              <span>{{ wishlist() ? 'Saved' : 'Add to Wishlist' }}</span>
            </button>
          </section>

          <section class="space-y-5 border-t border-zinc-300 pt-7">
            <details class="group" open>
              <summary class="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.2em]">
                <span>The Details</span>
                <span class="transition-transform group-open:rotate-180">v</span>
              </summary>
              <div class="mt-4 space-y-4 text-sm leading-relaxed text-zinc-600">
                <p>{{ item().description }}</p>
                <ul class="list-disc space-y-1 pl-5">
                  <li>Black silk-georgette</li>
                  <li>Floral embroidery detail</li>
                  <li>Concealed rear zip fastening</li>
                  <li>Sleeveless design</li>
                  <li>Midi length</li>
                </ul>
              </div>
            </details>
            <details class="group border-t border-zinc-300 pt-5">
              <summary class="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.2em]">
                <span>Composition</span>
                <span class="transition-transform group-open:rotate-180">v</span>
              </summary>
              <div class="mt-4 text-sm text-zinc-600">
                <p><span class="font-semibold">Outer:</span> Silk 100%, Polyester 100%</p>
                <p><span class="font-semibold">Lining:</span> Viscose 100%</p>
                <p class="mt-2 italic">Washing instructions: Dry Clean Only</p>
              </div>
            </details>
            <details class="group border-t border-zinc-300 pt-5">
              <summary class="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.2em]">
                <span>Shipping & Returns</span>
                <span class="transition-transform group-open:rotate-180">v</span>
              </summary>
              <div class="mt-4 space-y-2 text-sm text-zinc-600">
                <p>Standard shipping: 3-5 business days. Express shipping available at checkout.</p>
                <p>Free returns within 14 days of receipt. Conditions apply.</p>
              </div>
            </details>
          </section>
        </div>
      </section>

      <section class="border-t border-zinc-300 pt-12">
        <div class="flex flex-col items-center gap-8 md:flex-row">
          <div class="h-44 w-44 flex-shrink-0 overflow-hidden rounded-full grayscale">
            <img
              class="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI2bgCM-iBykMwe6Zz0J1C9zSHI1vHz57yw348h9SHsadQQ-GG3P__j6Qqgvefx9qN8C_PqgzfI3xFiNyijpqq_g1s3RIxsKdRSjWZT7ZXSBmzDY1vwULdFVKta2xQLoBM5svUlKRXU3_iyPUnjVnssKy_qKYPPCEQ8NaotuMcpSWJ-H4BiiM6rjQQQztRdmPt5pYztYtuTo9NK01XrYsrhAwWrEanvBjoabBpI_wJ7tPAhhmmHx9_1BbIwUZRPnm2pwmtyytKv-F6"
              alt="Prada aesthetic"
            />
          </div>
          <div class="max-w-2xl">
            <p class="text-xs font-bold uppercase tracking-[0.3em]">The Designer</p>
            <h3 class="mt-3 text-3xl font-black uppercase">{{ item().brand }}</h3>
            <p class="mt-4 text-sm leading-relaxed text-zinc-600">
              Under the creative direction of Miuccia Prada and Raf Simons, the Milanese house continues to challenge conventional beauty.
            </p>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <div class="flex items-end justify-between">
          <h3 class="text-xs font-bold uppercase tracking-[0.3em]">You may also like</h3>
          <span class="text-xs font-semibold uppercase tracking-[0.2em] underline underline-offset-4">Shop {{ item().brand }}</span>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (suggestion of suggestions; track suggestion.title) {
            <article class="group">
              <div class="relative mb-3 overflow-hidden bg-zinc-200">
                <img
                  class="aspect-[3/4] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  [src]="suggestion.image"
                  [alt]="suggestion.alt"
                />
              </div>
              <p class="text-[10px] font-semibold uppercase tracking-[0.2em]">{{ suggestion.brand }}</p>
              <p class="mt-1 text-sm text-zinc-600">{{ suggestion.title }}</p>
              <p class="mt-1 text-sm font-semibold">{{ suggestion.price | currency }}</p>
            </article>
          }
        </div>
      </section>
    </article>
  `,
  styles: [
    `
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }

      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WomensProductDetailComponent {
  readonly item = input.required<CatalogItem>();
  private readonly cart = inject(CartService);

  protected readonly gallery = WOMENS_GALLERY;
  protected readonly suggestions = WOMENS_YOU_MAY_LIKE;
  protected readonly sizes = WOMENS_SIZES;

  protected readonly activeImage = signal(0);
  protected readonly selectedSize = signal<string>(WOMENS_SIZES[2]);
  protected readonly wishlist = signal(false);

  protected setActiveImage(index: number): void {
    this.activeImage.set(index);
  }

  protected addToBag(): void {
    this.cart.add(this.item().id);
  }

  protected toggleWishlist(): void {
    this.wishlist.update((value) => !value);
  }
}
