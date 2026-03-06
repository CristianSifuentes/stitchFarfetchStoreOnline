import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { CatalogApiService } from '../services/catalog-api.service';

@Injectable({ providedIn: 'root' })
export class HomeStore {
  private readonly api = inject(CatalogApiService);

  readonly catalog = toSignal(this.api.list(), { initialValue: [] });
  readonly womenswear = computed(() => this.catalog().filter((x) => x.category === 'womenswear'));
  readonly menswear = computed(() => this.catalog().filter((x) => x.category === 'menswear'));
  readonly kidswear = computed(() => this.catalog().filter((x) => x.category === 'kids'));

  readonly heroTitle = toSignal(this.api.list().pipe(map(() => 'The New Generation of Style')), {
    initialValue: 'Loading…'
  });
}
