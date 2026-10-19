import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <div class="page-container py-32 text-center">
      <p class="label-caps text-muted">Error 404</p>
      <h1 class="text-headline mt-4">We couldn’t find this page</h1>
      <p class="mt-3 text-sm text-muted">The link may be broken, or the page may have moved.</p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <a routerLink="/" class="btn btn-primary">Back to home</a>
        <a routerLink="/search" class="btn btn-secondary">Shop all products</a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPageComponent {}
