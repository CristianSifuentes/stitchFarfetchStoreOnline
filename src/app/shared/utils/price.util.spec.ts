import { describe, expect, it } from 'vitest';
import { formatPrice } from './price.util';

describe('formatPrice', () => {
  it('formats number in USD style', () => {
    expect(formatPrice(3250)).toBe('$3,250');
  });
});
