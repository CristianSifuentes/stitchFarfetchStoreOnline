import { Injectable, computed, inject, linkedSignal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { BagLine, addLine, changeQuantity, changeSize, isBagLine, mergeBags } from './bag.model';

const STORAGE_KEY = 'vestra.bag.v1';

export function bagKey(email: string | null): string {
  return email ? `${STORAGE_KEY}:${email}` : STORAGE_KEY;
}

// The shopping bag. Like the wishlist it follows the session: one bag per
// account in this browser, plus the guest's, which joins the account's on
// sign-in. Lines are kept in the order they were added.
@Injectable({ providedIn: 'root' })
export class BagService {
  private readonly auth = inject(AuthService);

  private readonly state = linkedSignal<string | null, readonly BagLine[]>({
    source: () => this.auth.account()?.email ?? null,
    computation: (email, previous) => {
      if (email && previous && previous.source === null && previous.value.length) {
        const merged = mergeBags(readStored(bagKey(email)), previous.value);
        persist(bagKey(email), merged);
        persist(bagKey(null), []);
        return merged;
      }
      return readStored(bagKey(email));
    }
  });

  readonly lines = this.state.asReadonly();
  // Pieces in the bag, counting quantities (the header badge).
  readonly count = computed(() => this.state().reduce((sum, line) => sum + line.quantity, 0));

  add(id: string, size: string | null = null, quantity = 1): void {
    this.save(addLine(this.state(), id, size, quantity));
  }

  setSize(index: number, size: string): void {
    this.save(changeSize(this.state(), index, size));
  }

  setQuantity(index: number, quantity: number): void {
    this.save(changeQuantity(this.state(), index, quantity));
  }

  remove(index: number): void {
    this.save(this.state().filter((_, i) => i !== index));
  }

  // Puts a removed line back where it was (the page's "Undo").
  restore(line: BagLine, index: number): void {
    const next = [...this.state()];
    next.splice(Math.max(0, Math.min(index, next.length)), 0, line);
    this.save(next);
  }

  clear(): void {
    this.save([]);
  }

  private save(lines: readonly BagLine[]): void {
    this.state.set(lines);
    persist(bagKey(this.auth.account()?.email ?? null), lines);
  }
}

function readStored(key: string): BagLine[] {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isBagLine) : [];
  } catch {
    return [];
  }
}

function persist(key: string, lines: readonly BagLine[]): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(lines));
    }
  } catch {
    // Blocked storage: the bag still works for this visit.
  }
}
