import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthDialogService } from '../../core/auth';
import { AuthDialogComponent } from './auth/auth-dialog.component';
import { NewsletterBandComponent } from './newsletter-band.component';
import { ServiceLinksComponent } from './service-links.component';
import { SiteFooterComponent } from './site-footer.component';
import { SiteHeaderComponent } from './site-header.component';

// The storefront shell. Pages render their own page-container, so
// full-bleed sections and framed content can mix.
@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, SiteHeaderComponent, ServiceLinksComponent, NewsletterBandComponent, SiteFooterComponent, AuthDialogComponent],
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
    <!-- The sign-in dialog ships in its own chunk: fetched when the browser
         is idle, created the first time someone opens it. -->
    @defer (when authDialog.view(); prefetch on idle) {
      <app-auth-dialog />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicLayoutComponent {
  protected readonly authDialog = inject(AuthDialogService);
}
