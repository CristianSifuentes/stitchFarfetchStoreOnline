import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES, Department, departmentInfo, featureDesigner } from '../../../core/catalog';
import { CatalogStore, byNewest } from '../../../core/services/catalog.store';
import { BrandStripComponent } from '../../../shared/ui/brand-strip/brand-strip.component';
import { BreadcrumbComponent } from '../../../shared/ui/breadcrumb/breadcrumb.component';
import { DesignerCardComponent } from '../../../shared/ui/designer-card/designer-card.component';
import { PageHeroComponent } from '../../../shared/ui/page-hero/page-hero.component';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';
import { SectionHeaderComponent } from '../../../shared/ui/section-header/section-header.component';
import { designersIn } from '../../listing/listing.query';
import { DEPARTMENT_CONTENT } from '../data/department-content';

const NEW_IN_COUNT = 8;

const CATEGORY_COLUMNS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-3 lg:grid-cols-5'
};

// The landing page of a department (Women, Men, Kids). One template for all
// three, so they can never drift apart: hero → categories → designers →
// New In → brands → editorial stories. Content comes from
// DEPARTMENT_CONTENT; products, counts and tile images from the catalog.
@Component({
  selector: 'app-department-page',
  imports: [
    RouterLink,
    BreadcrumbComponent,
    PageHeroComponent,
    SectionHeaderComponent,
    ProductCardComponent,
    BrandStripComponent,
    DesignerCardComponent
  ],
  template: `
    <div class="page-container">
      <app-breadcrumb [items]="[{ label: 'Home', link: '/' }, { label: info().label }]" />

      <app-page-hero
        [image]="content().hero.image"
        [alt]="content().hero.alt"
        [eyebrow]="content().hero.eyebrow"
        [title]="content().hero.title"
        [text]="content().hero.text"
        [primary]="{ label: 'Shop New In', link: listingPath(), queryParams: { sort: 'newest' } }"
        [secondary]="{ label: 'Shop all', link: listingPath() }"
        [stats]="stats()"
      />

      <section class="section-y" aria-labelledby="categories-heading">
        <h2 id="categories-heading" class="sr-only">Shop by category</h2>
        <ul class="grid grid-cols-2 gap-4 md:gap-6" [class]="categoryColumns()">
          @for (tile of categoryTiles(); track tile.id) {
            <li>
              <a class="group block" [routerLink]="listingPath()" [queryParams]="{ category: tile.id }">
                <div class="aspect-square overflow-hidden bg-surface">
                  <img [src]="tile.image" [alt]="tile.label" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <p class="label-caps mt-4">{{ tile.label }}</p>
                <p class="mt-1 text-xs text-muted">{{ tile.count }} {{ tile.count === 1 ? 'item' : 'items' }}</p>
              </a>
            </li>
          }
        </ul>
      </section>

      <section aria-labelledby="designers-heading">
        <app-section-header
          eyebrow="Designer Spotlight"
          title="The houses defining the season"
          [actionLabel]="'View all ' + info().label.toLowerCase()"
          [actionLink]="listingPath()"
        />
        <div class="grid gap-4 md:grid-cols-3 md:gap-6">
          @for (designer of designers(); track designer.name) {
            <app-designer-card
              [name]="designer.name"
              [eyebrow]="designer.eyebrow"
              [image]="designer.image"
              [from]="designer.from"
              [link]="listingPath()"
              [queryParams]="{ designer: designer.name }"
            />
          }
        </div>
      </section>

      <section class="section-y" aria-labelledby="new-in-heading">
        <app-section-header
          eyebrow="Just Landed"
          [title]="'New In: ' + info().label"
          description="The latest arrivals, added this week."
          actionLabel="View all"
          [actionLink]="listingPath()"
          [actionQuery]="{ sort: 'newest' }"
        />
        <div class="product-grid">
          @for (item of newIn(); track item.id) {
            <app-product-card [item]="item" />
          } @empty {
            @for (n of skeletons; track n) {
              <div aria-hidden="true"><div class="aspect-[3/4] animate-pulse bg-surface"></div></div>
            }
          }
        </div>
      </section>

      <app-brand-strip [brands]="brands()" />

      <section class="section-y grid gap-px md:grid-cols-2" aria-label="Editorial">
        @for (story of content().stories; track story.title) {
          <a class="group relative block h-[32rem] overflow-hidden bg-ink" [routerLink]="listingPath()" [queryParams]="{ category: story.category }">
            <img [src]="story.image" [alt]="story.title" class="h-full w-full object-cover opacity-90 transition-transform duration-[2000ms] group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-10 text-canvas">
              <p class="label-caps mb-3 opacity-80">{{ story.label }}</p>
              <h3 class="text-headline max-w-sm">{{ story.title }}</h3>
              <p class="mt-3 max-w-sm text-sm opacity-85">{{ story.description }}</p>
              <span class="link-cta mt-6 self-start">Shop the edit</span>
            </div>
          </a>
        }
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentPageComponent {
  private readonly catalog = inject(CatalogStore);

  // From the route's data (withComponentInputBinding).
  readonly department = input.required<Department>();

  protected readonly skeletons = Array.from({ length: 4 }, (_, i) => i);
  protected readonly info = computed(() => departmentInfo(this.department()));
  protected readonly content = computed(() => DEPARTMENT_CONTENT[this.department()]);
  protected readonly listingPath = computed(() => `${this.info().path}/items`);

  private readonly items = computed(() => this.catalog.byDepartment(this.department()).sort(byNewest));

  protected readonly newIn = computed(() => this.items().slice(0, NEW_IN_COUNT));

  protected readonly stats = computed(() => {
    const items = this.items();
    if (!items.length) {
      return [];
    }
    return [
      { value: String(designersIn(items).length), label: 'Designers' },
      { value: `$${Math.min(...items.map((item) => item.price)).toLocaleString('en-US')}`, label: 'Prices from' },
      { value: String(items.length), label: 'Pieces' }
    ];
  });

  // One tile per category the department actually stocks, pictured by its
  // newest piece.
  protected readonly categoryTiles = computed(() =>
    CATEGORIES.flatMap((category) => {
      const inCategory = this.items().filter((item) => item.category === category.id);
      return inCategory.length ? [{ ...category, count: inCategory.length, image: inCategory[0].image }] : [];
    })
  );

  // One row on desktop whatever the count, so no tile is ever left alone.
  protected readonly categoryColumns = computed(
    () => CATEGORY_COLUMNS[this.categoryTiles().length] ?? 'md:grid-cols-3 lg:grid-cols-5'
  );

  protected readonly designers = computed(() =>
    this.content().designers.flatMap((designer) => {
      const feature = featureDesigner(this.items(), designer.name);
      return feature ? [{ ...feature, eyebrow: designer.eyebrow }] : [];
    })
  );

  protected readonly brands = computed(() => designersIn(this.items()).slice(0, 6));
}
