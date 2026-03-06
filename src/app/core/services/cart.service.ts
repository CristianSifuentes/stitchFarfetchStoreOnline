import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly items = signal<string[]>([]);
  readonly total = computed(() => this.items().length);

  add(id: string): void {
    this.items.update((v) => [...v, id]);
  }
}
