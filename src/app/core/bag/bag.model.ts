import { CatalogItem, effectivePrice } from '../catalog/catalog.model';

// One row of the shopping bag: a piece, in a size, some times. The size is
// null when the piece came from a quick "Add to bag" and still needs one.
export interface BagLine {
  readonly id: string;
  readonly size: string | null;
  readonly quantity: number;
}

export type DeliveryOption = 'standard' | 'express';

export interface DeliveryInfo {
  readonly id: DeliveryOption;
  readonly label: string;
  readonly eta: string;
  // US dollars, like the catalog.
  readonly fee: number;
}

// Matches the promo bar: standard delivery is free from $200.
export const FREE_DELIVERY_FROM = 200;
export const MAX_QUANTITY = 10;

export const DELIVERY_OPTIONS: ReadonlyArray<DeliveryInfo> = [
  { id: 'standard', label: $localize`:@@delivery.standard:Standard`, eta: $localize`:@@delivery.standard.eta:2–4 business days`, fee: 20 },
  { id: 'express', label: $localize`:@@delivery.express:Express`, eta: $localize`:@@delivery.express.eta:1–2 business days`, fee: 35 }
];

export function sameLine(line: BagLine, id: string, size: string | null): boolean {
  return line.id === id && line.size === size;
}

// Adding a piece already in the bag in the same size raises its quantity.
export function addLine(lines: readonly BagLine[], id: string, size: string | null, quantity = 1): BagLine[] {
  const existing = lines.find((line) => sameLine(line, id, size));
  if (existing) {
    return lines.map((line) => (line === existing ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + quantity) } : line));
  }
  return [...lines, { id, size, quantity: Math.min(MAX_QUANTITY, quantity) }];
}

// Changing a line's size to one already in the bag merges the two.
export function changeSize(lines: readonly BagLine[], index: number, size: string): BagLine[] {
  const target = lines[index];
  if (!target || target.size === size) {
    return [...lines];
  }
  const twin = lines.findIndex((line, i) => i !== index && sameLine(line, target.id, size));
  if (twin === -1) {
    return lines.map((line, i) => (i === index ? { ...line, size } : line));
  }
  return lines
    .map((line, i) => (i === twin ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + target.quantity) } : line))
    .filter((_, i) => i !== index);
}

export function changeQuantity(lines: readonly BagLine[], index: number, quantity: number): BagLine[] {
  const clamped = Math.max(1, Math.min(MAX_QUANTITY, Math.round(quantity)));
  return lines.map((line, i) => (i === index ? { ...line, quantity: clamped } : line));
}

// Signing in keeps what was in the guest's bag.
export function mergeBags(account: readonly BagLine[], guest: readonly BagLine[]): BagLine[] {
  return guest.reduce((lines, line) => addLine(lines, line.id, line.size, line.quantity), [...account]);
}

export interface BagEntry {
  readonly line: BagLine;
  // Position in the bag, for edits.
  readonly index: number;
  readonly item: CatalogItem;
  readonly lineTotal: number;
}

export interface BagSummary {
  readonly available: readonly BagEntry[];
  // Sold out since they were added: shown apart and never charged.
  readonly unavailable: readonly BagEntry[];
  readonly count: number;
  readonly subtotal: number;
  readonly delivery: number;
  readonly total: number;
  // Lines that still need a size before checkout.
  readonly missingSizes: number;
}

// Everything the bag page shows, from one pure function. Prices are the ones
// actually paid (sale prices included); delivery is free from $200 on the
// standard option.
export function summarizeBag(
  lines: readonly BagLine[],
  find: (id: string) => CatalogItem | undefined,
  sizesFor: (item: CatalogItem) => readonly string[],
  option: DeliveryOption
): BagSummary {
  const entries = lines.flatMap((line, index) => {
    const item = find(line.id);
    return item ? [{ line, index, item, lineTotal: effectivePrice(item) * line.quantity }] : [];
  });
  const available = entries.filter((entry) => !entry.item.soldOut);
  const unavailable = entries.filter((entry) => entry.item.soldOut);
  const subtotal = available.reduce((sum, entry) => sum + entry.lineTotal, 0);
  const info = DELIVERY_OPTIONS.find((delivery) => delivery.id === option) ?? DELIVERY_OPTIONS[0];
  const delivery = !available.length ? 0 : option === 'standard' && subtotal >= FREE_DELIVERY_FROM ? 0 : info.fee;
  return {
    available,
    unavailable,
    count: available.reduce((sum, entry) => sum + entry.line.quantity, 0),
    subtotal,
    delivery,
    total: subtotal + delivery,
    missingSizes: available.filter((entry) => entry.line.size === null && sizesFor(entry.item).length > 0).length
  };
}

export function isBagLine(value: unknown): value is BagLine {
  const line = value as Partial<BagLine> | null;
  return (
    typeof line?.id === 'string' &&
    (line.size === null || typeof line.size === 'string') &&
    typeof line.quantity === 'number' &&
    line.quantity >= 1
  );
}
