import { describe, expect, it } from 'vitest';
import { formatPrice } from './price.util';

describe('formatPrice', () => {
  it('formats whole dollars with thousands separators', () => {
    expect(formatPrice(3250)).toBe('$3,250');
    expect(formatPrice(745)).toBe('$745');
  });

  it('rounds to whole dollars', () => {
    expect(formatPrice(1149.6)).toBe('$1,150');
  });
});
