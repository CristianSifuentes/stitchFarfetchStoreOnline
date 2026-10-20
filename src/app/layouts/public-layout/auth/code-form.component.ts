import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  output,
  signal,
  viewChildren
} from '@angular/core';
import { Account, AuthDialogService, AuthService, emailError } from '../../../core/auth';
import { TextFieldComponent } from '../../../shared/ui/text-field/text-field.component';

const CODE_LENGTH = 6;
const RESEND_AFTER_S = 30;

// "Continue with a one-time code": the email first, then six boxes that
// advance as you type, accept a pasted code and verify themselves once full.
@Component({
  selector: 'app-code-form',
  imports: [TextFieldComponent],
  template: `
    @if (step() === 'email') {
      <form class="grid gap-6" novalidate (submit)="send($event)">
        <p class="text-sm leading-relaxed text-muted" i18n="@@auth.code.intro">We'll email you a 6-digit code to sign in. No password needed.</p>
        <app-text-field label="Email address" i18n-label="@@auth.field.email" type="email" autocomplete="email" [autofocus]="true" [(value)]="email" [error]="emailProblem()" />
        <button type="submit" class="btn btn-primary w-full" [disabled]="pending()">
          @if (pending()) {
            <span class="h-3.5 w-3.5 animate-spin rounded-full border border-canvas border-t-transparent" aria-hidden="true"></span>
            <ng-container i18n="@@auth.code.sending">Sending code</ng-container>
          } @else {
            <ng-container i18n="@@auth.code.send">Send code</ng-container>
          }
        </button>
      </form>
    } @else {
      <div class="grid gap-6">
        <p class="text-sm leading-relaxed text-muted">
          <ng-container i18n="@@auth.code.enter">Enter the code we sent to <span class="text-ink">{{ email() }}</span>.</ng-container>
          <button type="button" class="ml-1 text-ink underline underline-offset-4" (click)="step.set('email')" i18n="@@auth.code.change">Change</button>
        </p>

        <fieldset [class]="failure() ? 'motion-safe:animate-shake' : ''">
          <legend class="sr-only" i18n="@@auth.code.legend">6-digit code</legend>
          <div class="grid grid-cols-6 gap-2 sm:gap-3">
            @for (digit of digits(); track $index; let i = $index) {
              <input
                #box
                class="h-16 w-full border-0 border-b bg-transparent text-center text-3xl font-light outline-none transition-colors focus:border-ink"
                [class.border-line]="!digit && !failure()"
                [class.border-ink]="digit && !failure()"
                [class.border-error]="failure()"
                inputmode="numeric"
                maxlength="1"
                [attr.autocomplete]="i === 0 ? 'one-time-code' : 'off'"
                [attr.aria-label]="digitLabel(i)"
                [value]="digit"
                [disabled]="pending()"
                (input)="type(i, $event)"
                (keydown)="navigate(i, $event)"
                (paste)="paste($event)"
                (focus)="$any($event.target).select()"
              />
            }
          </div>
        </fieldset>

        @if (failure()) {
          <p class="border-l-2 border-error pl-3 text-sm text-error" role="alert">{{ failure() }}</p>
        } @else if (pending()) {
          <p class="flex items-center gap-2 text-sm text-muted" role="status">
            <span class="h-3.5 w-3.5 animate-spin rounded-full border border-ink border-t-transparent" aria-hidden="true"></span>
            <ng-container i18n="@@auth.code.checking">Checking your code</ng-container>
          </p>
        }

        <p class="bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
          <ng-container i18n="@@auth.code.demo">Demo mode, no email is sent. Your code is</ng-container>
          <button type="button" class="ml-1 font-semibold tracking-[0.3em] text-ink underline underline-offset-4" (click)="fill(sentCode())">{{ sentCode() }}</button>
        </p>

        <p class="text-center text-sm text-muted">
          <ng-container i18n="@@auth.code.didntGetIt">Didn't get it?</ng-container>&ngsp;
          @if (secondsLeft() > 0) {
            <span i18n="@@auth.code.resendIn">Resend in {{ countdown() }}</span>
          } @else {
            <button type="button" class="font-semibold text-ink underline underline-offset-4" (click)="resend()" i18n="@@auth.code.resend">Resend code</button>
          }
        </p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeFormComponent {
  private readonly auth = inject(AuthService);
  private readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  readonly done = output<Account>();

  protected readonly email = inject(AuthDialogService).email;
  protected readonly step = signal<'email' | 'verify'>('email');
  protected readonly digits = signal<string[]>(Array(CODE_LENGTH).fill(''));
  protected readonly sentCode = signal('');
  protected readonly secondsLeft = signal(0);
  // "0:07"
  protected readonly countdown = computed(() => `0:${String(this.secondsLeft()).padStart(2, '0')}`);
  protected readonly submitted = signal(false);
  protected readonly pending = signal(false);
  protected readonly failure = signal('');

  protected readonly emailProblem = computed(() => (this.submitted() ? emailError(this.email()) : ''));

  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  protected async send(event: Event): Promise<void> {
    event.preventDefault();
    this.submitted.set(true);
    if (this.emailProblem()) {
      return;
    }
    await this.requestCode();
    this.step.set('verify');
    setTimeout(() => this.focus(0));
  }

  protected async resend(): Promise<void> {
    this.digits.set(Array(CODE_LENGTH).fill(''));
    this.failure.set('');
    await this.requestCode();
    this.focus(0);
  }

  protected digitLabel(index: number): string {
    return $localize`:@@auth.code.digit:Digit ${index + 1}:INTERPOLATION:`;
  }

  protected type(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    if (value.length > 1) {
      // Autofill or a pasted code arriving through input.
      this.fill(value);
      return;
    }
    this.setDigit(index, value);
    if (value && index < CODE_LENGTH - 1) {
      this.focus(index + 1);
    }
    this.verifyWhenFull();
  }

  protected navigate(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      event.preventDefault();
      this.setDigit(index - 1, '');
      this.focus(index - 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focus(index - 1);
    } else if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      this.focus(index + 1);
    }
  }

  protected paste(event: ClipboardEvent): void {
    event.preventDefault();
    this.fill(event.clipboardData?.getData('text') ?? '');
  }

  protected fill(code: string): void {
    const chars = code.replace(/\D/g, '').slice(0, CODE_LENGTH).split('');
    this.digits.set(Array.from({ length: CODE_LENGTH }, (_, i) => chars[i] ?? ''));
    this.focus(Math.min(chars.length, CODE_LENGTH - 1));
    this.verifyWhenFull();
  }

  private setDigit(index: number, value: string): void {
    this.failure.set('');
    this.digits.update((digits) => digits.map((digit, i) => (i === index ? value : digit)));
  }

  private async verifyWhenFull(): Promise<void> {
    const code = this.digits().join('');
    if (code.length < CODE_LENGTH || this.pending()) {
      return;
    }
    this.pending.set(true);
    const result = await this.auth.verifyCode(code);
    this.pending.set(false);
    if (result.ok) {
      this.done.emit(result.account);
    } else {
      this.failure.set(result.error);
      this.digits.set(Array(CODE_LENGTH).fill(''));
      setTimeout(() => this.focus(0));
    }
  }

  private async requestCode(): Promise<void> {
    this.pending.set(true);
    this.sentCode.set(await this.auth.requestCode(this.email()));
    this.pending.set(false);
    this.startCountdown();
  }

  private startCountdown(): void {
    clearInterval(this.timer);
    this.secondsLeft.set(RESEND_AFTER_S);
    this.timer = setInterval(() => {
      this.secondsLeft.update((s) => s - 1);
      if (this.secondsLeft() <= 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  private focus(index: number): void {
    this.boxes()[index]?.nativeElement.focus();
  }
}
