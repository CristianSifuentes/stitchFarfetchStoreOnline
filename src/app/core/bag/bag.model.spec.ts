import { describe, expect, it } from 'vitest';
import { CatalogItem } from '../catalog/catalog.model';
import { BagLine, MAX_QUANTITY, addLine, changeQuantity, changeSize, mergeBags, summarizeBag } from './bag.model';

const item = (id: string, overrides: Partial<CatalogItem> = {}): CatalogItem => ({
  id,
  title: 'Shirt',
  brand: 'House',
  price: 100,
  image: '',
  department: 'menswear',
  category: 'clothing',
  description: '',
  addedAt: '2024-01-01',
  edits: [],
  ...overrides
});

const catalog = new Map([
  ['shirt', item('shirt')],
  ['bag', item('bag', { category: 'bags', price: 150, salePrice: 90 })],
  ['gone', item('gone', { soldOut: true })]
]);
const find = (id: string) => catalog.get(id);
const sizes = (piece: CatalogItem) => (piece.category === 'clothing' ? ['S', 'M'] : []);

describe('bag lines', () => {
  it('adds a new line, or raises the quantity of the same piece in the same size', () => {
    let lines = addLine([], 'shirt', 'M');
    lines = addLine(lines, 'shirt', 'M');
    lines = addLine(lines, 'shirt', 'S');
    expect(lines).toEqual([
      { id: 'shirt', size: 'M', quantity: 2 },
      { id: 'shirt', size: 'S', quantity: 1 }
    ]);
    expect(addLine([{ id: 'shirt', size: 'M', quantity: MAX_QUANTITY }], 'shirt', 'M')[0].quantity).toBe(MAX_QUANTITY);
  });

  it('merges two lines when one changes to the other size', () => {
    const lines: BagLine[] = [
      { id: 'shirt', size: null, quantity: 1 },
      { id: 'shirt', size: 'M', quantity: 2 }
    ];
    expect(changeSize(lines, 0, 'S')[0]).toEqual({ id: 'shirt', size: 'S', quantity: 1 });
    expect(changeSize(lines, 0, 'M')).toEqual([{ id: 'shirt', size: 'M', quantity: 3 }]);
  });

  it('keeps quantities between 1 and the maximum', () => {
    const lines: BagLine[] = [{ id: 'shirt', size: 'M', quantity: 2 }];
    expect(changeQuantity(lines, 0, 0)[0].quantity).toBe(1);
    expect(changeQuantity(lines, 0, 99)[0].quantity).toBe(MAX_QUANTITY);
  });

  it("adds the guest's lines to the account's on sign-in", () => {
    expect(mergeBags([{ id: 'shirt', size: 'M', quantity: 1 }], [{ id: 'shirt', size: 'M', quantity: 2 }, { id: 'bag', size: null, quantity: 1 }])).toEqual([
      { id: 'shirt', size: 'M', quantity: 3 },
      { id: 'bag', size: null, quantity: 1 }
    ]);
  });
});

describe('summarizeBag', () => {
  const lines: BagLine[] = [
    { id: 'shirt', size: null, quantity: 1 },
    { id: 'bag', size: null, quantity: 1 },
    { id: 'gone', size: 'M', quantity: 1 }
  ];

  it('charges sale prices, sets sold-out pieces apart and counts missing sizes', () => {
    const summary = summarizeBag(lines, find, sizes, 'standard');
    expect(summary.subtotal).toBe(190);
    expect(summary.count).toBe(2);
    expect(summary.unavailable.map((entry) => entry.item.id)).toEqual(['gone']);
    // The shirt needs a size; the bag is one size.
    expect(summary.missingSizes).toBe(1);
  });

  it('makes standard delivery free from $200, never express', () => {
    expect(summarizeBag(lines, find, sizes, 'standard').delivery).toBe(20);
    const more: BagLine[] = [{ id: 'shirt', size: 'M', quantity: 2 }];
    expect(summarizeBag(more, find, sizes, 'standard')).toMatchObject({ subtotal: 200, delivery: 0, total: 200 });
    expect(summarizeBag(more, find, sizes, 'express')).toMatchObject({ delivery: 35, total: 235 });
    expect(summarizeBag([], find, sizes, 'express').total).toBe(0);
  });
});
