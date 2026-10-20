import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'vestra.recent.v1';
const LIMIT = 12;

// The product pages you opened, newest first (Farfetch's "Recently viewed").
@Injectable({ providedIn: 'root' })
export class RecentlyViewedService {
  private readonly state = signal<readonly string[]>(readStored());

  readonly ids = this.state.asReadonly();

  add(id: string): void {
    const next = [id, ...this.state().filter((seen) => seen !== id)].slice(0, LIMIT);
    this.state.set(next);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
    } catch {
      // Blocked storage: remembered for this visit only.
    }
  }
}

function readStored(): string[] {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string').slice(0, LIMIT) : [];
  } catch {
    return [];
  }
}
