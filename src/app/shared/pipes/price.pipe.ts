import { Pipe, PipeTransform } from '@angular/core';
import { formatPrice } from '../utils/price.util';

// "$2,950": whole dollars, the way luxury prices are shown everywhere.
@Pipe({ name: 'price' })
export class PricePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return value == null ? '' : formatPrice(value);
  }
}
