import { describe, expect, it } from 'vitest';
import { CatalogItem } from './catalog.model';
import { featureDesigner } from './designers';

const item = (overrides: Partial<CatalogItem>): CatalogItem => ({
  id: 'x',
  title: '',
  brand: 'Saint Laurent',
  price: 100,
  image: '',
  department: 'menswear',
  category: 'clothing',
  description: '',
  addedAt: '2024-01-01',
  edits: [],
  ...overrides
});

describe('featureDesigner', () => {
  const items = [
    item({ id: 'wallet', category: 'accessories', image: 'wallet.jpg', price: 495, addedAt: '2024-03-20' }),
    item({ id: 'jacket', category: 'clothing', image: 'jacket.jpg', price: 2890, addedAt: '2024-02-01' }),
    item({ id: 'other', brand: 'Prada', image: 'prada.jpg' })
  ];

  it('pictures a house with clothing before newer accessories', () => {
    expect(featureDesigner(items, 'Saint Laurent')?.image).toBe('jacket.jpg');
  });

  it('reports the entry price across all its pieces', () => {
    expect(featureDesigner(items, 'Saint Laurent')?.from).toBe(495);
  });

  it('returns null for a designer without pieces', () => {
    expect(featureDesigner(items, 'Hermès')).toBeNull();
  });
});
