import { describe, expect, it } from 'vitest';
import { CatalogItem } from '../../core/catalog/catalog.model';
import { designersIn, queryCatalog } from './listing.query';

const item = (overrides: Partial<CatalogItem>): CatalogItem => ({
  id: 'x',
  title: 'Item',
  brand: 'Brand',
  price: 100,
  image: '',
  department: 'womenswear',
  category: 'clothing',
  description: '',
  addedAt: '2024-01-01',
  edits: [],
  ...overrides
});

const items = [
  item({ id: 'a', brand: 'Prada', title: 'Leather tote', category: 'bags', price: 2950, addedAt: '2024-03-01' }),
  item({ id: 'b', brand: 'Gucci', title: 'Silk dress', price: 3400, addedAt: '2024-03-05' }),
  item({ id: 'c', brand: 'Prada', title: 'Wool trousers', department: 'menswear', price: 760, addedAt: '2024-02-01' }),
  item({ id: 'd', brand: 'Chloé', title: 'Cotton dress', department: 'kids', price: 295, addedAt: '2024-01-15' })
];

const base = { department: null, category: null, designer: null, edit: null, age: null, sale: false, search: '', sort: 'newest' } as const;

describe('queryCatalog', () => {
  it('returns everything, newest first, without filters', () => {
    expect(queryCatalog(items, base).map((i) => i.id)).toEqual(['b', 'a', 'c', 'd']);
  });

  it('narrows by department, category and designer together', () => {
    expect(queryCatalog(items, { ...base, department: 'womenswear' }).map((i) => i.id)).toEqual(['b', 'a']);
    expect(queryCatalog(items, { ...base, department: 'womenswear', category: 'bags' }).map((i) => i.id)).toEqual(['a']);
    expect(queryCatalog(items, { ...base, designer: 'Prada' }).map((i) => i.id)).toEqual(['a', 'c']);
  });

  it('searches brand, title and category, ignoring case and accents', () => {
    expect(queryCatalog(items, { ...base, search: 'DRESS' }).map((i) => i.id)).toEqual(['b', 'd']);
    expect(queryCatalog(items, { ...base, search: 'chloe' }).map((i) => i.id)).toEqual(['d']);
    expect(queryCatalog(items, { ...base, search: 'bags' }).map((i) => i.id)).toEqual(['a']);
  });

  it('sorts by price both ways', () => {
    expect(queryCatalog(items, { ...base, sort: 'price-asc' }).map((i) => i.id)).toEqual(['d', 'c', 'a', 'b']);
    expect(queryCatalog(items, { ...base, sort: 'price-desc' }).map((i) => i.id)).toEqual(['b', 'a', 'c', 'd']);
  });

  it('does not mutate its input', () => {
    const copy = [...items];
    queryCatalog(items, { ...base, sort: 'price-asc' });
    expect(items).toEqual(copy);
  });
});

describe('queryCatalog: edits and sale', () => {
  const pool = [
    item({ id: 'gift', edits: ['gifts'], price: 500, salePrice: 250, addedAt: '2024-03-01' }),
    item({ id: 'party', edits: ['party', 'gifts'], price: 400, addedAt: '2024-02-01' }),
    item({ id: 'plain', price: 300, addedAt: '2024-01-01' })
  ];

  it('filters by edit', () => {
    expect(queryCatalog(pool, { ...base, edit: 'gifts' }).map((i) => i.id)).toEqual(['gift', 'party']);
  });

  it('keeps only discounted pieces on sale', () => {
    expect(queryCatalog(pool, { ...base, sale: true }).map((i) => i.id)).toEqual(['gift']);
  });

  it('sorts by the price actually paid', () => {
    expect(queryCatalog(pool, { ...base, sort: 'price-asc' }).map((i) => i.id)).toEqual(['gift', 'plain', 'party']);
  });
});

describe('queryCatalog: age groups', () => {
  const pool = [
    item({ id: 'bodysuit', department: 'kids', ageGroup: 'baby' }),
    item({ id: 'sneakers', department: 'kids', ageGroup: 'teens' }),
    item({ id: 'dress', department: 'womenswear' })
  ];

  it('narrows kidswear to one age group', () => {
    expect(queryCatalog(pool, { ...base, age: 'baby' }).map((i) => i.id)).toEqual(['bodysuit']);
    expect(queryCatalog(pool, { ...base, age: 'teens' }).map((i) => i.id)).toEqual(['sneakers']);
  });
});

describe('designersIn', () => {
  it('lists each designer once, alphabetically', () => {
    expect(designersIn(items)).toEqual(['Chloé', 'Gucci', 'Prada']);
  });
});
