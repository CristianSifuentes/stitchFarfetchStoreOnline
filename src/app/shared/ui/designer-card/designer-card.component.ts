import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { PricePipe } from '../../pipes/price.pipe';

// A designer tile: the house's newest piece, its name over a scrim, and a
// "from" price. Leads to that designer's listing.
@Component({
  selector: 'app-designer-card',
  imports: [RouterLink, PricePipe],
  template: `
    <a class="group relative block aspect-[4/5] overflow-hidden bg-surface" [routerLink]="link()" [queryParams]="queryParams()">
      <img [src]="image()" [alt]="name()" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
      <div class="absolute inset-x-0 bottom-0 p-8 text-canvas">
        <p class="label-caps mb-2 opacity-80">{{ eyebrow() }}</p>
        <p class="text-title">{{ name() }}</p>
        @if (from() !== null) {
          <p class="mt-1 text-xs opacity-80">From {{ from() | price }}</p>
        }
      </div>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignerCardComponent {
  readonly name = input.required<string>();
  readonly eyebrow = input.required<string>();
  readonly image = input.required<string>();
  readonly link = input.required<string>();
  readonly queryParams = input<Params | null>(null);
  readonly from = input<number | null>(null);
}
