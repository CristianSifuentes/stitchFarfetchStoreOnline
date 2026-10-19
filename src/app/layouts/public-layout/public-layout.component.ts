import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooterComponent } from './site-footer.component';
import { SiteHeaderComponent } from './site-header.component';

// The storefront shell. Pages render their own page-container, so
// full-bleed sections and framed content can mix.
@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  template: `
    <app-site-header />
    <main id="main">
      <router-outlet />
    </main>
    <app-site-footer />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicLayoutComponent {}
