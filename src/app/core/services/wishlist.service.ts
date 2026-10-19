import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'farfetch.wishlist.v1';

// App-wide wishlist: every heart reads and writes here, so the same product
// is saved on every page and the header count stays in sync.
@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly ids = signal<ReadonlySet<string>>(readStored());

  readonly count = computed(() => this.ids().size);

  has(id: string): boolean {
    return this.ids().has(id);
  }

  toggle(id: string): void {
    const next = new Set(this.ids());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.ids.set(next);
    persist(next);
  }
}

function readStored(): ReadonlySet<string> {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []);
  } catch {
    return new Set();
  }
}

function persist(ids: ReadonlySet<string>): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
    }
  } catch {
    // Private mode or blocked storage: the wishlist still works for this visit.
  }
}
