import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_REGION,
  LanguageId,
  RegionId,
  formatMoney,
  isLanguage,
  isRegion,
  languageInfo,
  regionInfo
} from './locale.model';

const STORAGE_KEY = 'vestra.locale.v1';

// The visitor's language and region, remembered in this browser. The
// region converts every price (the price pipe reads it); the language sets
// <html lang>. The UI copy itself is English for now.
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);
  private readonly stored = readStored();

  private readonly languageId = signal<LanguageId>(this.stored.language);
  private readonly regionId = signal<RegionId>(this.stored.region);
  private readonly open = signal(false);

  readonly language = computed(() => languageInfo(this.languageId()));
  readonly region = computed(() => regionInfo(this.regionId()));
  // Whether the Language | Region selector is showing.
  readonly pickerOpen = this.open.asReadonly();

  constructor() {
    this.document.documentElement.lang = this.languageId();
  }

  // A catalog price (US dollars) in the visitor's currency.
  format(usd: number): string {
    return formatMoney(usd, this.region());
  }

  setLanguage(id: LanguageId): void {
    this.languageId.set(id);
    this.document.documentElement.lang = id;
    this.persist();
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ language: this.languageId(), region: this.regionId() }));
      }
    } catch {
      // Blocked storage: the choice lasts for this visit.
    }
  }
}

function readStored(): { language: LanguageId; region: RegionId } {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as { language?: unknown; region?: unknown }) : {};
    return {
      language: isLanguage(parsed.language) ? parsed.language : DEFAULT_LANGUAGE,
      region: isRegion(parsed.region) ? parsed.region : DEFAULT_REGION
    };
  } catch {
    return { language: DEFAULT_LANGUAGE, region: DEFAULT_REGION };
  }
}
