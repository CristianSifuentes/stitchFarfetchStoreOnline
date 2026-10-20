import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LocaleService } from '../../core/locale';
import { PAYMENT_METHODS } from './payment-methods';

interface FooterColumn {
  readonly title: string;
  readonly links: ReadonlyArray<string>;
}

type Social = 'instagram' | 'facebook' | 'x' | 'tiktok' | 'youtube';

// Farfetch's footer, in its order: customer service, about, discounts and
// membership, content and social; then payment methods; then the legal
// links, the address, the trademark notice and the copyright. The
// newsletter lives in the band above it (NewsletterBandComponent).
@Component({
  selector: 'app-site-footer',
  template: `
    <footer class="border-t border-line bg-surface">
      <div class="page-container py-16">
        <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          @for (column of columns; track column.title) {
            <nav [attr.aria-label]="column.title">
              <h2 class="label-caps mb-6">{{ column.title }}</h2>
              <ul class="space-y-3 text-sm text-muted">
                @for (link of column.links; track link) {
                  <li><a href="#" class="transition-colors hover:text-ink">{{ link }}</a></li>
                }
              </ul>
            </nav>
          }

          <div class="grid content-start gap-12">
            <nav aria-label="Content and services">
              <h2 class="label-caps mb-6">Content &amp; Services</h2>
              <ul class="space-y-3 text-sm text-muted">
                <li><a href="#" class="transition-colors hover:text-ink">Fashion Feed: Featured Stories</a></li>
              </ul>
            </nav>

            <div>
              <h2 class="label-caps mb-6">Follow us</h2>
              <ul class="flex flex-wrap gap-5">
                @for (social of socials; track social.id) {
                  <li>
                    <a href="#" class="block text-ink transition-colors hover:text-muted" [attr.aria-label]="'VESTRA on ' + social.label">
                      <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                        @switch (social.id) {
                          @case ('instagram') {
                            <g fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /></g>
                            <circle cx="17.4" cy="6.6" r="1" fill="currentColor" />
                          }
                          @case ('facebook') {
                            <path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                          }
                          @case ('x') {
                            <path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                          }
                          @case ('tiktok') {
                            <path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                          }
                          @case ('youtube') {
                            <rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="1.5" />
                            <path fill="currentColor" d="m10 9 5 3-5 3z" />
                          }
                        }
                      </svg>
                    </a>
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-16 border-t border-line pt-10">
          <h2 class="label-caps mb-5">Payment methods</h2>
          <ul class="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            @for (method of paymentMethods; track method.id) {
              <li class="flex h-12 items-center gap-3 border border-line bg-canvas pl-3 pr-4">
                <svg class="h-7 w-7 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path [attr.d]="method.path" /></svg>
                <span class="text-[10px] font-semibold uppercase tracking-[0.12em]">{{ method.label }}</span>
              </li>
            }
          </ul>
        </div>
      </div>

      <div class="border-t border-line">
        <div class="page-container grid gap-8 py-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div class="max-w-3xl space-y-4">
            <nav aria-label="Legal">
              <ul class="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                @for (link of legal; track link) {
                  <li><a href="#" class="transition-colors hover:text-muted">{{ link }}</a></li>
                }
              </ul>
            </nav>
            <address class="text-xs not-italic leading-relaxed text-muted">
              Ciudad de México, México
            </address>
            <p class="text-xs leading-relaxed text-muted">
              VESTRA and the VESTRA logo are trade marks of VESTRA.
            </p>
            <p class="text-xs text-muted">© Copyright {{ year }} VESTRA. All rights reserved.</p>
          </div>
          <div class="flex flex-col gap-6 lg:items-end">
            <button
              type="button"
              class="flex items-center gap-3 border border-line bg-canvas px-4 py-3 text-left text-xs transition-colors hover:border-ink"
              [attr.aria-label]="'Change language and region. Now: ' + locale.region().name + ', ' + locale.region().currency + ', ' + locale.language().name"
              (click)="locale.openPicker()"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></svg>
              <span>
                <span class="block">{{ locale.region().name }} · {{ locale.region().currency }}</span>
                <span class="block text-muted">{{ locale.language().nativeName }}</span>
              </span>
            </button>
            <span class="select-none text-sm font-light uppercase tracking-[0.08em] text-muted" aria-hidden="true">Vestra</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteFooterComponent {
  protected readonly locale = inject(LocaleService);

  protected readonly columns: ReadonlyArray<FooterColumn> = [
    {
      title: 'Customer Service',
      links: [
        'Help & Contact Us',
        'FAQs',
        'Orders & Delivery',
        'Import Limits',
        'Returns & Refunds',
        'Payments & Pricing',
        'Crypto Payments',
        'Promotion Terms & Conditions',
        'VESTRA Customer Promise'
      ]
    },
    {
      title: 'About VESTRA',
      links: ['About Us', 'Press', 'VESTRA Partners', 'Careers', 'Modern Slavery Statement', 'VESTRA Advertising', 'Sitemap']
    },
    {
      title: 'Discounts & Membership',
      links: ['Affiliate Program', 'Refer a Friend', 'Loyalty Program', 'Student Beans & Graduates', 'Student & Youth Discount']
    }
  ];

  protected readonly socials: ReadonlyArray<{ readonly id: Social; readonly label: string }> = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'x', label: 'X' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'youtube', label: 'YouTube' }
  ];

  // Monochrome marks next to their names, in ink like the rest of the store.
  protected readonly paymentMethods = PAYMENT_METHODS;

  protected readonly legal = ['Privacy Policy', 'Terms & Conditions', 'Accessibility', 'Intellectual Property Protection'] as const;

  protected readonly year = new Date().getFullYear();
}
