import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HomeStore } from '../../home/store/home.store';
import { MensProductDetailComponent } from '../components/mens-product-detail.component';
import { WomensProductDetailComponent } from '../components/womens-product-detail.component';
import { KidsProductDetailComponent } from '../components/kids-product-detail.component';
import { CatalogItem } from '../../../core/models/catalog-item.model';

@Component({
  selector: 'app-product-page',
  standalone: true,
  template: `
    @if (product(); as item) {
      @switch (item.category) {
        @case ('menswear') {
          <app-mens-product-detail [item]="item" />
        }
        @case ('womenswear') {
          <app-womens-product-detail [item]="item" />
        }
        @case ('kids') {
          <app-kids-product-detail [item]="item" />
        }
      }
    } @else {
      <p>Product not found.</p>
    }
  `,
  imports: [MensProductDetailComponent, WomensProductDetailComponent, KidsProductDetailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(HomeStore);
  private readonly location = inject(Location);

  protected readonly product = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return null;
    }

    const fromCatalog = this.store.catalog().find((x) => x.id === id);
    if (fromCatalog) {
      return fromCatalog;
    }

    const state = this.location.getState() as { productPreview?: CatalogItem };
    const fromNavigation = state.productPreview;
    if (fromNavigation?.id === id) {
      return fromNavigation;
    }

    return null;
  });
}
