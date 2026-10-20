import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AGE_GROUPS,
  AgeGroup,
  CATEGORIES,
  Department,
  ProductCategory,
  ProductEdit,
  ageGroupInfo,
  categoryLabel,
  departmentInfo,
  editInfo,
  isAgeGroup,
  isCategory,
  isEdit
} from '../../../core/catalog';
import { CatalogStore } from '../../../core/services/catalog.store';
import { BreadcrumbComponent, Crumb } from '../../../shared/ui/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';
import { LISTING_SORTS, ListingSort, designersIn, isListingSort, queryCatalog } from '../listing.query';

const PAGE_SIZE = 8;

// The product listing (Farfetch "items.aspx"): one page for every
// department, category, designer and search. All state lives in the URL
// (?category=bags&designer=Prada&sort=price-asc&q=…), so any view can be
// shared, bookmarked and restored with the back button.
@Component({
  selector: 'app-product-listing-page',
  imports: [BreadcrumbComponent, ProductCardComponent],
  template: `
    <div class="page-container">
      <app-breadcrumb [items]="breadcrumb()" />

      <header class="max-w-2xl pb-10">
        <h1 class="text-headline">{{ title() }}</h1>
        <p class="mt-4 text-sm leading-relaxed text-muted">{{ description() }}</p>
      </header>

      <section class="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-y border-line py-4" aria-label="Filters">
        <div class="flex flex-wrap items-center gap-x-8 gap-y-3">
          @if (ageOptions().length) {
            <label class="flex items-center gap-2">
              <span class="label-caps text-muted">Age</span>
              <select class="select-line" [value]="age() ?? ''" (change)="update({ age: $any($event.target).value || null })">
                <option value="">All</option>
                @for (option of ageOptions(); track option.id) {
                  <option [value]="option.id">{{ option.label }} ({{ option.range }})</option>
                }
              </select>
            </label>
          }
          <label class="flex items-center gap-2">
            <span class="label-caps text-muted">Category</span>
            <select class="select-line" [value]="category() ?? ''" (change)="update({ category: $any($event.target).value || null })">
              <option value="">All</option>
              @for (option of categoryOptions(); track option.id) {
                <option [value]="option.id">{{ option.label }}</option>
              }
            </select>
          </label>
          <label class="flex items-center gap-2">
            <span class="label-caps text-muted">Designer</span>
            <select class="select-line" [value]="designer() ?? ''" (change)="update({ designer: $any($event.target).value || null })">
              <option value="">All</option>
              @for (name of designerOptions(); track name) {
                <option [value]="name">{{ name }}</option>
              }
            </select>
          </label>
          <label class="flex cursor-pointer items-center gap-2">
            <input type="checkbox" class="h-3.5 w-3.5 accent-black" [checked]="sale()" (change)="update({ sale: $any($event.target).checked ? 'true' : null })" />
            <span class="label-caps" [class.text-error]="sale()">Sale only</span>
          </label>
          @if (hasFilters()) {
            <button type="button" class="link-cta" (click)="clearAll()">Clear all</button>
          }
        </div>
        <label class="flex items-center gap-2">
          <span class="label-caps text-muted">Sort by</span>
          <select class="select-line" [value]="sort()" (change)="update({ sort: $any($event.target).value })">
            @for (option of sorts; track option.id) {
              <option [value]="option.id">{{ option.label }}</option>
            }
          </select>
        </label>
      </section>

      <p class="py-6 text-xs text-muted" aria-live="polite">{{ results().length }} {{ results().length === 1 ? 'item' : 'items' }}</p>

      @if (catalog.loading()) {
        <div class="product-grid" aria-hidden="true">
          @for (n of skeletons; track n) {
            <div><div class="aspect-[3/4] animate-pulse bg-surface"></div><div class="mt-4 h-3 w-1/2 bg-surface"></div><div class="mt-2 h-3 w-3/4 bg-surface"></div></div>
          }
        </div>
      } @else if (results().length) {
        <div class="product-grid">
          @for (item of visible(); track item.id; let i = $index) {
            <app-product-card [item]="item" [eager]="i < 4" />
          }
        </div>

        @if (results().length > pageSize) {
          <div class="mx-auto mt-16 flex max-w-xs flex-col items-center gap-4 text-center">
            <p class="text-xs text-muted">Viewing {{ visible().length }} of {{ results().length }} items</p>
            <div class="h-px w-full bg-line" aria-hidden="true">
              <div class="h-px bg-ink transition-[width] duration-500" [style.width.%]="(visible().length / results().length) * 100"></div>
            </div>
            @if (visible().length < results().length) {
              <button type="button" class="btn btn-primary mt-2" (click)="limit.set(limit() + pageSize)">Load more</button>
            }
          </div>
        }
      } @else {
        <div class="py-24 text-center">
          <p class="text-headline">No items match your selection</p>
          <p class="mt-3 text-sm text-muted">Try another category or designer, or clear your filters.</p>
          <button type="button" class="btn btn-secondary mt-8" (click)="clearAll()">Clear all filters</button>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListingPageComponent {
  protected readonly catalog = inject(CatalogStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // From the route's data (withComponentInputBinding); null on /search.
  readonly department = input<Department | null>(null);

  protected readonly sorts = LISTING_SORTS;
  protected readonly pageSize = PAGE_SIZE;
  protected readonly skeletons = Array.from({ length: PAGE_SIZE }, (_, i) => i);

  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true });

  protected readonly category = computed<ProductCategory | null>(() => {
    const value = this.params().get('category');
    return isCategory(value) ? value : null;
  });
  protected readonly designer = computed(() => this.params().get('designer'));
  protected readonly edit = computed<ProductEdit | null>(() => {
    const value = this.params().get('edit');
    return isEdit(value) ? value : null;
  });
  protected readonly sale = computed(() => this.params().get('sale') === 'true');
  protected readonly age = computed<AgeGroup | null>(() => {
    const value = this.params().get('age');
    return isAgeGroup(value) ? value : null;
  });
  protected readonly search = computed(() => this.params().get('q') ?? '');
  protected readonly sort = computed<ListingSort>(() => {
    const value = this.params().get('sort');
    return isListingSort(value) ? value : 'newest';
  });

  // Everything in this department (or search), before category/designer.
  private readonly pool = computed(() =>
    queryCatalog(this.catalog.all(), {
      department: this.department(),
      category: null,
      designer: null,
      edit: this.edit(),
      age: this.age(),
      sale: this.sale(),
      search: this.search(),
      sort: 'newest'
    })
  );

  protected readonly results = computed(() =>
    queryCatalog(this.pool(), {
      department: null,
      category: this.category(),
      designer: this.designer(),
      edit: null,
      age: null,
      sale: false,
      search: '',
      sort: this.sort()
    })
  );

  // A new result set starts again at the first page.
  protected readonly limit = linkedSignal({ source: this.results, computation: () => PAGE_SIZE });
  protected readonly visible = computed(() => this.results().slice(0, this.limit()));

  protected readonly categoryOptions = computed(() => {
    const present = new Set(this.pool().map((item) => item.category));
    return CATEGORIES.filter((category) => present.has(category.id));
  });
  // Only departments whose pieces carry an age group (Kids) offer the filter.
  protected readonly ageOptions = computed(() => {
    const department = this.department();
    const inDepartment = department ? this.catalog.byDepartment(department) : [];
    const present = new Set(inDepartment.map((item) => item.ageGroup));
    return AGE_GROUPS.filter((group) => present.has(group.id));
  });
  protected readonly designerOptions = computed(() =>
    designersIn(this.category() ? this.pool().filter((item) => item.category === this.category()) : this.pool())
  );

  protected readonly hasFilters = computed(
    () => !!this.category() || !!this.designer() || !!this.search() || !!this.edit() || this.sale() || !!this.age()
  );

  protected readonly title = computed(() => {
    const department = this.department();
    const category = this.category();
    const designer = this.designer();
    const edit = this.edit();
    if (!department) {
      return this.search() ? `Results for “${this.search()}”` : 'All products';
    }
    const possessive = departmentInfo(department).possessive;
    const age = this.age();
    // The most specific selection names the page: an edit, then sale, then
    // an age group ("Baby Clothing", "Teens (13–16 years)"), then a
    // category, then New In.
    let subject: string;
    if (edit || this.sale()) {
      const base = edit ? `${possessive} ${editInfo(edit).label}` : `${possessive} Sale`;
      subject = category ? `${base}: ${categoryLabel(category)}` : base;
    } else if (age) {
      const info = ageGroupInfo(age);
      subject = category ? `${info.label} ${categoryLabel(category)}` : `${info.label} (${info.range})`;
    } else {
      subject = `${possessive} ${category ? categoryLabel(category) : 'New In'}`;
    }
    return designer ? `${designer} · ${subject}` : subject;
  });

  protected readonly description = computed(() => {
    const department = this.department();
    if (!department) {
      return 'Every piece across womenswear, menswear and kidswear, from the world’s leading luxury houses.';
    }
    const category = this.category();
    const edit = this.edit();
    if (edit) {
      return editInfo(edit).description;
    }
    if (this.sale()) {
      return 'Up to 50% off a selection of pieces from the season’s collections, while stocks last.';
    }
    if (category) {
      return CATEGORY_DESCRIPTIONS[category];
    }
    const age = this.age();
    return age ? ageGroupInfo(age).description : DESCRIPTIONS[department];
  });

  protected readonly breadcrumb = computed<Crumb[]>(() => {
    const department = this.department();
    const category = this.category();
    if (!department) {
      return [{ label: 'Home', link: '/' }, { label: 'Search' }];
    }
    const info = departmentInfo(department);
    const crumbs: Crumb[] = [
      { label: 'Home', link: '/' },
      { label: info.label, link: info.path }
    ];
    const edit = this.edit();
    const age = this.age();
    // Edit, sale or age group: the section the page lives in, linked when
    // a category narrows it further.
    const section = edit
      ? { label: editInfo(edit).label, queryParams: { edit } }
      : this.sale()
        ? { label: 'Sale', queryParams: { sale: 'true' } }
        : age
          ? { label: ageGroupInfo(age).label, queryParams: { age } }
          : null;
    if (section) {
      crumbs.push(category ? { ...section, link: `${info.path}/items` } : { label: section.label });
    }
    if (category || !section) {
      crumbs.push({ label: category ? categoryLabel(category) : 'New In' });
    }
    return crumbs;
  });

  protected clearAll(): void {
    this.update({ category: null, designer: null, q: null, edit: null, sale: null, age: null });
  }

  protected update(params: Record<string, string | null>): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: params, queryParamsHandling: 'merge' });
  }
}

const DESCRIPTIONS: Record<Department, string> = {
  womenswear:
    'Explore the season’s most coveted womenswear: architectural tailoring, fluid silks and statement accessories from the world’s leading houses.',
  menswear:
    'From sharp tailoring to technical outerwear and statement sneakers, discover the season’s defining menswear from established and emerging designers.',
  kids: 'Premium essentials for babies, kids and teens: weather-ready outerwear, playful dresses and signature sneakers from the most-loved houses.'
};

// What each category holds, the same in every department.
const CATEGORY_DESCRIPTIONS: Record<ProductCategory, string> = {
  clothing: 'Tailoring, knitwear, outerwear and dresses: the season’s defining pieces, cut by the houses that set the pace.',
  shoes: 'From hand-finished leather classics to statement heels and the sneakers of the moment.',
  bags: 'Totes, shoulder bags and backpacks in the finest leathers, built to be carried for years.',
  accessories: 'Sunglasses, watches, belts and small leather goods: the details that finish a look.',
  jewelry: 'Fine and fashion jewelry, from everyday bands to pieces made to be noticed.'
};
