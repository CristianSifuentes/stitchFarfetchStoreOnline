import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CatalogItem } from '../../../core/models/catalog-item.model';

type WomensCategory = 'all' | 'dresses' | 'bags' | 'shoes' | 'accessories' | 'jewelry' | 'knitwear';
type WomensProductCategory = Exclude<WomensCategory, 'all'>;
type WomensSort = 'newest' | 'price-high' | 'price-low';

interface WomensCategoryTab {
  readonly key: WomensProductCategory;
  readonly label: string;
}

interface WomensProduct {
  readonly id: string;
  readonly brand: string;
  readonly title: string;
  readonly price: number;
  readonly image: string;
  readonly alt: string;
}

interface WomensArrivalItem extends WomensProduct {
  readonly category: WomensProductCategory;
  readonly dropRank: number;
  readonly badge?: string;
}

const WOMENS_CATEGORY_TABS: ReadonlyArray<WomensCategoryTab> = [
  { key: 'dresses', label: 'Dresses' },
  { key: 'bags', label: 'Bags' },
  { key: 'shoes', label: 'Shoes' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'jewelry', label: 'Jewelry' },
  { key: 'knitwear', label: 'Knitwear' }
];

const DESIGNER_SPOTLIGHT_ITEMS: ReadonlyArray<WomensProduct> = [
  {
    id: 'spot-prada-cleo',
    brand: 'Prada',
    title: 'Cleo brushed leather shoulder bag',
    price: 2950,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAe0eyKnWP8522SkzfSUfHeCAs5ri0HtCqttcfJkHPesbB5y1795iZuPR6-u5UQB3cK1Ltp_61GBcLjPkEmuEpmAaNSmAdCoiYyqvz7tgvCSpqwXUIGNj47ytqM-Au0ZvM_DGv7O0eUyJv5_-MLBHte1vS_9xI19xLL3yyuufhGtiQYXdb3toQHgSgA_Pm84y6PZxcyETsQZIDgMDth_tSqZPUBBNT46KvhI7zeVlQSZqF8kuUVmNB8Pv_0grjowmvJDAmnQIIB7BI',
    alt: 'Prada designer product shot luxury bag'
  },
  {
    id: 'spot-gucci-dress',
    brand: 'Gucci',
    title: 'GG-logo silk midi dress',
    price: 3400,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDiOethxgP7Tg57IxteGprRzx1tjn3JtPyg1opNmmOUL5wWs7MQjI9OvVVEa2lMDq0ALkqiRbmcgE-_J9NDuvv4Xq2ymLwoam5s9jj7OfTDPJCJ2ciGR2FXnlsDfo1ju-lyT5SE9aYszQBJw2l31widKZJxhZkw5ui6qcOgvLdoGLVPfkT285VpVWoLice3AsboZseUv2iAGqxeT7B3gx-vwPafYbFt1pelgPsCDlEfFY7hveHaIp1UF8muaQbILvuic55cC49cPLtV',
    alt: 'Gucci luxury silk dress on model'
  },
  {
    id: 'spot-ysl-pumps',
    brand: 'Saint Laurent',
    title: 'Cassandre 110mm leather pumps',
    price: 1150,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKKwsuPeCSRaqNetJxEUtEds1Bagz8Aopa5dhxzWN0F2g4YL2LYo40grqq58x71-HuWNXrgHo8hG0bYxjbkLxFYT6o3WZJB8bwUKvlhlMPeST-CzqAJ6gniaWX9UHuvmYZjKbXgbkHUn0toJQdbaEGDZMamWha4SjnGnBPxHtuXCsg1ckDn5eqzh4VATEbmbE3KGqdUFD3_ksJRPJ2vHxKEX9-QAKTl-UImsaD5Kp19250qgvC0_eOzAOiUtbBTbXyK2ybl6QIOFT9',
    alt: 'Saint Laurent high heels luxury shoes'
  },
  {
    id: 'spot-burberry-trench',
    brand: 'Burberry',
    title: 'The Kensington Heritage trench coat',
    price: 2490,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACZWcobiyLhm4X4tmJhoLqPf0XigINm_Vy8F9qOKI4yOnjUGY9Ih1J8hxm0XfA2uYDgcw-IiyNMYc2DnPd7C9Oltu_oecS3NVikUJf8UsqDVgItPBw_zCrMWjmw8ott5NzzS_WtULPFC4S5OKDCZ0o-ggPA1HT46-0jy76D29P9W1PeVhkJS42aGPruBcdasTLWpbwPhBiquUgjJRgzbI0XK7zh4jlQhTTDnZm-t_BQuweLwsbCixigNK3M06q11dGZSBxfeq9ghbr',
    alt: 'Burberry classic trench coat'
  }
];

const NEW_SEASON_ARRIVALS: ReadonlyArray<WomensArrivalItem> = [
  {
    id: 'arr-bottega-hop',
    brand: 'Bottega Veneta',
    title: 'Small Hop leather tote bag',
    price: 4100,
    category: 'bags',
    dropRank: 8,
    badge: 'New Season',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCK9tvZb8DIlZZ596qgNZr6j2If5tPRSbNNv-BHtnHfJWCGlA_GpebK7NuKE2Bta5ygKYUU9eVzB321r6wjbxliV27Dx5tQpvZZIa3rhBM4RcR4m8sr5RjDrDLizQTqXh_YReyUXWrzR4H1uzOzUV0Y-kLGuop3EyfPtNXHOUtQypim3lui4ViEWdh4ra_SgUtA-hse2geLF7BxQmrwBTd-csoUravNYKoc1R0KdNgKPhTwuRR_0utd4HStznN0nvGUAXWpRb43ur-z',
    alt: 'Luxury shoulder bag black leather'
  },
  {
    id: 'arr-loewe-flamenco',
    brand: 'Loewe',
    title: 'Flamenco Clutch Mini',
    price: 2250,
    category: 'bags',
    dropRank: 7,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDJmyBaanlSSnxDZEU56wIX087pj3AXJVdwlN5zgXEzXbu4qeZJHNqdksrm-dOQuMNcs9GOky-bxHRKR2VsICmCNTJfte5Sz86cDYl67jfZIUStSX2kzUmPhOUuL2W2iOqboYQN08C1FSgxbDQS_ZJk0OMYPsmwuvnm9gNnPDWwo8Cv64B6DN0l_a_7hjLlnY8KaPkqFDRZHYBTUqEAtk8PCAlamaNamIc1Vs8tb_Dl8h_VoJc81pehq4Mi2VO2WPhxCFScqw4f4cWr',
    alt: 'Luxury sunglasses portrait'
  },
  {
    id: 'arr-jacquemus-bahia',
    brand: 'Jacquemus',
    title: 'La Robe Bahia draped dress',
    price: 745,
    category: 'dresses',
    dropRank: 6,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuArpgiGPzZWNJJJRsORSS_hcMLKNLZV2jPP7FEhk39fS5jWr75M-ihVlLL8rZeD_ZSxPJVKi64QC4F5sdoz_Es0YVNdiSGlROOo2pyiq56Ug_v68RKy-4Xqj88M0oqHQ-t7KQvjWpHEKHplkEcQKHteyYsnZVK4jlnlW5CkxWSXXkZK6eP2qkB-LBzrIFYDp5VDVGqie1nC3hWj5lM9b2FRXM1a9LwNCC5QQzMiaEGRuVFJ1cXA7kAK8i8wHMDvJAV24JwmG0wkTjpQ',
    alt: 'Floral luxury dress on hanger'
  },
  {
    id: 'arr-amina-begum',
    brand: 'Amina Muaddi',
    title: 'Begum 95mm glass slingbacks',
    price: 1020,
    category: 'shoes',
    dropRank: 5,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAulmPEIVLeWu0wKFDCO_oKSXVdE_10QByH6LTPAircwU_TNPdm7dVyZ01xj6HiXOn5y4a2imVD5Z8wlAJMzwBmmIruW20pVY0seJZIDnQQuVmb_GNNuPd-1BgcIzzvYxhwKMZFvZtdriHShCLnpCM04bFY8wMDKqmpSEj3edvUbue9O_s1g46eGcyX4UOcj8P6sWiLJtgiOqtuIO4RmG2n56BSMaLDOJw2Q4hf-TQucQJ8VNNPypnHc9alSWx9hQqCCBisi2fTyzQ',
    alt: 'Statement high fashion heels'
  },
  {
    id: 'arr-cartier-tank',
    brand: 'Cartier',
    title: 'Tank Must small model watch',
    price: 3300,
    category: 'jewelry',
    dropRank: 4,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDPLP--luso4OgfG3eAv7iuizPo254WQxkBhCtZeGWK_Kp6c_QlNEpw5lINh6rZZGnOFIevoKMjrr7uxTg1J77l_JcUDpzRGBT9BzrA-jPz3DRQz7S6WqnktAHnuTZXrnYakhrvhybiy6XB3rV1DzNi1zlX9pQlkb9bncpSV9LokKx86kz_8z4bvwJ-YBpRD8cWzjqIdlztGBRJg3izIiG4D9qCQO_t4Tpy-Dkc1Ng0S3eWqAxKjDwpOi1LGXfpWbSvGGQ5byBPOQWj',
    alt: 'Luxury watch minimalist shot'
  },
  {
    id: 'arr-miumiu-cardigan',
    brand: 'Miu Miu',
    title: 'Cashmere cardigan jacket',
    price: 2150,
    category: 'knitwear',
    dropRank: 3,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjW-ASYoMi3S6nbJkKiMfpg7C58B2s5YhvDTl9TF4PDbytrSZWGjJKuoKRIVPA-epRRw7wSIunppuB-F0s5pCN9s3TPsa3Fp8NhQCSZUf16akSkN0dbz1M5Icx2Ih79oKc7KqOWXGkAfkYnsD14TA4RGhHY-Odjw_IMbjbsrTEdHjvTJ5wRc6EPlvELUufBml9WSBFJSHlu7pEwunqDBZiZbGARQwVFX6rwTURy0jZWA7eyG0GHPL5tHDmanhmNUY9kmbGA7A1VoTU',
    alt: 'Luxury black t-shirt premium'
  },
  {
    id: 'arr-therow-margaux',
    brand: 'The Row',
    title: 'Margaux 15 leather tote',
    price: 4390,
    category: 'bags',
    dropRank: 2,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVzVohpXIspkri8vF-02XFtxdRygqfJwfX5d1YRmZskRmEU_6I8wnpLEztm29MbU3dwD0_Gu_IW5gqdNCwln-vBht8Jd1SdA06XKpoNSDjm62aVht97PgcXDupthxBYFiAimckKKGon8Dp4HFYX-SYQoR4QbLN9CI06ubMPq0Yih44pG34Prx-8rjkb_vihGJO4x5d41aCmselUHwYF9pNmTlE-zZJKzNt42ugbpoYsJEaeATgPIor6xUdFIpbDXaLoXep5MaV5qHo',
    alt: 'Luxury white silk blouse'
  },
  {
    id: 'arr-maxmara-ludmilla',
    brand: 'Max Mara',
    title: 'Ludmilla double-faced cashmere coat',
    price: 6850,
    category: 'accessories',
    dropRank: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCtoF3ACq2N1z_klje9nL5W31z6hRfTB2Z-tl3IT-1TGLRrML6od0hNX1170ljwhj1m0YgvQ5ECnkYUIJDJmla-Vcw4subv71_Ha3qkLb9AvY_p4RE2ThTfI88K9Df-d8xQ3UIqDkudYPXWNS8DnOvkKo7YEqSOtfzVnR-YVvm3R31eG48Uz0gxkWIh1UBwI9m7kQHtmI8cgCzCDehW1GIhct5T1RFGBFZs6LnU_j5Nk6UeFnN8MjVIftTam9qBbvs3-NymPwOp6-3D',
    alt: 'Premium wool coat grey'
  }
];

@Component({
  selector: 'app-womens-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <section class="mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-zinc-400">
      <a routerLink="/" class="transition-colors hover:text-zinc-900">Home</a>
      <span>/</span>
      <span class="text-zinc-900">Women</span>
    </section>

    <section class="relative mb-14 overflow-hidden rounded-2xl bg-zinc-900 text-white">
      <img
        class="absolute inset-0 h-full w-full object-cover opacity-90"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjaLgmMaSJovV9Ieb50yQtDYIOY2HMVUWIvsFa5O-9RMpCllP9crxEAsRLkXY-lI_TbDIeoT4p_e_FHTnFiQp3DcaPlOk0z6YL8VB2vsgMVvfla0-lIG1vHBHj8gKWm-cNs0knGbPLW2GiGZNe1m8LkFHEHk5ePMsYrXUBFEjFARs6I1ESjj66-Xq0tZJW4WgJA_RxZYYcrraVFjy0orhjkb0fnDHyrhAYpxQ5bkzUhZSVQdZdO9ljeIojmkJ7jgjQltiZtVYEu64o"
        alt="Editorial high fashion photography of a woman in luxury couture"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent"></div>
      <div class="relative z-10 flex min-h-[19rem] flex-col justify-center p-6 md:min-h-[28rem] md:p-12">
        <p class="text-[10px] font-semibold uppercase tracking-[0.34em] text-zinc-100 md:text-xs">SS24 Collection</p>
        <h1 class="mt-3 max-w-2xl text-4xl font-light tracking-tight md:text-6xl">The Modern Icon</h1>
        <p class="mt-4 max-w-lg text-sm text-zinc-200 md:text-base">
          Experience the definitive edit of the season's most coveted pieces from world-leading designers.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            class="border border-white bg-white px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-transparent hover:text-white"
          >
            Shop New In
          </button>
          <button
            type="button"
            class="border border-white/85 bg-transparent px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black"
          >
            Trending Now
          </button>
        </div>
      </div>
    </section>

    <section class="mb-16 border-b border-zinc-200 pb-5">
      <div class="flex flex-wrap items-center gap-x-8 gap-y-3">
        @for (tab of categoryTabs; track tab.key) {
          <button
            type="button"
            class="border-b pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
            [class.border-black]="selectedCategory() === tab.key"
            [class.text-black]="selectedCategory() === tab.key"
            [class.border-transparent]="selectedCategory() !== tab.key"
            [class.text-zinc-400]="selectedCategory() !== tab.key"
            (click)="setCategory(tab.key)"
          >
            {{ tab.label }}
          </button>
        }
        <button
          type="button"
          class="border-b pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
          [class.border-black]="selectedCategory() === 'all'"
          [class.text-black]="selectedCategory() === 'all'"
          [class.border-transparent]="selectedCategory() !== 'all'"
          [class.text-zinc-400]="selectedCategory() !== 'all'"
          (click)="setCategory('all')"
        >
          All
        </button>
      </div>
    </section>

    <section class="mb-20">
      <div class="mb-7 flex items-end justify-between gap-4">
        <div>
          <h2 class="text-3xl font-light tracking-tight">Designer Spotlight</h2>
          <p class="mt-1 text-sm text-zinc-500">A curated selection from our favorite luxury houses.</p>
        </div>
        <button type="button" class="border-b border-black pb-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
          View All Brands
        </button>
      </div>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        @for (item of spotlightItems; track item.id) {
          <article class="group">
            <div class="relative mb-4 aspect-[3/4] overflow-hidden bg-zinc-200">
              <img [src]="item.image" [alt]="item.alt" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <button
                type="button"
                class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-sm transition hover:bg-white"
                (click)="toggleFavorite(item.id)"
                [attr.aria-label]="isFavorite(item.id) ? 'Remove from wishlist' : 'Add to wishlist'"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24" [attr.fill]="isFavorite(item.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8">
                  <path d="M12.1 21.35 10 19.3C5 14.65 2 11.85 2 8.4 2 5.6 4.2 3.4 7 3.4c1.6 0 3.2.75 4.2 1.95 1-1.2 2.6-1.95 4.2-1.95 2.8 0 5 2.2 5 5 0 3.45-3 6.25-8 10.9l-2.3 2.05Z"></path>
                </svg>
              </button>
            </div>
            <h3 class="text-[10px] font-bold uppercase tracking-[0.2em]">{{ item.brand }}</h3>
            <p class="mt-1 line-clamp-1 text-xs text-zinc-600">{{ item.title }}</p>
            <p class="mt-2 text-sm font-medium">{{ item.price | currency }}</p>
            <a
              class="mt-2 inline-block text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-700 underline underline-offset-4"
              [routerLink]="['/product', item.id]"
              [state]="{ productPreview: toProductDetail(item) }"
            >
              View details
            </a>
          </article>
        }
      </div>
    </section>

    <section class="mb-20 rounded-2xl bg-zinc-100 px-6 py-10">
      <div class="grid grid-cols-2 items-center justify-items-center gap-6 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 md:grid-cols-6">
        @for (brand of marqueeBrands; track brand) {
          <span>{{ brand }}</span>
        }
      </div>
    </section>

    <section class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h2 class="text-3xl font-light tracking-tight">New Season Arrivals</h2>
      <div class="flex flex-wrap items-center gap-4">
        <label class="inline-flex items-center gap-2 border-b border-black pb-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
          <span>Sort by</span>
          <select
            class="border-none bg-transparent text-[10px] font-semibold uppercase tracking-[0.2em] focus:outline-none"
            [value]="sortBy()"
            (change)="onSortChange($event)"
            aria-label="Sort women arrivals"
          >
            <option value="newest">Newest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </label>
        <button
          type="button"
          class="bg-black px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white"
          (click)="setCategory('all')"
        >
          Filter: {{ selectedCategoryLabel() }}
        </button>
      </div>
    </section>

    <section class="mb-20 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-12">
      @for (item of displayedArrivals(); track item.id) {
        <article class="group">
          <div class="relative mb-3 aspect-[3/4] overflow-hidden bg-zinc-200">
            <img [src]="item.image" [alt]="item.alt" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            @if (item.badge) {
              <span class="absolute left-2 top-2 bg-white px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.16em]">{{ item.badge }}</span>
            }
            <button
              type="button"
              class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-sm transition hover:bg-white"
              (click)="toggleFavorite(item.id)"
              [attr.aria-label]="isFavorite(item.id) ? 'Remove from wishlist' : 'Add to wishlist'"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" [attr.fill]="isFavorite(item.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8">
                <path d="M12.1 21.35 10 19.3C5 14.65 2 11.85 2 8.4 2 5.6 4.2 3.4 7 3.4c1.6 0 3.2.75 4.2 1.95 1-1.2 2.6-1.95 4.2-1.95 2.8 0 5 2.2 5 5 0 3.45-3 6.25-8 10.9l-2.3 2.05Z"></path>
              </svg>
            </button>
          </div>
          <h3 class="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-700">{{ item.brand }}</h3>
          <p class="mt-1 line-clamp-1 text-xs text-zinc-600">{{ item.title }}</p>
          <p class="mt-1 text-sm font-medium">{{ item.price | currency }}</p>
          <a
            class="mt-2 inline-block text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-700 underline underline-offset-4"
            [routerLink]="['/product', item.id]"
            [state]="{ productPreview: toProductDetail(item) }"
          >
            View details
          </a>
          <button
            type="button"
            class="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-700 underline underline-offset-4"
            (click)="addToBag(item.id)"
          >
            Add to bag
          </button>
        </article>
      } @empty {
        <p class="col-span-full rounded-xl bg-white p-6 text-sm text-zinc-600">No products available in this selection yet.</p>
      }
    </section>

    <section class="mx-auto mb-16 max-w-2xl border-t border-zinc-200 pt-14 text-center">
      <p class="text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500">Stay Inspired</p>
      <h3 class="mt-4 text-3xl font-light tracking-tight">Receive early access to sales and exclusive fashion news.</h3>
      <form class="mt-8 flex flex-col gap-3 sm:flex-row" (submit)="$event.preventDefault()">
        <input
          type="email"
          class="w-full border-b border-zinc-900 bg-transparent px-2 py-3 text-sm outline-none"
          placeholder="Your email address"
          aria-label="Newsletter email"
        />
        <button type="submit" class="bg-black px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">Sign Up</button>
      </form>
      <p class="mt-4 text-[10px] text-zinc-400">
        By signing up, you agree to our Terms and Conditions and Privacy Policy. You can unsubscribe at any time.
      </p>
    </section>

    <footer class="mt-12 border-t border-zinc-200 bg-zinc-100">
      <div class="grid gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 class="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-700">Customer Service</h4>
          <ul class="space-y-2 text-sm text-zinc-600">
            <li>Contact Us</li>
            <li>Orders and Delivery</li>
            <li>Returns and Refunds</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div>
          <h4 class="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-700">About Farfetch</h4>
          <ul class="space-y-2 text-sm text-zinc-600">
            <li>About Us</li>
            <li>Investors</li>
            <li>Careers</li>
            <li>Sustainability</li>
          </ul>
        </div>
        <div>
          <h4 class="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-700">Shopping With Us</h4>
          <ul class="space-y-2 text-sm text-zinc-600">
            <li>Student Discount</li>
            <li>App Download</li>
            <li>Farfetch Membership</li>
            <li>Refer a Friend</li>
          </ul>
        </div>
        <div>
          <h4 class="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-700">Social Media</h4>
          <div class="flex gap-3 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            <span class="rounded-full border border-zinc-300 px-3 py-2">IG</span>
            <span class="rounded-full border border-zinc-300 px-3 py-2">FB</span>
            <span class="rounded-full border border-zinc-300 px-3 py-2">PI</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-3 border-t border-zinc-200 px-5 py-5 text-[10px] uppercase tracking-[0.16em] text-zinc-400 md:flex-row md:items-center md:justify-between">
        <p>2024 Farfetch UK Limited. All Rights Reserved.</p>
        <div class="flex gap-5">
          <span>Privacy Policy</span>
          <span>Terms and Conditions</span>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WomensPageComponent {
  private readonly cart = inject(CartService);

  protected readonly categoryTabs = WOMENS_CATEGORY_TABS;
  protected readonly spotlightItems = DESIGNER_SPOTLIGHT_ITEMS;
  protected readonly marqueeBrands = ['Balenciaga', 'Chanel', 'Valentino', 'Versace', 'Loewe', 'Givenchy'] as const;

  protected readonly selectedCategory = signal<WomensCategory>('all');
  protected readonly sortBy = signal<WomensSort>('newest');
  private readonly favorites = signal<ReadonlySet<string>>(new Set());

  protected readonly selectedCategoryLabel = computed(() => {
    const category = this.selectedCategory();
    if (category === 'all') {
      return 'All';
    }
    return this.categoryTabs.find((tab) => tab.key === category)?.label ?? 'All';
  });

  protected readonly displayedArrivals = computed(() => {
    const category = this.selectedCategory();
    const sort = this.sortBy();

    const filtered = category === 'all' ? NEW_SEASON_ARRIVALS : NEW_SEASON_ARRIVALS.filter((item) => item.category === category);
    const sorted = [...filtered];

    if (sort === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
      return sorted;
    }

    if (sort === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
      return sorted;
    }

    sorted.sort((a, b) => b.dropRank - a.dropRank);
    return sorted;
  });

  protected setCategory(category: WomensCategory): void {
    this.selectedCategory.set(category);
  }

  protected onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement | null)?.value ?? 'newest';
    if (value === 'price-high' || value === 'price-low' || value === 'newest') {
      this.sortBy.set(value);
    }
  }

  protected isFavorite(id: string): boolean {
    return this.favorites().has(id);
  }

  protected toggleFavorite(id: string): void {
    this.favorites.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected addToBag(id: string): void {
    this.cart.add(id);
  }

  protected toProductDetail(item: WomensProduct): CatalogItem {
    return {
      id: item.id,
      brand: item.brand,
      title: item.title,
      price: item.price,
      image: item.image,
      description: `${item.brand} signature piece crafted for the latest womenswear collection.`,
      category: 'womenswear'
    };
  }
}
