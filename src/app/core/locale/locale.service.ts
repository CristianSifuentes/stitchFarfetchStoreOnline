import { DOCUMENT } from '@angular/common';
import { Injectable, LOCALE_ID, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  DEFAULT_REGION,
  LanguageId,
  RegionId,
  formatMoney,
  isRegion,
  languageInfo,
  languagePath,
  regionInfo,
  toLanguage
} from './locale.model';

const STORAGE_KEY = 'vestra.locale.v1';

// The visitor's language and region. The language is the build being
// served: Angular i18n compiles one per locale, each under its own URL
// prefix (/es-419/…), with <html lang> set. Choosing another language
// loads the same page from that build. The region is remembered in this
// browser and converts every price (the price pipe reads it), whatever
// the language.
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly languageId = toLanguage(inject(LOCALE_ID));

  private readonly regionId = signal<RegionId>(readStoredRegion());
  private readonly open = signal(false);

  readonly language = signal(languageInfo(this.languageId)).asReadonly();
  readonly region = computed(() => regionInfo(this.regionId()));
  // Whether the Language | Region selector is showing.
  readonly pickerOpen = this.open.asReadonly();

  // A catalog price (US dollars) in the visitor's currency.
  format(usd: number): string {
    return formatMoney(usd, this.region());
  }

  // The same page in another language: a full load of that build.
  setLanguage(id: LanguageId): void {
    if (id !== this.languageId) {
      this.document.defaultView?.location.assign(languagePath(id) + this.router.url);
    }
  }

  setRegion(id: RegionId): void {
    this.regionId.set(id);
    this.persist();
  }

  openPicker(): void {
    this.open.set(true);
  }

  closePicker(): void {
    this.open.set(false);
  }

  private persist(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ region: this.regionId() }));
      }
    } catch {
      // Blocked storage: the choice lasts for this visit.
    }
  }
}

function readStoredRegion(): RegionId {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as { region?: unknown }) : {};
    return isRegion(parsed.region) ? parsed.region : DEFAULT_REGION;
  } catch {
    return DEFAULT_REGION;
  }
}
