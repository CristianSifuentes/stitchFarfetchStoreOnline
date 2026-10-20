import '@angular/compiler';
import { Injector, signal } from '@angular/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Account } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';
import { WishlistService, mergeWishlists, wishlistKey } from './wishlist.service';

class MemoryStorage {
  private readonly data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
}

const alex: Account = { name: 'Alex Morgan', email: 'alex@example.com', provider: 'email' };

// The wishlist with a session we control.
function setup() {
  const account = signal<Account | null>(null);
  const injector = Injector.create({
    providers: [{ provide: AuthService, useValue: { account } }, { provide: WishlistService }]
  });
  return { account, wishlist: injector.get(WishlistService) };
}

describe('mergeWishlists', () => {
  it("keeps the account's pieces first and adds the guest's new ones", () => {
    expect(mergeWishlists(['a', 'b'], ['b', 'c'])).toEqual(['a', 'b', 'c']);
  });
});

describe('WishlistService', () => {
  beforeEach(() => vi.stubGlobal('localStorage', new MemoryStorage()));
  afterEach(() => vi.unstubAllGlobals());

  it('lists the most recently saved first', () => {
    const { wishlist } = setup();
    wishlist.toggle('a');
    wishlist.toggle('b');
    expect(wishlist.items()).toEqual(['b', 'a']);
    wishlist.toggle('a');
    expect(wishlist.items()).toEqual(['b']);
  });

  it("folds the guest's pieces into the account on sign-in, then keeps them apart", () => {
    localStorage.setItem(wishlistKey(alex.email), JSON.stringify(['saved-before']));
    const { account, wishlist } = setup();
    wishlist.toggle('guest-pick');

    account.set(alex);
    expect(wishlist.items()).toEqual(['guest-pick', 'saved-before']);
    expect(JSON.parse(localStorage.getItem(wishlistKey(null)) ?? '')).toEqual([]);

    wishlist.toggle('while-signed-in');
    account.set(null);
    expect(wishlist.count()).toBe(0);

    account.set(alex);
    expect(wishlist.items()).toEqual(['while-signed-in', 'guest-pick', 'saved-before']);
  });

  it('puts a removed piece back where it was', () => {
    const { wishlist } = setup();
    ['a', 'b', 'c'].forEach((id) => wishlist.toggle(id));
    const index = wishlist.indexOf('b');
    wishlist.remove('b');
    wishlist.restore('b', index);
    expect(wishlist.items()).toEqual(['c', 'b', 'a']);
  });
});
