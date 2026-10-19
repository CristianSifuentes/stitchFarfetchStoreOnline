import { Department, ProductCategory } from './catalog.model';

export interface DepartmentInfo {
  readonly id: Department;
  // Header tab and breadcrumb ("Women").
  readonly label: string;
  // Possessive for titles ("Women's Clothing").
  readonly possessive: string;
  readonly path: string;
}

export const DEPARTMENTS: ReadonlyArray<DepartmentInfo> = [
  { id: 'womenswear', label: 'Women', possessive: "Women's", path: '/womenswear' },
  { id: 'menswear', label: 'Men', possessive: "Men's", path: '/menswear' },
  { id: 'kids', label: 'Kids', possessive: "Kids'", path: '/kids' }
];

// Display order is the order Farfetch uses in its category navigation.
export const CATEGORIES: ReadonlyArray<{ readonly id: ProductCategory; readonly label: string }> = [
  { id: 'clothing', label: 'Clothing' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'bags', label: 'Bags' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'jewelry', label: 'Jewelry' }
];

export function departmentInfo(id: Department): DepartmentInfo {
  return DEPARTMENTS.find((department) => department.id === id) ?? DEPARTMENTS[0];
}

export function categoryLabel(id: ProductCategory): string {
  return CATEGORIES.find((category) => category.id === id)?.label ?? id;
}

export function isDepartment(value: unknown): value is Department {
  return DEPARTMENTS.some((department) => department.id === value);
}

export function isCategory(value: unknown): value is ProductCategory {
  return CATEGORIES.some((category) => category.id === value);
}
