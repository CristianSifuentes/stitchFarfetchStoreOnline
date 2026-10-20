import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewsletterBandComponent } from './newsletter-band.component';
import { ServiceLinksComponent } from './service-links.component';
import { SiteFooterComponent } from './site-footer.component';
import { SiteHeaderComponent } from './site-header.component';

// The storefront shell. Pages render their own page-container, so
// full-bleed sections and framed content can mix.
@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, SiteHeaderComponent, ServiceLinksComponent, NewsletterBandComponent, SiteFooterComponent],
  template: `
    <app-site-header />
    <main id="main">
      <router-outlet />
    </main>
    <div class="mt-24">
      <app-service-links />
      <app-newsletter-band />
      <app-site-footer />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicLayoutComponent {}
