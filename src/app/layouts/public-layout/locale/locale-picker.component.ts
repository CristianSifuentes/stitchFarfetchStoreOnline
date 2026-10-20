import { ChangeDetectionStrategy, Component, ElementRef, afterRenderEffect, computed, inject, signal, viewChild } from '@angular/core';
import { LANGUAGES, LanguageId, LocaleService, REGIONS, RegionId, currencySymbol, formatMoney } from '../../../core/locale';

type Tab = 'language' | 'region';

// A sample catalog price, to show what a region's prices look like.
const SAMPLE_PRICE = 1250;

// Farfetch's "Language | Region" selector as a drawer from the right, on
// the native <dialog> (focus trap, Esc, inert page). Choices apply at once:
// prices change currency behind the drawer as you pick a region.
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
              <h2 id="locale-title" class="label-caps">Language &amp; region</h2>
              <button type="button" class="-mr-2 flex h-10 w-10 items-center justify-center transition-colors hover:text-muted" aria-label="Close" (click)="locale.closePicker()">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>

            <div class="mt-6 grid grid-cols-2 border-b border-line" role="tablist" aria-label="Language or region">
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
                <p class="py-6 text-sm leading-relaxed text-muted">Choose the language you want to browse the site in.</p>
                <ul class="border-t border-line" role="radiogroup" aria-label="Language">
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
                            <span class="mt-1 block text-xs text-muted" lang="en">{{ language.name }}</span>
                          }
                        </span>
                        @if (language.id === locale.language().id) {
                          <svg class="h-4 w-4 shrink-0 motion-safe:animate-fade-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                        }
                      </button>
                    </li>
                  }
                </ul>
                <p class="mt-6 bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
                  VESTRA is available in English for now. We'll remember your choice for when more languages arrive.
                </p>
              </div>
            } @else {
              <div class="motion-safe:animate-fade-in">
                <p class="py-6 text-sm leading-relaxed text-muted">Choose where you're shopping from. Prices are shown in that region's currency.</p>
                <label class="relative mb-2 block">
                  <svg class="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                  <span class="sr-only">Search regions</span>
                  <input class="input-line pl-7" type="search" placeholder="Search for a country or currency" [value]="query()" (input)="query.set($any($event.target).value)" />
                </label>
                <ul class="border-t border-line" role="radiogroup" aria-label="Region">
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
                        <span class="text-xs text-muted" [attr.aria-label]="'Sample price ' + region.sample">{{ region.sample }}</span>
                        @if (region.id === locale.region().id) {
                          <svg class="h-4 w-4 motion-safe:animate-fade-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                        } @else {
                          <span></span>
                        }
                      </button>
                    </li>
                  } @empty {
                    <li class="py-10 text-center text-sm text-muted">No regions match "{{ query() }}".</li>
                  }
                </ul>
                <p class="mt-6 bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
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
              <button type="button" class="btn btn-primary px-8" (click)="locale.closePicker()">Done</button>
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
    { id: 'language', label: 'Language' },
    { id: 'region', label: 'Region' }
  ];
  protected readonly languages = LANGUAGES;
  protected readonly tab = signal<Tab>('language');
  protected readonly query = signal('');

  // Regions matching the search, each with its symbol and a sample price.
  protected readonly regions = computed(() => {
    const needle = this.query().trim().toLowerCase();
    return REGIONS.filter((region) => !needle || `${region.name} ${region.currency}`.toLowerCase().includes(needle)).map((region) => ({
      ...region,
      symbol: currencySymbol(region),
      sample: formatMoney(SAMPLE_PRICE, region)
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
