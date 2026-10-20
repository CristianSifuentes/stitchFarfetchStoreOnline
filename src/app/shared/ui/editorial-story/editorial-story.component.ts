import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

// An editorial moment ("Modern folklore"): a large photograph beside the
// story, with the edit's products projected underneath.
@Component({
  selector: 'app-editorial-story',
  imports: [RouterLink],
  template: `
    <section class="grid items-center gap-8 lg:grid-cols-2 lg:gap-16" [attr.aria-label]="title()">
      <div class="aspect-[4/5] overflow-hidden bg-surface lg:aspect-[5/6]" [class.lg:order-2]="imageSide() === 'right'">
        <img [src]="image()" [alt]="alt()" class="h-full w-full object-cover" loading="lazy" />
      </div>
      <div class="max-w-md space-y-5">
        <p class="label-caps text-muted">{{ eyebrow() }}</p>
        <h2 class="text-display">{{ title() }}</h2>
        <p class="leading-relaxed text-muted">{{ text() }}</p>
        <a class="btn btn-primary" [routerLink]="link()" [queryParams]="queryParams()">{{ actionLabel() }}</a>
      </div>
    </section>
    <div class="mt-12">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorialStoryComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly text = input.required<string>();
  readonly image = input.required<string>();
  readonly alt = input.required<string>();
  readonly link = input.required<string>();
  readonly queryParams = input<Params | null>(null);
  readonly actionLabel = input('Explore more');
  readonly imageSide = input<'left' | 'right'>('left');
}
