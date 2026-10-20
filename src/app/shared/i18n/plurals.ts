// Counts in running text, for the places an ICU plural can't go (bound
// attributes, TypeScript). Templates use ICU expressions instead. One
// message per CLDR category, so a language with more forms (Russian: one,
// few, many) translates each; the others repeat "other".

const rules = new Intl.PluralRules(typeof $localize !== 'undefined' && $localize.locale ? $localize.locale : 'en-US');

// "1 item", "3 items".
export function itemCount(count: number): string {
  switch (rules.select(count)) {
    case 'one':
      return $localize`:@@plural.item.one:${count}:count: item`;
    case 'few':
      return $localize`:@@plural.item.few:${count}:count: items`;
    case 'many':
      return $localize`:@@plural.item.many:${count}:count: items`;
    default:
      return $localize`:@@plural.item.other:${count}:count: items`;
  }
}

// "1 piece", "3 pieces".
export function pieceCount(count: number): string {
  switch (rules.select(count)) {
    case 'one':
      return $localize`:@@plural.piece.one:${count}:count: piece`;
    case 'few':
      return $localize`:@@plural.piece.few:${count}:count: pieces`;
    case 'many':
      return $localize`:@@plural.piece.many:${count}:count: pieces`;
    default:
      return $localize`:@@plural.piece.other:${count}:count: pieces`;
  }
}
