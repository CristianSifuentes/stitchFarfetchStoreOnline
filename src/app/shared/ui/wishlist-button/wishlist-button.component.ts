import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { WishlistService } from '../../../core/services/wishlist.service';

// The one heart in the app. Sits in a card's corner (or wherever the host
// places it) and reads/writes the shared WishlistService.
@Component({
  selector: 'app-wishlist-button',
  template: `
    <button
      type="button"
      class="flex h-8 w-8 items-center justify-center rounded-full bg-canvas/90 transition-colors hover:bg-canvas"
      [attr.aria-pressed]="saved()"
      [attr.aria-label]="saved() ? removeLabel() : saveLabel()"
      (click)="toggle($event)"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" [attr.fill]="saved() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistButtonComponent {
  private readonly wishlist = inject(WishlistService);

  readonly productId = input.required<string>();
  // Accessible name, e.g. "Prada Galleria tote".
  readonly label = input($localize`:@@wishlist.thisItem:this item`);

  protected readonly saved = computed(() => this.wishlist.has(this.productId()));
  protected readonly saveLabel = computed(() => $localize`:@@wishlist.save:Save ${this.label()}:item: to wishlist`);
  protected readonly removeLabel = computed(() => $localize`:@@wishlist.remove:Remove ${this.label()}:item: from wishlist`);

  protected toggle(event: Event): void {
    // The button often sits inside a card link.
    event.preventDefault();
    event.stopPropagation();
    this.wishlist.toggle(this.productId());
  }
}
