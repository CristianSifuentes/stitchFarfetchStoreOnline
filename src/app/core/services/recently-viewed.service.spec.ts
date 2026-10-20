import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RecentlyViewedService } from './recently-viewed.service';

class MemoryStorage {
  private readonly data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

describe('RecentlyViewedService', () => {
  beforeEach(() => vi.stubGlobal('localStorage', new MemoryStorage()));
  afterEach(() => vi.unstubAllGlobals());

  it('keeps the newest first, once each, at most twelve, across reloads', () => {
    const recent = new RecentlyViewedService();
    ['a', 'b', 'a'].forEach((id) => recent.add(id));
    expect(recent.ids()).toEqual(['a', 'b']);

    Array.from({ length: 20 }, (_, i) => `p${i}`).forEach((id) => recent.add(id));
    expect(recent.ids()).toHaveLength(12);
    expect(new RecentlyViewedService().ids()[0]).toBe('p19');
  });
});
