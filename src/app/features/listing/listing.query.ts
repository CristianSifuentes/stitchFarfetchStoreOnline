import { AgeGroup, CatalogItem, Department, ProductCategory, ProductEdit, effectivePrice } from '../../core/catalog/catalog.model';

export type ListingSort = 'newest' | 'price-asc' | 'price-desc';

export const LISTING_SORTS: ReadonlyArray<{ readonly id: ListingSort; readonly label: string }> = [
  { id: 'newest', label: $localize`:@@sort.newest:Newest first` },
  { id: 'price-asc', label: $localize`:@@sort.priceAsc:Price: low to high` },
  { id: 'price-desc', label: $localize`:@@sort.priceDesc:Price: high to low` }
];

export interface ListingQuery {
  readonly department: Department | null;
  readonly category: ProductCategory | null;
  readonly designer: string | null;
  readonly edit: ProductEdit | null;
  // Kids only: Baby, Kids or Teens.
  readonly age: AgeGroup | null;
  readonly sale: boolean;
  readonly search: string;
  readonly sort: ListingSort;
}

export function isListingSort(value: unknown): value is ListingSort {
  return LISTING_SORTS.some((sort) => sort.id === value);
}

// Everything a listing page shows, from one pure function: the department
// and search narrow the pool; category, designer, edit and sale filter it;
// sort orders it by the price actually paid.
export function queryCatalog(items: readonly CatalogItem[], query: ListingQuery): CatalogItem[] {
  const needle = normalize(query.search);
  const results = items.filter(
    (item) =>
      (query.department === null || item.department === query.department) &&
      (query.category === null || item.category === query.category) &&
      (query.designer === null || item.brand === query.designer) &&
      (query.edit === null || item.edits.includes(query.edit)) &&
      (query.age === null || item.ageGroup === query.age) &&
      (!query.sale || item.salePrice !== undefined) &&
      (!needle || normalize(`${item.brand} ${item.title} ${item.category}`).includes(needle))
  );

  return results.sort((a, b) => {
    switch (query.sort) {
      case 'price-asc':
        return effectivePrice(a) - effectivePrice(b);
      case 'price-desc':
        return effectivePrice(b) - effectivePrice(a);
      default:
        return b.addedAt.localeCompare(a.addedAt);
    }
  });
}

// Designers available for the current pool, alphabetically — so the filter
// never offers a designer that leads to an empty page.
export function designersIn(items: readonly CatalogItem[]): string[] {
  return [...new Set(items.map((item) => item.brand))].sort((a, b) => a.localeCompare(b));
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}
