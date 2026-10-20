import { ChangeDetectionStrategy, Component } from '@angular/core';

interface ServiceLink {
  readonly title: string;
  readonly text: string;
  readonly icon: 'bag' | 'question' | 'chat';
}

// "How to shop / FAQs / Need help?": the three reassurances above the footer.
@Component({
  selector: 'app-service-links',
  template: `
    <section class="border-t border-line" aria-label="Customer service">
      <ul class="page-container grid gap-px py-10 sm:grid-cols-3">
        @for (link of links; track link.title) {
          <li>
            <a href="#" class="group flex items-start gap-4 p-4 transition-colors hover:bg-surface">
              <svg class="mt-0.5 h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                @switch (link.icon) {
                  @case ('bag') { <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /> }
                  @case ('question') { <circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" /> }
                  @case ('chat') { <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /> }
                }
              </svg>
              <span>
                <span class="label-caps block">{{ link.title }}</span>
                <span class="mt-1 block text-sm text-muted">{{ link.text }}</span>
              </span>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceLinksComponent {
  protected readonly links: ReadonlyArray<ServiceLink> = [
    { title: 'How to shop', text: 'Your guide to placing an order', icon: 'bag' },
    { title: 'FAQs', text: 'We have the answers to your questions', icon: 'question' },
    { title: 'Need help?', text: 'Contact our Customer Service team', icon: 'chat' }
  ];
}
