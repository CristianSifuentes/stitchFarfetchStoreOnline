import { AgeGroup, Department, ProductCategory, ProductEdit } from './catalog.model';

export interface DepartmentInfo {
  readonly id: Department;
  // Header tab and breadcrumb ("Women").
  readonly label: string;
  // Qualifies a title ("Women's" Clothing). Titles are whole messages with
  // it as a placeholder, so each language puts it where it belongs
  // ("Ropa de mujer").
  readonly possessive: string;
  readonly path: string;
}

export const DEPARTMENTS: ReadonlyArray<DepartmentInfo> = [
  { id: 'womenswear', label: $localize`:@@dept.women:Women`, possessive: $localize`:@@dept.women.possessive:Women's`, path: '/womenswear' },
  { id: 'menswear', label: $localize`:@@dept.men:Men`, possessive: $localize`:@@dept.men.possessive:Men's`, path: '/menswear' },
  { id: 'kids', label: $localize`:@@dept.kids:Kids`, possessive: $localize`:@@dept.kids.possessive:Kids'`, path: '/kids' }
];

// Display order is the order Farfetch uses in its category navigation.
export const CATEGORIES: ReadonlyArray<{ readonly id: ProductCategory; readonly label: string }> = [
  { id: 'clothing', label: $localize`:@@category.clothing:Clothing` },
  { id: 'shoes', label: $localize`:@@category.shoes:Shoes` },
  { id: 'bags', label: $localize`:@@category.bags:Bags` },
  { id: 'accessories', label: $localize`:@@category.accessories:Accessories` },
  { id: 'jewelry', label: $localize`:@@category.jewelry:Jewelry` }
];

export interface AgeGroupInfo {
  readonly id: AgeGroup;
  readonly label: string;
  // "0–36 months", shown next to the label.
  readonly range: string;
  readonly description: string;
}

export const AGE_GROUPS: ReadonlyArray<AgeGroupInfo> = [
  {
    id: 'baby',
    label: $localize`:@@age.baby:Baby`,
    range: $localize`:@@age.baby.range:0–36 months`,
    description: $localize`:@@age.baby.description:Soft knits, bodysuits and first layers for the littlest ones, in the gentlest fabrics.`
  },
  {
    id: 'kids',
    label: $localize`:@@age.kids:Kids`,
    range: $localize`:@@age.kids.range:2–12 years`,
    description: $localize`:@@age.kids.description:Play-proof outerwear, everyday staples and party pieces for growing wardrobes.`
  },
  {
    id: 'teens',
    label: $localize`:@@age.teens:Teens`,
    range: $localize`:@@age.teens.range:13–16 years`,
    description: $localize`:@@age.teens.description:Sneakers, statement jewelry and streetwear staples for teens with a point of view.`
  }
];

export interface EditInfo {
  readonly id: ProductEdit;
  readonly label: string;
  readonly description: string;
}

export const EDITS: ReadonlyArray<EditInfo> = [
  {
    id: 'gifts',
    label: $localize`:@@nav.gifts:Gifts`,
    description: $localize`:@@edit.gifts.description:Considered gifts and little luxuries: jewelry, eyewear, small leather goods and more.`
  },
  {
    id: 'party',
    label: $localize`:@@edit.party:Party Looks`,
    description: $localize`:@@edit.party.description:Evening dressing for the season of celebrations, from gowns and tailoring to finishing touches.`
  },
  {
    id: 'winter',
    label: $localize`:@@edit.winter:The Winter Edit`,
    description: $localize`:@@edit.winter.description:Coats, knitwear and boots for the coldest months, cut by the houses that master outerwear.`
  },
  {
    id: 'heritage',
    label: $localize`:@@edit.heritage:Modern Heritage`,
    description: $localize`:@@edit.heritage.description:Trench coats, brogues and check tailoring: the classics, quietly reinvented.`
  }
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

export function ageGroupInfo(id: AgeGroup): AgeGroupInfo {
  return AGE_GROUPS.find((group) => group.id === id) ?? AGE_GROUPS[0];
}

export function isAgeGroup(value: unknown): value is AgeGroup {
  return AGE_GROUPS.some((group) => group.id === value);
}
