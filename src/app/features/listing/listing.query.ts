import { CatalogItem, Department, ProductCategory } from '../../core/catalog/catalog.model';

export type ListingSort = 'newest' | 'price-asc' | 'price-desc';

export const LISTING_SORTS: ReadonlyArray<{ readonly id: ListingSort; readonly label: string }> = [
  { id: 'newest', label: 'Newest first' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' }
];

export interface ListingQuery {
  readonly department: Department | null;
  readonly category: ProductCategory | null;
  readonly designer: string | null;
  readonly search: string;
  readonly sort: ListingSort;
}

export function isListingSort(value: unknown): value is ListingSort {
  return LISTING_SORTS.some((sort) => sort.id === value);
}

// Everything a listing page shows, from one pure function: the department
// and search narrow the pool, category and designer filter it, sort orders it.
export function queryCatalog(items: readonly CatalogItem[], query: ListingQuery): CatalogItem[] {
  const needle = normalize(query.search);
  const results = items.filter(
    (item) =>
      (query.department === null || item.department === query.department) &&
      (query.category === null || item.category === query.category) &&
      (query.designer === null || item.brand === query.designer) &&
      (!needle || normalize(`${item.brand} ${item.title} ${item.category}`).includes(needle))
  );

  return results.sort((a, b) => {
    switch (query.sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
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
