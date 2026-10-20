import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import {
  Account,
  AuthDialogService,
  AuthService,
  STRENGTH_LABELS,
  emailError,
  isValidPassword,
  passwordChecks,
  passwordStrength
} from '../../../core/auth';
import { TextFieldComponent } from '../../../shared/ui/text-field/text-field.component';
import { SocialSignInComponent } from './social-sign-in.component';

// Farfetch's "Register": name, email and a password whose strength and
// rules update as you type, the newsletter opt-in and the legal line.
@Component({
  selector: 'app-register-form',
  imports: [TextFieldComponent, SocialSignInComponent],
  template: `
    <form class="grid gap-6" novalidate (submit)="submit($event)">
      <app-text-field label="Name" i18n-label="@@auth.field.name" autocomplete="name" [autofocus]="true" [(value)]="name" [error]="nameProblem()" />
      <app-text-field label="Email address" i18n-label="@@auth.field.email" type="email" autocomplete="email" [(value)]="email" [error]="emailProblem()" />
      <div>
        <app-text-field label="Password" i18n-label="@@auth.field.password" type="password" autocomplete="new-password" [revealable]="true" [(value)]="password" [error]="passwordProblem()" />
        <div class="mt-4 flex items-center gap-3" aria-hidden="true">
          <div class="grid flex-1 grid-cols-4 gap-1">
            @for (step of steps; track step) {
              <span class="h-0.5 transition-colors duration-300" [class.bg-ink]="strength() >= step" [class.bg-line]="strength() < step"></span>
            }
          </div>
          <span class="label-caps w-14 text-right">{{ strengthLabel() }}</span>
        </div>
        <ul class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs" aria-label="Password requirements" i18n-aria-label="@@auth.passwordRequirements">
          @for (check of checks(); track check.id) {
            <li class="flex items-center gap-1.5 transition-colors" [class.text-ink]="check.met" [class.text-muted]="!check.met">
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                @if (check.met) {
                  <path d="m5 12 5 5 9-10" />
                } @else {
                  <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
                }
              </svg>
              {{ check.label }}<span class="sr-only">: @if (check.met) {<ng-container i18n="@@auth.check.done">done</ng-container>} @else {<ng-container i18n="@@auth.check.missing">missing</ng-container>}</span>
            </li>
          }
        </ul>
      </div>

      <label class="flex cursor-pointer items-start gap-3 text-sm">
        <input type="checkbox" class="mt-0.5 h-3.5 w-3.5 accent-black" [checked]="newsletter()" (change)="newsletter.set($any($event.target).checked)" />
        <span class="text-muted" i18n="@@auth.newsletterOptIn">Sign up for promotions, tailored new arrivals, stock updates and more.</span>
      </label>

      @if (failure()) {
        <p class="border-l-2 border-error pl-3 text-sm text-error motion-safe:animate-shake" role="alert">{{ failure() }}</p>
      }

      <button type="submit" class="btn btn-primary w-full" [disabled]="pending()">
        @if (pending()) {
          <span class="h-3.5 w-3.5 animate-spin rounded-full border border-canvas border-t-transparent" aria-hidden="true"></span>
          <ng-container i18n="@@auth.creatingAccount">Creating your account</ng-container>
        } @else {
          <ng-container i18n="@@auth.register">Register</ng-container>
        }
      </button>

      <p class="text-xs leading-relaxed text-muted" i18n="@@auth.terms">
        By registering, you agree to our <span class="text-ink underline underline-offset-2">Terms &amp; Conditions</span>
        and <span class="text-ink underline underline-offset-2">Privacy and Cookie Policy</span>.
      </p>
    </form>

    <div class="mt-8">
      <app-social-sign-in [disabled]="pending()" (done)="done.emit($event)" />
    </div>

    <p class="mt-8 text-center text-sm text-muted">
      <ng-container i18n="@@auth.haveAccount">Already have an account?</ng-container>&ngsp;
      <button type="button" class="font-semibold text-ink underline underline-offset-4" (click)="dialog.open('sign-in')" i18n="@@auth.signIn">Sign in</button>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent {
  private readonly auth = inject(AuthService);
  protected readonly dialog = inject(AuthDialogService);

  readonly done = output<Account>();

  protected readonly steps = [1, 2, 3, 4] as const;
  protected readonly name = signal('');
  protected readonly email = this.dialog.email;
  protected readonly password = signal('');
  protected readonly newsletter = signal(true);
  protected readonly submitted = signal(false);
  protected readonly pending = signal(false);
  protected readonly failure = signal('');

  protected readonly checks = computed(() => passwordChecks(this.password()));
  protected readonly strength = computed(() => passwordStrength(this.password()));
  protected readonly strengthLabel = computed(() => STRENGTH_LABELS[this.strength()]);

  protected readonly nameProblem = computed(() => (this.submitted() && !this.name().trim() ? $localize`:@@auth.error.nameMissing:Enter your name.` : ''));
  protected readonly emailProblem = computed(() => (this.submitted() ? emailError(this.email()) : ''));
  protected readonly passwordProblem = computed(() =>
    this.submitted() && !isValidPassword(this.password()) ? $localize`:@@auth.error.passwordRules:Your password needs at least 8 characters, a letter and a number.` : ''
  );

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    this.submitted.set(true);
    this.failure.set('');
    if (this.nameProblem() || this.emailProblem() || this.passwordProblem()) {
      return;
    }
    this.pending.set(true);
    const result = await this.auth.register(this.name(), this.email(), this.password());
    this.pending.set(false);
    if (result.ok) {
      this.done.emit(result.account);
    } else {
      this.failure.set(result.error);
    }
  }
}
