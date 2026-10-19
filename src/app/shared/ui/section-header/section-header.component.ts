import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

// Eyebrow + headline + optional description, with an optional "View all"
// link on the right. Every section in the app opens with this.
@Component({
  selector: 'app-section-header',
  imports: [RouterLink],
  template: `
    <div class="mb-10 flex items-end justify-between gap-6 border-b border-line pb-5" [class.flex-col]="align() === 'center'" [class.items-center]="align() === 'center'" [class.text-center]="align() === 'center'">
      <div>
        @if (eyebrow()) {
          <p class="label-caps mb-2 text-muted">{{ eyebrow() }}</p>
        }
        <h2 class="text-headline">{{ title() }}</h2>
        @if (description()) {
          <p class="mt-2 max-w-xl text-sm text-muted">{{ description() }}</p>
        }
      </div>
      @if (actionLabel() && actionLink()) {
        <a class="link-cta shrink-0" [routerLink]="actionLink()" [queryParams]="actionQuery()">{{ actionLabel() }}</a>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input('');
  readonly description = input('');
  readonly actionLabel = input('');
  readonly actionLink = input<string | null>(null);
  readonly actionQuery = input<Params | null>(null);
  readonly align = input<'start' | 'center'>('start');
}
