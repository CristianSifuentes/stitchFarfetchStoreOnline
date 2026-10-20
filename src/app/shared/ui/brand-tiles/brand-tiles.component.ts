import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

export interface BrandTile {
  readonly name: string;
  readonly image: string;
  readonly link: string;
  readonly queryParams?: Params;
}

// "Trending brands": large tiles with the house name set across the photo.
@Component({
  selector: 'app-brand-tiles',
  imports: [RouterLink],
  template: `
    <section [attr.aria-label]="title()">
      <div class="mb-8 flex items-end justify-between gap-6">
        <h2 class="text-headline">{{ title() }}</h2>
        @if (actionLink()) {
          <a class="link-cta" [routerLink]="actionLink()">{{ actionLabel() }}</a>
        }
      </div>
      <ul class="grid gap-4 md:grid-cols-3 md:gap-6">
        @for (brand of brands(); track brand.name) {
          <li>
            <a class="group relative block aspect-[4/5] overflow-hidden bg-black" [routerLink]="brand.link" [queryParams]="brand.queryParams">
              <img [src]="brand.image" alt="" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <!-- A flat scrim keeps the name legible on light and dark photos alike. -->
              <span class="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/45" aria-hidden="true"></span>
              <span class="absolute inset-0 flex items-center justify-center p-6 text-center text-2xl font-light uppercase tracking-[0.2em] text-white md:text-3xl">{{ brand.name }}</span>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandTilesComponent {
  readonly title = input($localize`:@@section.trendingBrands:Trending brands`);
  readonly brands = input.required<ReadonlyArray<BrandTile>>();
  readonly actionLabel = input($localize`:@@section.allBrands:All brands`);
  readonly actionLink = input<string | null>(null);
}
