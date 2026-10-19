import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// A quiet row of house names between sections.
@Component({
  selector: 'app-brand-strip',
  template: `
    <section class="border-y border-line py-10" aria-label="Featured designers">
      <ul class="grid grid-cols-3 items-center justify-items-center gap-6 md:grid-cols-6">
        @for (brand of brands(); track brand) {
          <li class="label-caps tracking-[0.25em] text-muted">{{ brand }}</li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandStripComponent {
  readonly brands = input.required<ReadonlyArray<string>>();
}
