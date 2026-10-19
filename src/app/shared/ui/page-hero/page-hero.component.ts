import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

export interface HeroAction {
  readonly label: string;
  readonly link: string;
  readonly queryParams?: Params;
}

export interface HeroStat {
  readonly value: string;
  readonly label: string;
}

// The editorial hero every department opens with: full-bleed photography,
// a left-to-right scrim, light display type and up to two actions.
@Component({
  selector: 'app-page-hero',
  imports: [RouterLink],
  template: `
    <section class="relative flex min-h-[26rem] items-center overflow-hidden bg-ink text-canvas md:aspect-[21/9]">
      <img [src]="image()" [alt]="alt()" class="absolute inset-0 h-full w-full object-cover" loading="eager" />
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
      <div class="relative z-10 max-w-2xl px-6 py-12 md:px-16">
        <p class="label-caps mb-4 opacity-80">{{ eyebrow() }}</p>
        <h1 class="text-display">{{ title() }}</h1>
        <p class="mt-5 max-w-md text-sm leading-relaxed opacity-85 md:text-base">{{ text() }}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a class="btn btn-light" [routerLink]="primary().link" [queryParams]="primary().queryParams">{{ primary().label }}</a>
          @if (secondary(); as action) {
            <a class="btn btn-outline-light" [routerLink]="action.link" [queryParams]="action.queryParams">{{ action.label }}</a>
          }
        </div>
        @if (stats().length) {
          <dl class="mt-10 flex flex-wrap items-center gap-8">
            @for (stat of stats(); track stat.label) {
              <div class="flex flex-col-reverse">
                <dt class="label-caps mt-1 opacity-60">{{ stat.label }}</dt>
                <dd class="text-3xl font-light">{{ stat.value }}</dd>
              </div>
            }
          </dl>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeroComponent {
  readonly image = input.required<string>();
  readonly alt = input.required<string>();
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly text = input.required<string>();
  readonly primary = input.required<HeroAction>();
  readonly secondary = input<HeroAction | null>(null);
  readonly stats = input<ReadonlyArray<HeroStat>>([]);
}
