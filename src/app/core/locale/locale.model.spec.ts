import { describe, expect, it } from 'vitest';
import { REGIONS, currencySymbol, formatMoney, isLanguage, isRegion, languagePath, regionInfo, toLanguage } from './locale.model';

describe('formatMoney', () => {
  it('keeps US dollars as the catalog has them', () => {
    expect(formatMoney(3250)).toBe('$3,250');
    expect(formatMoney(1149.6)).toBe('$1,150');
  });

  it('converts and writes each region its own way, in whole units', () => {
    expect(formatMoney(3250, regionInfo('MX'))).toBe('$59,800');
    expect(formatMoney(3250, regionInfo('GB'))).toBe('£2,503');
    expect(formatMoney(3250, regionInfo('DE'))).toMatch(/^2\.925\s€$/);
    expect(formatMoney(3250, regionInfo('JP'))).toMatch(/481,000$/);
  });
});

describe('regions and languages', () => {
  it('gives every region a symbol', () => {
    expect(REGIONS).toHaveLength(12);
    expect(currencySymbol(regionInfo('FR'))).toBe('€');
    expect(currencySymbol(regionInfo('MX'))).toBe('$');
  });

  it('guards untrusted values', () => {
    expect(isRegion('MX')).toBe(true);
    expect(isRegion('XX')).toBe(false);
    expect(isLanguage('es-419')).toBe(true);
    expect(isLanguage('es')).toBe(false);
    expect(toLanguage('fr')).toBe('fr');
    expect(toLanguage('pt-BR')).toBe('en-US');
  });

  it('serves English at the root and the others under their id', () => {
    expect(languagePath('en-US')).toBe('');
    expect(languagePath('es-419')).toBe('/es-419');
  });
});
