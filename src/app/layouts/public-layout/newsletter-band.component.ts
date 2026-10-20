import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Channel = 'email' | 'sms';

// "Never miss a thing": the sign-up band above the footer, with a choice
// of channel. Validates the address or number for the channel chosen.
@Component({
  selector: 'app-newsletter-band',
  template: `
    <section class="border-t border-line bg-canvas" aria-labelledby="newsletter-heading">
      <div class="page-container grid gap-10 py-16 lg:grid-cols-2 lg:items-end lg:gap-16">
        <div>
          <h2 id="newsletter-heading" class="text-headline">Never miss a thing</h2>
          <p class="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Sign up for promotions, tailored new arrivals, stock updates and more, straight to your inbox.
          </p>
        </div>

        @if (subscribed()) {
          <p class="text-sm" role="status">Thank you. You're on the list.</p>
        } @else {
          <form class="space-y-5" (submit)="subscribe($event)">
            <fieldset class="flex items-center gap-6">
              <legend class="label-caps mb-3 text-muted">Get updates by</legend>
              @for (option of channels; track option.id) {
                <label class="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" name="channel" class="h-3.5 w-3.5 accent-black" [value]="option.id" [checked]="channel() === option.id" (change)="channel.set(option.id)" />
                  {{ option.label }}
                </label>
              }
            </fieldset>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
              <input
                class="input-line flex-1"
                [type]="channel() === 'email' ? 'email' : 'tel'"
                [placeholder]="channel() === 'email' ? 'Email address' : 'Mobile number'"
                [attr.aria-label]="channel() === 'email' ? 'Email address' : 'Mobile number'"
                [value]="contact()"
                (input)="contact.set($any($event.target).value)"
              />
              <button type="submit" class="btn btn-primary" [disabled]="!valid()">Subscribe</button>
            </div>
            <p class="text-xs leading-relaxed text-muted">
              By signing up, you agree to receive marketing communications and confirm you have read our Privacy Policy. You can unsubscribe at any time.
            </p>
          </form>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterBandComponent {
  protected readonly channels: ReadonlyArray<{ id: Channel; label: string }> = [
    { id: 'email', label: 'Email' },
    { id: 'sms', label: 'SMS' }
  ];

  protected readonly channel = signal<Channel>('email');
  protected readonly contact = signal('');
  protected readonly subscribed = signal(false);

  protected readonly valid = computed(() =>
    this.channel() === 'email'
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.contact())
      : this.contact().replace(/\D/g, '').length >= 8
  );

  protected subscribe(event: Event): void {
    event.preventDefault();
    if (this.valid()) {
      this.subscribed.set(true);
    }
  }
}
