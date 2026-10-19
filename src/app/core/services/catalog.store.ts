import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { CatalogItem, Department } from '../catalog/catalog.model';
import { environment } from '../../../environments/environment';

// The one source of products for every feature. Loaded once; pages derive
// their views from it with computed() instead of keeping their own copies.
@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly items = toSignal(
    inject(HttpClient)
      .get<CatalogItem[]>(`${environment.apiUrl}/catalog.json`)
      .pipe(catchError(() => of([] as CatalogItem[]))),
    { initialValue: null }
  );

  readonly loading = computed(() => this.items() === null);
  readonly all = computed(() => this.items() ?? []);

  // Newest first across the whole catalog.
  readonly newest = computed(() => [...this.all()].sort(byNewest));

  byDepartment(department: Department): CatalogItem[] {
    return this.all().filter((item) => item.department === department);
  }

  find(id: string): CatalogItem | undefined {
    return this.all().find((item) => item.id === id);
  }
}

export function byNewest(a: CatalogItem, b: CatalogItem): number {
  return b.addedAt.localeCompare(a.addedAt);
}
