import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Department, departmentInfo, featureDesigner } from '../../../core/catalog';
import { CatalogStore } from '../../../core/services/catalog.store';
import { BrandTile, BrandTilesComponent } from '../../../shared/ui/brand-tiles/brand-tiles.component';
import { BreadcrumbComponent } from '../../../shared/ui/breadcrumb/breadcrumb.component';

const LETTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '#'];

interface BrandEntry {
  readonly name: string;
  readonly count: number;
}

// Farfetch's "Brands": the trending houses as tiles, then every designer in
// the department from A to Z, each leading to its listing.
@Component({
  selector: 'app-brands-page',
  imports: [RouterLink, BreadcrumbComponent, BrandTilesComponent],
  template: `
    <div class="page-container">
      <app-breadcrumb [items]="[{ label: 'Home', link: '/' }, { label: info().label, link: info().path }, { label: 'Brands' }]" />

      <header class="max-w-2xl pb-12">
        <h1 class="text-headline">{{ info().possessive }} Brands</h1>
        <p class="mt-4 text-sm leading-relaxed text-muted">
          {{ brands().length }} designers, from heritage houses to the names defining what comes next.
        </p>
      </header>

      @if (trending().length) {
        <app-brand-tiles [brands]="trending()" />
      }

      <nav class="sticky top-[7.5rem] z-10 -mx-5 mt-16 border-y border-line bg-canvas px-5 lg:top-[9.25rem] lg:mx-0 lg:px-0" aria-label="Brands A to Z">
        <ul class="no-scrollbar flex gap-1 overflow-x-auto py-3 lg:justify-between">
          @for (letter of letters; track letter) {
            <li>
              @if (groups().has(letter)) {
                <a [routerLink]="[]" [fragment]="'brands-' + letter" class="label-caps flex h-8 w-8 items-center justify-center transition-colors hover:bg-ink hover:text-canvas">{{ letter }}</a>
              } @else {
                <span class="label-caps flex h-8 w-8 items-center justify-center text-line" aria-hidden="true">{{ letter }}</span>
              }
            </li>
          }
        </ul>
      </nav>

      <div class="divide-y divide-line">
        @for (group of groupList(); track group.letter) {
          <section [id]="'brands-' + group.letter" class="grid scroll-mt-56 gap-6 py-10 md:grid-cols-[6rem_1fr]" [attr.aria-label]="group.letter">
            <h2 class="text-headline">{{ group.letter }}</h2>
            <ul class="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              @for (brand of group.brands; track brand.name) {
                <li>
                  <a class="group flex items-baseline justify-between gap-4 text-sm" [routerLink]="info().path + '/items'" [queryParams]="{ designer: brand.name }">
                    <span class="border-b border-transparent transition-colors group-hover:border-ink">{{ brand.name }}</span>
                    <span class="text-xs text-muted">{{ brand.count }}</span>
                  </a>
                </li>
              }
            </ul>
          </section>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsPageComponent {
  private readonly catalog = inject(CatalogStore);

  // From the route's data (withComponentInputBinding).
  readonly department = input.required<Department>();

  protected readonly letters = LETTERS;
  protected readonly info = computed(() => departmentInfo(this.department()));
  private readonly items = computed(() => this.catalog.byDepartment(this.department()));

  protected readonly brands = computed<BrandEntry[]>(() => {
    const counts = new Map<string, number>();
    for (const item of this.items()) {
      counts.set(item.brand, (counts.get(item.brand) ?? 0) + 1);
    }
    return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
  });

  // The houses with the most pieces, pictured by their signature piece.
  protected readonly trending = computed<BrandTile[]>(() =>
    [...this.brands()]
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, 3)
      .flatMap((brand) => {
        const feature = featureDesigner(this.items(), brand.name);
        return feature
          ? [{ name: brand.name, image: feature.image, link: `${this.info().path}/items`, queryParams: { designer: brand.name } }]
          : [];
      })
  );

  protected readonly groups = computed(() => {
    const groups = new Map<string, BrandEntry[]>();
    for (const brand of this.brands()) {
      const initial = brand.name.normalize('NFD').charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(initial) ? initial : '#';
      groups.set(letter, [...(groups.get(letter) ?? []), brand]);
    }
    return groups;
  });

  protected readonly groupList = computed(() =>
    LETTERS.filter((letter) => this.groups().has(letter)).map((letter) => ({ letter, brands: this.groups().get(letter) ?? [] }))
  );
}
