import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <div class="page-container py-32 text-center">
      <p class="label-caps text-muted" i18n="@@notFound.eyebrow">Error 404</p>
      <h1 class="text-headline mt-4" i18n="@@notFound.title">We couldn’t find this page</h1>
      <p class="mt-3 text-sm text-muted" i18n="@@notFound.text">The link may be broken, or the page may have moved.</p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <a routerLink="/" class="btn btn-primary" i18n="@@notFound.home">Back to home</a>
        <a routerLink="/search" class="btn btn-secondary" i18n="@@notFound.shopAll">Shop all products</a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPageComponent {}
