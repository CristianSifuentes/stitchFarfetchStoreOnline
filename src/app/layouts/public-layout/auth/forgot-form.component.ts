import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AuthDialogService, AuthService, emailError } from '../../../core/auth';
import { TextFieldComponent } from '../../../shared/ui/text-field/text-field.component';

// "Forgot your password?": asks for the email, then confirms without saying
// whether an account exists for it.
@Component({
  selector: 'app-forgot-form',
  imports: [TextFieldComponent],
  template: `
    @if (sent()) {
      <div class="grid gap-6 motion-safe:animate-fade-in" role="status">
        <svg class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
          <rect x="2.5" y="5" width="19" height="14" /><path d="m3 6 9 7 9-7" />
        </svg>
        <div>
          <p class="text-title" i18n="@@auth.forgot.checkInbox">Check your inbox</p>
          <p class="mt-3 text-sm leading-relaxed text-muted" i18n="@@auth.forgot.sent">
            If there's an account for <span class="text-ink">{{ email() }}</span>, you'll get a link to reset your password in the next few minutes.
          </p>
        </div>
        <button type="button" class="btn btn-primary w-full" (click)="dialog.open('sign-in')" i18n="@@auth.backToSignIn">Back to sign in</button>
        <button type="button" class="text-sm text-muted underline underline-offset-4 hover:text-ink" (click)="sent.set(false)" i18n="@@auth.forgot.tryAgain">Didn't get it? Try again</button>
      </div>
    } @else {
      <form class="grid gap-6" novalidate (submit)="submit($event)">
        <p class="text-sm leading-relaxed text-muted" i18n="@@auth.forgot.intro">Enter the email you registered with and we'll send you a link to reset your password.</p>
        <app-text-field label="Email address" i18n-label="@@auth.field.email" type="email" autocomplete="email" [autofocus]="true" [(value)]="email" [error]="emailProblem()" />
        <button type="submit" class="btn btn-primary w-full" [disabled]="pending()">
          @if (pending()) {
            <span class="h-3.5 w-3.5 animate-spin rounded-full border border-canvas border-t-transparent" aria-hidden="true"></span>
            <ng-container i18n="@@auth.forgot.sending">Sending link</ng-container>
          } @else {
            <ng-container i18n="@@auth.forgot.send">Send reset link</ng-container>
          }
        </button>
      </form>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotFormComponent {
  private readonly auth = inject(AuthService);
  protected readonly dialog = inject(AuthDialogService);

  protected readonly email = this.dialog.email;
  protected readonly submitted = signal(false);
  protected readonly pending = signal(false);
  protected readonly sent = signal(false);

  protected readonly emailProblem = computed(() => (this.submitted() ? emailError(this.email()) : ''));

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    this.submitted.set(true);
    if (this.emailProblem()) {
      return;
    }
    this.pending.set(true);
    await this.auth.requestPasswordReset(this.email());
    this.pending.set(false);
    this.sent.set(true);
  }
}
