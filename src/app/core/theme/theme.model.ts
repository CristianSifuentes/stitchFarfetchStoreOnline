// The store's two looks. Light is "Monochrome Absolute" as designed; dark
// swaps ink and canvas, so pages keep the same contrast the other way round.
export type Theme = 'light' | 'dark';

// What the visitor chose; until they choose, the store follows the system.
export type ThemePreference = Theme | 'system';

// Shared with src/assets/theme-init.js, which applies the theme before the
// first paint: keep the two in step.
export const THEME_STORAGE_KEY = 'vestra.theme.v1';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

export function resolveTheme(preference: ThemePreference, systemDark: boolean): Theme {
  if (preference === 'system') {
    return systemDark ? 'dark' : 'light';
  }
  return preference;
}
