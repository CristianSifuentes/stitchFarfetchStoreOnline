export interface CatalogItem {
  id: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  category: 'womenswear' | 'menswear' | 'kids';
  description: string;
}
