import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CatalogItem } from '../../../core/models/catalog-item.model';

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private readonly http = inject(HttpClient);

  list() {
    return this.http.get<CatalogItem[]>('/assets/data/catalog.json');
  }
}
