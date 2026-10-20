import { Department, ProductCategory, ProductEdit } from './catalog.model';

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

export interface EditInfo {
  readonly id: ProductEdit;
  readonly label: string;
  readonly description: string;
}

export const EDITS: ReadonlyArray<EditInfo> = [
  { id: 'gifts', label: 'Gifts', description: 'Considered gifts and little luxuries: jewelry, eyewear, small leather goods and more.' },
  { id: 'party', label: 'Party Looks', description: 'Evening dressing for the season of celebrations, from gowns and tailoring to finishing touches.' },
  { id: 'winter', label: 'The Winter Edit', description: 'Coats, knitwear and boots for the coldest months, cut by the houses that master outerwear.' },
  { id: 'heritage', label: 'Modern Heritage', description: 'Trench coats, brogues and check tailoring: the classics, quietly reinvented.' }
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

export function editInfo(id: ProductEdit): EditInfo {
  return EDITS.find((edit) => edit.id === id) ?? EDITS[0];
}

export function isEdit(value: unknown): value is ProductEdit {
  return EDITS.some((edit) => edit.id === value);
}
