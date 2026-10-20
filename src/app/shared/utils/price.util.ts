import { RegionInfo, formatMoney } from '../../core/locale/locale.model';

// "$2,950": whole units, the way luxury prices are shown everywhere. In US
// dollars unless a region is given (then converted to its currency).
export function formatPrice(value: number, region?: RegionInfo): string {
  return formatMoney(value, region);
}
