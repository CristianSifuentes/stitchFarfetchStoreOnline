import { ChangeDetectionStrategy, Component, ElementRef, LOCALE_ID, afterRenderEffect, computed, inject, signal, viewChild } from '@angular/core';
import { LANGUAGES, LanguageId, LocaleService, REGIONS, RegionId, currencySymbol, formatMoney } from '../../../core/locale';

type Tab = 'language' | 'region';

// A sample catalog price, to show what a region's prices look like.
const SAMPLE_PRICE = 1250;

// Farfetch's "Language | Region" selector as a drawer from the right, on
// the native <dialog> (focus trap, Esc, inert page). A region applies at
// once: prices change currency behind the drawer. A language loads the
// same page in that language's build.
@Component({
  selector: 'app-locale-picker',
  template: `
    <dialog
      #dialog
      class="ml-auto mr-0 h-dvh max-h-none w-full max-w-md bg-canvas p-0 text-ink backdrop:bg-black/50 motion-safe:animate-drawer-in motion-safe:backdrop:animate-fade-in"
      aria-labelledby="locale-title"
      (close)="locale.closePicker()"
      (click)="closeOnBackdrop($event)"
    >
      @if (locale.pickerOpen()) {
        <div class="flex h-full flex-col">
          <header class="px-6 pt-6 sm:px-10">
            <div class="flex items-center justify-between">
              <h2 id="locale-title" class="label-caps" i18n="@@locale.title">Language &amp; region</h2>
              <button type="button" class="-mr-2 flex h-10 w-10 items-center justify-center transition-colors hover:text-muted" aria-label="Close" i18n-aria-label="@@common.close" (click)="locale.closePicker()">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>

            <div class="mt-6 grid grid-cols-2 border-b border-line" role="tablist" aria-label="Language or region" i18n-aria-label="@@locale.tabs">
              @for (option of tabs; track option.id) {
                <button
                  type="button"
                  role="tab"
                  class="label-caps -mb-px border-b py-4 transition-colors"
                  [class.border-ink]="tab() === option.id"
                  [class.border-transparent]="tab() !== option.id"
                  [class.text-muted]="tab() !== option.id"
                  [attr.aria-selected]="tab() === option.id"
                  (click)="tab.set(option.id)"
                >{{ option.label }}</button>
              }
            </div>
          </header>

          <div class="flex-1 overflow-y-auto px-6 pb-10 sm:px-10">
            @if (tab() === 'language') {
              <div class="motion-safe:animate-fade-in">
                <p class="py-6 text-sm leading-relaxed text-muted" i18n="@@locale.languageIntro">Choose the language you want to browse the site in.</p>
                <ul class="border-t border-line" role="radiogroup" aria-label="Language" i18n-aria-label="@@locale.language">
                  @for (language of languages; track language.id) {
                    <li>
                      <button
                        type="button"
                        role="radio"
                        class="group flex w-full items-center justify-between gap-4 border-b border-line py-5 text-left"
                        [attr.aria-checked]="language.id === locale.language().id"
                        [attr.lang]="language.id"
                        (click)="chooseLanguage(language.id)"
                      >
                        <span>
                          <span class="block text-base transition-colors group-hover:text-muted" [class.font-medium]="language.id === locale.language().id">{{ language.nativeName }}</span>
                          @if (language.name !== language.nativeName) {
                            <span class="mt-1 block text-xs text-muted" [attr.lang]="locale.language().id">{{ language.name }}</span>
                          }
                        </span>
                        @if (language.id === locale.language().id) {
                          <svg class="h-4 w-4 shrink-0 motion-safe:animate-fade-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                        }
                      </button>
                    </li>
                  }
                </ul>
                <p class="mt-6 bg-surface px-4 py-3 text-xs leading-relaxed text-muted" i18n="@@locale.languageNote">
                  The page reloads in the language you choose. Your region, bag and wishlist stay as they are.
                </p>
              </div>
            } @else {
              <div class="motion-safe:animate-fade-in">
                <p class="py-6 text-sm leading-relaxed text-muted" i18n="@@locale.regionIntro">Choose where you're shopping from. Prices are shown in that region's currency.</p>
                <label class="relative mb-2 block">
                  <svg class="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                  <span class="sr-only" i18n="@@locale.searchLabel">Search regions</span>
                  <input class="input-line pl-7" type="search" placeholder="Search for a country or currency" i18n-placeholder="@@locale.searchPlaceholder" [value]="query()" (input)="query.set($any($event.target).value)" />
                </label>
                <ul class="border-t border-line" role="radiogroup" aria-label="Region" i18n-aria-label="@@locale.region">
                  @for (region of regions(); track region.id) {
                    <li>
                      <button
                        type="button"
                        role="radio"
                        class="group grid w-full grid-cols-[1fr_auto_1rem] items-center gap-4 border-b border-line py-4 text-left"
                        [attr.aria-checked]="region.id === locale.region().id"
                        (click)="chooseRegion(region.id)"
                      >
                        <span>
                          <span class="block text-sm transition-colors group-hover:text-muted" [class.font-medium]="region.id === locale.region().id">{{ region.name }}</span>
                          <span class="mt-0.5 block text-xs text-muted">{{ region.currency }} {{ region.symbol }}</span>
                        </span>
                        <span class="text-xs text-muted" [attr.aria-label]="region.sampleLabel">{{ region.sample }}</span>
                        @if (region.id === locale.region().id) {
                          <svg class="h-4 w-4 motion-safe:animate-fade-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                        } @else {
                          <span></span>
                        }
                      </button>
                    </li>
                  } @empty {
                    <li class="py-10 text-center text-sm text-muted" i18n="@@locale.noMatch">No regions match "{{ query() }}".</li>
                  }
                </ul>
                <p class="mt-6 bg-surface px-4 py-3 text-xs leading-relaxed text-muted" i18n="@@locale.ratesNote">
                  Prices are converted from US dollars at indicative rates and rounded to whole units.
                </p>
              </div>
            }
          </div>

          <footer class="border-t border-line px-6 py-5 sm:px-10">
            <div class="flex items-center justify-between gap-4">
              <p class="text-xs text-muted">
                <span class="text-ink">{{ locale.region().name }}</span> · {{ locale.region().currency }} · {{ locale.language().nativeName }}
              </p>
              <button type="button" class="btn btn-primary px-8" (click)="locale.closePicker()" i18n="@@locale.done">Done</button>
            </div>
          </footer>
        </div>
      }
    </dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalePickerComponent {
  protected readonly locale = inject(LocaleService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly tabs: ReadonlyArray<{ readonly id: Tab; readonly label: string }> = [
    { id: 'language', label: $localize`:@@locale.language:Language` },
    { id: 'region', label: $localize`:@@locale.region:Region` }
  ];
  protected readonly languages = LANGUAGES;
  protected readonly tab = signal<Tab>('language');
  protected readonly query = signal('');

  private readonly collator = new Intl.Collator(inject(LOCALE_ID));

  // Regions matching the search, in the reader's alphabetical order, each
  // with its symbol and a sample price.
  protected readonly regions = computed(() => {
    const needle = this.query().trim().toLowerCase();
    return [...REGIONS].sort((a, b) => this.collator.compare(a.name, b.name)).filter((region) => !needle || `${region.name} ${region.currency}`.toLowerCase().includes(needle)).map((region) => ({
      ...region,
      symbol: currencySymbol(region),
      sample: formatMoney(SAMPLE_PRICE, region),
      sampleLabel: $localize`:@@locale.samplePrice:Sample price ${formatMoney(SAMPLE_PRICE, region)}:INTERPOLATION:`
    }));
  });

  constructor() {
    // The service decides; the browser's dialog follows (browser-only).
    afterRenderEffect(() => {
      const dialog = this.dialog().nativeElement;
      const open = this.locale.pickerOpen();
      if (open && !dialog.open) {
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close();
      }
    });
  }

  protected chooseLanguage(id: LanguageId): void {
    this.locale.setLanguage(id);
  }

  protected chooseRegion(id: RegionId): void {
    this.locale.setRegion(id);
  }

  // A click on the dialog element itself is a click on its backdrop.
  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.locale.closePicker();
    }
  }
}
