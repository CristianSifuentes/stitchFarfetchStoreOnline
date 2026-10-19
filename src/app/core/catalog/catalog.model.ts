// The two axes every product is organized by, mirroring Farfetch:
// a department (who it's for) and a category (what it is).
export type Department = 'womenswear' | 'menswear' | 'kids';
export type ProductCategory = 'clothing' | 'shoes' | 'bags' | 'accessories' | 'jewelry';

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
}
