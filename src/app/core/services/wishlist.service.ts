import { Injectable, computed, inject, linkedSignal } from '@angular/core';
import { AuthService } from '../auth/auth.service';

const STORAGE_KEY = 'vestra.wishlist.v1';

// Where a wishlist lives: one per account, plus the guest's.
export function wishlistKey(email: string | null): string {
  return email ? `${STORAGE_KEY}:${email}` : STORAGE_KEY;
}

// Signing in keeps what you saved as a guest: the account's pieces, then the
// guest's new ones, in the order they were saved.
export function mergeWishlists(account: readonly string[], guest: readonly string[]): string[] {
  return [...new Set([...account, ...guest])];
}

// App-wide wishlist: every heart reads and writes here, so the same product
// is saved on every page and the header count stays in sync. It follows the
// session: signed in, it is that account's list (kept per account in this
// browser); signed out, the guest's.
@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly auth = inject(AuthService);

  // Ordered, oldest first. Re-read whenever the account changes; on
  // sign-in the guest list is folded into the account's and cleared.
  private readonly ids = linkedSignal<string | null, readonly string[]>({
    source: () => this.auth.account()?.email ?? null,
    computation: (email, previous) => {
      if (email && previous && previous.source === null) {
        const merged = mergeWishlists(readStored(wishlistKey(email)), previous.value);
        persist(wishlistKey(email), merged);
        persist(wishlistKey(null), []);
        return merged;
      }
      return readStored(wishlistKey(email));
    }
  });

  private readonly set = computed(() => new Set(this.ids()));

  readonly count = computed(() => this.ids().length);
  // Most recently saved first, as the wishlist page shows them.
  readonly items = computed(() => [...this.ids()].reverse());

  has(id: string): boolean {
    return this.set().has(id);
  }

  toggle(id: string): void {
    this.save(this.has(id) ? this.ids().filter((saved) => saved !== id) : [...this.ids(), id]);
  }

  remove(id: string): void {
    this.save(this.ids().filter((saved) => saved !== id));
  }

  // Puts a removed piece back where it was (the page's "Undo").
  restore(id: string, index: number): void {
    if (this.has(id)) {
      return;
    }
    const next = [...this.ids()];
    next.splice(Math.max(0, Math.min(index, next.length)), 0, id);
    this.save(next);
  }

  indexOf(id: string): number {
    return this.ids().indexOf(id);
  }

  private save(ids: readonly string[]): void {
    this.ids.set(ids);
    persist(wishlistKey(this.auth.account()?.email ?? null), ids);
  }
}

function readStored(key: string): string[] {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is string => typeof id === 'string'))] : [];
  } catch {
    return [];
  }
}

function persist(key: string, ids: readonly string[]): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(ids));
    }
  } catch {
    // Private mode or blocked storage: the wishlist still works for this visit.
  }
}
