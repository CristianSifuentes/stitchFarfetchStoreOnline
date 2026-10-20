import { ChangeDetectionStrategy, Component } from '@angular/core';

interface FooterColumn {
  readonly title: string;
  readonly links: ReadonlyArray<string>;
}

// The single footer: four link columns and the legal line. The newsletter
// lives in the band above it (NewsletterBandComponent).
@Component({
  selector: 'app-site-footer',
  template: `
    <footer class="border-t border-line bg-surface">
      <div class="page-container grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        @for (column of columns; track column.title) {
          <div>
            <h2 class="label-caps mb-6">{{ column.title }}</h2>
            <ul class="space-y-3 text-sm text-muted">
              @for (link of column.links; track link) {
                <li><a href="#" class="transition-colors hover:text-ink">{{ link }}</a></li>
              }
            </ul>
          </div>
        }

      </div>

      <div class="border-t border-line">
        <div class="page-container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p class="text-xs text-muted">© 2024 FARFETCH UK Limited. All rights reserved.</p>
          <span class="select-none text-sm font-light uppercase tracking-[0.08em] text-muted">Farfetch</span>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteFooterComponent {
  protected readonly columns: ReadonlyArray<FooterColumn> = [
    { title: 'Customer Service', links: ['Contact Us', 'Orders & Delivery', 'Returns & Refunds', 'Payment & Pricing', 'FAQs'] },
    { title: 'About Farfetch', links: ['About Us', 'Careers', 'Investors', 'Affiliate Program', 'Sustainability'] },
    { title: 'Legal', links: ['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Accessibility'] },
    { title: 'Shopping With Us', links: ['Gift Cards', 'Student Discount', 'Farfetch Access', 'Refer a Friend', 'Download the App'] }
  ];
}
