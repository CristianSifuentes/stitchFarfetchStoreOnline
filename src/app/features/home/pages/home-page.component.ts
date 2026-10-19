import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DEPARTMENTS, featureDesigner } from '../../../core/catalog';
import { CatalogStore } from '../../../core/services/catalog.store';
import { BrandStripComponent } from '../../../shared/ui/brand-strip/brand-strip.component';
import { DesignerCardComponent } from '../../../shared/ui/designer-card/designer-card.component';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card.component';
import { SectionHeaderComponent } from '../../../shared/ui/section-header/section-header.component';

const DEPARTMENT_IMAGES: Record<string, string> = {
  womenswear: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  menswear: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80',
  kids: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80'
};

// One designer per department's headline house.
const FEATURED_DESIGNERS = [
  { name: 'Bottega Veneta', eyebrow: 'New Season' },
  { name: 'Max Mara', eyebrow: 'Investment Piece' },
  { name: 'Saint Laurent', eyebrow: 'Icons of the House' },
  { name: 'Burberry Kids', eyebrow: 'Heritage for Kids' }
] as const;

const HOME_BRANDS = ['Prada', 'Gucci', 'Saint Laurent', 'Burberry', 'Loewe', 'Balenciaga'] as const;

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, SectionHeaderComponent, ProductCardComponent, DesignerCardComponent, BrandStripComponent],
  template: `
    <div class="page-container">
      <section class="pt-12" aria-labelledby="departments-heading">
        <p class="label-caps mb-3 text-center text-muted">SS24 Collection</p>
        <h1 id="departments-heading" class="text-headline mb-10 text-center">Choose your world</h1>
        <div class="grid grid-cols-3 gap-2 md:gap-4">
          @for (department of departments; track department.id) {
            <a [routerLink]="department.path" class="group relative block aspect-[3/4] overflow-hidden bg-surface">
              <img [src]="images[department.id]" [alt]="department.label" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="eager" />
              <div class="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/5"></div>
              <span class="btn btn-light absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2.5 md:bottom-8 md:px-10 md:py-4">{{ department.label }}</span>
            </a>
          }
        </div>
      </section>

      <section class="section-y grid items-center gap-10 lg:grid-cols-2 lg:gap-16" aria-labelledby="editorial-heading">
        <div class="space-y-6">
          <p class="label-caps text-muted">The Modern Muse</p>
          <h2 id="editorial-heading" class="text-display">The new generation of style</h2>
          <p class="max-w-md leading-relaxed text-muted">
            Curated pieces from the world’s most iconic designers, blending timeless craftsmanship with contemporary silhouettes.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <a routerLink="/womenswear/items" [queryParams]="{ sort: 'newest' }" class="btn btn-primary">Shop women</a>
            <a routerLink="/menswear/items" [queryParams]="{ sort: 'newest' }" class="btn btn-secondary">Shop men</a>
          </div>
        </div>
        <div class="aspect-square overflow-hidden bg-surface">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80" alt="Editorial fashion still life" class="h-full w-full object-cover" loading="lazy" />
        </div>
      </section>

      <app-brand-strip [brands]="brands" />

      <section class="section-y" aria-labelledby="designers-heading">
        <app-section-header eyebrow="Curated for you" title="This season’s designers" actionLabel="Shop all" actionLink="/search" />
        <div class="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          @for (designer of designers(); track designer.name) {
            <app-designer-card
              [name]="designer.name"
              [eyebrow]="designer.eyebrow"
              [image]="designer.image"
              [from]="designer.from"
              link="/search"
              [queryParams]="{ designer: designer.name }"
            />
          }
        </div>
      </section>

      <section aria-labelledby="new-in-heading">
        <app-section-header
          eyebrow="Just landed"
          title="New In"
          description="The latest arrivals across womenswear, menswear and kidswear."
          actionLabel="View all"
          actionLink="/search"
          [actionQuery]="{ sort: 'newest' }"
        />
        <div class="product-grid">
          @for (item of newIn(); track item.id) {
            <app-product-card [item]="item" />
          } @empty {
            @for (n of skeletons; track n) {
              <div aria-hidden="true"><div class="aspect-[3/4] animate-pulse bg-surface"></div></div>
            }
          }
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  private readonly catalog = inject(CatalogStore);

  protected readonly departments = DEPARTMENTS;
  protected readonly images = DEPARTMENT_IMAGES;
  protected readonly brands = HOME_BRANDS;
  protected readonly skeletons = Array.from({ length: 8 }, (_, i) => i);

  protected readonly newIn = computed(() => this.catalog.newest().slice(0, 8));

  protected readonly designers = computed(() =>
    FEATURED_DESIGNERS.flatMap((designer) => {
      const feature = featureDesigner(this.catalog.all(), designer.name);
      return feature ? [{ ...feature, eyebrow: designer.eyebrow }] : [];
    })
  );
}
