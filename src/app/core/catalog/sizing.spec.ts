import { describe, expect, it } from 'vitest';
import { sizesFor } from './sizing';

describe('sizesFor', () => {
  it('sizes kidswear by age group', () => {
    expect(sizesFor({ department: 'kids', category: 'clothing', ageGroup: 'baby' })[0]).toBe('3M');
    expect(sizesFor({ department: 'kids', category: 'clothing', ageGroup: 'teens' })).toEqual(['13Y', '14Y', '15Y', '16Y']);
    expect(sizesFor({ department: 'kids', category: 'shoes', ageGroup: 'teens' })[0]).toBe('36 EU');
  });

  it('falls back to the department run without an age group', () => {
    expect(sizesFor({ department: 'kids', category: 'clothing' })[0]).toBe('4Y');
    expect(sizesFor({ department: 'menswear', category: 'clothing' })[0]).toBe('46 IT');
  });

  it('has no sizes for one-size categories', () => {
    expect(sizesFor({ department: 'kids', category: 'jewelry', ageGroup: 'teens' })).toEqual([]);
  });
});
