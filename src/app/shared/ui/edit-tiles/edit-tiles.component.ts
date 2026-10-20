import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

export interface EditTile {
  readonly label: string;
  readonly image: string;
  readonly link: string;
  readonly queryParams?: Params;
}

// "Trending now": four photo tiles, each a doorway into an edit or a
// designer, with its name in label caps underneath.
@Component({
  selector: 'app-edit-tiles',
  imports: [RouterLink],
  template: `
    <section [attr.aria-label]="title()">
      <h2 class="text-headline mb-8">{{ title() }}</h2>
      <ul class="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        @for (tile of tiles(); track tile.label) {
          <li>
            <a class="group block" [routerLink]="tile.link" [queryParams]="tile.queryParams">
              <div class="aspect-[3/4] overflow-hidden bg-surface">
                <img [src]="tile.image" [alt]="tile.label" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <p class="label-caps mt-4 border-b border-transparent pb-0.5 transition-colors group-hover:border-ink">{{ tile.label }}</p>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTilesComponent {
  readonly title = input('Trending now');
  readonly tiles = input.required<ReadonlyArray<EditTile>>();
}
