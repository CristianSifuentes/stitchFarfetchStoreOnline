import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { Account, AuthDialogService, AuthService, DEMO_ACCOUNT, emailError } from '../../../core/auth';
import { TextFieldComponent } from '../../../shared/ui/text-field/text-field.component';
import { SocialSignInComponent } from './social-sign-in.component';

// Farfetch's "Sign in": email and password, a way back in without a
// password (one-time code), and the social providers.
@Component({
  selector: 'app-sign-in-form',
  imports: [TextFieldComponent, SocialSignInComponent],
  template: `
    <form class="grid gap-6" novalidate (submit)="submit($event)">
      <app-text-field label="Email address" type="email" autocomplete="email" [autofocus]="true" [(value)]="email" [error]="emailProblem()" />
      <div>
        <app-text-field label="Password" type="password" autocomplete="current-password" [revealable]="true" [(value)]="password" [error]="passwordProblem()" />
        <button type="button" class="mt-3 text-xs text-muted underline underline-offset-4 transition-colors hover:text-ink" (click)="dialog.open('forgot')">
          Forgot your password?
        </button>
      </div>

      @if (failure()) {
        <p class="border-l-2 border-error pl-3 text-sm text-error motion-safe:animate-shake" role="alert">{{ failure() }}</p>
      }

      <div class="grid gap-3">
        <button type="submit" class="btn btn-primary w-full" [disabled]="pending()">
          @if (pending()) {
            <span class="h-3.5 w-3.5 animate-spin rounded-full border border-canvas border-t-transparent" aria-hidden="true"></span>
            Signing in
          } @else {
            Sign in
          }
        </button>
        <button type="button" class="btn btn-secondary w-full" [disabled]="pending()" (click)="dialog.open('code')">Continue with a one-time code</button>
      </div>

      <p class="bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
        Demo account: <span class="text-ink">{{ demo.email }}</span> · <span class="text-ink">{{ demo.password }}</span>
        <button type="button" class="ml-1 font-semibold text-ink underline underline-offset-4" (click)="useDemo()">Fill in</button>
      </p>
    </form>

    <div class="mt-8">
      <app-social-sign-in [disabled]="pending()" (done)="done.emit($event)" />
    </div>

    <p class="mt-8 text-center text-sm text-muted">
      First time on VESTRA?
      <button type="button" class="font-semibold text-ink underline underline-offset-4" (click)="dialog.open('register')">Register</button>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInFormComponent {
  private readonly auth = inject(AuthService);
  protected readonly dialog = inject(AuthDialogService);

  readonly done = output<Account>();

  protected readonly demo = DEMO_ACCOUNT;
  protected readonly email = this.dialog.email;
  protected readonly password = signal('');
  protected readonly submitted = signal(false);
  protected readonly pending = signal(false);
  protected readonly failure = signal('');

  // Errors appear after the first attempt, then follow the typing.
  protected readonly emailProblem = computed(() => (this.submitted() ? emailError(this.email()) : ''));
  protected readonly passwordProblem = computed(() => (this.submitted() && !this.password() ? 'Enter your password.' : ''));

  protected useDemo(): void {
    this.email.set(DEMO_ACCOUNT.email);
    this.password.set(DEMO_ACCOUNT.password);
  }

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    this.submitted.set(true);
    this.failure.set('');
    if (this.emailProblem() || this.passwordProblem()) {
      return;
    }
    this.pending.set(true);
    const result = await this.auth.signIn(this.email(), this.password());
    this.pending.set(false);
    if (result.ok) {
      this.done.emit(result.account);
    } else {
      this.failure.set(result.error);
    }
  }
}
