import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AGE_GROUPS,
  CATEGORIES,
  Department,
  ProductCategory,
  departmentInfo,
  editInfo,
  featureDesigner,
  isAgeGroup,
  isCategory,
  isEdit
} from '../../../core/catalog';
import { LocaleService } from '../../../core/locale';
import { CatalogStore, byNewest } from '../../../core/services/catalog.store';
import { BrandTile, BrandTilesComponent } from '../../../shared/ui/brand-tiles/brand-tiles.component';
import { BreadcrumbComponent } from '../../../shared/ui/breadcrumb/breadcrumb.component';
import { EditTile, EditTilesComponent } from '../../../shared/ui/edit-tiles/edit-tiles.component';
import { EditorialStoryComponent } from '../../../shared/ui/editorial-story/editorial-story.component';
import { DirectoryColumn, LinkDirectoryComponent } from '../../../shared/ui/link-directory/link-directory.component';
import { PageHeroComponent } from '../../../shared/ui/page-hero/page-hero.component';
import { ProductCarouselComponent } from '../../../shared/ui/product-carousel/product-carousel.component';
import { designersIn, isListingSort, queryCatalog } from '../../listing/listing.query';
import { DEPARTMENT_CONTENT } from '../data/department-content';
import { itemCount, pieceCount } from '../../../shared/i18n/plurals';

const NEW_IN_COUNT = 12;

const CATEGORY_COLUMNS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-3 lg:grid-cols-5'
};

const GIFTS_FOR: Record<Department, string> = {
  womenswear: $localize`:@@directory.giftsForHer:Gifts for her`,
  menswear: $localize`:@@directory.giftsForHim:Gifts for him`,
  kids: $localize`:@@directory.giftsForKids:Gifts for kids`
};

// A department's hub (Women, Men, Kids), in the order of Farfetch's:
// seasonal campaign → New in daily → Trending now → an editorial story with
// its pieces → shop by age (kids) → shop by category → trending brands →
// more to explore.
// One template for all three; words and photography come from
// DEPARTMENT_CONTENT, products, counts and tile images from the catalog.
@Component({
  selector: 'app-department-page',
  imports: [
    RouterLink,
    BreadcrumbComponent,
    PageHeroComponent,
    ProductCarouselComponent,
    EditTilesComponent,
    EditorialStoryComponent,
    BrandTilesComponent,
    LinkDirectoryComponent
  ],
  template: `
    <div class="page-container">
      <app-breadcrumb [items]="[{ label: homeLabel, link: '/' }, { label: info().label }]" />

      <app-page-hero
        [image]="content().campaign.image"
        [alt]="content().campaign.alt"
        [eyebrow]="content().campaign.eyebrow"
        [title]="content().campaign.title"
        [text]="content().campaign.text"
        [primary]="{ label: exploreMoreLabel, link: listingPath(), queryParams: { edit: content().campaign.edit } }"
        [secondary]="{ label: shopNewInLabel, link: listingPath(), queryParams: { sort: 'newest' } }"
        [stats]="stats()"
      />

      <div class="section-y">
        <app-product-carousel
          eyebrow="Just landed"
          i18n-eyebrow="@@section.justLanded"
          title="New in daily from the best brands"
          i18n-title="@@dept.newInDaily"
          [items]="newIn()"
          [actionLink]="listingPath()"
          [actionQuery]="{ sort: 'newest' }"
        />
      </div>

      <app-edit-tiles [tiles]="trends()" />

      <div class="section-y">
        <app-editorial-story
          [eyebrow]="content().editorial.eyebrow"
          [title]="content().editorial.title"
          [text]="content().editorial.text"
          [image]="content().editorial.image"
          [alt]="content().editorial.alt"
          [link]="listingPath()"
          [queryParams]="{ edit: content().editorial.edit }"
          [actionLabel]="shopEditLabel()"
        >
          @if (editorialItems().length) {
            <app-product-carousel
              [title]="editLabel()"
              [items]="editorialItems()"
              [actionLink]="listingPath()"
              [actionQuery]="{ edit: content().editorial.edit }"
            />
          }
        </app-editorial-story>
      </div>

      @if (ageTiles().length) {
        <section class="pb-16 md:pb-24" aria-labelledby="ages-heading">
          <h2 id="ages-heading" class="text-headline mb-8" i18n="@@dept.shopByAge">Shop by age</h2>
          <ul class="grid gap-4 sm:grid-cols-3 md:gap-6">
            @for (tile of ageTiles(); track tile.id) {
              <li>
                <a class="group relative block aspect-[3/4] overflow-hidden bg-black" [routerLink]="listingPath()" [queryParams]="{ age: tile.id }">
                  <img [src]="tile.image" [alt]="tile.label" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <span class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true"></span>
                  <span class="absolute inset-x-0 bottom-0 p-8 text-white">
                    <span class="label-caps block opacity-80">{{ tile.range }}</span>
                    <span class="text-title mt-1 block">{{ tile.label }}</span>
                    <span class="mt-1 block text-xs opacity-80">{{ pieceCount(tile.count) }}</span>
                  </span>
                </a>
              </li>
            }
          </ul>
        </section>
      }

      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" class="text-headline mb-8" i18n="@@dept.shopByCategory">Shop by category</h2>
        <ul class="grid grid-cols-2 gap-4 md:gap-6" [class]="categoryColumns()">
          @for (tile of categoryTiles(); track tile.id) {
            <li>
              <a class="group block" [routerLink]="listingPath()" [queryParams]="{ category: tile.id }">
                <div class="aspect-square overflow-hidden bg-surface">
                  <img [src]="tile.image" [alt]="tile.label" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <p class="label-caps mt-4">{{ tile.label }}</p>
                <p class="mt-1 text-xs text-muted">{{ itemCount(tile.count) }}</p>
              </a>
            </li>
          }
        </ul>
      </section>

      <div class="section-y">
        <app-brand-tiles [brands]="brands()" [actionLink]="info().path + '/brands'" />
      </div>

      <app-link-directory [columns]="directory()" [label]="moreToExploreLabel()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentPageComponent {
  private readonly catalog = inject(CatalogStore);
  private readonly locale = inject(LocaleService);

  // From the route's data (withComponentInputBinding).
  readonly department = input.required<Department>();

  protected readonly info = computed(() => departmentInfo(this.department()));
  protected readonly content = computed(() => DEPARTMENT_CONTENT[this.department()]);
  protected readonly listingPath = computed(() => `${this.info().path}/items`);
  protected readonly editLabel = computed(() => editInfo(this.content().editorial.edit).label);
  protected readonly shopEditLabel = computed(() => $localize`:@@dept.shopEdit:Shop ${this.editLabel()}:edit:`);
  protected readonly moreToExploreLabel = computed(() => $localize`:@@dept.moreToExploreIn:More to explore in ${this.info().label}:department:`);
  // Counts inside @for use the plural helpers: an ICU in a repeated
  // template breaks i18n hydration.
  protected readonly itemCount = itemCount;
  protected readonly pieceCount = pieceCount;
  protected readonly homeLabel = $localize`:@@breadcrumb.home:Home`;
  protected readonly exploreMoreLabel = $localize`:@@common.exploreMore:Explore more`;
  protected readonly shopNewInLabel = $localize`:@@dept.shopNewIn:Shop New In`;

  private readonly items = computed(() => this.catalog.byDepartment(this.department()).sort(byNewest));

  protected readonly newIn = computed(() => this.items().slice(0, NEW_IN_COUNT));
  protected readonly editorialItems = computed(() =>
    this.items().filter((item) => item.edits.includes(this.content().editorial.edit))
  );

  protected readonly stats = computed(() => {
    const items = this.items();
    if (!items.length) {
      return [];
    }
    return [
      { value: String(designersIn(items).length), label: $localize`:@@dept.stat.designers:Designers` },
      { value: this.locale.format(Math.min(...items.map((item) => item.price))), label: $localize`:@@dept.stat.pricesFrom:Prices from` },
      { value: String(items.length), label: $localize`:@@dept.stat.pieces:Pieces` }
    ];
  });

  // Each trend is pictured by the first piece its filters lead to, never
  // repeating a photo already used by an earlier tile.
  protected readonly trends = computed<EditTile[]>(() => {
    const used = new Set<string>();
    return this.content().trends.flatMap((trend) => {
      const params = trend.queryParams;
      const category: ProductCategory | null = isCategory(params['category']) ? params['category'] : null;
      const matches = queryCatalog(this.items(), {
        department: null,
        category,
        designer: typeof params['designer'] === 'string' ? params['designer'] : null,
        edit: isEdit(params['edit']) ? params['edit'] : null,
        age: isAgeGroup(params['age']) ? params['age'] : null,
        sale: false,
        search: '',
        sort: isListingSort(params['sort']) ? params['sort'] : 'newest'
      });
      const pick = matches.find((item) => !used.has(item.image));
      if (!pick) {
        return [];
      }
      used.add(pick.image);
      return [{ label: trend.label, image: pick.image, link: this.listingPath(), queryParams: params }];
    });
  });

  // Kidswear's first way in (Farfetch: Baby, Kids, Teens): one tile per age
  // group, pictured by its newest piece not already shown in Trending now.
  // Empty for departments without ages.
  protected readonly ageTiles = computed(() => {
    const used = new Set(this.trends().map((trend) => trend.image));
    return AGE_GROUPS.flatMap((group) => {
      const pieces = this.items().filter((item) => item.ageGroup === group.id);
      const pick = pieces.find((item) => !used.has(item.image)) ?? pieces[0];
      return pick ? [{ ...group, count: pieces.length, image: pick.image }] : [];
    });
  });

  protected readonly categoryColumns = computed(
    () => CATEGORY_COLUMNS[this.categoryTiles().length] ?? 'md:grid-cols-3 lg:grid-cols-5'
  );

  // One tile per category the department actually stocks, pictured by its
  // newest piece.
  protected readonly categoryTiles = computed(() =>
    CATEGORIES.flatMap((category) => {
      const inCategory = this.items().filter((item) => item.category === category.id);
      return inCategory.length ? [{ ...category, count: inCategory.length, image: inCategory[0].image }] : [];
    })
  );

  protected readonly brands = computed<BrandTile[]>(() =>
    this.content().brands.flatMap((name) => {
      const feature = featureDesigner(this.items(), name);
      return feature ? [{ name, image: feature.image, link: this.listingPath(), queryParams: { designer: name } }] : [];
    })
  );

  // Farfetch's closing link lists, generated the same way for every department.
  protected readonly directory = computed<DirectoryColumn[]>(() => {
    const items = this.listingPath();
    return [
      {
        title: $localize`:@@nav.gifts:Gifts`,
        links: [
          { label: GIFTS_FOR[this.department()], link: items, queryParams: { edit: 'gifts' } },
          { label: $localize`:@@directory.jewelryWatches:Jewelry & watches`, link: items, queryParams: { category: 'jewelry' } },
          { label: $localize`:@@category.accessories:Accessories`, link: items, queryParams: { category: 'accessories' } },
          { label: $localize`:@@directory.giftsByPrice:Gifts by price`, link: items, queryParams: { edit: 'gifts', sort: 'price-asc' } }
        ]
      },
      {
        title: $localize`:@@directory.partySeason:Party Season`,
        links: [
          { label: $localize`:@@directory.partyLooks:Party looks`, link: items, queryParams: { edit: 'party' } },
          { label: $localize`:@@directory.eveningShoes:Evening shoes`, link: items, queryParams: { edit: 'party', category: 'shoes' } },
          { label: $localize`:@@directory.brandsOfTheMoment:Brands of the moment`, link: `${this.info().path}/brands` },
          { label: $localize`:@@nav.newIn:New In`, link: items, queryParams: { sort: 'newest' } }
        ]
      },
      {
        title: $localize`:@@directory.holidayStyles:Holiday Styles`,
        links: [
          { label: $localize`:@@edit.winter:The Winter Edit`, link: items, queryParams: { edit: 'winter' } },
          { label: $localize`:@@edit.heritage:Modern Heritage`, link: items, queryParams: { edit: 'heritage' } },
          { label: $localize`:@@directory.knitwear:Knitwear`, link: items, queryParams: { q: 'knit' } },
          { label: $localize`:@@nav.sale:Sale`, link: items, queryParams: { sale: 'true' } }
        ]
      }
    ];
  });
}
