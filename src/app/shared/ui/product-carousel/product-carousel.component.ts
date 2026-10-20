import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, input, signal, viewChild } from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { CatalogItem } from '../../../core/catalog/catalog.model';
import { ProductCardComponent } from '../product-card/product-card.component';

// A horizontal rail of product cards ("New in daily", an edit's pieces):
// scroll-snap on touch, arrow buttons on desktop that appear only when
// there's more to see, and an "Explore more" link to the full listing.
@Component({
  selector: 'app-product-carousel',
  imports: [RouterLink, ProductCardComponent],
  template: `
    <section [attr.aria-label]="title()">
      <div class="mb-8 flex items-end justify-between gap-6">
        <div>
          @if (eyebrow()) {
            <p class="label-caps mb-2 text-muted">{{ eyebrow() }}</p>
          }
          <h2 class="text-headline">{{ title() }}</h2>
        </div>
        <div class="flex shrink-0 items-center gap-6">
          <div class="hidden gap-2 md:flex">
            <button type="button" class="flex h-10 w-10 items-center justify-center border border-line transition-colors hover:border-ink disabled:opacity-30" aria-label="Previous products" i18n-aria-label="@@carousel.previous" [disabled]="!canPrev()" (click)="scroll(-1)">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
            </button>
            <button type="button" class="flex h-10 w-10 items-center justify-center border border-line transition-colors hover:border-ink disabled:opacity-30" aria-label="Next products" i18n-aria-label="@@carousel.next" [disabled]="!canNext()" (click)="scroll(1)">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </button>
          </div>
          @if (actionLink()) {
            <a class="link-cta" [routerLink]="actionLink()" [queryParams]="actionQuery()">{{ actionLabel() }}</a>
          }
        </div>
      </div>

      <ul
        #rail
        class="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 md:gap-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
        (scroll)="measure()"
      >
        @for (item of items(); track item.id) {
          <li class="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[calc((100%-4.5rem)/4.4)]">
            <app-product-card [item]="item" />
          </li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCarouselComponent {
  readonly title = input.required<string>();
  readonly items = input.required<ReadonlyArray<CatalogItem>>();
  readonly eyebrow = input('');
  readonly actionLabel = input($localize`:@@common.exploreMore:Explore more`);
  readonly actionLink = input<string | null>(null);
  readonly actionQuery = input<Params | null>(null);

  private readonly rail = viewChild.required<ElementRef<HTMLElement>>('rail');
  protected readonly canPrev = signal(false);
  protected readonly canNext = signal(true);

  constructor() {
    afterNextRender(() => this.measure());
  }

  protected measure(): void {
    const { scrollLeft, scrollWidth, clientWidth } = this.rail().nativeElement;
    this.canPrev.set(scrollLeft > 1);
    this.canNext.set(scrollLeft + clientWidth < scrollWidth - 1);
  }

  // Pages by most of the visible width.
  protected scroll(direction: 1 | -1): void {
    const rail = this.rail().nativeElement;
    const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.9, behavior: reduced ? 'auto' : 'smooth' });
  }
}
