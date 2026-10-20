import { AgeGroup, CatalogItem } from './catalog.model';

// Size runs per department and category. Bags, accessories and jewelry are
// one size, so the product page skips the size picker for them.
const CLOTHING: Record<CatalogItem['department'], readonly string[]> = {
  womenswear: ['38 IT', '40 IT', '42 IT', '44 IT', '46 IT'],
  menswear: ['46 IT', '48 IT', '50 IT', '52 IT', '54 IT'],
  kids: ['4Y', '6Y', '8Y', '10Y', '12Y']
};

const SHOES: Record<CatalogItem['department'], readonly string[]> = {
  womenswear: ['36 EU', '37 EU', '38 EU', '39 EU', '40 EU'],
  menswear: ['40 EU', '41 EU', '42 EU', '43 EU', '44 EU'],
  kids: ['28 EU', '30 EU', '32 EU', '34 EU']
};

// Kidswear is sized by age group, so a bodysuit and a teen's T-shirt never
// share a size run.
const KIDS_CLOTHING: Record<AgeGroup, readonly string[]> = {
  baby: ['3M', '6M', '12M', '18M', '24M'],
  kids: ['4Y', '6Y', '8Y', '10Y', '12Y'],
  teens: ['13Y', '14Y', '15Y', '16Y']
};

const KIDS_SHOES: Record<AgeGroup, readonly string[]> = {
  baby: ['17 EU', '18 EU', '19 EU', '20 EU', '21 EU'],
  kids: ['28 EU', '30 EU', '32 EU', '34 EU'],
  teens: ['36 EU', '37 EU', '38 EU', '39 EU', '40 EU']
};

export function sizesFor(item: Pick<CatalogItem, 'department' | 'category' | 'ageGroup'>): readonly string[] {
  const age = item.department === 'kids' ? item.ageGroup : undefined;
  switch (item.category) {
    case 'clothing':
      return age ? KIDS_CLOTHING[age] : CLOTHING[item.department];
    case 'shoes':
      return age ? KIDS_SHOES[age] : SHOES[item.department];
    default:
      return [];
  }
}
