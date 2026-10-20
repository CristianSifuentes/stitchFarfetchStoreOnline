import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { BagSummary, DELIVERY_OPTIONS, DeliveryOption, FREE_DELIVERY_FROM } from '../../../core/bag/bag.model';
import { LocaleService } from '../../../core/locale';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { PAYMENT_METHODS } from '../../../shared/data/payment-methods';

// Farfetch's "Summary" box: subtotal, delivery, the total with the currency
// code, "Import duties included" and Continue. Delivery is chosen here; a
// line shows how far you are from free standard delivery.
@Component({
  selector: 'app-bag-summary',
  imports: [PricePipe],
  template: `
    <section class="border border-line p-6 sm:p-8" aria-labelledby="summary-heading">
      <h2 id="summary-heading" class="label-caps">Summary</h2>

      <dl class="mt-6 space-y-3 text-sm">
        <div class="flex justify-between">
          <dt class="text-muted">Subtotal <span class="text-xs">({{ summary().count }} {{ summary().count === 1 ? 'item' : 'items' }})</span></dt>
          <dd>{{ summary().subtotal | price }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-muted">Delivery</dt>
          <dd>{{ !summary().count ? '—' : summary().delivery ? (summary().delivery | price) : 'Free' }}</dd>
        </div>
      </dl>

      @if (summary().count) {
      <fieldset class="mt-6 space-y-2">
        <legend class="label-caps mb-3 text-muted">Delivery</legend>
        @for (option of options; track option.id) {
          <label
            class="flex cursor-pointer items-center justify-between gap-3 border px-4 py-3 text-sm transition-colors"
            [class.border-ink]="delivery() === option.id"
            [class.border-line]="delivery() !== option.id"
          >
            <span class="flex items-center gap-3">
              <input type="radio" name="delivery" class="h-3.5 w-3.5 accent-black" [checked]="delivery() === option.id" (change)="deliveryChange.emit(option.id)" />
              <span>
                <span class="block">{{ option.label }}</span>
                <span class="block text-xs text-muted">{{ option.eta }}</span>
              </span>
            </span>
            <span class="text-xs">{{ option.id === 'standard' && freeStandard() ? 'Free' : (option.fee | price) }}</span>
          </label>
        }
      </fieldset>
      }

      @if (summary().subtotal > 0 && summary().subtotal < freeFrom) {
        <div class="mt-5">
          <p class="text-xs text-muted">Add {{ freeFrom - summary().subtotal | price }} more for free standard delivery.</p>
          <div class="mt-2 h-px bg-line"><div class="h-px bg-ink transition-[width] duration-500" [style.width.%]="(summary().subtotal / freeFrom) * 100"></div></div>
        </div>
      }

      <div class="mt-6 flex items-baseline justify-between border-t border-line pt-6">
        <span class="label-caps">Total</span>
        <span class="text-xl"><span class="mr-1 text-xs text-muted">{{ locale.region().currency }}</span>{{ summary().total | price }}</span>
      </div>
      <p class="mt-1 text-right text-xs text-muted">Import duties included</p>

      <button type="button" class="btn btn-primary mt-6 w-full" [disabled]="!summary().count || placing()" (click)="checkout.emit()">
        @if (placing()) {
          <span class="h-3.5 w-3.5 animate-spin rounded-full border border-canvas border-t-transparent" aria-hidden="true"></span>
          Placing your order
        } @else {
          Continue
        }
      </button>
      @if (problem()) {
        <p class="mt-3 text-xs text-error" role="alert">{{ problem() }}</p>
      }

      <ul class="mt-6 flex flex-wrap gap-3 text-muted" aria-label="Accepted payment methods">
        @for (method of payments; track method.id) {
          <li [attr.title]="method.label">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" role="img" [attr.aria-label]="method.label"><path [attr.d]="method.path" /></svg>
          </li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BagSummaryComponent {
  protected readonly locale = inject(LocaleService);

  readonly summary = input.required<BagSummary>();
  readonly delivery = input.required<DeliveryOption>();
  readonly placing = input(false);
  // Why Continue can't go ahead yet, if it can't.
  readonly problem = input('');

  readonly deliveryChange = output<DeliveryOption>();
  readonly checkout = output();

  protected readonly options = DELIVERY_OPTIONS;
  protected readonly freeFrom = FREE_DELIVERY_FROM;
  protected readonly payments = PAYMENT_METHODS;

  protected freeStandard(): boolean {
    return this.summary().subtotal >= FREE_DELIVERY_FROM;
  }
}
