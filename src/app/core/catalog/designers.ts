import { CatalogItem, ProductCategory } from './catalog.model';

export interface DesignerFeature {
  readonly name: string;
  readonly image: string;
  // Lowest price across the designer's pieces.
  readonly from: number;
}

// What best represents a house on a designer tile: clothing first, then
// bags and shoes; a wallet or a ring is the last resort.
const SIGNATURE_ORDER: readonly ProductCategory[] = ['clothing', 'bags', 'shoes', 'accessories', 'jewelry'];

// Pictures a designer with its most representative piece (newest within the
// best category), and its entry price. Null when the designer has no pieces.
export function featureDesigner(items: readonly CatalogItem[], name: string): DesignerFeature | null {
  const pieces = items.filter((item) => item.brand === name);
  if (!pieces.length) {
    return null;
  }
  const signature = [...pieces].sort(
    (a, b) =>
      SIGNATURE_ORDER.indexOf(a.category) - SIGNATURE_ORDER.indexOf(b.category) || b.addedAt.localeCompare(a.addedAt)
  )[0];
  return { name, image: signature.image, from: Math.min(...pieces.map((item) => item.price)) };
}
