import { describe, expect, it } from 'vitest';
import { itemCount, pieceCount } from './plurals';

describe('counts', () => {
  it('picks the English singular and plural', () => {
    expect(itemCount(1)).toBe('1 item');
    expect(itemCount(0)).toBe('0 items');
    expect(pieceCount(1)).toBe('1 piece');
    expect(pieceCount(3)).toBe('3 pieces');
  });
});
