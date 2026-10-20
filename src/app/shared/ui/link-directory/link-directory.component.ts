import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

export interface DirectoryLink {
  readonly label: string;
  readonly link: string;
  readonly queryParams?: Params;
}

export interface DirectoryColumn {
  readonly title: string;
  readonly links: ReadonlyArray<DirectoryLink>;
}

// The quiet lists of links at the end of a Farfetch department page
// (Gifts, Party season, Holiday styles…): every one a filtered listing.
@Component({
  selector: 'app-link-directory',
  imports: [RouterLink],
  template: `
    <nav class="grid gap-10 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3" [attr.aria-label]="label()">
      @for (column of columns(); track column.title) {
        <div>
          <h2 class="label-caps mb-5">{{ column.title }}</h2>
          <ul class="space-y-3 text-sm text-muted">
            @for (link of column.links; track link.label) {
              <li><a class="transition-colors hover:text-ink" [routerLink]="link.link" [queryParams]="link.queryParams">{{ link.label }}</a></li>
            }
          </ul>
        </div>
      }
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkDirectoryComponent {
  readonly columns = input.required<ReadonlyArray<DirectoryColumn>>();
  readonly label = input('More to explore');
}
