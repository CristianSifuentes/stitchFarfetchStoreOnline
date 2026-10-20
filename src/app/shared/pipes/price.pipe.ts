import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocaleService } from '../../core/locale/locale.service';

// A catalog price in the visitor's currency: "$2,950", "2.925 €", "£2,272".
// Impure so it re-runs when the region changes; the region is a signal, so
// the views that use it are refreshed when it does.
@Pipe({ name: 'price', pure: false })
export class PricePipe implements PipeTransform {
  private readonly locale = inject(LocaleService);

  transform(value: number | null | undefined): string {
    return value == null ? '' : this.locale.format(value);
  }
}
