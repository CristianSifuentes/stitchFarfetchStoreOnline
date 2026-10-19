import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface FooterColumn {
  readonly title: string;
  readonly links: ReadonlyArray<string>;
}

// The single footer: three link columns and the newsletter sign-up.
@Component({
  selector: 'app-site-footer',
  template: `
    <footer class="mt-24 border-t border-line bg-surface">
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

        <div>
          <h2 class="label-caps mb-6">Subscribe</h2>
          <p class="mb-6 text-sm text-muted">Sign up for early access to sales, new arrivals and exclusive edits.</p>
          @if (subscribed()) {
            <p class="text-sm" role="status">Thank you. You're on the list.</p>
          } @else {
            <form class="flex items-end border-b border-ink" (submit)="subscribe($event)">
              <input
                class="input-line border-b-0"
                type="email"
                placeholder="Email address"
                aria-label="Email address"
                [value]="email()"
                (input)="email.set($any($event.target).value)"
              />
              <button type="submit" class="p-3 disabled:opacity-30" [disabled]="!emailValid()" aria-label="Subscribe">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </form>
            <p class="mt-4 text-xs text-muted">By signing up you agree to our Privacy Policy. Unsubscribe at any time.</p>
          }
        </div>
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
    { title: 'Legal', links: ['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Accessibility'] }
  ];

  protected readonly email = signal('');
  protected readonly emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()));
  protected readonly subscribed = signal(false);

  protected subscribe(event: Event): void {
    event.preventDefault();
    if (this.emailValid()) {
      this.subscribed.set(true);
    }
  }
}
