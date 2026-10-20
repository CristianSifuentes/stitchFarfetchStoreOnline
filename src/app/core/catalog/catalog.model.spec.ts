import { describe, expect, it } from 'vitest';
import { discountPercent, effectivePrice } from './catalog.model';

describe('sale pricing', () => {
  it('charges the sale price when there is one', () => {
    expect(effectivePrice({ price: 1000, salePrice: 700 })).toBe(700);
    expect(effectivePrice({ price: 1000 })).toBe(1000);
  });

  it('reports the discount in whole percent', () => {
    expect(discountPercent({ price: 1000, salePrice: 700 })).toBe(30);
    expect(discountPercent({ price: 895, salePrice: 625 })).toBe(30);
    expect(discountPercent({ price: 1000 })).toBe(0);
  });
});
