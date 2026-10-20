// The two choices of Farfetch's "Language | Region" selector. A region sets
// the currency prices are shown in; a language is the one the site is read in.

export type LanguageId = 'ru' | 'es-419' | 'de' | 'zh-Hans' | 'fr' | 'en-US';

export interface LanguageInfo {
  readonly id: LanguageId;
  // In the language itself: "Deutsch".
  readonly nativeName: string;
  // In the UI's language: "German".
  readonly name: string;
  // For the header button: "DE".
  readonly short: string;
}

export const LANGUAGES: ReadonlyArray<LanguageInfo> = [
  { id: 'ru', nativeName: 'Русский', name: 'Russian', short: 'RU' },
  { id: 'es-419', nativeName: 'Español (latinoamericano)', name: 'Spanish (Latin American)', short: 'ES' },
  { id: 'de', nativeName: 'Deutsch', name: 'German', short: 'DE' },
  { id: 'zh-Hans', nativeName: '中文（简体）', name: 'Chinese (Simplified)', short: 'ZH' },
  { id: 'fr', nativeName: 'Français', name: 'French', short: 'FR' },
  { id: 'en-US', nativeName: 'English (American)', name: 'English (American)', short: 'EN' }
];

export type RegionId = 'US' | 'MX' | 'CA' | 'BR' | 'GB' | 'FR' | 'DE' | 'IT' | 'ES' | 'AE' | 'CN' | 'JP';

export interface RegionInfo {
  readonly id: RegionId;
  readonly name: string;
  // ISO 4217 code: what prices are shown in.
  readonly currency: string;
  // How numbers and money are written there ("2.925 €" in Germany).
  readonly locale: string;
  // Units of the currency per US dollar, the catalog's currency. Fixed,
  // indicative rates: a real store would fetch them.
  readonly rate: number;
}

// Alphabetical, as the selector lists them.
export const REGIONS: ReadonlyArray<RegionInfo> = [
  { id: 'BR', name: 'Brazil', currency: 'BRL', locale: 'pt-BR', rate: 5.5 },
  { id: 'CA', name: 'Canada', currency: 'CAD', locale: 'en-CA', rate: 1.38 },
  { id: 'CN', name: 'China', currency: 'CNY', locale: 'zh-CN', rate: 7.1 },
  { id: 'FR', name: 'France', currency: 'EUR', locale: 'fr-FR', rate: 0.9 },
  { id: 'DE', name: 'Germany', currency: 'EUR', locale: 'de-DE', rate: 0.9 },
  { id: 'IT', name: 'Italy', currency: 'EUR', locale: 'it-IT', rate: 0.9 },
  { id: 'JP', name: 'Japan', currency: 'JPY', locale: 'ja-JP', rate: 148 },
  { id: 'MX', name: 'Mexico', currency: 'MXN', locale: 'es-MX', rate: 18.4 },
  { id: 'ES', name: 'Spain', currency: 'EUR', locale: 'es-ES', rate: 0.9 },
  { id: 'AE', name: 'United Arab Emirates', currency: 'AED', locale: 'en-AE', rate: 3.67 },
  { id: 'GB', name: 'United Kingdom', currency: 'GBP', locale: 'en-GB', rate: 0.77 },
  { id: 'US', name: 'United States', currency: 'USD', locale: 'en-US', rate: 1 }
];

export const DEFAULT_LANGUAGE: LanguageId = 'en-US';
export const DEFAULT_REGION: RegionId = 'US';

export function languageInfo(id: LanguageId): LanguageInfo {
  return LANGUAGES.find((language) => language.id === id) ?? LANGUAGES[LANGUAGES.length - 1];
}

export function regionInfo(id: RegionId): RegionInfo {
  return REGIONS.find((region) => region.id === id) ?? REGIONS[REGIONS.length - 1];
}

export function isLanguage(value: unknown): value is LanguageId {
  return LANGUAGES.some((language) => language.id === value);
}

export function isRegion(value: unknown): value is RegionId {
  return REGIONS.some((region) => region.id === value);
}

const formatters = new Map<RegionId, Intl.NumberFormat>();

// A US-dollar catalog price in a region's currency, in whole units and
// written the local way: $3,250 · $59,800 (MXN) · 2.925 € · ¥23,075.
export function formatMoney(usd: number, region: RegionInfo = regionInfo(DEFAULT_REGION)): string {
  let formatter = formatters.get(region.id);
  if (!formatter) {
    formatter = new Intl.NumberFormat(region.locale, {
      style: 'currency',
      currency: region.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    formatters.set(region.id, formatter);
  }
  return formatter.format(Math.round(usd * region.rate));
}

// "$" for MXN in Mexico, "€" for EUR: the symbol the region writes.
export function currencySymbol(region: RegionInfo): string {
  return (
    new Intl.NumberFormat(region.locale, { style: 'currency', currency: region.currency })
      .formatToParts(0)
      .find((part) => part.type === 'currency')?.value ?? region.currency
  );
}
