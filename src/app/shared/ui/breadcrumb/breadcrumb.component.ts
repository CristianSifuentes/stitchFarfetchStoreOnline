import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

export interface Crumb {
  readonly label: string;
  readonly link?: string;
  readonly queryParams?: Params;
}

// Home / Women / Clothing — the last crumb is the current page.
@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  template: `
    <nav aria-label="Breadcrumb" class="py-6">
      <ol class="flex flex-wrap items-center gap-2 text-xs text-muted">
        @for (crumb of items(); track crumb.label; let last = $last) {
          <li class="flex items-center gap-2">
            @if (!last && crumb.link) {
              <a [routerLink]="crumb.link" [queryParams]="crumb.queryParams" class="transition-colors hover:text-ink">{{ crumb.label }}</a>
              <span aria-hidden="true">/</span>
            } @else {
              <span class="text-ink" aria-current="page">{{ crumb.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {
  readonly items = input.required<ReadonlyArray<Crumb>>();
}
