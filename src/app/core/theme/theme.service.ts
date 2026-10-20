import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { THEME_STORAGE_KEY, Theme, ThemePreference, isTheme, resolveTheme } from './theme.model';

// Light or dark, remembered in this browser. The theme is a data-theme
// attribute on <html>: styles.css redefines the color tokens under it, so
// every page follows without per-component dark styles. On the server the
// visitor's choice is unknown; src/assets/theme-init.js sets the attribute
// before the first paint and this service keeps it from then on.
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly media = this.browser ? this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)') ?? null : null;

  private readonly preference = signal<ThemePreference>(readStored());
  private readonly systemDark = signal(this.media?.matches ?? false);

  readonly theme = computed<Theme>(() => resolveTheme(this.preference(), this.systemDark()));
  readonly dark = computed(() => this.theme() === 'dark');

  constructor() {
    // While no choice is saved, a change of the system theme shows at once.
    this.media?.addEventListener('change', (event) => this.systemDark.set(event.matches));

    effect(() => {
      if (this.browser) {
        this.document.documentElement.dataset['theme'] = this.theme();
      }
    });
  }

  toggle(): void {
    this.preference.set(this.dark() ? 'light' : 'dark');
    this.persist();
  }

  private persist(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, this.preference());
      }
    } catch {
      // Blocked storage: the choice lasts for this visit.
    }
  }
}

function readStored(): ThemePreference {
  try {
    const stored = typeof localStorage === 'undefined' ? null : localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}
