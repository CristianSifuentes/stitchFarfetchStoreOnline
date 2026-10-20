// The two axes every product is organized by, mirroring Farfetch:
// a department (who it's for) and a category (what it is).
export type Department = 'womenswear' | 'menswear' | 'kids';
export type ProductCategory = 'clothing' | 'shoes' | 'bags' | 'accessories' | 'jewelry';
// Curated edits that cut across categories (Farfetch's "Gifts", "Party
// looks", seasonal campaigns): a product can belong to several.
export type ProductEdit = 'gifts' | 'party' | 'winter' | 'heritage';

export interface CatalogItem {
  id: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  department: Department;
  category: ProductCategory;
  description: string;
  // ISO date; drives "Newest first" and the "New In" edits.
  addedAt: string;
  // A short merchandising label shown on the card, e.g. "New Season".
  badge?: string;
  edits: ProductEdit[];
  // Present when the piece is on sale; price stays the original.
  salePrice?: number;
}

// What the customer pays.
export function effectivePrice(item: Pick<CatalogItem, 'price' | 'salePrice'>): number {
  return item.salePrice ?? item.price;
}

// "-30%", rounded to whole percent; 0 when not on sale.
export function discountPercent(item: Pick<CatalogItem, 'price' | 'salePrice'>): number {
  return item.salePrice ? Math.round((1 - item.salePrice / item.price) * 100) : 0;
}
